export interface WatermarkOptions {
  watermarkUrl: string;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  scaleRatio?: number; // e.g., 0.15 for 15% width relative to base image
}

export async function applyWatermark(
  imageUrl: string,
  options: WatermarkOptions
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      return reject(new Error('Canvas 2D context not available'));
    }

    const baseImg = new Image();
    // crossOrigin anonymous is mandatory for fetching URLs (like Google Photos =d format)
    baseImg.crossOrigin = 'anonymous'; 
    baseImg.onerror = () => reject(new Error('Failed to load base image: ' + imageUrl));
    baseImg.onload = () => {
      // Size canvas to exactly match original image
      canvas.width = baseImg.width;
      canvas.height = baseImg.height;

      // Draw base image onto canvas
      ctx.drawImage(baseImg, 0, 0);

      const wmImg = new Image();
      wmImg.crossOrigin = 'anonymous';
      wmImg.onerror = () => reject(new Error('Failed to load watermark image'));
      wmImg.onload = () => {
        // Calculate dynamic dimensions to respect aspect ratio
        const scaleRatio = options.scaleRatio || 0.15;
        const wmWidth = canvas.width * scaleRatio;
        const wmRatio = wmImg.height / wmImg.width;
        const wmHeight = wmWidth * wmRatio;

        // Positioning logic
        const padding = canvas.width * 0.05; // 5% padding from the nearest edge
        let x = 0;
        let y = 0;

        switch (options.position) {
          case 'bottom-right':
            x = canvas.width - wmWidth - padding;
            y = canvas.height - wmHeight - padding;
            break;
          case 'bottom-left':
            x = padding;
            y = canvas.height - wmHeight - padding;
            break;
          case 'top-right':
            x = canvas.width - wmWidth - padding;
            y = padding;
            break;
          case 'top-left':
            x = padding;
            y = padding;
            break;
        }

        ctx.drawImage(wmImg, x, y, wmWidth, wmHeight);

        // Safe Blob Export
        canvas.toBlob((blob) => {
          // Aggressive memory cleanup immediately inside callback
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          canvas.width = 0;
          canvas.height = 0;
          baseImg.src = '';
          wmImg.src = '';
          
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas toBlob failed'));
          }
        }, 'image/jpeg', 0.95);
      };

      wmImg.src = options.watermarkUrl;
    };

    baseImg.src = imageUrl;
  });
}
