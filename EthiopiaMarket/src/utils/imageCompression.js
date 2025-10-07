import imageCompression from 'browser-image-compression';

export async function compressImage(file) {
  const options = {
    maxSizeMB: 0.5, // Maximum file size in MB
    maxWidthOrHeight: 1024, // Maximum width or height
    useWebWorker: true,
    initialQuality: 0.8, // Initial quality
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    return file; // Return original if compression fails
  }
}

export async function compressImages(files) {
  const compressionPromises = Array.from(files).map(file => compressImage(file));
  return Promise.all(compressionPromises);
}

export function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

