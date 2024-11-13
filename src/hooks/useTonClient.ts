import { useEffect, useState } from "react";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { CHAIN } from "@tonconnect/ui-react";
import { TonClient } from "@ton/ton";
import { useTonConnect } from "./useTonConnect";

export const useTonClient = () => {
  const { network } = useTonConnect();
  const [client, setClient] = useState<TonClient>();

  useEffect(() => {
    if (!network) return;
    (async () => {
      const endpoint = await getHttpEndpoint({
        network: network === CHAIN.MAINNET ? "mainnet" : "testnet",
      });
      const tonClient = new TonClient({ endpoint });
      setClient(tonClient);
    })();
  }, [network]);

  return {
    client,
  };
};
