import Head from "next/head";
import "../styles/main.css";
import {useEffect} from 'react';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>5555 Bouncing DVD Logos</title>
        <meta property="og:title" content="DVD" key="title" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
