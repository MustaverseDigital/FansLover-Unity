import { NftCollection } from "@/wrappers/NftCollection";
import { Address, OpenedContract } from "@ton/core";
import { TonClient } from "@ton/ton";
import { useCallback, useEffect, useState } from "react";

export const useNftCollection = (
  address: Address,
  tonClient: TonClient | undefined
) => {
  const [collection, setCollection] =
    useState<OpenedContract<NftCollection> | null>(null);
  // 使用 useCallback 來記憶化初始化集合的函數
  const initializeCollection = useCallback(() => {
    if (!tonClient) return null;

    return tonClient.open(NftCollection.createFromAddress(address));
  }, [address, tonClient]);

  useEffect(() => {
    const nftCollection = initializeCollection();
    if (nftCollection) {
      setCollection(nftCollection);
    }
  }, [initializeCollection]);

  return collection;
};
