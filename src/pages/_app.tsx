import { AppProvider } from "@/context/app-context";
import "@/styles/globals.css";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <TonConnectUIProvider
      manifestUrl="https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json"
      // actionsConfiguration={{
      //     twaReturnUrl: "https://t.me/tinaaaaalee_gf_bot",
      //   }}
    >
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </TonConnectUIProvider>
  );
}
