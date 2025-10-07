import { useState, useEffect, useRef } from 'react';

function LazyImage({ src, alt, className }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={imgRef} className={className}>
      {isLoading && (
        <div className="skeleton w-full h-full absolute inset-0" />
      )}
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoading(false)}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
        />
      )}
    </div>
  );
}

export default LazyImage;

