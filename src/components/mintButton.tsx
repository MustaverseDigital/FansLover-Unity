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
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [address]);

  // 根據條件動態調整按鈕文字
  const buttonText = loading
    ? "Minting..."
    : !address
    ? "Please connect your wallet"
    : isOwnerStatus
    ? "Already minted"
    : canMint
    ? "Mint NFT"
    : "Need 10 💗 to mint NFT";

  return (
    <button
      onClick={() => {
        if (address) {
          handleMint();
        }
      }}
      disabled={
        loading ||
        isOwnerStatus ||
        !checkStatus ||
        !canMint ||
        !address // 禁用按鈕如果未連接錢包
      }
      className={`rounded-3xl w-1/2 p-1 sm:p-2 md:p-3 flex items-center justify-center
        ${
          loading || isOwnerStatus || !checkStatus || !canMint || !address
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-white cursor-pointer"
        }`}
    >
      <span className="font-light">{buttonText}</span>
    </button>
  );
};

export default MintButton;
