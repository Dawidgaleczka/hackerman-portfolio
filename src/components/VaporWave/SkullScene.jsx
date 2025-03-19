import { useEffect, useState, useRef } from "react";
import Dialog from "./../Dialog/Dialog";
import SkullHealthbar from "./SkullHealthbar";
import imageSrc from "/images/skull.png";
import doomHand from "/images/test.png";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
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
    // Skull Visibility Effect
    // =========================================
    useEffect(() => {
        if (!skullRef.current) return;
        
        if (skullVisible) {
            skullRef.current.visible = true;
        } else {
            skullRef.current.visible = false;
        }
    }, [skullVisible]);

    // =========================================
    // Three.js Scene Setup
    // =========================================
    useEffect(() => {
        if (!canvasRef || !canvasRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, 0.5, 1);

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Lighting setup
        const setupLights = () => {
            const hemiLight = new THREE.HemisphereLight("#ffffff", "#222222", 1.5);
            scene.add(hemiLight);

            const directionalLight = new THREE.DirectionalLight("#ffffff", 5);
            directionalLight.castShadow = true;
            directionalLight.position.set(5, 5, 5);
            scene.add(directionalLight);

            const pointLight = new THREE.PointLight("#00ff99", 10, 25);
            pointLight.castShadow = true;
            pointLight.position.set(0, 3, 2);
            scene.add(pointLight);

            const ambientLight = new THREE.AmbientLight("#444444", 1.0);
            scene.add(ambientLight);
        };
        setupLights();

        // Shader setup
        const fresnelShader = {
            uniforms: {
                color: { value: new THREE.Color(0x008F11) },
                fresnelPower: { value: 2.5 },
                fresnelScale: { value: 1.5 },
                opacity: { value: 0 },
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vViewDir;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
                    vViewDir = normalize(-viewPosition.xyz);
                    gl_Position = projectionMatrix * viewPosition;
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                uniform float fresnelPower;
                uniform float fresnelScale;
                uniform float opacity;
                varying vec3 vNormal;
                varying vec3 vViewDir;
                void main() {
                    float fresnel = pow(1.0 - dot(vNormal, vViewDir), fresnelPower) * fresnelScale;
                    gl_FragColor = vec4(color * fresnel, opacity);
                }
            `,
            transparent: true,
        };

        // Load skull model
        const loader = new OBJLoader();
        let skull;
        let jaw = null;
        let skullTop = null;

        loader.load(
            "/models/skull.obj",
            (obj) => {
                skull = obj;
                skullRef.current = obj;
                obj.scale.set(0.01, 0.01, 0.01);
                obj.position.set(0, 0.5, -2);

                // Apply materials
                obj.traverse((child) => {
                    if (child.isMesh) {
                        child.material = new THREE.ShaderMaterial(fresnelShader);
                        if (child.name.toLowerCase().includes("jaw")) {
                            jaw = child;
                        } else if (child.name.toLowerCase().includes("head")) {
                            skullTop = child;
                        }
                    }
                });
                
                scene.add(obj);
                
                // Initial animations
                gsap.to(obj.scale, { 
                    x: 0.08, y: 0.08, z: 0.08, 
                    duration: 1.2, 
                    delay: 1, 
                    ease: "power2.inOut" 
                });
                
                gsap.to(obj.position, {
                    z: 0,
                    duration: 1.2,
                    delay: 1,
                    ease: "power2.inOut",
                    onComplete: () => {
                        gsap.to(obj.position, { 
                            z: -2, 
                            duration: 2, 
                            ease: "power2.inOut", 
                            onComplete: startIdleAnimation 
                        });
                    }
                });
                
                // Fade in opacity
                obj.traverse((child) => {
                    if (child.isMesh && child.material && child.material.uniforms.opacity) {
                        gsap.to(child.material.uniforms.opacity, { 
                            value: 1, 
                            duration: 1.5, 
                            delay: 1, 
                            ease: "power2.out" 
                        });
                    }
                });
                
                // Jaw animation
                if (jaw) {
                    gsap.to(jaw.rotation, {
                        x: 0.6,
                        duration: 1.2,
                        delay: 1,
                        ease: "power2.inOut",
                        onComplete: () => {
                            gsap.to(jaw.rotation, { 
                                x: 0.1, 
                                duration: 1.5, 
                                repeat: -1, 
                                yoyo: true, 
                                ease: "power2.inOut" 
                            });
                        }
                    });
                }

                // Skull top animation
                if (skullTop) {
                    gsap.to(skullTop.rotation, {
                        x: "-=0.15",
                        duration: 1.5,
                        repeat: -1,
                        yoyo: true,
                        ease: "power2.inOut"
                    });
                }
            }
        );

        // Idle animation function
        const startIdleAnimation = () => {
            if (!skull) return;

            // Position animation
            gsap.to(skull.position, {
                y: "+=0.05",
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });

            // Rotation animation
            gsap.to(skull.rotation, {
                x: "+=0.05",
                y: "+=0.1",
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });

            // Scale animation
            gsap.to(skull.scale, {
                x: "+=0.005",
                y: "+=0.005",
                z: "+=0.005",
                duration: 3.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });

            // Jaw animation
            if (jaw) {
                gsap.to(jaw.rotation, {
                    x: "+=0.02",
                    duration: 2,
                    repeat: -1,
                    yoyo: true,
                    ease: "power2.inOut",
                });
            }
        };

        // Mouse movement handler
        const onMouseMove = (event) => {
            if (!skull) return;
            const x = (event.clientX / window.innerWidth) * 2 - 1;
            const y = -(event.clientY / window.innerHeight) * 2 + 1;
            gsap.to(skull.rotation, { 
                y: x * 0.5, 
                x: -y * 0.2, 
                duration: 0.5, 
                ease: "power2.out" 
            });
        };
        
        window.addEventListener("mousemove", onMouseMove);
        
        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();
        
        // Cleanup
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
        };
    }, [canvasRef]);

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
    // 3D Card Effect
    // =========================================
    const aboutCardRef = useRef(null);

    useEffect(() => {
        const aboutCard = aboutCardRef.current;
        if (!aboutCard) return;

        let bounds;

        const rotateElement = (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            const leftX = mouseX - bounds.left;
            const topY = mouseY - bounds.top;
            
            const center = {
                x: bounds.width / 2,
                y: bounds.height / 2
            };
            
            const distanceX = leftX - center.x;
            const distanceY = topY - center.y;
            
            // Limit the rotation
            const rotateX = Math.min(Math.max(-10, distanceY / 10), 10);
            const rotateY = Math.min(Math.max(-10, -distanceX / 10), 10);
            
            aboutCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        };
        
        const resetElement = () => {
            aboutCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        };
        
        const handleMouseMove = (e) => {
            if (!bounds) bounds = aboutCard.getBoundingClientRect();
            window.requestAnimationFrame(() => rotateElement(e));
        };
        
        const handleMouseLeave = () => {
            window.requestAnimationFrame(() => resetElement());
        };
        
        const handleMouseEnter = () => {
            bounds = aboutCard.getBoundingClientRect();
        };
        
        aboutCard.addEventListener('mouseenter', handleMouseEnter);
        aboutCard.addEventListener('mousemove', handleMouseMove);
        aboutCard.addEventListener('mouseleave', handleMouseLeave);
        
        return () => {
            if (aboutCard) {
                aboutCard.removeEventListener('mouseenter', handleMouseEnter);
                aboutCard.removeEventListener('mousemove', handleMouseMove);
                aboutCard.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, [showAboutMe]);

    // =========================================
    // Render
    // =========================================
    return (
        <div className="skull-scene">
            <div className="skull-scene-overlay" />
            <div className="skull-scene-inner">
                <canvas ref={canvasRef} className="skull-webgl" />
                
                {/* Dialog Sequence */}
                {currentDialog === 1 && !showSurrenderDialog && !gameCompleted && skullVisible && (
                    <Dialog
                        name={"Lost travler"}
                        defaultOpen={true}
                        imageSrc={imageSrc}
                        conversation={["This digital highway isn't big enough for the both of us..."]}
                        afterClose={closeDialog1}
                    />
                )}
                {currentDialog === 2 && !showSurrenderDialog && !gameCompleted && skullVisible && (
                    <Dialog
                        name={"Lost travler"}
                        defaultOpen={true}
                        imageSrc={imageSrc}
                        conversation={["Ehm.. hold up. Maybe we can talk about this?"]}
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
                        conversation={["Thanks for sparing me! I can help you navigate this digital wasteland now. Where would you like to go?"]}
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
                {showAboutMe && (
                    <div className="content-section about-me-section" ref={aboutCardRef}>
                        <div className="about-content">
                            <div className="about-image-container">
                                <img src="/images/im-in.png" alt="Profile" className="about-image" />
                            </div>
                            <div className="about-text">
                                <h2>About Me</h2>
                                <p>Hi! I'm a developer passionate about creating engaging digital experiences. With a focus on web development and immersive interfaces, I love bringing creative ideas to life through code.</p>
                                <div className="social-links">
                                    <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="social-link">
                                        <i className="fab fa-linkedin"></i> LinkedIn
                                    </a>
                                    <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="social-link">
                                        <i className="fab fa-x-twitter"></i> X
                                    </a>
                                    <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="social-link">
                                        <i className="fab fa-github"></i> GitHub
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Projects Section */}
                {showProjects && (
                    <div className="content-section projects-section">
                        <h2>My Projects</h2>
                        <div className="projects-grid">
                            <div className="project-card">
                                <div className="project-image">
                                    <img src="/images/project1.jpg" alt="Project 1" />
                                </div>
                                <h3>Project Title 1</h3>
                                <p>A brief description of the project and the technologies used.</p>
                                <div className="project-links">
                                    <a href="#" className="project-link">Demo</a>
                                    <a href="#" className="project-link">GitHub</a>
                                </div>
                            </div>
                            <div className="project-card">
                                <div className="project-image">
                                    <img src="/images/project2.jpg" alt="Project 2" />
                                </div>
                                <h3>Project Title 2</h3>
                                <p>A brief description of the project and the technologies used.</p>
                                <div className="project-links">
                                    <a href="#" className="project-link">Demo</a>
                                    <a href="#" className="project-link">GitHub</a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

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


