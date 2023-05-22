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
  const [nfts, setNfts] = useState([]); // NFTs array
  const [modal, setModal] = useState(false); // Modal state
  const [errorMsg, setErrorMsg] = useState(""); // Error message
  const [selectedNft, setSelectedNft] = useState(null); // Selected NFT for modal
  const [buddy, setBuddy] = useState(""); // Buddy Wallet address
  const { address, isConnected } = useAccount(); // Wagmi account details
  const [copied, setCopied] = useState(false); // Copied state for address

  /**
   * Create the provider client for Tokenbound SDK via Viem
   * @returns providerClient
   */
  const providerClient = createPublicClient({
    chain: goerli || mainnet,
    transport: custom(window.ethereum),
  });

  /**
   * Alchemy SDK configuration
   * @returns alchemy client
   */
  const ALCHEMY_API = process.env.NEXT_PUBLIC_ALCHEMY_API;
  const config = {
    apiKey: ALCHEMY_API,
    network: Network.ETH_MAINNET,
  };
  const alchemy = new Alchemy(config);

  /**
   * Get the NFT data for the connected address via Alchemy
   * @returns nfts
   */
  useEffect(() => {
    const main = async () => {
      async function getNftsForOwner() {
        if (isConnected) {
          try {
            let nftArray = [];
            const nftsIterable = alchemy.nft.getNftsForOwnerIterator(address);
            for await (const nft of nftsIterable) {
              nftArray.push(nft);
            }
            setNfts(nftArray);
          } catch (err) {
            setErrorMsg("An error occurred while fetching NFTs");
            console.log(err?.message);
          }
        }
      }
      getNftsForOwner();
    };
    main();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  /**
   * Get the ERC6551 address (or Buddy Wallet) from all available ERC721 addresses
   * @param contractAdd
   * @param tokenId
   */

  const handleAddress = async (contractAdd, tokenId) => {
    try {
      const accountAddress = await getAccount(
        contractAdd,
        tokenId,
        providerClient
      );
      setBuddy(accountAddress);
    } catch (err) {
      setErrorMsg("An error occured while getting the address");
    }
  };

  /**
   * Logic to for modal component
   */
  const openModal = () => {
    setModal(!modal);
    document.body.classList.add("overflow-hidden");
  };
  const closeModal = () => {
    setModal(false);
    document.body.classList.remove("overflow-hidden");
  };
  const copyAddress = () => {
    navigator.clipboard.writeText(buddy);
    setCopied(true);
  };

  async function handleDisconnect() {
    await disconnect();
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="navbar px-6">
        <div className="flex-1">
          <img src="./logo.png" className="w-16" alt="logo" />
        </div>
        {/* Display only if connected */}
        <div className="flex">{isConnected && <ConnectButton />}</div>
      </div>
      <main className="hero min-h-screen mb-10">
        <div className="hero-content text-center">
          <div className="max-w-full mx-10">
            <img src="./logo.png" className="w-32 mx-auto" alt="logo" />
            <h1 className="text-6xl font-bold">Buddy Wallet</h1>
            <h2 className="pb-4 font-normal text-lg">
              View Your NFT&apos;s Buddy Wallet Using ERC6551
            </h2>
            {!isConnected && (
              <div className="grid justify-center space-y-2 mb-10">
                <ConnectButton />
              </div>
            )}
            <div className="grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-4">
              {/* Display only if connected and filter out removed NFTs */}
              {isConnected &&
                nfts
                  ?.filter((nft) => nft.title !== "")
                  .map((nft, index) => (
                    <div
                      className="card bg-gray-200 rounded-md p-3 space-y-1"
                      key={index}
                    >
                      <h2 className="label truncate text-ellipsis">
                        {nft.title}
                      </h2>
                      <img
                        src={nft.media[0]?.gateway}
                        className="w-full rounded-lg object-fill"
                        alt={nft.title}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedNft(index);
                          openModal();
                          handleAddress(nft.contract.address, nft.tokenId);
                        }}
                        className="btn btn-primary font-black"
                      >
                        View Buddy Wallet
                      </button>
                      {/* Modal component for selected NFT only */}
                      {modal && selectedNft === index && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                          <div className="bg-white xs:w-full xs:mx-10 p-10 rounded-box">
                            <div className="flex flex-row justify-between">
                              <div className="tooltip flex" data-tip="Close">
                                <button
                                  onClick={() => {
                                    closeModal();
                                  }}
                                  className="btn btn-circle btn-outline"
                                >
                                  x
                                </button>
                              </div>
                              <div className="flex">
                                <img
                                  src="./logo.png"
                                  className="w-16"
                                  alt="Buddy Logo"
                                />
                              </div>
                            </div>
                            <h2 className="text-center text-3xl text-black mt-6">
                              {nft.title}&apos;s Buddy Wallet
                            </h2>
                            <div className="flex space-x-4 flex-row justify-center mt-4 mb-8">
                              <Link
                                href={`https://etherscan.io/address/${buddy}`}
                                target="_blank"
                              >
                                <button className="btn btn-primary">
                                  View On Etherscan
                                </button>
                              </Link>
                              {copied ? (
                                <button className="btn btn-success">
                                  Copied
                                </button>
                              ) : (
                                <div
                                  className="tooltip tooltip-bottom"
                                  data-tip={`${buddy.slice(
                                    0,
                                    4
                                  )}...${buddy.slice(-4)}`}
                                >
                                  <button
                                    className="btn btn-primary"
                                    onClick={() => copyAddress()}
                                  >
                                    Copy Address
                                  </button>
                                </div>
                              )}
                            </div>
                            <div className="grid justify-center space-y-4  p-10">
                              <div className="grid space-y-3">
                                <h3 className="text-lg font-normal text-black">
                                  Transaction support coming soon!
                                </h3>
                                <img
                                  src={nft.media[0]?.gateway}
                                  className="rounded-md w-72"
                                  alt={nft.title}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
            </div>
            <div className="grid justify-center my-5">
              <h2 className="text-2xl">Not Familiar with ERC6551?</h2>
              <div className="flex flex-row justify-center space-x-2">
                <Link href="https://eips.ethereum.org/EIPS/eip-6551">
                  <button className="btn btn-primary">EIP</button>
                </Link>
                <Link href="https://docs.tokenbound.org">
                  <button className="btn btn-primary">Docs</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Toast display for error messages */}
      {errorMsg && (
        <div className="toast toast-end">
          <div className="alert alert-error">
            <div>
              <span>{errorMsg}</span>
            </div>
          </div>
        </div>
      )}
      <footer className="flex flex-row justify-between px-8 pb-2 ">
        <div className="grid justify-center items-center">
          <a
            href="https://tokenbound.org"
            rel="noopener noreferrer"
            target="_blank"
          >
            Powered by Tokenbound
          </a>
        </div>
        <div className="flex flex-row justify-between items-center space-x-4">
          <a
            href="https://www.github.com/petermazzocco"
            rel="noopener noreferrer"
            target="_blank"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="currentColor"
              className="bi bi-github"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
          <a href="https://twitter.com/ohitspm" target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="currentColor"
              className="bi bi-twitter"
              viewBox="0 0 16 16"
            >
              <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
            </svg>
          </a>
          <img src="./logo.png" className="w-12" alt="Buddy Logo" />
        </div>
      </footer>
    </div>
  );
}
