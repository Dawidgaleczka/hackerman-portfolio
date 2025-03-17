import { useRef, useState } from "react";
import gsap from "gsap";
import "./VaporWave.css";

import TitleSection from "./TitleSection";
import VaporWaveScene from "./VaporWaveScene";
import SkullScene from "./SkullScene";

const VaporWaveNew = () => {
  const canvasRef = useRef(null);
  const skullCanvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);

  const [modelLoaded, setModelLoaded] = useState(false);

  const handleGameStart = () => {
    console.log("Game started!");

    const title = document.querySelector(".vapor-wave-bottom h1");
    const title2 = document.querySelector(".vapor-wave-bottom h2");
    const title3 = document.querySelector(".vapor-wave-bottom h3");
    const button = document.querySelector(".start-button");

    gsap.to([title, title2, title3], {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => {
        title.style.display = "none";
        title2.style.display = "none";
        title3.style.display = "none";
      }
    });

    gsap.to(button, {
      opacity: 0,
      scale: .8,
      duration: 1,
      delay: .2,
      ease: "power2.inOut",
      onComplete: () => {
        setTimeout(() => {
          button.style.display = "none";
        }, 1000);
      }
    });

    setModelLoaded(true);
  };

  return (
    <div className="vapor-wave">
      <TitleSection 
        handleGameStart={() => handleGameStart(sceneRef.current)} 
      />
      <VaporWaveScene 
        canvasRef={canvasRef} 
        sceneRef={sceneRef} 
        cameraRef={cameraRef}
        rendererRef={rendererRef}
      />
      {modelLoaded && ( 
        <SkullScene 
          canvasRef={skullCanvasRef}
        />
      )}
    </div>
  );
};

export default VaporWaveNew;