import { useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { useTonAddress, TonConnectButton } from "@tonconnect/ui-react";
import { useRouter } from "next/router";
import axios from 'axios';
import Image from 'next/image';
import fansLoverLogo from "/public/fansLoverLogo.jpg";

const Game = () => {
  const [unlockMinter, setUnlockMinter] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loveValue, setLoveValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiError, setIsApiError] = useState(false);

  const { unityProvider, isLoaded, sendMessage } = useUnityContext({
    loaderUrl: "/Build/docs.loader.js",
    dataUrl: "/Build/docs.data",
    frameworkUrl: "/Build/docs.framework.js",
    codeUrl: "/Build/docs.wasm",
  });
  const router = useRouter();

  const userFriendlyAddress = useTonAddress();

  useEffect(() => {
    if (!isLoaded) return;
    function sendAddress(userFriendlyAddress: string) {
      sendMessage("ReactBridge", "sendAddress", userFriendlyAddress);
    }
    sendAddress(userFriendlyAddress);
    console.log("sendAddress in next", userFriendlyAddress);
  }, [isLoaded, sendMessage, userFriendlyAddress]);

  // We'll use a state to store the device pixel ratio.
  const [devicePixelRatio, setDevicePixelRatio] = useState(
    typeof window !== "undefined" ? window.devicePixelRatio : 1
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    // A function which will update the device pixel ratio of the Unity
    // Application to match the device pixel ratio of the browser.
    const updateDevicePixelRatio = () => {
      setDevicePixelRatio(window.devicePixelRatio);
    };
    // A media matcher which watches for changes in the device pixel ratio.
    const mediaMatcher = window.matchMedia(
      `screen and (resolution: ${devicePixelRatio}dppx)`
    );
    // Adding an event listener to the media matcher which will update the
    // device pixel ratio of the Unity Application when the device pixel
    // ratio changes.
    mediaMatcher.addEventListener("change", updateDevicePixelRatio);
    return () => {
      // Removing the event listener when the component unmounts.
      mediaMatcher.removeEventListener("change", updateDevicePixelRatio);
    };
  }, [devicePixelRatio]);

  useEffect(() => {
    const handleClick = () => { setIsOpen(false) };
    addEventListener('click', handleClick);
    return () => {
      removeEventListener('click', handleClick);
    };
  }, [isOpen]);

  const AffectionCheck = async () => {
    setIsApiError(false);
    setIsLoading(true);
    try {
      const response = await axios.post('https://ai-gf.tinalee.bot/chat', {
        message: "現在好感度是多少",
        userId: 11,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = JSON.parse(response.data);
      const isUnlocked = Boolean(data.unlocked);
      console.log('love:', data);
      if (isUnlocked && isUnlocked !== null) {
        setLoveValue(data.love);
        setUnlockMinter(true);
        setIsOpen(true);
      }
      if (!isUnlocked) {
        console.log('love:', isUnlocked);
        console.log(data.love)
        setLoveValue(data.love === undefined ? data.text : data.love);
        setIsOpen(true);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error sending API request:', error);
      setIsApiError(true);
      setIsLoading(false);
      setIsOpen(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-100">
      {/* Top Bar */}
      <div className="absolute top-4 left-0 right-0 flex justify-between items-center p-2">
        <div className="flex items-center justify-evenly gap-3">
          <Image src={fansLoverLogo} alt="fans_lover_logo" width={50} height={50} className="rounded-full" />
          <div className='flex flex-col items-center justify-center gap-1'>
            <span className="font-bold">FansNetwork  </span>
          </div>
        </div>
        <TonConnectButton />
      </div>

      <div className="relative w-auto h-auto bg-white rounded-lg p-1">
        <Unity
          unityProvider={unityProvider}
          style={{
            width: "100%",
            height: "calc(100vh - 11rem)",
            borderRadius: "15px",
          }}
          devicePixelRatio={devicePixelRatio}
        />
      </div>
      {/* Bottom Nav */}
      <div className="absolute bottom-2 left-0 right-0 px-2 ">
        <div className="flex justify-center items-center gap-5">
          <button className=" w-[120px] md:w-auto h-12 p-3 bg-white rounded-3xl flex items-center justify-center">
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="relative w-8 h-8">
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
                </div>
              </div>
            ) : (
              <div className='flex justify-center items-center' onClick={AffectionCheck}>
                <div>❤️</div>
                <div className="font-light" >Affection Check</div>
              </div>
            )}
          </button>
          <button
            className={`rounded-3xl p-1 sm:p-2 md:p-3 flex items-center justify-center ${unlockMinter ? 'bg-white' : 'bg-gray-400'} `}
            onClick={() => {
              if (unlockMinter) {
                router.push("/ton");
              }
            }}
            disabled={!unlockMinter}
          >
            <span className="font-light">
              {unlockMinter ? "Mint NFT" : "need 100 love to mint NFT"}
              {/* go th Minter */}
            </span>
          </button>
          <button className='font-bold bg-white rounded-3xl p-2'
            onClick={() => router.push("/ton")}>test btn</button>
          <audio src="/bgm.mp3" muted={false} autoPlay />
        </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-80">
            {isApiError ? (
              <p className="text-red-500 text-center">
                Error fetching data from the server. Please try again later.
              </p>
            ) : (
              <div className="text-center">
                <h2 className="text-xl font-bold mb-4">Current Affection Level</h2>
                <p className="text-lg">Your current affection level is:</p>
                <p className="text-red-500">{loveValue}</p>
              </div>
            )}
            <div className="flex justify-center items-center">
              <button
                className="mt-4 p-2 bg-blue-500 text-white rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
