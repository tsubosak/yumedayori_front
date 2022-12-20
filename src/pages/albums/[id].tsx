import type { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { Anchor, Box, Container, SimpleGrid, Title } from "@mantine/core"
import React from "react"
import Head from "next/head"
import useSWR from "swr"
import { FullAlbum } from "../../types"
import { IconMusic } from "@tabler/icons"
import Link from "next/link"
import { IconWithText } from "../../components/IconWithText"
import dynamic from "next/dynamic"
import Error from "next/error"
import { FetchError } from "../../error"
const NeoGraph = dynamic(() => import("../../components/NeoGraph"), {
  ssr: false,
})

const AlbumFetchWrap = ({ albumId }: { albumId: number }) => {
  const { data, error, isLoading } = useSWR<FullAlbum>(`/albums/${albumId}`)

  if (error instanceof FetchError)
    return <Error statusCode={error.statusCode}></Error>
  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
  if (!data) return <></>

  return (
    <>
      <Head>
        <title>{data.title}</title>
      </Head>

      <Container mb="md">
        <Title order={1}>{data.title}</Title>
      </Container>
      <NeoGraph path={`/albums/${albumId}/relationships`} focus={data.title} />
      <Container>
        <Box my="lg">
          <Title order={2} mb="md">
            楽曲
          </Title>
          <SimpleGrid cols={3} spacing="md">
            {data.tracks.map((track) => (
              <Link
                prefetch={false}
                key={track.id}
                href={`/tracks/${track.id}`}
                legacyBehavior
              >
                <Anchor>
                  <IconWithText text={track.title}>
                    <IconMusic size="3rem" />
                  </IconWithText>
                </Anchor>
              </Link>
            ))}
          </SimpleGrid>
        </Box>
      </Container>
    </>
  )
}

const AlbumDetailWrap: NextPage<{
  albumId: number
}> = ({ albumId }) => {
  if (!albumId) {
    return <></>
  }
  return <AlbumFetchWrap albumId={albumId} />
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return { props: { albumId: params?.id } }
}

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: true }
}

export default AlbumDetailWrap
