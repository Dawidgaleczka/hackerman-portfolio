import React from "react";
import "./CRTScanline.css";

const CRTScanline = () => {
    return (
        <>
            <div className="crt-background"></div> {/* Circular CRT gradient background */}
            <div className="crt-scanlines"></div> {/* Always visible scanlines */}
            <div className="crt-overlay"></div> {/* Moving overlay effect */}
        </>
    );
};

export default CRTScanline;
