import { useEffect, useState } from "react";
import "./Cursor.css";

const Cursor = () => {
    const [trail, setTrail] = useState([]);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [prevPos, setPrevPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            const snappedX = Math.round(e.clientX / 15) * 15;
            const snappedY = Math.round(e.clientY / 15) * 15;

            let offsetX = 0;
            let offsetY = 0;

            if (snappedX > prevPos.x && snappedY === prevPos.y) offsetX = -15; // Left
            else if (snappedX < prevPos.x && snappedY === prevPos.y) offsetX = 15; // Right
            else if (snappedY > prevPos.y && snappedX === prevPos.x) offsetY = -15; // Up
            else if (snappedY < prevPos.y && snappedX === prevPos.x) offsetY = 15; // Down
            else if (snappedX > prevPos.x && snappedY > prevPos.y) { offsetX = -15; offsetY = -15; } // Top-left
            else if (snappedX > prevPos.x && snappedY < prevPos.y) { offsetX = -15; offsetY = 15; } // Bottom-left
            else if (snappedX < prevPos.x && snappedY > prevPos.y) { offsetX = 15; offsetY = -15; } // Top-right
            else if (snappedX < prevPos.x && snappedY < prevPos.y) { offsetX = 15; offsetY = 15; } // Bottom-right

            setMousePos({ x: snappedX, y: snappedY });
            setPrevPos({ x: snappedX, y: snappedY });
            setTrail((prevTrail) => {
                const newTrail = [...prevTrail.slice(-9), { x: snappedX + offsetX, y: snappedY + offsetY, timestamp: Date.now() }];
                return newTrail.filter((p, index) => index === 0 || (p.x !== snappedX || p.y !== snappedY));
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [prevPos]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTrail((prevTrail) => prevTrail.filter((p) => Date.now() - p.timestamp < 100));
        }, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {trail.map((pos, index) => (
                <div
                    key={index}
                    className="pixel"
                    style={{
                        position: "absolute",
                        width: "15px",
                        height: "15px",
                        left: pos.x - 7.5 + "px",
                        top: pos.y - 7.5 + "px",
                        opacity: (index + 1) / (trail.length + 1),
                        mixBlendMode: "difference", // Improved inversion
                        backgroundColor: "white", // Ensures visibility on different backgrounds
                        pointerEvents: "none", // Prevents interference with elements
                    }}
                ></div>
            ))}
            <div
                className="cursor-pixel"
                style={{
                    position: "absolute",
                    width: "15px",
                    height: "15px",
                    left: mousePos.x - 7.5 + "px",
                    top: mousePos.y - 7.5 + "px",
                    mixBlendMode: "difference", // Ensures main pixel inverts colors properly
                    backgroundColor: "white", // Matches trail color
                    pointerEvents: "none", // Prevents interaction issues
                }}
            ></div>
        </>
    );
};

export default Cursor;