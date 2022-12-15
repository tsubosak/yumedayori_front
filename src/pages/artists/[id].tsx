import type { GetStaticPaths, GetStaticProps, NextPage } from "next"
import {
  Anchor,
  Avatar,
  Box,
  Center,
  Container,
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
import {
  PARENT_TYPE_JA_BY_CHILD,
  PARENT_TYPE_JA_BY_PARENT,
} from "../../constants"

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
      {data.parents.length > 0 ? (
        <Box my="lg">
          <Title order={2}>親アーティスト</Title>
          <SimpleGrid spacing="md" cols={3}>
            {data.parents.map(({ parent, parentType }) => (
              <Link
                key={parent.id}
                href={`/artists/${parent.id}`}
                legacyBehavior
              >
                <Anchor>
                  <Center>
                    <Avatar
                      m="lg"
                      alt={parent.name}
                      src={null}
                      //caption={}
                      size="xl"
                    />
                    <Text>
                      {parent.name} ({PARENT_TYPE_JA_BY_CHILD[parentType]})
                    </Text>
                  </Center>
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
          <Title order={2}>子アーティスト</Title>
          <SimpleGrid spacing="md" cols={3}>
            {data.children.map(({ child, parentType }) => (
              <Link key={child.id} href={`/artists/${child.id}`} legacyBehavior>
                <Anchor>
                  <Center>
                    <Avatar
                      m="lg"
                      alt={child.name}
                      src={null}
                      //caption={}
                      size="xl"
                    />
                    <Text>
                      {child.name} ({PARENT_TYPE_JA_BY_PARENT[parentType]})
                    </Text>
                  </Center>
                </Anchor>
              </Link>
            ))}
          </SimpleGrid>
        </Box>
      ) : (
        <></>
      )}
      <Box my="lg">
        <Title order={2}>楽曲</Title>
        <SimpleGrid spacing="md" cols={3}>
          {data.tracks.map((track) => (
            <Link key={track.id} href={`/tracks/${track.id}`} legacyBehavior>
              <Anchor>
                <Image
                  m="lg"
                  alt={track.title}
                  withPlaceholder
                  placeholder={
                    <Box>
                      <IconMusic size="3rem" />
                    </Box>
                  }
                  caption={track.title}
                />
              </Anchor>
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
