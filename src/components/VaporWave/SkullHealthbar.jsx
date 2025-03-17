import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";

const SkullHealthbar = ({ health = 100 }) => {
    const [currentHealth, setCurrentHealth] = useState(100);
    const healthBarRef = useRef(null);
    const containerRef = useRef(null);
    const clampedHealth = Math.max(0, Math.min(health, 100));

    useEffect(() => {
        // Animate the component when it mounts
        gsap.fromTo(
            containerRef.current,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
        );

        // Animate the health bar when it changes
        gsap.to(healthBarRef.current, {
            width: `${clampedHealth}%`,
            duration: 0.5,
            ease: "power2.out",
            backgroundColor:
                clampedHealth > 70 ? "green" : clampedHealth > 30 ? "yellow" : "red",
        });

        setCurrentHealth(health);
    }, [health]);

    return (
        <div ref={containerRef} className="health-bar-container">
            <div
                ref={healthBarRef}
                className="health-bar"
                style={{
                    width: `${clampedHealth}%`,
                    backgroundColor:
                        clampedHealth > 70 ? "green" : clampedHealth > 30 ? "yellow" : "red",
                }}
            ></div>
            <span className="health-text">{clampedHealth}%</span>
        </div>
    );
};

export default SkullHealthbar;
