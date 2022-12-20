import type { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { Anchor, Box, Container, SimpleGrid, Title } from "@mantine/core"
import React from "react"
import Head from "next/head"
import useSWR from "swr"
import { FullTrack } from "../../types"
import { IconUserCircle } from "@tabler/icons"
import Link from "next/link"
import { CREDITED_AS_JA } from "../../constants"
import { IconWithText } from "../../components/IconWithText"
import dynamic from "next/dynamic"
import { FetchError } from "../../error"
import Error from "next/error"
const NeoGraph = dynamic(() => import("../../components/NeoGraph"), {
  ssr: false,
})

const TrackFetchWrap = ({ trackId }: { trackId: number }) => {
  const { data, error, isLoading } = useSWR<FullTrack>(`/tracks/${trackId}`)

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

      <NeoGraph path={`/tracks/${trackId}/relationships`} focus={data.title} />
      <Container>
        {data.artists.length > 0 ? (
          <Box my="lg">
            <SimpleGrid spacing="sm" cols={3}>
              {data.artists.map((artist) => (
                <Link
                  prefetch={false}
                  key={artist.id}
                  href={`/artists/${artist.id}`}
                  legacyBehavior
                >
                  <Anchor>
                    <IconWithText text={artist.name}>
                      <IconUserCircle size="3rem" />
                    </IconWithText>
                  </Anchor>
                </Link>
              ))}
            </SimpleGrid>
          </Box>
        ) : (
          <> </>
        )}
        {data.albums.length > 0 ? (
          <Box my="lg">
            <Title order={2} mb="md">
              収録アルバム
            </Title>
            <SimpleGrid spacing="sm" cols={3}>
              {data.albums.map((album) => (
                <Link
                  prefetch={false}
                  key={album.id}
                  href={`/albums/${album.id}`}
                  legacyBehavior
                >
                  <Anchor>
                    <IconWithText text={album.title}>
                      <IconUserCircle size="3rem" />
                    </IconWithText>
                  </Anchor>
                </Link>
              ))}
            </SimpleGrid>
          </Box>
        ) : (
          <> </>
        )}
        {data.credits.length > 0 ? (
          <Box my="lg">
            <Title order={2} mb="md">
              クレジット
            </Title>
            <SimpleGrid cols={3}>
              {data.credits.map(({ artist, creditedAs }) => (
                <Link
                  prefetch={false}
                  key={artist.id}
                  href={`/artists/${artist.id}`}
                  legacyBehavior
                >
                  <Anchor>
                    <IconWithText
                      text={`${artist.name} (${
                        CREDITED_AS_JA[creditedAs] || creditedAs
                      })`}
                    >
                      <IconUserCircle size="3rem" />
                    </IconWithText>
                  </Anchor>
                </Link>
              ))}
            </SimpleGrid>
          </Box>
        ) : (
          <></>
        )}
      </Container>
    </>
  )
}

const TrackDetailWrap: NextPage<{
  trackId: number
}> = ({ trackId }) => {
  if (!trackId) {
    return <></>
  }
  return <TrackFetchWrap trackId={trackId} />
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return { props: { trackId: params?.id } }
}

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: true }
}

export default TrackDetailWrap
