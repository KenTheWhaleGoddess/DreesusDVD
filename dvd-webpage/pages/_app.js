import Head from "next/head";
import "../styles/main.css";
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Dopamine Void Distractions</title>
        <meta property="og:title" content="DVD" key="title" />
        <link rel="icon" type="image/x-icon" href="https://d38aca3d381g9e.cloudfront.net/favicon.ico"/>
        <meta property="og:image" content="https://d38aca3d381g9e.cloudfront.net/monky.jpg" />

        <meta name="twitter:title" content="Dopamine Void Distractions" />
        <meta name="twitter:description" content="2525 social experiences for those who seek a test" />
        <meta name="twitter:image" content="https://d38aca3d381g9e.cloudfront.net/monky.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
