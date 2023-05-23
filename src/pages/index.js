import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { disconnect } from "@wagmi/core";
import { getAccount } from "@tokenbound/sdk";
import { useState, useEffect } from "react";
import { createPublicClient, custom } from "viem";
import { goerli, mainnet } from "viem/chains";
import Link from "next/link";
import { Alchemy, Network } from "alchemy-sdk";

export default function Main() {
  // const [nfts, setNfts] = useState([]); // NFTs array
  // const [modal, setModal] = useState(false); // Modal state
  // const [errorMsg, setErrorMsg] = useState(""); // Error message
  // const [selectedNft, setSelectedNft] = useState(null); // Selected NFT for modal
  // const [buddy, setBuddy] = useState(""); // Buddy Wallet address
  // const { address, isConnected } = useAccount(); // Wagmi account details
  // const [copied, setCopied] = useState(false); // Copied state for address

  // /**
  //  * Create the provider client for Tokenbound SDK via Viem
  //  * @returns providerClient
  //  */
  // const providerClient = createPublicClient({
  //   chain: goerli || mainnet,
  //   transport: custom(window.ethereum),
  // });

  // /**
  //  * Alchemy SDK configuration
  //  * @returns alchemy client
  //  */
  // const ALCHEMY_API = process.env.NEXT_PUBLIC_ALCHEMY_API;
  // const config = {
  //   apiKey: ALCHEMY_API,
  //   network: Network.ETH_MAINNET,
  // };
  // const alchemy = new Alchemy(config);

  // /**
  //  * Get the NFT data for the connected address via Alchemy
  //  * @returns nfts
  //  */
  // useEffect(() => {
  //   const main = async () => {
  //     async function getNftsForOwner() {
  //       if (isConnected) {
  //         try {
  //           let nftArray = [];
  //           const nftsIterable = alchemy.nft.getNftsForOwnerIterator(address);
  //           for await (const nft of nftsIterable) {
  //             nftArray.push(nft);
  //           }
  //           setNfts(nftArray);
  //         } catch (err) {
  //           setErrorMsg("An error occurred while fetching NFTs");
  //           console.log(err?.message);
  //         }
  //       }
  //     }
  //     getNftsForOwner();
  //   };
  //   main();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [address]);

  // /**
  //  * Get the ERC6551 address (or Buddy Wallet) from all available ERC721 addresses
  //  * @param contractAdd
  //  * @param tokenId
  //  */

  // const handleAddress = async (contractAdd, tokenId) => {
  //   try {
  //     const accountAddress = await getAccount(
  //       contractAdd,
  //       tokenId,
  //       providerClient
  //     );
  //     setBuddy(accountAddress);
  //   } catch (err) {
  //     setErrorMsg("An error occured while getting the address");
  //   }
  // };

  // /**
  //  * Logic to for modal component
  //  */
  // const openModal = () => {
  //   setModal(!modal);
  //   document.body.classList.add("overflow-hidden");
  // };
  // const closeModal = () => {
  //   setModal(false);
  //   document.body.classList.remove("overflow-hidden");
  // };
  // const copyAddress = () => {
  //   navigator.clipboard.writeText(buddy);
  //   setCopied(true);
  // };

  // async function handleDisconnect() {
  //   await disconnect();
  // }

  return <></>;
}
