import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { useState, useEffect } from "react";

const APIKEY = process.env.NEXT_PUBLIC_ALCHEMY_API;
const { chains, publicClient } = configureChains(
  [mainnet],
  [alchemyProvider({ apiKey: APIKEY }), publicProvider()]
);

const PROJECT_ID = process.env.NEXT_PUBLIC_WC_ID;
const { connectors } = getDefaultWallets({
  appName: "Buddy Wallet",
  projectId: PROJECT_ID,
  chains,
});

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function App({ Component, pageProps }) {
  /**
   * @note Fix hydration error:
   * */
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <>
      {ready && (
        <WagmiConfig config={config}>
          <RainbowKitProvider
            chains={chains}
            theme={lightTheme({
              accentColor: "#5e20dd",
              borderRadius: "small",
            })}
          >
            <Component {...pageProps} />
          </RainbowKitProvider>
        </WagmiConfig>
      )}
    </>
  );
}
