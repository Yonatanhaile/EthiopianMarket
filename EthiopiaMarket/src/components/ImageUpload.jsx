import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { compressImage } from '../utils/imageCompression';

function ImageUpload({ images, onChange, maxImages = 5 }) {
  const { t } = useTranslation();
  const [previews, setPreviews] = useState(images || []);
  const [isCompressing, setIsCompressing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % previews.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + previews.length) % previews.length);
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    
    if (previews.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    setIsCompressing(true);

    try {
      const compressedFiles = await Promise.all(
        files.map(file => compressImage(file))
      );

      const newPreviews = await Promise.all(
        compressedFiles.map(file => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });
        })
      );

      const updatedPreviews = [...previews, ...newPreviews];
      setPreviews(updatedPreviews);
      onChange(updatedPreviews);
    } catch (error) {
      console.error('Error processing images:', error);
    } finally {
      setIsCompressing(false);
    }
  };

  const removeImage = (index) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    onChange(updated);
    
    // Adjust currentIndex if necessary
    if (updated.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= updated.length) {
      setCurrentIndex(updated.length - 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Image Carousel */}
      {previews.length > 0 && (
        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={previews[currentIndex]}
            alt={`Preview ${currentIndex + 1}`}
            className="w-full h-full object-contain"
          />
          
          {/* Navigation Arrows */}
          {previews.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 transition-colors"
                aria-label="Previous image"
              >
                ←
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 transition-colors"
                aria-label="Next image"
              >
                →
              </button>
            </>
          )}
          
          {/* Delete Current Image Button */}
          <button
            type="button"
            onClick={() => removeImage(currentIndex)}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
            title="Delete this image"
          >
            ×
          </button>
          
          {/* Image Counter */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {previews.length}
          </div>
        </div>
      )}
      
      {/* Thumbnail Navigation */}
      {previews.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {previews.map((preview, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                index === currentIndex ? 'border-primary-600' : 'border-gray-300'
              }`}
            >
              <img
                src={preview}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
      
      {/* Upload Button */}
      {previews.length < maxImages && (
        <label className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition-colors">
          <div className="flex flex-col items-center">
            <span className="text-5xl mb-3">📷</span>
            <span className="text-base font-medium text-gray-700 mb-1">
              {isCompressing ? 'Compressing images...' : 'Click to upload images'}
            </span>
            <span className="text-sm text-gray-500">
              {previews.length} / {maxImages} images uploaded
            </span>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
            disabled={isCompressing}
          />
        </label>
      )}
      
      {isCompressing && (
        <p className="text-sm text-primary-600 text-center animate-pulse">
          Compressing images... Please wait
        </p>
      )}
    </div>
  );
}

export default ImageUpload;

