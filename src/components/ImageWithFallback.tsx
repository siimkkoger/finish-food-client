import React, { useState } from 'react';

interface ImageWithFallbackProps {
    src: string;
    fallbackSrc: string;
    alt?: string;
    [prop: string]: any; // to capture additional props
}

function ImageWithFallback({ src, fallbackSrc, alt = '', ...props }: ImageWithFallbackProps) {
    const [currentSrc, setCurrentSrc] = useState(src);

    const handleError = () => {
        setCurrentSrc(fallbackSrc);
    };

    return <img src={currentSrc} alt={alt} onError={handleError} {...props} />;
}

export default ImageWithFallback;
