import React, { useCallback, useState } from "react";
import { CHAIN, TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import { Address, toNano } from "@ton/core";
import { TonClient } from "@ton/ton";
import { useTonConnect } from "@/hooks/useTonConnect";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { NftCollection as NftCollectionWrapper } from "@/wrappers/NftCollection";
import { useCheckNFT } from "@/hooks/useCheckNFT";

const MintNFT = () => {
  // const { tonClient } = useApp();
  const [loading, setLoading] = useState(false);

  const address = useTonAddress();
  const { network, sender, walletAddress } = useTonConnect();
  const NFT_COLLECTION_ADDRESS = Address.parse(
    network === CHAIN.MAINNET
      ? ""
      : "EQAXju2d1HY2ObK-pVmcbYx7ukMB_Jm0JzzW-iR81d7uLcAF"
  );
  const { isOwnerStatus, checkStatus, NFTData } = useCheckNFT(
    NFT_COLLECTION_ADDRESS,
    walletAddress
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
    if (address === "") return;

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
        value: toNano("0.005"),
        queryId: randomSeed,
        amount: toNano("0.005"),
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-100">
      <TonConnectButton />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">
          TON NFT Minter (with Spline)
        </h1>

        <div className="space-y-6">
          {!checkStatus && !walletAddress && (
            <p className="text-center font-bold text-lg">
              Connect wallet first
            </p>
          )}
          {!checkStatus && walletAddress && (
            <p className="text-center font-bold text-lg">Checking NFT status</p>
          )}
          {checkStatus && !isOwnerStatus && (
            <button
              onClick={() => {
                handleMint();
              }}
              disabled={loading || isOwnerStatus}
              className={`w-full px-4 py-2 rounded-md text-white flex items-center justify-center gap-2
              ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {loading && <div className="w-4 h-4 animate-spin" />}
              {loading ? "Minting..." : "Mint NFT"}
            </button>
          )}
          <button
            onClick={() => {
              handleMint();
            }}
            disabled={loading || isOwnerStatus}
            className={`w-full px-4 py-2 rounded-md text-white flex items-center justify-center gap-2
              ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading && <div className="w-4 h-4 animate-spin" />}
            {loading ? "Minting..." : "Mint NFT"}
          </button>
          {checkStatus && isOwnerStatus && NFTData && (
            <div className="text-center">
              {/* {NFTData?.content.toBoc()} */}
              <p>You are the owner of the NFT collection!!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MintNFT;
