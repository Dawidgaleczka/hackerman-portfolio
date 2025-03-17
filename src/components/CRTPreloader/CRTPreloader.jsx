import React, { useState, useEffect } from "react";
import Typewriter from "typewriter-effect";
import "./CrtPreloader.css";

import click1 from "/audio/key1.mp3";
import click2 from "/audio/key2.mp3";
import click3 from "/audio/key3.mp3";
import click4 from "/audio/key4.mp3";

const CrtPreloader = ({ onComplete }) => {
    const [logs, setLogs] = useState([]);
    const [stage, setStage] = useState("booting");
    const [inputValue, setInputValue] = useState("");
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [showUsernameInput, setShowUsernameInput] = useState(false);
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const [loginMessageDisplayed, setLoginMessageDisplayed] = useState(false);
    const [authSuccess, setAuthSuccess] = useState(false);

    // Keyboard click sounds
    const clickSounds = [
        new Audio(click1),
        new Audio(click2),
        new Audio(click3),
        new Audio(click4)
    ];

    // Boot sequence messages with randomized delays
    const bootSequence = [
        "Boot sequence initiated...",
        "Loading system files...",
        "Checking memory...",
        "System ready."
    ];

    useEffect(() => {
        if (stage === "booting") {
            let delay = 0;
            bootSequence.forEach((message, index) => {
                const randomDelay = Math.floor(Math.random() * 2000) + 2000;
                setTimeout(() => {
                    setLogs((prev) => [...prev, message]);

                    if (index === bootSequence.length - 1) {
                        setTimeout(() => {
                            setLogs([]);
                            setLoginMessageDisplayed(true);
                            setTimeout(() => setShowUsernameInput(true), 1500);
                            setStage("username");
                        }, 2500);
                    }
                }, delay);
                delay += randomDelay;
            });
        }
    }, [stage]);

    const playRandomClickSound = () => {
        const randomSound = clickSounds[Math.floor(Math.random() * clickSounds.length)];
        randomSound.currentTime = 0; // Reset sound to start
        randomSound.play();
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        playRandomClickSound();
    };

    const handleInputSubmit = (e) => {
        if (e.key === "Enter") {
            if (stage === "username") {
                setUsername(inputValue);
                setInputValue("");
                setTimeout(() => {
                    setShowPasswordInput(true);
                    setStage("password");
                }, 200);
            } else if (stage === "password") {
                setPassword(inputValue);
                setInputValue("");
                setTimeout(() => {
                    setAuthSuccess(true);
                    setTimeout(() => onComplete(), 2000);
                }, 500);
            }
        }
    };

    return (
        <div className="crt-screen">
            <div className="terminal">
                {logs.map((log, index) => (
                    <Typewriter
                        key={index}
                        options={{
                            delay: 50,
                            cursor: "",
                        }}
                        onInit={(typewriter) => {
                            typewriter.typeString(log).start();
                        }}
                    />
                ))}

                {loginMessageDisplayed && (
                    <div className="terminal-line">
                        <Typewriter
                            options={{
                                delay: 50,
                                cursor: "",
                            }}
                            onInit={(typewriter) => {
                                typewriter.typeString("Login to continue.").start();
                            }}
                        />
                    </div>
                )}

                {showUsernameInput && !username && (
                    <div className="terminal-line">
                        <span className="prompt">$</span> Username:{" "}
                        <input
                            type="text"
                            className="terminal-input"
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleInputSubmit}
                            autoFocus
                        />
                    </div>
                )}

                {username && <div className="terminal-line">$ Username: {username}</div>}

                {showPasswordInput && !password && (
                    <div className="terminal-line">
                        <span className="prompt">$</span> Password:{" "}
                        <input
                            type="password"
                            className="terminal-input"
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleInputSubmit}
                            autoFocus
                        />
                    </div>
                )}

                {password && <div className="terminal-line">$ Password: ********</div>}

                {authSuccess && <div className="terminal-line success">Authentication successful...</div>}
            </div>
        </div>
    );
};

export default CrtPreloader;
