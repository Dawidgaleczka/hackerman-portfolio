import gsap from "gsap";
import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const TitleSection = ({ handleGameStart }) => {
    useEffect(() => {
        const title = document.querySelector(".vapor-wave-bottom h1");
        const title2 = document.querySelector(".vapor-wave-bottom h2");
        const title3 = document.querySelector(".vapor-wave-bottom h3");
        const button = document.querySelector(".start-button");

        gsap.fromTo(
            [title, title2, title3, button],
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
    }, []);

    return (
        <div className="vapor-wave-bottom">
            <div className="vapor-wave-content">
                <h1 className="glitch" data-text="CREATIVE DEVELOPER">WEB & SOFTWARE DEVELOPER</h1>
                <h1 className="glow">WEB & SOFTWARE DEVELOPER</h1>
                <h2>Dawid galeczka</h2>
                <h3 className="kanji">デジタル・ウェストランドへようこそ、ストーカー</h3>
                <button onClick={handleGameStart} className="start-button">Start</button>
            </div>
        </div>
    );
};

export default TitleSection;