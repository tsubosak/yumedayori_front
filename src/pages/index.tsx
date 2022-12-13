import { Anchor, Container, Title } from "@mantine/core"
import type { NextPage } from "next"
import Link from "next/link"

const Home: NextPage = () => {
  return (
    <Container>
      <Title order={1}>yumedayori-front</Title>
      <Link href={"/artists/1"}>
        <Anchor>artist</Anchor>
      </Link>
    </Container>
  )
}

export default Home
