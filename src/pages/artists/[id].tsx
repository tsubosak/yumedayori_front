import type { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { Box } from "@mantine/core"
import React from "react"
import Head from "next/head"

const ArtistDetail: NextPage<{
  artistId: number
}> = ({ artistId }) => {
  return (
    <>
      <Head>
        <title>{artistId}</title>
      </Head>
      <Box>{artistId}</Box>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return { props: { artistId: params?.id } }
}

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: true }
}

export default ArtistDetail
