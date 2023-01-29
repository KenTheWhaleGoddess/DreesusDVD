import Head from "next/head";
import "../styles/main.css";
import {React} from 'react';

function MyApp({ Component, pageProps }) {
	let song = new Audio("/public/audio/ededdeddy.mp3");
	song.play();
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
