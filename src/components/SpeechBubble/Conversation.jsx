import { useState } from "react";
import SpeechBubble from "./SpeechBubble"; // Import SpeechBubble component

const Conversation = ({
    name,    
    textArray,
    speechBubbleRef,
    setShowMessage,
    toggleExpand,
    afterClose
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [showText, setShowText] = useState(true); // Controls when to update text

    const handleNext = () => {
        if (currentIndex < textArray.length - 1) {
            setShowText(false); // Hide current text first
            setTimeout(() => {
                setCurrentIndex(prevIndex => prevIndex + 1);
                setShowText(true); // Show new text after update
            }, 100); // Short delay for smoother transition
        } else {            
            setIsVisible(false); // Hide speech bubble when reaching last string
            setShowMessage(false);             
            toggleExpand();
            afterClose && afterClose();
        }
    };

    return (
        <div>
            {isVisible && showText && (
                <SpeechBubble 
                    name={name} 
                    text={textArray[currentIndex]}
                    speechBubbleRef={speechBubbleRef}
                    onNext={handleNext} // Only update text when button is clicked
                    isLast={currentIndex === textArray.length - 1} // Pass flag for last text
                />
            )}
        </div>
    );
};

export default Conversation;
