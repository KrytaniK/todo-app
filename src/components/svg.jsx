import React from "react";

const C_SVG = ({ className, sourceURL, color, size }) => {

    if (!sourceURL) return null;

    return <div
        className={`${className || ""} svg`}
        style={{
            WebkitMask: `url(${sourceURL})`,
            WebkitMaskSize: 'cover',
            WebkitMaskPosition: 'center',
            WebkitMaskRepeat: 'no-repeat',
            backgroundColor: `${color}`,
            width: `${size}`,
            height: `${size}`
        }}
    />
}

export default C_SVG;