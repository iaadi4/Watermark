export interface WatermarkOptions {
  watermarkUrl: string;
  position: 
    | 'top-left' | 'top-center' | 'top-right'
    | 'center-left' | 'center' | 'center-right'
    | 'bottom-left' | 'bottom-center' | 'bottom-right';
  scaleRatio?: number; // 0.1 to 1.0
  opacity?: number;    // 0 to 1.0
  offsetX?: number;    // Pixels
  offsetY?: number;    // Pixels
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
    baseImg.crossOrigin = 'anonymous'; 
    baseImg.onerror = () => reject(new Error('Failed to load base image'));
    baseImg.onload = () => {
      canvas.width = baseImg.width;
      canvas.height = baseImg.height;

      ctx.drawImage(baseImg, 0, 0);

      const wmImg = new Image();
      wmImg.crossOrigin = 'anonymous';
      wmImg.onerror = () => reject(new Error('Failed to load watermark image'));
      wmImg.onload = () => {
        // Calculate dimensions relative to the shortest side for better consistency
        const shortestSide = Math.min(canvas.width, canvas.height);
        const scaleRatio = options.scaleRatio || 0.15;
        
        const wmWidth = shortestSide * scaleRatio;
        const wmRatio = wmImg.height / wmImg.width;
        const wmHeight = wmWidth * wmRatio;

        const manualOffsetX = options.offsetX || 0;
        const manualOffsetY = options.offsetY || 0;
        
        // Edge padding (5% of shortest side)
        const edgePadding = shortestSide * 0.05;
        
        let x = 0;
        let y = 0;

        // Snapped Positioning Logic
        switch (options.position) {
          case 'top-left':
            x = edgePadding;
            y = edgePadding;
            break;
          case 'top-center':
            x = (canvas.width / 2) - (wmWidth / 2);
            y = edgePadding;
            break;
          case 'top-right':
            x = canvas.width - wmWidth - edgePadding;
            y = edgePadding;
            break;
          case 'center-left':
            x = edgePadding;
            y = (canvas.height / 2) - (wmHeight / 2);
            break;
          case 'center':
            x = (canvas.width / 2) - (wmWidth / 2);
            y = (canvas.height / 2) - (wmHeight / 2);
            break;
          case 'center-right':
            x = canvas.width - wmWidth - edgePadding;
            y = (canvas.height / 2) - (wmHeight / 2);
            break;
          case 'bottom-left':
            x = edgePadding;
            y = canvas.height - wmHeight - edgePadding;
            break;
          case 'bottom-center':
            x = (canvas.width / 2) - (wmWidth / 2);
            y = canvas.height - wmHeight - edgePadding;
            break;
          case 'bottom-right':
            x = canvas.width - wmWidth - edgePadding;
            y = canvas.height - wmHeight - edgePadding;
            break;
        }

        // Apply manual offsets
        x += manualOffsetX;
        y += manualOffsetY;

        // Apply Opacity
        ctx.globalAlpha = options.opacity !== undefined ? options.opacity : 1.0;
        ctx.drawImage(wmImg, x, y, wmWidth, wmHeight);
        ctx.globalAlpha = 1.0; // Reset

        canvas.toBlob((blob) => {
          // Cleanup
          ctx.clearRect(0, 0, canvas.width, canvas.height);
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
