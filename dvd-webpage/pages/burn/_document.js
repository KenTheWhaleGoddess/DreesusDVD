import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta
            property="og:image"
            content="/public/img/monky.jpg"
          />
          <meta property="og:description" content="2525 social experiences for those who seek a test" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
