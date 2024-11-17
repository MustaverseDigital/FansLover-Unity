import React, { useCallback, useState } from "react";
import { CHAIN, useTonAddress } from "@tonconnect/ui-react";
import { Address, toNano } from "@ton/core";
import { TonClient } from "@ton/ton";
import { useTonConnect } from "@/hooks/useTonConnect";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { NftCollection as NftCollectionWrapper } from "@/wrappers/NftCollection";
import { useCheckNFT } from "@/hooks/useCheckNFT";
import { useApp } from "@/context/app-context";
import { useNftCollection } from "@/hooks/useNftCollection";
import { NFT_COLLECTION_ADDRESS } from "@/constants/address";

export interface UserData {
  userid: string;
  unlocked: boolean;
  love: number;
}

const MintButton = ({ canMint }: { canMint: boolean }) => {
  const { tonClient } = useApp();
  const [loading, setLoading] = useState(false);
  const { network, sender, walletAddress } = useTonConnect();
  const address = useTonAddress();
  const nftCollection = useNftCollection(NFT_COLLECTION_ADDRESS, tonClient);
  const { isOwnerStatus, checkStatus } = useCheckNFT(
    nftCollection,
    canMint ? walletAddress : null,
    tonClient
  );
  const waitTxFinalized = useCallback(
    async (txlt: string, address: Address, tonClient: TonClient) => {
      for (let attempt = 0; attempt < 10; attempt++) {
        await sleep(2000);
        const result = await tonClient.getContractState(address);
        const lastLx = result.lastTransaction?.lt;
        if (lastLx !== txlt) {
          console.log(`Transaction ${txlt} finalized`);
          break;
        }
      }
    },
    []
  );
  const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  const randomSeed = Math.floor(Math.random() * 10000);
  const handleMint = useCallback(async () => {
    if (address === null) return;

    setLoading(true);
    const endpoint = await getHttpEndpoint({
      network: network === CHAIN.MAINNET ? "mainnet" : "testnet",
    });
    const tonClient = new TonClient({ endpoint });

    if (!tonClient) return;

    const nftCollection = tonClient.open(
      NftCollectionWrapper.createFromAddress(NFT_COLLECTION_ADDRESS)
    );
    try {
      const collectionData = await nftCollection.getCollectionData();
      await nftCollection.sendMintNft(sender, {
        value: toNano("0.01"),
        queryId: randomSeed,
        amount: toNano("0.01"),
        itemIndex: collectionData.nextItemId,
        itemOwnerAddress: Address.parse(address),
        itemContentUrl: `item.json`,
      });

      const result = await tonClient.getContractState(NFT_COLLECTION_ADDRESS);
      console.log(result);
      const txLt = result.lastTransaction?.lt ?? "";
      console.log(`Last transaction: ${txLt}`);

      await waitTxFinalized(txLt, NFT_COLLECTION_ADDRESS, tonClient);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [address]);

  return (
    <button
      onClick={() => {
        handleMint();
      }}
      disabled={loading || isOwnerStatus || !checkStatus || !canMint}
      className={`rounded-3xl w-1/2 p-1 sm:p-2 md:p-3 flex items-center justify-center
        ${
          loading || isOwnerStatus || !checkStatus || !canMint
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-white cursor-pointer"
        }`}
    >
      <span className="font-light">
        {loading
          ? "Minting..."
          : isOwnerStatus
          ? "Already minted"
          : canMint
          ? "Mint NFT"
          : "need 10 💗 to mint NFT"}
      </span>
    </button>
  );
};

export default MintButton;
