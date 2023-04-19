import React from "react";

const C_SVG = ({ className, sourceURL, color, size }) => {

    if (!sourceURL || sourceURL.length < 1) return null;

    return <div
        className={`${className || ""} svg`}
        style={{
            WebkitMask: `url(${import.meta.env.BASE_URL}${sourceURL})`,
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