import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./Dialog.css";
import MessageDotsIcon from "../Icons/MessageDots";
import Conversation from "../SpeechBubble/Conversation";

const Dialog = ({
    name = "ENTER NAME OF CHARACTER PROP",
    conversation = ["ENTER CONVERSATION PROP"],
    entryMessage,
    entryMessageTimeout = 2000,
    messageTimeout = 3000,
    defaultOpen = false,
    videoSrc,
    imageSrc,
    afterClose,
}) => {
    const [showMessage, setShowMessage] = useState(defaultOpen ? false : true);
    const [showEntryMessage, setShowEntryMessage] = useState(entryMessage ? true : false);
    const [isExpanded, setIsExpanded] = useState(false);

    const dialogRef = useRef(null);
    const messageRef = useRef(null);
    const entryMessageRef = useRef(null);
    const speechBubbleRef = useRef(null); // Ref for the speech bubble

    useEffect(() => {
        gsap.set([dialogRef.current, entryMessageRef.current], { autoAlpha: 0, scale: 0.5, x: -100 });
        gsap.set(messageRef.current, { autoAlpha: 0, scale: 0.5 });

        setTimeout(() => {
            gsap.to([dialogRef.current, entryMessageRef.current], {
                autoAlpha: 1,
                scale: 1,
                x: 0,
                duration: 1.2,
                ease: "elastic.out(1, 0.5)",
            });

            setTimeout(() => {
                gsap.to(entryMessageRef.current, {
                    autoAlpha: 0,
                    scale: 0.5,
                    duration: 0.5,
                    ease: "power2.out",
                    onComplete: () => setShowEntryMessage(false),
                });
            }, entryMessageTimeout);
        }, 2000);

        setTimeout(() => {
            gsap.to(messageRef.current, {
                autoAlpha: 1,
                scale: 1,
                duration: 1,
                ease: "elastic.out(1, 0.5)",
            });
        }, messageTimeout);
    }, []);

    // Animate the SpeechBubble when it appears
    useEffect(() => {
        if (isExpanded && speechBubbleRef.current) {
            gsap.fromTo(
                speechBubbleRef.current,
                { autoAlpha: 0, x: -100, scale: 0.8 },
                { autoAlpha: 1, x: 0, scale: 1, duration: 0.8, ease: "power3.out", delay: 0.5 }
            );
        } else {
            gsap.to(speechBubbleRef.current, { autoAlpha: 0, scale: 0.8, duration: 0.5, ease: "power3.inOut", delay: 0.5 });
        }
    }, [isExpanded]);

    const animateMessage = (scale, rotate = 0) => {
        gsap.to(messageRef.current, {
            scale,
            rotate,
            duration: 0.3,
            ease: "power2.out",
        });
    };

    const toggleExpand = () => {
        setIsExpanded((prev) => !prev);

        // Hide message when expanding, show when shrinking
        gsap.to(messageRef.current, {
            autoAlpha: isExpanded ? 1 : 0,
            scale: isExpanded ? 1 : 0.5,
            duration: 0.5,
            ease: "power2.out",
        });

        gsap.to(dialogRef.current, {
            width: isExpanded ? "120px" : "400px",
            height: isExpanded ? "120px" : "200px",
            duration: 1.2,
            ease: "elastic.out(1, 0.5)",
        });
    };

    useEffect(() => {
        defaultOpen && toggleExpand();
    }, [defaultOpen])

    return (
        <div
            ref={dialogRef}
            className="dialog"
            onMouseEnter={() => animateMessage(1.2, 5)}
            onMouseLeave={() => animateMessage(1)}
            onClick={toggleExpand}
            style={{
                position: "absolute",
                top: "50%",
                left: "20px",
                transform: "translate(0%, -50%)",
                zIndex: "10000",
                minHeight: "120px",
                width: "120px",
                height: "120px",
                borderRadius: "20px",
                cursor: "pointer",
                transition: "all 0.3s ease-out",
            }}
        >
            {videoSrc && (
                <video autoPlay loop muted className="video-background">
                    <source src={videoSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            )}

            {imageSrc && <img src={imageSrc} alt="character" className="image-background" />}

            {showMessage && (
                <div ref={messageRef} className="message">
                    <MessageDotsIcon />
                </div>
            )}

            {isExpanded && (
                <Conversation 
                    name={name} 
                    setShowMessage={setShowMessage}
                    textArray={conversation}
                    speechBubbleRef={speechBubbleRef}
                    toggleExpand={toggleExpand}
                    afterClose={afterClose}
                />
            )}

            {showEntryMessage && <div ref={entryMessageRef} className="entry-message">{entryMessage}</div>}
        </div>
    );
};

export default Dialog;
