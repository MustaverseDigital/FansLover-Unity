import { useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { useTonAddress, TonConnectButton } from "@tonconnect/ui-react";
import axios from "axios";
import Image from "next/image";
import fansLoverLogo from "/public/fansLoverLogo.jpg";
import MintButton from "@/components/mintButton";
// import MintButton from "@/components/mintButton";

interface UserData {
  unlocked: boolean;
  love: number;
  userid: number;
}

const Game = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiError, setIsApiError] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isCanMint, setIsCanMint] = useState(false);
  const userFriendlyAddress = useTonAddress();

  const { unityProvider, isLoaded, sendMessage } = useUnityContext({
    loaderUrl: "/Build/docs.loader.js",
    dataUrl: "/Build/docs.data",
    frameworkUrl: "/Build/docs.framework.js",
    codeUrl: "/Build/docs.wasm",
  });

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
    const handleClick = () => {
      setIsOpen(false);
    };
    addEventListener("click", handleClick);
    return () => {
      removeEventListener("click", handleClick);
    };
  }, [isOpen]);

  const AffectionCheck = async () => {
    setIsApiError(false);
    setIsLoading(true);
    const userid = userFriendlyAddress;
    try {
      const res = await axios.get(
        `https://ai-gf.tinalee.bot/get_status?userid=${userid}`
      );
      const data = res.data as UserData;
      const isUnlocked = Boolean(data.unlocked);
      setUserData(data);
      console.log("isUnlocked", isUnlocked);
      if (isUnlocked && isUnlocked !== null) {
        setIsCanMint(data.love >= 100);
      }
      if (!isUnlocked) {
        setIsCanMint(false);
      }
    } catch (error) {
      console.error("Error sending API request:", error);
      setIsApiError(true);
      // setIsOpen(true);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (userFriendlyAddress) {
      AffectionCheck();
      const intervalId = setInterval(() => {
        AffectionCheck();
      }, 10000);
      return () => clearInterval(intervalId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userFriendlyAddress]);

  useEffect(() => {
    console.log("isLoading", isLoading);
    console.log("isApiError", isApiError);
  }, [isLoading, isApiError]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-100">
      {/* Top Bar */}
      <div className="absolute top-4 left-0 right-0 flex justify-between items-center p-2">
        <div className="flex items-center justify-evenly gap-3">
          <Image
            src={fansLoverLogo}
            alt="fans_lover_logo"
            width={50}
            height={50}
            className="rounded-full"
          />
          <div className="flex flex-col items-center justify-center gap-1">
            <span className="font-bold">FansLover </span>
          </div>
        </div>
        <TonConnectButton />
      </div>

      <div className="relative w-auto h-auto bg-white rounded-lg p-1">
        <Unity
          unityProvider={unityProvider}
          style={{
            height: "calc(100vh - 11rem)",
            width: `calc((100vh - 11rem) * (9 / 16))`,
            borderRadius: "15px",
          }}
          devicePixelRatio={devicePixelRatio}
        />
      </div>
      {/* Bottom Nav */}
      <div className="absolute bottom-2 left-0 right-0 px-2 ">
        <div className="flex justify-center items-center">
          <p className="text-red-500 flex">
            {Array.from(
              { length: Math.floor((userData?.love || 0) / 10) },
              (_, index) => (
                <span key={index}>💗</span>
              )
            )}
          </p>
        </div>
        <div className="flex justify-center items-center gap-1">
          <MintButton canMint={isCanMint} />
        </div>
      </div>
      <audio src="/bgm.mp3" muted={false} autoPlay loop />
    </div>
  );
};

export default Game;
