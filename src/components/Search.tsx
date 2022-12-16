import { Select } from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
import { useRouter } from "next/router"
import { useMemo, useState } from "react"
import useSWR from "swr"
import { Artist, Track } from "../types"

export const Search = () => {
  const router = useRouter()
  const [searchValue, onSearchChange] = useState("")
  const [debounced] = useDebouncedValue(searchValue, 500)
  const tracks = useSWR<Track[]>(debounced ? `/tracks?q=${debounced}` : null)
  const artists = useSWR<Artist[]>(debounced ? `/artists?q=${debounced}` : null)
  const data = useMemo(() => {
    return [
      ...(tracks.data || []).map((track) => ({
        value: `/tracks/${track.id}`,
        label: track.title,
        name: track.title,
        group: "曲",
      })),
      ...(artists.data || []).map((artist) => ({
        value: `/artists/${artist.id}`,
        label: artist.name,
        name: artist.name,
        group: "アーティスト",
      })),
    ]
  }, [tracks.data, artists.data])
  return (
    <Select
      placeholder="検索"
      searchable
      clearable
      nothingFound="候補がありません"
      onSearchChange={onSearchChange}
      searchValue={searchValue}
      data={data}
      onChange={(item) => {
        if (!item) {
          return
        }
        router.push(item)
      }}
      filter={() => true}
    />
  )
}
