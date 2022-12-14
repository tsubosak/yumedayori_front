import type { GetStaticPaths, GetStaticProps, NextPage } from "next"
import {
  Box,
  Center,
  Container,
  Flex,
  Image,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core"
import React from "react"
import Head from "next/head"
import useSWR from "swr"
import { FullArtist } from "../../types"
import { IconMusic } from "@tabler/icons"
import Link from "next/link"

const ArtistFetchWrap = ({ artistId }: { artistId: number }) => {
  const { data, error, isLoading } = useSWR<FullArtist>(`/artists/${artistId}`)

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
  if (!data) return <></>

  return (
    <>
      <Head>
        <title>{data.name}</title>
      </Head>

      <ruby>
        <Title order={1}>{data.name}</Title>
        <rp>(</rp>
        <rt>{data.yomi}</rt>
        <rp>)</rp>
      </ruby>
      <Box my="lg">
        <SimpleGrid cols={3}>
          {data.tracks.map((track) => (
            <Link key={track.id} href={`/tracks/${track.id}`}>
              <Image
                m="lg"
                alt={track.title}
                withPlaceholder
                placeholder={
                  <Box m="lg">
                    <IconMusic size="3rem" />
                  </Box>
                }
                caption={track.title}
              />
            </Link>
          ))}
        </SimpleGrid>
      </Box>
    </>
  )
}

const ArtistDetailWrap: NextPage<{
  artistId: number
}> = ({ artistId }) => {
  if (!artistId) {
    return <></>
  }
  return (
    <Container>
      <ArtistFetchWrap artistId={artistId} />
    </Container>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return { props: { artistId: params?.id } }
}

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: true }
}

export default ArtistDetailWrap
