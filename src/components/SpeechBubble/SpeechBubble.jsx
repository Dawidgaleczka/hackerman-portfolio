import { useEffect, useState } from "react";
import Typewriter from "typewriter-effect";
import PixelButton from "../PixelButton/PixelButton";
import "./SpeechBubble.css";

const SpeechBubble = ({ 
    name, 
    text, 
    onNext, 
    isLast, 
    speechBubbleRef 
}) => {
    const [buttonsVisible, setButtonsVisible] = useState(false);

    useEffect(() => {
        setButtonsVisible(false); // Reset button visibility when new text arrives
    }, [text]);

    const handleButtonClick = (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevents bubbling to parent elements
        onNext();
    };

    return (
        <div className="speech-bubble" ref={speechBubbleRef}>
            <div className="speech-bubble-text">
                {name && <h1>{name}</h1>}
                <Typewriter
                    key={text} // Ensures Typewriter resets when text changes
                    options={{
                        autoStart: true,
                        delay: 50,
                    }}
                    onInit={(typewriter) => {
                        typewriter
                            .typeString(text)
                            .callFunction(() => {
                                setButtonsVisible(true); // Show button after typing completes
                            })
                            .start();
                    }}
                />
            </div>
            {buttonsVisible && (
                <div className="speech-bubble-buttons">
                    <PixelButton
                        onClick={handleButtonClick}
                        text={isLast ? "Close" : "Next"}
                    />
                </div>
            )}
            <div className="speech-bubble-triangle"></div>
        </div>
    );
};

export default SpeechBubble;
