import { useEffect, useRef, useState } from 'react';
import '../VaporWave/styles/about-me.css';

const AboutMeSection = () => {
    const aboutCardRef = useRef(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const rafRef = useRef(null);
    const boundsRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            const isMobileView = window.innerWidth <= 768;
            if (isMobile !== isMobileView) {
                setIsMobile(isMobileView);
                // Reset bounds cache on resize
                boundsRef.current = null;
            }
        };

        // Throttle resize events
        let resizeTimer;
        const throttledResize = () => {
            if (!resizeTimer) {
                resizeTimer = setTimeout(() => {
                    resizeTimer = null;
                    handleResize();
                }, 200);
            }
        };

        window.addEventListener('resize', throttledResize);
        
        return () => {
            window.removeEventListener('resize', throttledResize);
        };
    }, [isMobile]);

    useEffect(() => {
        if (isMobile) return;

        const aboutCard = aboutCardRef.current;
        if (!aboutCard) return;

        // Add will-change to optimize rendering
        aboutCard.style.willChange = 'transform';
        
        const rotateElement = (e) => {
            // Use cached bounds when possible
            if (!boundsRef.current) {
                boundsRef.current = aboutCard.getBoundingClientRect();
            }
            
            const bounds = boundsRef.current;
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

            // Limit the rotation and reduce sensitivity for smoother effect
            const rotateX = Math.min(Math.max(-8, distanceY / 12), 8);
            const rotateY = Math.min(Math.max(-8, -distanceX / 12), 8);

            // Apply transform with hardware acceleration hints
            aboutCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02) translateZ(0)`;
        };

        const resetElement = () => {
            // Use transition for smooth reset
            aboutCard.style.transition = 'transform 0.5s ease-out';
            aboutCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateZ(0)`;
            
            // Clear the animation frame if it's still pending
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        };

        const handleMouseMove = (e) => {
            // Cancel any existing animation frame
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
            
            // Remove transition during active movement for immediate response
            aboutCard.style.transition = 'none';
            
            // Schedule the transform update
            rafRef.current = requestAnimationFrame(() => {
                rotateElement(e);
                rafRef.current = null;
            });
        };

        const handleMouseLeave = () => {
            resetElement();
            // Clear bounds cache when mouse leaves
            boundsRef.current = null;
        };

        const handleMouseEnter = () => {
            // Recalculate bounds on mouse enter
            boundsRef.current = aboutCard.getBoundingClientRect();
        };

        aboutCard.addEventListener('mouseenter', handleMouseEnter);
        aboutCard.addEventListener('mousemove', handleMouseMove);
        aboutCard.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            if (aboutCard) {
                aboutCard.removeEventListener('mouseenter', handleMouseEnter);
                aboutCard.removeEventListener('mousemove', handleMouseMove);
                aboutCard.removeEventListener('mouseleave', handleMouseLeave);
                
                // Reset will-change to avoid memory consumption
                aboutCard.style.willChange = 'auto';
                
                // Cancel any pending animation frame
                if (rafRef.current) {
                    cancelAnimationFrame(rafRef.current);
                }
            }
        };
    }, [isMobile]);

    return (
        <div className="content-section about-me-section">
            <div className="about-content" ref={aboutCardRef}>
                <div className="about-image-container">
                    <img src="/images/Dawid.jpg" alt="Profile" className="about-image" />
                </div>

                <div className="about-text">
                    <h2>About Me</h2>
                    <p>Hi! I'm Dawid, a developer passionate about crafting engaging web experiences. I specialize in building sleek, functional websites and applications.</p>
                    <p>As a software development student, I focus on creating modern web applications. My goal is to build user-friendly and efficient digital solutions that help people in their daily lives.</p>
                    <p>Beyond coding, I explore new tech and continuously expand my skills.</p>
                </div>

                <div className="social-links-container">
                    <h3>Connect With Me</h3>

                    {/* First row - Email only (full width) */}
                    <div className="social-links email-row">
                        <a href="mailto:dawidgaleczka@icloud.com" target="_blank" rel="noopener noreferrer" className="social-link email-link">
                            <i className="fas fa-envelope"></i> dawidgaleczka@icloud.com
                        </a>
                    </div>

                    {/* Second row - Social platforms */}
                    <div className="social-links platforms-row">
                        <a href="https://www.linkedin.com/in/dawid-galeczka-5052aa2a9/" target="_blank" rel="noopener noreferrer" className="social-link">
                            <i className="fab fa-linkedin"></i> LinkedIn
                        </a>
                        <a href="https://x.com/GaleczkaDawid" target="_blank" rel="noopener noreferrer" className="social-link">
                            <i className="fab fa-x-twitter"></i> X
                        </a>
                        <a href="https://github.com/Dawidgaleczka" target="_blank" rel="noopener noreferrer" className="social-link">
                            <i className="fab fa-github"></i> GitHub
                        </a>
                    </div>
                    
                    {/* Skills section with 2 rows of 3 skills */}
                    <div className="skills-container">
                        <h3>Skills</h3>
                        <div className="skills-grid skills-grid-2x3">
                            <div className="skill-item">
                                <i className="fab fa-html5"></i>
                                <span>HTML</span>
                            </div>
                            <div className="skill-item">
                                <i className="fab fa-css3-alt"></i>
                                <span>CSS</span>
                            </div>
                            <div className="skill-item">
                                <i className="fab fa-js"></i>
                                <span>JavaScript</span>
                            </div>
                            <div className="skill-item">
                                <i className="fab fa-node-js"></i>
                                <span>Node</span>
                            </div>
                            <div className="skill-item">
                                <i className="fab fa-git-alt"></i>
                                <span>Git</span>
                            </div>
                            <div className="skill-item">
                                <i className="fab fa-figma"></i>
                                <span>Figma</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutMeSection;



