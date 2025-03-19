import { useEffect, useState, useRef } from "react";
import Dialog from "./../Dialog/Dialog";
import SkullHealthbar from "./SkullHealthbar";
import SkullRenderer from "./SkullRenderer";
import AboutMeSection from "./AboutMeSection";
import ProjectsSection from "./ProjectsSection";
import imageSrc from "/images/skull.png";
import doomHand from "/images/test.png";
import gsap from "gsap";

const SkullScene = ({ canvasRef }) => {
    // =========================================
    // State Management
    // =========================================
    const [doomHandVisible, setDoomHandVisible] = useState(false);
    const [healthbarVisible, setHealthbarVisible] = useState(false);
    const [currentDialog, setCurrentDialog] = useState(1);
    const [skullHealth, setSkullHealth] = useState(100);
    const [isFiring, setIsFiring] = useState(false);
    const [showSurrenderDialog, setShowSurrenderDialog] = useState(false);
    const [showMatrixAnimation, setShowMatrixAnimation] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false); 
    const [showNavigationButtons, setShowNavigationButtons] = useState(false);
    const [showPostMatrixDialog, setShowPostMatrixDialog] = useState(false);
    const [skullVisible, setSkullVisible] = useState(true);
    const [showBackButton, setShowBackButton] = useState(false);
    const [showAboutMe, setShowAboutMe] = useState(false);
    const [showProjects, setShowProjects] = useState(false);
    
    // Refs
    const skullRef = useRef(null);

    // =========================================
    // Skull Health Effect
    // =========================================
    useEffect(() => {
        if (skullHealth === 1 && !showSurrenderDialog) {
            setShowSurrenderDialog(true);
        }
    }, [skullHealth, showSurrenderDialog]);

    // =========================================
    // Dialog Handlers
    // =========================================
    const closeDialog1 = () => {
        setDoomHandVisible(true);
        setCurrentDialog(2);
    }

    const closeDialog2 = () => {
        setHealthbarVisible(true);
        setCurrentDialog(3);
    }

    const closePostMatrixDialog = () => {
        setShowPostMatrixDialog(false);
        setShowNavigationButtons(true);
    }

    const closeSurrenderDialog = () => {
        setShowMatrixAnimation(true);
        setDoomHandVisible(false);
        setHealthbarVisible(false);
        
        setTimeout(() => {
            setSkullHealth(100);
            
            if (skullRef.current) {
                const skull = skullRef.current;
                
                // Reset skull position
                gsap.to(skull.position, {
                    x: 0,
                    y: 0.5,
                    z: -2,
                    duration: 1,
                    ease: "power2.inOut"
                });
                
                // Change skull color
                skull.traverse((child) => {
                    if (child.isMesh && child.material && child.material.uniforms.color) {
                        gsap.to(child.material.uniforms.color.value, {
                            r: 0,
                            g: 0.56,
                            b: 0.07,
                            duration: 1
                        });
                    }
                });
            }
            
            setShowMatrixAnimation(false);
            setShowSurrenderDialog(false);
            setShowPostMatrixDialog(true);
        }, 3000);
    }

    // =========================================
    // Interaction Handlers
    // =========================================
    const handleShoot = () => {
        if (!healthbarVisible || skullHealth <= 1 || showSurrenderDialog) return;
        
        setIsFiring(true);
        setTimeout(() => setIsFiring(false), 300);
    
        setSkullHealth(prev => Math.max(1, prev - 10));
        
        if (skullRef.current) {
            const skull = skullRef.current;

            // Flash red effect
            skull.traverse((child) => {
                if (child.isMesh && child.material && child.material.uniforms.color) {
                    const originalColor = child.material.uniforms.color.value.clone();
                    gsap.to(child.material.uniforms.color.value, {
                        r: 1, g: 0, b: 0,
                        duration: 0.1,
                        onComplete: () => {
                            gsap.to(child.material.uniforms.color.value, {
                                r: originalColor.r,
                                g: originalColor.g,
                                b: originalColor.b,
                                duration: 0.2
                            });
                        }
                    });
                }
            });
            
            // Shake effect
            gsap.to(skull.position, {
                x: "+=0.05",
                duration: 0.1,
                repeat: 5,
                yoyo: true
            });
        }
    };

    // =========================================
    // Navigation Handlers
    // =========================================
    const handleButtonClick = (section) => {
        setShowNavigationButtons(false);
        setShowMatrixAnimation(true);
        setSkullVisible(false);
        
        setTimeout(() => {
            setShowMatrixAnimation(false);
            setShowBackButton(true);
            
            // Set the appropriate section to show
            if (section === 'about') {
                setShowAboutMe(true);
                setShowProjects(false);
            } else if (section === 'projects') {
                setShowProjects(true);
                setShowAboutMe(false);
            }
        }, 3000);
    };

    const handleBackClick = () => {
        setShowBackButton(false);
        setShowMatrixAnimation(true);
        setShowAboutMe(false);
        setShowProjects(false);
        
        setTimeout(() => {
            setShowMatrixAnimation(false);
            setSkullVisible(true);
            setShowNavigationButtons(true);
        }, 3000);
    };

    // =========================================
    // Render
    // =========================================
    return (
        <div className="skull-scene">
            <div className="skull-scene-overlay" />
            <div className="skull-scene-inner">
                <canvas ref={canvasRef} className="skull-webgl" />
                
                <SkullRenderer 
                    canvasRef={canvasRef} 
                    skullRef={skullRef} 
                    skullVisible={skullVisible} 
                />
                
                {/* Dialog Sequence */}
                {currentDialog === 1 && !showSurrenderDialog && !gameCompleted && skullVisible && (
                    <Dialog
                        name={"Lost travler"}
                        defaultOpen={true}
                        imageSrc={imageSrc}
                        conversation={["This digital highway aint big enough for the both of us..."]}
                        afterClose={closeDialog1}
                    />
                )}
                {currentDialog === 2 && !showSurrenderDialog && !gameCompleted && skullVisible && (
                    <Dialog
                        name={"Lost travler"}
                        defaultOpen={true}
                        imageSrc={imageSrc}
                        conversation={["Ehm.. Maybe we could talk about this? (click on the gun)"]}
                        afterClose={closeDialog2}
                    />
                )}
                {/* Surrender Dialog */}
                {showSurrenderDialog && !showMatrixAnimation && skullVisible && (
                    <Dialog
                        name={"Lost travler"}
                        defaultOpen={true}
                        imageSrc={imageSrc}
                        conversation={["I give up! Please stop shooting me!"]}
                        afterClose={closeSurrenderDialog}
                    />
                )}

                {/* Post-Matrix Dialog */}
                {showPostMatrixDialog && skullVisible && (
                    <Dialog
                        name={"Lost travler"}
                        defaultOpen={true}
                        imageSrc={imageSrc}
                        conversation={["Thanks for sparing me! I can help you navigate this digital wasteland. Where would you like to go?"]}
                        afterClose={closePostMatrixDialog}
                    />
                )}

                {/* Matrix Animation */}
                {showMatrixAnimation && (
                    <div className="matrix-animation-overlay">
                        <div className="matrix-animation"></div>
                    </div>
                )}

                {/* Navigation Buttons */}
                {showNavigationButtons && (
                    <div className="navigation-buttons">
                        <button 
                            className="nav-button about-button" 
                            onClick={() => handleButtonClick('about')}
                        >
                            ABOUT ME
                        </button>
                        <button 
                            className="nav-button projects-button" 
                            onClick={() => handleButtonClick('projects')}
                        >
                            PROJECTS
                        </button>
                    </div>
                )}

                {/* About Me Section */}
                {showAboutMe && <AboutMeSection />}

                {/* Projects Section */}
                {showProjects && <ProjectsSection />}

                {/* Back Button */}
                {showBackButton && (
                    <div className="back-button-container">
                        <button 
                            className="back-button" 
                            onClick={handleBackClick}
                        >
                            BACK
                        </button>
                    </div>
                )}

                {/* Doom Hand */}
                {doomHandVisible && !showSurrenderDialog && !gameCompleted && skullVisible && (
                    <div 
                        id="doom-hand" 
                        className={isFiring ? "firing" : ""}
                        onClick={handleShoot}
                    >
                        <img src={doomHand} alt="Doom Hand" />
                    </div>
                )}
                
                {/* Health Bar */}
                {healthbarVisible && !gameCompleted && skullVisible && (
                    <SkullHealthbar health={skullHealth} />
                )}
            </div>
        </div>
    );
};

export default SkullScene;


