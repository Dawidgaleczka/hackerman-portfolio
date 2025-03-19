import gsap from "gsap";
import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const TitleSection = ({ handleGameStart }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        // Handle resize events to update mobile state
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        window.addEventListener('resize', handleResize);
        
        // Initial animation setup
        const title = document.querySelector(".vapor-wave-bottom h1.glitch");
        const title2 = document.querySelector(".vapor-wave-bottom h1.glow");
        const name = document.querySelector(".vapor-wave-bottom h2");
        const title3 = document.querySelector(".vapor-wave-bottom h3");
        const button = document.querySelector(".start-button");

        // Set initial opacity to 0
        gsap.set([title, title2, name, title3, button], { opacity: 0 });
        
        // Mobile animation - simpler, less scroll dependent
        if (isMobile) {
            // Only animate the glitch title since glow is hidden on mobile
            gsap.to(title, {
                opacity: 1,
                duration: 1.2,
                ease: "power2.out",
                delay: 0.3
            });
            
            gsap.to(name, {
                opacity: 1,
                duration: 1,
                ease: "power2.out",
                delay: 0.8
            });
            
            gsap.to(title3, {
                opacity: 1,
                duration: 1,
                ease: "power2.out",
                delay: 1.2
            });
            
            gsap.to(button, {
                opacity: 1,
                duration: 1,
                ease: "power2.out",
                delay: 1.5
            });
        } 
        // Desktop animation with scroll trigger
        else {
            gsap.fromTo(
                [title, title2, name, title3, button],
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 1.5,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".vapor-wave-bottom",
                        start: () => `${window.innerHeight * 0.4}px center`,
                        end: () => `${window.innerHeight * 0.55}px center`,
                        scrub: true,
                        pin: false,
                    },
                }
            );
        }
        
        return () => {
            window.removeEventListener('resize', handleResize);
            // Clean up ScrollTrigger
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [isMobile]);

    return (
        <div className="vapor-wave-bottom">
            <div className="vapor-wave-content">
                {/* Fix the data-text attribute to match the actual text */}
                <h1 className="glitch" data-text="WEB & SOFTWARE DEVELOPER">WEB & SOFTWARE DEVELOPER</h1>
                <h1 className="glow">WEB & SOFTWARE DEVELOPER</h1>
                <h2>Dawid galeczka</h2>
                <h3 className="kanji">デジタル・ウェストランドへようこそ、ストーカー</h3>
                <button onClick={handleGameStart} className="start-button">Start</button>
            </div>
        </div>
    );
};

export default TitleSection;