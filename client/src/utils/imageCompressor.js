/**
 * Client-side image compression and resizing using native HTML5 Canvas
 * Ensures uploaded payment receipts/screenshots are lightweight (<150KB),
 * upload in milliseconds, and fit comfortably within database limits.
 */
export function compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.65) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided.'));
    }

    if (!file.type.startsWith('image/')) {
      return reject(new Error('Please upload an image file (PNG, JPG, or WEBP).'));
    }

    // Limit original file size to 25MB before client compression
    if (file.size > 25 * 1024 * 1024) {
      return reject(new Error('File size exceeds 25MB. Please choose a smaller image.'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image.'));
      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // Calculate approximate size of compressed dataURL in bytes
        const compressedBytes = Math.round((compressedDataUrl.length * 3) / 4);

        resolve({
          dataUrl: compressedDataUrl,
          originalName: file.name,
          originalSize: file.size,
          compressedSize: compressedBytes,
          width,
          height,
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
