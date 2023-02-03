import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import Dvd from "../abis/DVD.json";
import { contractAddress } from "../deployed-addresses.js";
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const [signedIn, setSignedIn] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [mintId, setMintAmount] = useState(null);
  const [txnFailed, setTxnFailed] = useState(null);
  const [wasClicked, setWasClicked] = useState(null);
  const connectButton = async () => {
    if (!wasClicked) {
      let audio = new Audio("https://d38aca3d381g9e.cloudfront.net/ededdeddy.mp3");
      audio.type = "audio/mp3";
      audio.play();
      setWasClicked(true);
    }
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    setUserAddress(await signer.getAddress());
    setSignedIn(true);
  };

  const mint = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    try {
      setTxnFailed(false);

      const unitPrice = 0.0025;
      const contract = new ethers.Contract(contractAddress, Dvd, signer);
      const transaction = await contract.publicMint(mintId, {
        value: ethers.utils.parseEther(`${unitPrice * mintId}`),
      });
      toast.success("Transaction in progress: " + transaction.hash);
      await transaction.wait();
      toast.success("Successfully minted " + mintId.toString());
    } catch (error) {
      setTxnFailed(true);

      if (error.message.contains("insufficient funds")) {
        toast.error("Not enough ETH to mint " + mintId.toString());
      }
      else if (error.message.contains("not in public sale")) {
        toast.error("sale is closed, check back soon!");
      } else {
        toast.error("unexpected error occurred: " + error.message);
      }
      throw new Error(error.message);
    }
  };

  const mintOnClick = async () => {
    if (mintId >= 0 && mintId <= 3) {
      mint();
    }
  };

  const mintIdHandler = (event) => {
    const newId = event.target.value;
    setMintAmount(newId);
  };

  return (
    <div>
      <Toaster />
      <div className="nav">
        {signedIn ? (
          <button onClick={connectButton} className="connectButton">
            {userAddress.slice(0, 6) +
              "..." +
              userAddress.slice(userAddress.length - 5, userAddress.length - 1)}
          </button>
        ) : (
          <button onClick={connectButton} className="connectButton">
            Connect
          </button>
        )}
      </div>
      <div className="rootContainer">
        <div>
          <h1 className="logo-hero center">DVD</h1>
          <div className="center hero-links">
            <a
              className="hero-link"
              href="https://opensea.io"
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
              href="https://goerli.etherscan.io/address/0x6c721dcb420f167ed3cfc7cec85279a66fec097f"
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

        <p className="center hero-description">.0025 ETH per mint. 1-3 per tx</p>
        <div className="center">
          <input
            className="inputWhite"
            placeholder="Amount"
            type="number"
            name="name"
            value={mintId || 0}
            onChange={(event) => mintIdHandler(event)}
          />
          <button className="mintButton" onClick={mintOnClick}>
            mint
          </button>
        </div>
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
