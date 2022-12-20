import { API_ENDPOINT, CONSTANT_TRACK_IDS } from "./constants"
import { FullAlbum, FullArtist, FullTrack } from "./types"

export const generateStaticPaths = async (
  type: "track" | "artist" | "album"
) => {
  const artistIds = new Set<number>()
  const trackIds = new Set<number>(CONSTANT_TRACK_IDS)
  const albums = new Set<number>()
  for (const id of trackIds.values()) {
    console.log("fetching track", id)
    const res = await fetch(API_ENDPOINT + `/tracks/${id}`)
    const json: FullTrack = await res.json()
    for (const artist of json.artists) {
      artistIds.add(artist.id)
    }
    for (const album of json.albums) {
      albums.add(album.id)
    }
    for (const credit of json.credits) {
      artistIds.add(credit.artist.id)
    }
  }
  for (const id of artistIds.values()) {
    console.log("fetching artist", id)
    const res = await fetch(API_ENDPOINT + `/artists/${id}`)
    const json: FullArtist = await res.json()
    for (const child of json.children) {
      artistIds.add(child.child.id)
    }
    for (const parent of json.parents) {
      artistIds.add(parent.parent.id)
    }
    for (const track of json.tracks) {
      trackIds.add(track.id)
    }
    for (const credit of json.credits) {
      trackIds.add(credit.track.id)
    }
  }
  if (type === "track") {
    for (const id of albums.values()) {
      console.log("fetching album", id)
      const res = await fetch(API_ENDPOINT + `/albums/${id}`)
      const json: FullAlbum = await res.json()
      for (const track of json.tracks) {
        trackIds.add(track.id)
      }
    }
  }

  switch (type) {
    case "artist":
      return Array.from(artistIds.values())
    case "track":
      return Array.from(trackIds.values())
    case "album":
      return Array.from(albums.values())
    default:
      return []
  }
}
