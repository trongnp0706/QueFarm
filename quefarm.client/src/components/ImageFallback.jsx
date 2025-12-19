import React, { useEffect, useMemo, useState } from 'react';
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

const ImageFallback = ({
  src,
  alt,
  fallbackSrc = '/images/placeholder.svg',
  style,
  width,
  height,
  debug = false,
  className,
  imgStyle,
  imgClassName,
  // Kept for backward compatibility; currently unused (we use native <img>).
  // eslint-disable-next-line no-unused-vars
  preview = false,
  ...props
}) => {
  const resolvedSrc = useMemo(() => resolveImageUrl(src), [src]);
  const resolvedFallbackSrc = useMemo(() => resolveImageUrl(fallbackSrc), [fallbackSrc]);

  const [currentSrc, setCurrentSrc] = useState(resolvedSrc);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
    setCurrentSrc(resolvedSrc);
  }, [resolvedSrc]);

  const handleError = () => {
    if (!resolvedFallbackSrc) {
      setImageError(true);
      setCurrentSrc(null);
      return;
    }

    // Switch once to fallback; if fallback also fails, show placeholder UI
    if (currentSrc !== resolvedFallbackSrc) {
      setCurrentSrc(resolvedFallbackSrc);
    } else {
      setImageError(true);
      setCurrentSrc(null);
    }
  };

  const mergedImgStyle = {
    ...(style || {}),
    ...(imgStyle || {}),
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
  };

  const mergedImgClassName = [className, imgClassName].filter(Boolean).join(' ');

  // If image failed to load (or no src), show custom placeholder
  if (imageError || !currentSrc) {
    return (
      <div
        className={`product-image-placeholder ${mergedImgClassName || ''}`}
        style={mergedImgStyle}
        data-debug={debug ? 'image-fallback' : undefined}
      >
        <div className="text-center">
          <FaImage className="mx-auto mb-2 text-4xl text-gray-400" />
          <p className="text-sm text-gray-500">Không có ảnh</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={mergedImgClassName}
      style={mergedImgStyle}
      onError={handleError}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
};

export default ImageFallback;