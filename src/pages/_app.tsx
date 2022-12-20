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
import { API_ENDPOINT } from "../constants"
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
                    <Anchor>yumedayori</Anchor>
                  </Link>
                  <Select
                    onChange={(val) => {
                      router.push(`/tracks/${val}`)
                    }}
                    data={[
                      5125, 3133, 7091, 2051, 7189, 2169, 2597, 6105, 8920,
                      8202, 6029, 7178, 7320, 7668, 8706, 1523, 4118, 4101,
                      7273, 6389, 8229, 6278, 5804, 1329, 1732, 6980, 4629,
                      2350, 4045, 288, 8318, 6339, 4245, 2913, 4233, 4821, 2161,
                      6572, 8694, 4217, 7070, 3198, 4714, 7848, 7489, 45, 7215,
                      7598, 5151, 6057, 8450, 5936, 4279, 3223, 6409, 3114,
                      5580, 5731, 1242, 2525, 4634, 8222, 101, 2900, 2460, 435,
                      6284, 2642, 1886, 2315, 4152, 5414, 4843, 5568, 5172, 504,
                      1585, 8617, 1920, 3555, 7266, 8240, 1684, 6925, 4541,
                      7115, 253, 2017, 733, 7546, 2366, 3445, 2116, 957, 6250,
                      7292, 3443, 6818, 4574, 3997,
                    ].map((s) => s.toString())}
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
