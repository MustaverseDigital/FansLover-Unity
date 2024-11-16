import { useEffect, useState } from "react";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { CHAIN } from "@tonconnect/ui-react";
import { TonClient } from "@ton/ton";
import { useTonConnect } from "./useTonConnect";

export const useTonClient = () => {
  const { network } = useTonConnect();
  const [client, setClient] = useState<TonClient>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initializeClient() {
      try {
        if (!network) return;

        const endpoint = await getHttpEndpoint({
          network: network === CHAIN.MAINNET ? "mainnet" : "testnet",
        });

        const newClient = new TonClient({ endpoint });
        setClient(newClient);
      } catch (error) {
        console.error("Failed to initialize TonClient:", error);
      } finally {
        setLoading(false);
      }
    }

    initializeClient();
  }, [network]);
  return {
    client,
    loading,
  };
};
