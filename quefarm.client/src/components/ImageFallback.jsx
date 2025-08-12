import React, { useState } from 'react';
import { Image } from 'antd';
import { FaImage } from 'react-icons/fa';

// Helper function to resolve image URL - simplified for consistency
const resolveImageUrl = (src) => {
  if (!src) return null;
  
  // If it's already a full URL, return as is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  
  // For development, use full URL to backend
  if (window.location.hostname === 'localhost') {
    const normalizedSrc = src.startsWith('/') ? src : `/${src}`;
    return `https://localhost:7013${normalizedSrc}`;
  }
  
  // For production, use relative URL (nginx proxies /images/ to backend)
  const normalizedSrc = src.startsWith('/') ? src : `/${src}`;
  return normalizedSrc;
};

const ImageFallback = ({ src, alt, fallbackSrc = '/images/placeholder.svg', style, width, height, debug = false, className, imgStyle, imgClassName, preview = false, ...props }) => {
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
      <div
        className={`product-image-placeholder ${className || ''}`}
        style={{ width: width, height: height, ...style }}
      >
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
      preview={preview}
      className={className}
      imgStyle={imgStyle}
      imgClassName={imgClassName}
      {...props}
    />
  );
};

export default ImageFallback;