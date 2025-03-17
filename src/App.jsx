import { useState, useEffect, useRef } from "react";
import videoSrc from "/video/me.mp4";
import "./App.css";

import Dialog from "./components/Dialog/Dialog";
import CRTScanline from "./components/CRTScanline/CRTScanline";
import VaporWaveNew from "./components/VaporWave/VaporWaveNew";
import MatrixOverlayNew from "./components/MatrixOverlay/MatrixOverlayNew";
import CRTPreloader from "./components/CRTPreloader/CRTPreloader";

import backgroundMusic from "/audio/background1.mp3"; 

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false); // Tracks if preloader has completed
  const audioRef = useRef(null); // Reference for the audio element

  useEffect(() => {
    // Check if the preloader has been completed before
    const isPreloaded = sessionStorage.getItem("isPreloaded");

    if (isPreloaded) {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && audioRef.current) {
      audioRef.current.play().catch((error) => console.log("Audio autoplay prevented:", error));
    }
  }, [isLoaded]);

  const handlePreloaderComplete = () => {
    sessionStorage.setItem("isPreloaded", "true"); // Save state so preloader doesn't show again
    setIsLoaded(true);
  };

  return (
    <>
      {!isLoaded ? (
        <CRTPreloader onComplete={handlePreloaderComplete} />
      ) : (
        <>
          <MatrixOverlayNew />
          <VaporWaveNew />
          <Dialog 
            name="Dawid"
            entryMessage={"YO!"}
            videoSrc={videoSrc}
            conversation={[
              "Welcome to the digital northern highway, My guy! Name's Dawid.",
              "I'll be your local stalker through this digital wasteland. Buckle up, bro!",
              "Smash that close button and let's blaze through the digital landscape!",
            ]}
          />
          {/* Audio Element */}
          {/* <audio ref={audioRef} src={backgroundMusic} loop autoPlay /> */}
        </>
      )}
      <CRTScanline />
    </>
  );
};

export default App;
