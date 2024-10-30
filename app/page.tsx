"use client"
import { useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

const Game = () => {
  const { unityProvider } = useUnityContext({
    loaderUrl: "/Build/docs.loader.js",
    dataUrl: "/Build/docs.data",
    frameworkUrl: "/Build/docs.framework.js",
    codeUrl: "/Build/docs.wasm",
  });

  // We'll use a state to store the device pixel ratio.
  const [devicePixelRatio, setDevicePixelRatio] = useState(typeof window !== 'undefined' ? window.devicePixelRatio : 1);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // A function which will update the device pixel ratio of the Unity
    // Application to match the device pixel ratio of the browser.
    const updateDevicePixelRatio = () => {
      setDevicePixelRatio(window.devicePixelRatio);
    };
    // A media matcher which watches for changes in the device pixel ratio.
    const mediaMatcher = window.matchMedia(`screen and (resolution: ${devicePixelRatio}dppx)`);
    // Adding an event listener to the media matcher which will update the
    // device pixel ratio of the Unity Application when the device pixel
    // ratio changes.
    mediaMatcher.addEventListener("change", updateDevicePixelRatio);
    return () => {
      // Removing the event listener when the component unmounts.
      mediaMatcher.removeEventListener("change", updateDevicePixelRatio);
    };
  }, [devicePixelRatio]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-100">
      {/* Top Bar */}
      <div className="absolute top-4 left-0 right-0 flex justify-between items-center p-2">
        <div className="flex items-center justify-evenly bg-white rounded-3xl p-3">
          <div className="bg-orange-400 w-6 h-6 rounded-full"></div>
          <span className="font-bold">$ 73</span>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-3xl p-3">
          <div className="bg-blue-500 w-6 h-6 rounded-full"></div>
          <span className="font-bold">UQBd...fJYB</span>
        </div>
      </div>

      <div className="relative w-auto h-auto bg-white rounded-lg p-1">
        <Unity unityProvider={unityProvider}
          style={{
            width: '100%', height: 'calc(100vh - 15rem)',
            borderRadius: '15px',
          }}
          devicePixelRatio={devicePixelRatio}
        />
      </div>
      {/* Bottom Nav */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex justify-between px-8">
          <button className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="transform rotate-45">↑</span>
          </button>
          <button className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            📊
          </button>
          <button className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            😊
          </button>
          <button className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            👤
          </button>
        </div>
      </div>
    </div>
  );
};

export default Game;