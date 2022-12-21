import type { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { Anchor, Box, Container, Grid, SimpleGrid, Title } from "@mantine/core"
import React from "react"
import Head from "next/head"
import useSWR, { SWRConfig } from "swr"
import { FullArtist } from "../../types"
import { IconMusic, IconUserCircle } from "@tabler/icons"
import Link from "next/link"
import {
  API_ENDPOINT,
  CREDITED_AS_JA,
  PARENT_TYPE_JA_BY_CHILD,
  PARENT_TYPE_JA_BY_PARENT,
} from "../../constants"
import { IconWithText } from "../../components/IconWithText"
import dynamic from "next/dynamic"
import { FetchError } from "../../error"
import Error from "next/error"
import { generateStaticPaths } from "../../staticPaths"
const NeoGraph = dynamic(() => import("../../components/NeoGraph"), {
  ssr: false,
})

const ArtistFetchWrap = ({ artistId }: { artistId: number }) => {
  const { data, error, isLoading } = useSWR<FullArtist>(`/artists/${artistId}`)

  if (!data && error instanceof FetchError)
    return <Error statusCode={error.statusCode}></Error>
  if (!data && error) return <div>failed to load</div>
  if (!data && isLoading) return <div>loading...</div>
  if (!data) return <></>

  return (
    <>
      <Head>
        <title>{data.name}</title>
      </Head>

      <Container mb="md">
        <ruby>
          <Title order={1}>{data.name}</Title>
          <rp>(</rp>
          <rt>{data.yomi}</rt>
          <rp>)</rp>
        </ruby>
      </Container>
      <NeoGraph path={`/artists/${artistId}/relationships`} focus={data.name} />
      <Container>
        {data.parents.length > 0 ? (
          <Box my="lg">
            <Title order={2} mb="md">
              親アーティスト
            </Title>
            <SimpleGrid cols={3}>
              {data.parents.map(({ parent, parentType }) => (
                <Link
                  prefetch={false}
                  key={parent.id}
                  href={`/artists/${parent.id}`}
                  legacyBehavior
                >
                  <Anchor>
                    <IconWithText
                      text={`${parent.name} (${PARENT_TYPE_JA_BY_CHILD[parentType]})`}
                    >
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
        {data.children.length > 0 ? (
          <Box my="lg">
            <Title order={2} mb="md">
              子アーティスト
            </Title>
            <SimpleGrid cols={3}>
              {data.children.map(({ child, parentType }) => (
                <Link
                  prefetch={false}
                  key={child.id}
                  href={`/artists/${child.id}`}
                  legacyBehavior
                >
                  <Anchor>
                    <IconWithText
                      text={`${child.name} (${PARENT_TYPE_JA_BY_PARENT[parentType]})`}
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
        {data.credits.length > 0 ? (
          <Box my="lg">
            <Title order={2} mb="md">
              クレジット
            </Title>
            <Grid>
              {data.credits.map(({ track, creditedAs }) => (
                <Grid.Col key={track.id} span={4}>
                  <Link
                    prefetch={false}
                    href={`/tracks/${track.id}`}
                    legacyBehavior
                  >
                    <Anchor>
                      <IconWithText
                        text={`${track.title} (${
                          CREDITED_AS_JA[creditedAs] || creditedAs
                        })`}
                      >
                        <IconMusic size="3rem" />
                      </IconWithText>
                    </Anchor>
                  </Link>
                </Grid.Col>
              ))}
            </Grid>
          </Box>
        ) : (
          <></>
        )}
      </Container>
    </>
  )
}

const ArtistDetailWrap: NextPage<{
  artistId: number
  fallback: Record<string, FullArtist>
}> = ({ artistId, fallback }) => {
  if (!artistId) {
    return <></>
  }
  return (
    <SWRConfig value={{ fallback }}>
      <ArtistFetchWrap artistId={artistId} />
    </SWRConfig>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const fullArtist = await fetch(API_ENDPOINT + `/artists/${params?.id}`)
  /*const relationships = await fetch(
    API_ENDPOINT + `/artists/${params?.id}/relationships`
  )*/
  return {
    props: {
      artistId: params?.id,
      fallback: {
        [`/artists/${params?.id}`]: await fullArtist.json(),
        /*[`/artists/${params?.id}/relationships`]: relationships.ok
          ? await relationships.json()
          : null,*/
      },
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const ids =
    process.env.MODE === "export" ? await generateStaticPaths("artist") : []
  return {
    paths: ids.map((id) => ({ params: { id: id.toString() } })),
    fallback: true,
  }
}

export default ArtistDetailWrap
