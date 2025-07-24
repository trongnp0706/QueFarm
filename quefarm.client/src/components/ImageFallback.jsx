import React, { useState } from 'react';
import { Image } from 'antd';

// Helper function to resolve image URL
const resolveImageUrl = (src) => {
  if (!src) return null;
  
  // If it's already a full URL, return as is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  
  // If it's a relative path starting with /, resolve it to backend
  if (src.startsWith('/')) {
    const API_BASE_URL = window.location.hostname === 'localhost' 
      ? 'https://localhost:7013'
      : ''; // Use relative URL in production
    return `${API_BASE_URL}${src}`;
  }
  
  // Otherwise return as is
  return src;
};

const ImageFallback = ({ src, alt, fallbackSrc = '/logo.png', style, width, height, debug = false, ...props }) => {
  const [imageError, setImageError] = useState(false);
  const resolvedSrc = resolveImageUrl(src);
  const resolvedFallbackSrc = resolveImageUrl(fallbackSrc);
  const [currentSrc, setCurrentSrc] = useState(resolvedSrc);

  const handleError = () => {
    if (!imageError && currentSrc !== resolvedFallbackSrc) {
      setImageError(true);
      setCurrentSrc(resolvedFallbackSrc);
    }
  };

  const handleLoad = () => {
    if (imageError && currentSrc === resolvedSrc) {
      setImageError(false);
    }
  };

  // Reset error state when src prop changes
  React.useEffect(() => {
    const newResolvedSrc = resolveImageUrl(src);
    if (newResolvedSrc !== currentSrc && !imageError) {
      setCurrentSrc(newResolvedSrc);
    }
  }, [src, currentSrc, imageError, debug]);

  return (
    <Image
      src={currentSrc || resolvedFallbackSrc}
      alt={alt}
      style={{
        ...style,
        width: width,
        height: height
      }}
      onError={handleError}
      onLoad={handleLoad}
      fallback={resolvedFallbackSrc}
      preview={false}
      {...props}
    />
  );
};

export default ImageFallback;