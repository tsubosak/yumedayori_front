import {
  AppShell,
  Box,
  Group,
  Header,
  MantineProvider,
  Center,
  Text,
  Anchor,
} from "@mantine/core"
import type { AppProps } from "next/app"
import Head from "next/head"
import { API_ENDPOINT } from "../constants"
import { SWRConfig } from "swr"
import Link from "next/link"
import { Search } from "../components/Search"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, viewport-fit=cover"
        />
      </Head>
      <SWRConfig
        value={{
          refreshInterval: 0,
          fetcher: (resource, init) =>
            fetch(API_ENDPOINT + resource, init).then((res) => res.json()),
        }}
      >
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <AppShell
            header={
              <Header height={60}>
                <Group sx={{ height: "100%" }} px={20} position="apart">
                  <Link href="/" legacyBehavior>
                    <Anchor>yumedayori</Anchor>
                  </Link>
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
