import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const [signedIn, setSignedIn] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [mintId, setMintAmount] = useState(null);
  const [txnFailed, setTxnFailed] = useState(null);
  const [wasClicked, setWasClicked] = useState(null);

  return (
    <div>
      <Toaster />
      <div className="rootContainer">
        <div>
          <h1 className="logo-hero center">Now that I have your attention...</h1>
          <div className="center hero-links">
            <a
              className="hero-link"
              href="https://opensea.io/collection/now-that-i-have-your-attention"
              target="_blank"
            >
              Opensea
            </a>
            <a
              className="hero-link"
              href="https://twitter.com/KinkyBedBugs"
              target="_blank"
            >
              Twitter
            </a>
            <a
              className="hero-link"
              href="https://etherscan.io/address/0x0ff1c3c879e0004b2cdb52c432c8c42305a67f12"
              target="_blank"
            >
              Contract
            </a>
          </div>
        </div>

        <div>
          <p className="center hero-description">
            <img src="/img/monky.jpg" className="hero-img" />
          </p>

          {txnFailed ? (
            <p className="center hero-description">Transaction failed</p>
          ) : null}
        </div>

        <p className="center hero-description">We minted out! Thank you very much.</p>

        <a className="redirectButton" href="./burn">
            Burn 25 to redeem 👀
        </a>
        <p className="center hero-description"></p>
      </div>

      <style jsx>{`
        .rootContainer {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100vw;
        }

        .clicktosave {
          font-size: 1.5rem;
          text-align: center;
        }

        .hero-img {
          width: 500px;
        }

        .logo-hero {
          font-size: 5rem;
          margin: 15px 0 0;
          margin-top: 30px;
          text-align: center;
        }
        .hero-description {
          width: 400px;
          font-size: 22px;
          text-align: center;
          font-weight: lighter;
        }

        @media (max-width: 768px) {
          .hero-description {
            width: 200px;
          }
          .nav {
            display: flex;
            justify-content: center;
            float: none;
          }
          .connectButton {
            display: relative;
          }
          .redirectButton {
            display: relative;
          }
          .pfp-generator img {
            height: 236px;
            width: 236px;
          }
        }

        .center {
          align-items: center;
          justify-content: center;
          display: flex;
        }

        .footer {
          margin-bottom: 10px;
          bottom: 10px;
        }

        .nav {
          display: sticky;
          float: right;
          margin-top: 20px;
          margin-right: 40px;
        }

        .userAddress {
          display: absolute;
          right: 0;
          top: 0;
          padding: 10px 45px;
          height: 30px;
          border: 2px solid #000;
          box-shadow: 5px 5px 0px 0px rgba(255, 255, 255, 0.75);
          -webkit-box-shadow: 5px 5px 0px 0px rgba(255, 255, 255, 0.75);
          -moz-box-shadow: 5px 5px 0px 0px rgba(255, 255, 255, 0.75);
          background: transparent;
          color: #000;
          text-transform: uppercase;
          font-size: 24px;
          font-weight: 700;
          cursor: pointer;
        }
        .connectButton {
          display: absolute;
          right: 0;
          top: 0;
          padding: 10px 45px;
          height: 60px;
          border: none;

          background: transparent;
          color: #000;
          text-transform: uppercase;
          font-size: 24px;
          font-weight: 700;
          cursor: pointer;
        }
        .redirectButton {
          display: absolute;
          right: 0;
          top: 0;
          padding: 10px 45px;
          height: 60px;
          border: 2px;

          background: transparent;
          color: #000;
          text-transform: uppercase;
          font-size: 24px;
          font-weight: 700;
          cursor: pointer;
        }

        .mintInput {
          padding: 10px 10px;
          text-align: center;
          width: 80px;
          height: 36px;
          margin-right: 20px;
          color: #000;
          background: transparent;
          font-weight: bold;
          font-size: 16px;
          border: none;
        }

        .mintButton {
          padding: 10px 25px;
          height: 60px;
          border: 2px solid #000;
          box-shadow: 5px 5px 0px 0px rgba(255, 255, 255, 0.75);
          -webkit-box-shadow: 5px 5px 0px 0px rgba(255, 255, 255, 0.75);
          -moz-box-shadow: 5px 5px 0px 0px rgba(255, 255, 255, 0.75);
          background: transparent;
          color: #000;
          text-transform: uppercase;
          font-size: 24px;
          font-weight: bold;
          cursor: pointer;
          border: none;
        }

        .hero-links {
          margin-top: 10px;
          justify-content: center;
          display: flex;
          flex-wrap: wrap;
        }

        .hero-links a {
          margin: 10px 20px;
        }

        .pfp-generator {
          width: 100%;
          margin-top: 32px;
          padding-top: 96px;
          padding-bottom: 10%;
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
        }

        .pfp-generator input {
          margin-bottom: 20px;
        }
        .pfp-generator img {
          height: 336px;
          width: 336px;
        }
      `}</style>
    </div>
  );
}
export async function getServerSideProps({ req, res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

  return {
    props: {
      time: new Date().toISOString(),
    },
  };
}
