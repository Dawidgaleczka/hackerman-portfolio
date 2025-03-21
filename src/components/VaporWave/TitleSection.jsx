import gsap from "gsap";
import { useEffect, useState, useCallback } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const TitleSection = ({ handleGameStart }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    // Debounced resize handler
    const handleResize = useCallback(() => {
        const isMobileView = window.innerWidth <= 768;
        if (isMobile !== isMobileView) {
            setIsMobile(isMobileView);
        }
    }, [isMobile]);

    useEffect(() => {
        const elementsToAnimate = [
            ".vapor-wave-bottom h1.glitch",
            ".vapor-wave-bottom h1.glow",
            ".vapor-wave-bottom h2",
            ".vapor-wave-bottom h3",
            ".start-button"
        ];
        
        elementsToAnimate.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.willChange = "opacity, transform";
            }
        });

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

        else {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".vapor-wave-bottom",
                    start: "top center",
                    end: "center center",
                    scrub: 0.5, 
                    pin: false,
                   
                    markers: false,
                    fastScrollEnd: true,
                    preventOverlaps: true,
                    invalidateOnRefresh: true
                }
            });
      
            tl.to([title, title2], { opacity: 1, duration: 0.5 })
              .to(name, { opacity: 1, duration: 0.3 }, "-=0.2")
              .to(title3, { opacity: 1, duration: 0.3 }, "-=0.1")
              .to(button, { opacity: 1, duration: 0.3 }, "-=0.1");
        }
        
        return () => {
            window.removeEventListener('resize', throttledResize);
            
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());

            elementsToAnimate.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    element.style.willChange = "auto";
                }
            });
        };
    }, [isMobile, handleResize]);

    return (
        <div className="vapor-wave-bottom">
            <div className="vapor-wave-content">
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
