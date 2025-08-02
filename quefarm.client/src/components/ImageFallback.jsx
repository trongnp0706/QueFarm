import React, { useState } from 'react';
import { Image } from 'antd';
import { FaImage } from 'react-icons/fa';

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
      : '';
    return `${API_BASE_URL}${src}`;
  }
  
  // Otherwise return as is
  return src;
};

const ImageFallback = ({ src, alt, fallbackSrc = '/images/placeholder.svg', style, width, height, debug = false, className, ...props }) => {
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

  // If image failed to load, show custom placeholder
  if (imageError || !currentSrc) {
    return (
      <div className={`product-image-placeholder ${className || ''}`}>
        <div className="text-center">
          <FaImage className="mx-auto mb-2 text-4xl text-gray-400" />
          <p className="text-sm text-gray-500">Không có ảnh</p>
        </div>
      </div>
    );
  }

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
      className={className}
      {...props}
    />
  );
};

export default ImageFallback;