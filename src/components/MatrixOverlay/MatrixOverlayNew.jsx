import React, { useEffect, useRef } from "react";
import "./MatrixOverlay.css";

const MatrixOverlay = () => {
    const canvasRef = useRef(null);
    const initialLoadRef = useRef(true);
    const initialDurationRef = useRef(200);
    const dropsRef = useRef([]);
    const columnsRef = useRef(0);
    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZあいうえおカキクケコ";
    const name = "Dawid Galeczka".split("");
    const startXRef = useRef(0);
    const middleRowRef = useRef(0);

    const resizeCanvas = () => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columnsRef.current = Math.floor(canvas.width / 18);
        dropsRef.current = Array(columnsRef.current).fill(0);
        startXRef.current = Math.floor(columnsRef.current / 2) - Math.floor(name.length / 2);
        middleRowRef.current = Math.floor(canvas.height / 18 / 2);
    };

    const drawMatrix = (ctx, canvas) => {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#00ff00";
        ctx.font = "18px monospace";

        for (let i = 0; i < dropsRef.current.length; i++) {
            let text = characters[Math.floor(Math.random() * characters.length)];

            if (initialLoadRef.current && initialDurationRef.current > 0) {
                if (
                    (i >= startXRef.current && i < startXRef.current + name.length && (dropsRef.current[i] === middleRowRef.current - 1 || dropsRef.current[i] === middleRowRef.current + 1)) ||
                    (i === startXRef.current - 1 || i === startXRef.current + name.length) && dropsRef.current[i] === middleRowRef.current
                ) {
                    text = " ";
                }
            }

            if (i >= startXRef.current && i < startXRef.current + name.length && dropsRef.current[i] === middleRowRef.current) {
                text = name[i - startXRef.current];
            }

            ctx.fillText(text, i * 18, dropsRef.current[i] * 18);

            if (dropsRef.current[i] * 18 > canvas.height && Math.random() > 0.975) {
                dropsRef.current[i] = 0;
            }
            dropsRef.current[i]++;
        }

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
                animate();
            }, 50);
        });
    };

    useEffect(() => {
        resizeCanvas();
        animate();

        window.addEventListener("resize", resizeCanvas);

        return () => {
            window.removeEventListener("resize", resizeCanvas);
        };
    }, []);

    useEffect(() => {
        const overlay = canvasRef.current;
        const onScroll = () => {
            const scrollFactor = window.scrollY / window.innerHeight;
            const scaleValue = 1 + scrollFactor * 2.0; // More aggressive scaling
            const opacity = Math.max(0.4 - scrollFactor * 0.6, 0); // More aggressive opacity fade
            overlay.style.transform = `scale(${scaleValue})`;
            overlay.style.transformOrigin = "center top";
            overlay.style.opacity = opacity;
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
                transition: "transform 0.1s ease-out, opacity 0.5s ease-in-out"
            }}
        />
    );
};

export default MatrixOverlay;
