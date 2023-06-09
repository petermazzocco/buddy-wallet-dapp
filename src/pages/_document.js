import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>BUDDY WALLET</title>
        <meta
          name="description"
          content="Buddy Wallet is a ERC6551 friendly wallet"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="twitter:title" content="BUDDY WALLET" />
        <meta
          name="twitter:description"
          content="Buddy Wallet is a ERC6551 friendly wallet"
        />
        <meta name="twitter:image" content="/logo.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
