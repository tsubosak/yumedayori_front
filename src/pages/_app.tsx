import {
  AppShell,
  Box,
  Group,
  Header,
  MantineProvider,
  Center,
  Text,
  Anchor,
  Select,
} from "@mantine/core"
import type { AppProps } from "next/app"
import Head from "next/head"
import { API_ENDPOINT, CONSTANT_TRACK_IDS } from "../constants"
import { SWRConfig } from "swr"
import Link from "next/link"
import { Search } from "../components/Search"
import { FetchError } from "../error"
import { useRouter } from "next/router"

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, viewport-fit=cover"
        />
        <meta name="robots" content="noindex,nofollow"></meta>
      </Head>
      <SWRConfig
        value={{
          refreshInterval: 0,
          fetcher: async (resource, init) => {
            const res = await fetch(API_ENDPOINT + resource, init)
            if (!res.ok) {
              const body: { message: string; statusCode: number } | null =
                await res.json().catch(() => null)
              if (body) {
                throw new FetchError(body.message, body.statusCode)
              } else {
                throw new Error(await res.text())
              }
            }
            return res.json()
          },
        }}
      >
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <AppShell
            header={
              <Header height={60}>
                <Group sx={{ height: "100%" }} px={20} position="apart">
                  <Link prefetch={false} href="/" legacyBehavior>
                    <Anchor>yumedayori-front</Anchor>
                  </Link>
                  <Select
                    onChange={(val) => {
                      router.push(`/tracks/${val}`)
                    }}
                    data={CONSTANT_TRACK_IDS.map((s) => s.toString())}
                  ></Select>
                  <Search />
                </Group>
              </Header>
            }
            footer={
              <Box
                pt="md"
                px="md"
                sx={{
                  paddingBottom: "max(env(safe-area-inset-bottom), 1rem)",
                }}
              >
                <Center>
                  <Text>yumedayori-front / API Endpoint: {API_ENDPOINT}</Text>
                </Center>
                <Center>
                  <Text>
                    本システムは卒業研究にあたって開発された実験用実装です。
                  </Text>
                </Center>
              </Box>
            }
            styles={(theme) => ({
              main: {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.colors.gray[0],
              },
            })}
          >
            <Component {...pageProps} />
          </AppShell>
        </MantineProvider>
      </SWRConfig>
    </>
  )
}

export default MyApp
