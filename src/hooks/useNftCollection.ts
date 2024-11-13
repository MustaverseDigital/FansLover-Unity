import { NftCollection } from "@/wrappers/NftCollection";
import { Address, OpenedContract } from "@ton/core";
import { TonClient } from "@ton/ton";
import { useEffect, useState } from "react";

export const useNftCollection = (
  address: Address,
  tonClient: TonClient | undefined
) => {
  const [collection, setCollection] =
    useState<OpenedContract<NftCollection> | null>(null);
  useEffect(() => {
    if (tonClient == null) {
      return;
    }

    const nftCollection = tonClient.open(
      NftCollection.createFromAddress(address)
    );
    setCollection(nftCollection);
  }, [address, tonClient]);

  return collection;
};
