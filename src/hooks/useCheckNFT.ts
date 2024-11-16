import { NftCollection } from "@/wrappers/NftCollection";
import { NftItem } from "@/wrappers/NftItem";
import { Address, OpenedContract, Cell } from "@ton/core";
import { TonClient } from "@ton/ton";
import { useEffect, useRef, useState } from "react";

interface NFTData {
  collectionAddress: Address;
  content: Cell;
  index: bigint;
  init: number;
  ownerAddress: Address;
  pointValue: number;
}

export const useCheckNFT = (
  nftCollection: OpenedContract<NftCollection> | null,
  walletAddress: Address | null,
  tonClient: TonClient | undefined
) => {
  const [isOwnerStatus, setIsOwnerStatus] = useState(false);
  const [checkStatus, setCheckStatus] = useState(false);
  const [NFTData, setNFTData] = useState<NFTData | null>(null);
  const isProcessing = useRef(false);

  useEffect(() => {
    const checkNFT = async () => {
      if (nftCollection === null || walletAddress === null) {
        console.log("nftCollection or walletAddress is null");
        return;
      }
      try {
        const collectionData = await nftCollection.getCollectionData();
        const nextIndex = collectionData.nextItemId;
        for (let i = 0; i < nextIndex; i++) {
          try {
            const itemAddress = await nftCollection.getItemAddressByIndex(i);
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
          } catch (error) {
            console.error("checkNFT item error", error);
          }
        }
      } catch (error) {
        console.error("checkNFT collection error", error);
      } finally {
        setCheckStatus(true);
      }
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
