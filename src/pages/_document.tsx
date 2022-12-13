import React from "react"
import NextDocument, { Html, Head, Main, NextScript } from "next/document"
import { createGetInitialProps } from "@mantine/next"

const getInitialProps = createGetInitialProps()

class Document extends NextDocument<{}> {
  static getInitialProps = getInitialProps
  render() {
    return (
      <Html lang="ja">
        <Head>
          <meta charSet="UTF-8" />
          <meta name="robots" content="noindex,nofollow,noarchive" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default Document
