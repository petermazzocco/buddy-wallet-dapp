import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { getAccount } from "@tokenbound/sdk";
import { useState, useEffect } from "react";
import { createPublicClient, http, createWalletClient, custom } from "viem";
import { goerli, mainnet } from "viem/chains";
import Link from "next/link";
import { Alchemy, Network } from "alchemy-sdk";

export default function Main() {
  const [nfts, setNfts] = useState([]);
  const [modal, setModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedNft, setSelectedNft] = useState(null);
  const [buddy, setBuddy] = useState("");
  const { address, isConnected } = useAccount();
  const [copied, setCopied] = useState(false);

  /**
   * Create the client for the public and wallet provider for Tokenbound SDK
   * @returns walletClient
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
   * Get the NFT data for the connected address
   * @returns nfts
   */
  useEffect(() => {
    const main = async () => {
      let owner = address;
      async function getNftsForOwner() {
        if (isConnected) {
          try {
            let nftArray = [];
            const nftsIterable = alchemy.nft.getNftsForOwnerIterator(owner);
            for await (const nft of nftsIterable) {
              nftArray.push(nft);
            }
            setNfts(nftArray);
          } catch (err) {
            setErrorMsg("An error occurred while fetching");
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
   * Get the NFT data for the connected address
   * @returns nfts
   */

  /**
   * Function to get the ERC6551 address from the ERC721 address
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
   * Logic to open modal
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

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="navbar px-6">
        <div className="flex-1">
          <img src="./logo.png" className="w-16" alt="logo" />
        </div>
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
                        className="btn btn-primary"
                      >
                        View Buddy Wallet
                      </button>
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
                              <div className="grid">
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
      {errorMsg && (
        <div className="toast toast-end">
          <div className="alert alert-error">
            <div>
              <span>{errorMsg}</span>
            </div>
          </div>
        </div>
      )}

      <footer className="footer flex flex-row justify-between p-4  ">
        <div>
          <img src="./logo.png" className="w-16" alt="Buddy Logo" />
          <a
            href="https://tokenbound.org"
            rel="noopener noreferrer"
            target="_blank"
          >
            Powered by Tokenbound
          </a>
        </div>
      </footer>
    </div>
  );
}
