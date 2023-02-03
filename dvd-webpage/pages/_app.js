import Head from "next/head";
import "../styles/main.css";
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>2525 Bouncing DVD Logos</title>
        <meta property="og:title" content="DVD" key="title" />
        <link rel="icon" type="image/x-icon" href="https://d38aca3d381g9e.cloudfront.net/favicon.ico"/>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
