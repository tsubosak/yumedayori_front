import { Anchor, Container, Space, Title } from "@mantine/core"
import type { NextPage } from "next"
import Link from "next/link"

const Home: NextPage = () => {
  return (
    <Container>
      <Title order={1} mb="xl">
        yumedayori-front
      </Title>
      <Title order={2}>
        本システムは卒業研究にあたって開発された実験用実装です。
      </Title>
      <Space h="md" />
      <Link prefetch={false} href={"/artists/1"} legacyBehavior>
        <Anchor>artist</Anchor>
      </Link>
    </Container>
  )
}

export default Home
