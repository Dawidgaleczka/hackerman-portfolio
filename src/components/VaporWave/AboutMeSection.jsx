import { useEffect, useRef } from 'react';
import '../VaporWave/styles/about-me.css';

const AboutMeSection = () => {
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
    }, []);

    return (
        <div className="content-section about-me-section">
            <div className="about-content" ref={aboutCardRef}>
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
    );
};

export default AboutMeSection;