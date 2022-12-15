import type { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { Anchor, Box, Container, SimpleGrid, Title } from "@mantine/core"
import React from "react"
import Head from "next/head"
import useSWR from "swr"
import { FullAlbum } from "../../types"
import { IconMusic } from "@tabler/icons"
import Link from "next/link"
import { IconWithText } from "../../components/IconWithText"

const AlbumFetchWrap = ({ albumId }: { albumId: number }) => {
  const { data, error, isLoading } = useSWR<FullAlbum>(`/albums/${albumId}`)

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
  if (!data) return <></>

  return (
    <>
      <Head>
        <title>{data.title}</title>
      </Head>

      <Title order={1}>{data.title}</Title>
      <Box my="lg">
        <Title order={2} mb="md">
          楽曲
        </Title>
        <SimpleGrid cols={3} spacing="md">
          {data.tracks.map((track) => (
            <Link key={track.id} href={`/tracks/${track.id}`} legacyBehavior>
              <Anchor>
                <IconWithText text={track.title}>
                  <IconMusic size="3rem" />
                </IconWithText>
              </Anchor>
            </Link>
          ))}
        </SimpleGrid>
      </Box>
    </>
  )
}

const AlbumDetailWrap: NextPage<{
  albumId: number
}> = ({ albumId }) => {
  if (!albumId) {
    return <></>
  }
  return (
    <Container>
      <AlbumFetchWrap albumId={albumId} />
    </Container>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return { props: { albumId: params?.id } }
}

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: true }
}

export default AlbumDetailWrap
