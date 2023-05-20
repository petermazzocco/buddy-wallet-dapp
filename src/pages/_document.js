import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>BUDDY WALLET</title>
        <meta
          content="Buddy Wallet - View & Transact With Your NFT's Buddy Wallet Using ERC6551"
          name="description"
        />
        <link href="/favicon.ico" rel="shortcut icon" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
