import { NftCollection } from "@/wrappers/NftCollection";
import { NftItem } from "@/wrappers/NftItem";
import { Address, Cell } from "@ton/core";
import { TonClient } from "@ton/ton";
import { CHAIN } from "@tonconnect/ui-react";
import { useEffect, useRef, useState } from "react";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { useTonConnect } from "./useTonConnect";

interface NFTData {
  collectionAddress: Address;
  content: Cell;
  index: bigint;
  init: number;
  ownerAddress: Address;
  pointValue: number;
}

export const useCheckNFT = (
  nftCollection: Address | null,
  walletAddress: Address | null
) => {
  const [isOwnerStatus, setIsOwnerStatus] = useState(false);
  const [checkStatus, setCheckStatus] = useState(false);
  const [NFTData, setNFTData] = useState<NFTData | null>(null);
  const isProcessing = useRef(false);
  const { network } = useTonConnect();

  useEffect(() => {
    const checkNFT = async () => {
      if (nftCollection === null || walletAddress === null) {
        console.log("nftCollection or walletAddress is null");
        return;
      }
      const endpoint = await getHttpEndpoint({
        network: network === CHAIN.MAINNET ? "mainnet" : "testnet",
      });
      const tonClient = new TonClient({ endpoint });
      const nftCollectionContract = tonClient.open(
        NftCollection.createFromAddress(nftCollection)
      );
      // console.log("walletAddress", walletAddress.toString());
      const collectionData = await nftCollectionContract.getCollectionData();
      const nextIndex = collectionData.nextItemId;
      // console.log(`Next item index: ${nextIndex}`);
      for (let i = 0; i < nextIndex; i++) {
        const itemAddress = await nftCollectionContract.getItemAddressByIndex(
          i
        );
        // console.log(`Item address: ${itemAddress.toString()}`);
        if (tonClient) {
          const nftItem = tonClient.open(
            NftItem.createFromAddress(itemAddress)
          );
          const nftItemData = await nftItem.getNftData();
          if (
            walletAddress.toString() === nftItemData.ownerAddress.toString()
          ) {
            setIsOwnerStatus(true);
            console.log("nftItemData", nftItemData);
            setNFTData(nftItemData as NFTData);
            break;
          }
        }
      }
      setCheckStatus(true);
    };

    const tick = async () => {
      if (isProcessing.current) return;
      isProcessing.current = true;

      await checkNFT();

      isProcessing.current = false;
    };

    const intervalId = setInterval(tick, 50 * 1000);
    tick();
    return () => {
      isProcessing.current = false;
      clearInterval(intervalId);
    };
  }, [nftCollection, walletAddress]);

  return { isOwnerStatus, checkStatus, NFTData };
};
