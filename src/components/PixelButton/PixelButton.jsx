import "./PixelButton.css";

const PixelButton = ({
    className,
    onClick,
    text
}) => {
    return (
        <button 
            className={`eightbit-btn ${className}`}
            onClick={onClick}
        >
            {text}
        </button>
    );
}

export default PixelButton;