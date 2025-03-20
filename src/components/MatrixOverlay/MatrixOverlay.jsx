import React, { useEffect, useRef } from "react";
import "./MatrixOverlay.css";

const MatrixOverlay = () => {
    const canvasRef = useRef(null);
    const initialLoadRef = useRef(true);
    const initialDurationRef = useRef(200);
    const dropsRef = useRef([]);
    const columnsRef = useRef(0);
    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZあいうえおカキクケコ";
    const name = "Dawid galeczka".split("");
    const startXRef = useRef(0);
    const middleRowRef = useRef(0);

    const resizeCanvas = () => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columnsRef.current = Math.floor(canvas.width / 20);
        dropsRef.current = Array(columnsRef.current).fill(0);
        startXRef.current = Math.floor(columnsRef.current / 2) - Math.floor(name.length / 2);
        middleRowRef.current = Math.floor(canvas.height / 20 / 2);
    };

    const drawMatrix = (ctx, canvas) => {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#00ff00";
        ctx.font = "18px monospace";

        for (let i = 0; i < dropsRef.current.length; i++) {
            let text = characters[Math.floor(Math.random() * characters.length)];

            // Initial load: Remove characters surrounding the name
            if (initialLoadRef.current && initialDurationRef.current > 0) {
                if (
                    (i >= startXRef.current && i < startXRef.current + name.length && (dropsRef.current[i] === middleRowRef.current - 1 || dropsRef.current[i] === middleRowRef.current + 1)) ||
                    (i === startXRef.current - 1 || i === startXRef.current + name.length) && dropsRef.current[i] === middleRowRef.current
                ) {
                    text = " "; // Replace with empty space
                }
            }

            // Display name at middle row
            if (i >= startXRef.current && i < startXRef.current + name.length && dropsRef.current[i] === middleRowRef.current) {
                text = name[i - startXRef.current];
            }

            ctx.fillText(text, i * 20, dropsRef.current[i] * 20);

            if (dropsRef.current[i] * 20 > canvas.height && Math.random() > 0.975) {
                dropsRef.current[i] = 0;
            }
            dropsRef.current[i]++;
        }

        // Reduce initial load duration
        if (initialLoadRef.current) {
            initialDurationRef.current--;
            if (initialDurationRef.current <= 0) {
                initialLoadRef.current = false;
            }
        }
    };

    const animate = () => {
        requestAnimationFrame(() => {
            setTimeout(() => {
                drawMatrix(canvasRef.current.getContext("2d"), canvasRef.current);
                animate(); // Recursively call animate
            }, 50); // This will delay animation by 50ms, controlling the speed
        });
    };


    useEffect(() => {
        resizeCanvas(); // Initial canvas sizing
        animate(); // Start the animation loop

        window.addEventListener("resize", resizeCanvas); // Resize handler for the canvas

        return () => {
            window.removeEventListener("resize", resizeCanvas);
        };
    }, []);

    useEffect(() => {
        const overlay = canvasRef.current;
        const onScroll = () => {
            const opacity = Math.max(0.3 - (window.scrollY / (window.innerHeight * 0.25)), 0);
            overlay.style.opacity = opacity;
            overlay.style.transition = "opacity 0.5s ease-in-out";
        };

        window.addEventListener("scroll", onScroll);

        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="matrix-overlay"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 10,
                pointerEvents: "none",
                opacity: 0.4,
            }}
        />
    );
};

export default MatrixOverlay;
