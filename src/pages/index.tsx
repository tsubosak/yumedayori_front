import { Anchor, Container, Title } from "@mantine/core"
import type { NextPage } from "next"
import Link from "next/link"

const Home: NextPage = () => {
  return (
    <Container>
      <Title order={1} mb="xl">
        yumedayori-front
      </Title>
      <Link prefetch={false} href={"/artists/1"} legacyBehavior>
        <Anchor>artist</Anchor>
      </Link>
    </Container>
  )
}

export default Home
