import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { compressImage } from '../utils/imageCompression';

function ImageUpload({ images, onChange, maxImages = 5 }) {
  const { t } = useTranslation();
  const [previews, setPreviews] = useState(images || []);
  const [isCompressing, setIsCompressing] = useState(false);

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
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {previews.map((preview, index) => (
          <div key={index} className="relative aspect-square">
            <img
              src={preview}
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
            >
              ×
            </button>
          </div>
        ))}
        
        {previews.length < maxImages && (
          <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
            <span className="text-4xl mb-2">📷</span>
            <span className="text-sm text-gray-600 text-center px-2">
              {isCompressing ? t('common.loading') : t('listing.uploadImages')}
            </span>
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
      </div>
      
      <p className="text-xs text-gray-500">
        {previews.length} / {maxImages} images
        {isCompressing && ' (Compressing...)'}
      </p>
    </div>
  );
}

export default ImageUpload;

