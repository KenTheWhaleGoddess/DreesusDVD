import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import {Dvd} from "../../abis/DVD.json";
import {DvdBurn} from "../../abis/DVDBurn.json";
import { originalAddress, burnToRedeemAddress, burnAddress } from "../../deployed-addresses.js";
import toast, { Toaster } from 'react-hot-toast';
import { Network, Alchemy } from 'alchemy-sdk';

export default function Home() {
  const [signedIn, setSignedIn] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [txnFailed, setTxnFailed] = useState(null);
  const [wasClicked, setWasClicked] = useState(null);
  const [selectedToBurn, setSelectedToBurn] = useState([]);
  const [index, setIndex] = useState(0);
  const [allOriginalsHeld, setAllOriginalsHeld] = useState([]);
  const [loaded, setLoaded] = useState(null);
  const [approved, setApproved] = useState(null);

  const icons = {
    connectionIcon: '⌛',
    successIcon: '✔️'
  }

  const toggleColors = {
    unselected: 'pink',
    selected: 'green'
  }

  const alchemy = new Alchemy({
    apiKey: "DLDbm529U5Kv4xbHAf14VglumArANVfG",
    network: Network.ETH_GOERLI,
  });
  
  const connectButton = async () => {
    if (!wasClicked) {
      let audio = new Audio("https://d38aca3d381g9e.cloudfront.net/ededdeddy.mp3");
      audio.type = "audio/mp3";
      //audio.play();
      setWasClicked(true);
    }
    toast('Connecting wallet, calling Alchemy for NFTs..', {
      icon: icons.connectionIcon
    })
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const addy = await signer.getAddress();
    setUserAddress(addy);
    const alchemyResponse = (await alchemy.nft.getNftsForOwner(addy, {
      contractAddresses: [originalAddress]
    }))['ownedNfts'];
    const keys = Object.keys(alchemyResponse);
    setAllOriginalsHeld(keys);
    console.log(keys);

    const originalContract = new ethers.Contract(originalAddress, Dvd, signer);
    const approvedResponse = await originalContract.isApperovdForAll(addy, burnToRedeemAddress)
    setApproved()
    setSignedIn(true);
    
    toast('Connected wallet and got your NFTs!', {
      icon: icons.successIcon
    });
  };

  const mint = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    try {
      setTxnFailed(false);

      const contract = new ethers.Contract(burnToRedeemAddress, DvdBurn, signer);
      const transaction = await contract.burnToRedeem(selectedToBurn);
      toast.success("Transaction in progress: " + transaction.hash);
      await transaction.wait();
      toast.success("Successfully minted!");
    } catch (error) {
      setTxnFailed(true);

      throw new Error(error.message);
    }
  };

  const setApproval = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    try {
      setTxnFailed(false);

      const contract = new ethers.Contract(originalAddress, DvdBurn, signer);
      const transaction = await contract.setApprovalForAll(burnToRedeemAddress, true);
      toast.success("Approval in progress: " + transaction.hash);
      await transaction.wait();
      setApproved(true);
      toast.success("Set approval for all!");
    } catch (error) {
      setTxnFailed(true);

      throw new Error(error.message);
    }
  };

  const min = (x, y) => {
    if (x > y) {
      return y;
    }
    return x;
  }

  const loadNftsFirst = () => {

    setIndex(0);
    loadNftsFrom(0);
    setLoaded(true);
  }

  const loadNftsFrom = (from) => {
    const btns = document.getElementById('btns');
    btns.innerHTML = "";
    for(let i = from; i < min(from + 25, allOriginalsHeld.length); i++) {
      const btnName = 'button' + i.toString();

      const btn = document.createElement('button');
      const text = document.createTextNode(i.toString());
      btn.id = btnName;
      if (selectedToBurn.includes(i)) {
        btn.style.backgroundColor = toggleColors.selected;
      } else {
        btn.style.backgroundColor = toggleColors.unselected;
      }
      btn.classList.add('toggleBtn');
      btn.onclick = (() => toggle(i));
      btn.appendChild(text);
      btns.appendChild(btn);
    }
    
  }
  const paginateLeft = () => {
    if (index >= 25) {
      loadNftsFrom(index - 25);
      setIndex(index - 25);
    }
  }
  const paginateRight = () => {
    if (index < ((allOriginalsHeld.length - (allOriginalsHeld.length % 25) - 25))) {
      loadNftsFrom(index + 25);
      setIndex(index + 25);

    }
  }
  const toggle = (btnId) => {
    const btnName = 'button' + btnId.toString();
    console.log("toggle : " + btnName);
    console.log("toggle : " + selectedToBurn.toString());
    const btn = document.getElementById(btnName);
    if (selectedToBurn.includes(btnId)) {
      const indexId = selectedToBurn.indexOf(btnId);
      setSelectedToBurn(selectedToBurn.filter((x) => x != btnId));
      btn.style.backgroundColor = toggleColors.unselected;
    } else {
      setSelectedToBurn(selectedToBurn => [...selectedToBurn, btnId]);
      btn.style.backgroundColor = toggleColors.selected;
    }
  }

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
        {!signedIn ? <div>
          <button onClick={connectButton} className="connectButton">
            Connect
          </button>
          </div> : <div></div>}
        {selectedToBurn.length == 25 ?
          <button className="mintButton" onClick={mint}>
            mint
          </button>
          :           <div>  <p className="center hero-description">Select 25 to burn.</p></div>}
          <p className="center hero-description">Currently Selected: {selectedToBurn.length}</p>
          <div id="btns"></div>

          {signedIn && approved && allOriginalsHeld.length >= 25 ?
          <React.Fragment>
            <button className="connectButton" onClick={loadNftsFirst}> Select your tokens </button>

          </React.Fragment>
          : <div></div>
        }
        {signedIn && !approved && allOriginalsHeld.length >= 25 ?
          <React.Fragment>
            <button className="connectButton" onClick={setApproval}> Approve your DVD tokens for transfer </button>

          </React.Fragment>
          : <div></div>
        }

      {signedIn && loaded && approved && allOriginalsHeld.length >= 25?
          <React.Fragment>
            <button className="paginateLeft" onClick={paginateLeft}> &lt; </button>

            <button className="paginateRight" onClick={paginateRight}> &gt; </button>

          </React.Fragment>
          : <div></div>
        }
        {signedIn && allOriginalsHeld.length < 25?
          <React.Fragment>
            <p className="center hero-description">You need 25 to participate :) You have: {allOriginalsHeld.length} DVDs</p>

            <button className="otherButton" href="https://opensea.io/collection/now-that-i-have-your-attention">
               OpenSea
            </button>
            <button className="otherButton" href="https://sudoswap.xyz/#/browse/buy/0x0FF1c3C879e0004b2Cdb52c432C8c42305A67f12">
               SudoSwap
            </button>
          </React.Fragment>
          : <div></div>
        }

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
        .otherButton {
          display: flex;
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

        .toggleBtn {

          padding: 10px 25px;
          height: 40px;
          border: 2px solid #000;
          box-shadow: 5px 5px 0px 0px rgba(255, 255, 255, 0.75);
          -webkit-box-shadow: 5px 5px 0px 0px rgba(255, 255, 255, 0.75);
          -moz-box-shadow: 5px 5px 0px 0px rgba(255, 255, 255, 0.75);
          background: white;
          color: black;
          text-transform: uppercase;
          font-size: 24px;
          font-weight: bold;
          cursor: pointer;
          border: 2px;
        }

        .mintButton {
          padding: 10px 25px;
          height: 40px;
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

        .paginateLeft {
          padding: 10px 25px;
          height: 40px;
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
        .paginateRight {
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

        .paginate {
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
  )
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
