export interface WatermarkOptions {
  position:
    | 'top-left' | 'top-center' | 'top-right'
    | 'center-left' | 'center' | 'center-right'
    | 'bottom-left' | 'bottom-center' | 'bottom-right';
  scaleRatio?: number; // relative to shortest side, 0.05–0.5
  opacity?: number;    // 0–1
  offsetX?: number;    // px nudge after position snap
  offsetY?: number;
}

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload  = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load: ${url}`));
    img.src = url;
  });
}

export async function applyWatermark(
  sourceUrl: string,
  watermarkImg: HTMLImageElement, // pre-loaded; don't pass the URL here
  mimeType: string,
  options: WatermarkOptions
): Promise<Blob> {
  const baseImg = await loadImage(sourceUrl);

  const canvas = document.createElement('canvas');
  canvas.width  = baseImg.naturalWidth;
  canvas.height = baseImg.naturalHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  ctx.drawImage(baseImg, 0, 0);

  const w  = canvas.width;
  const h  = canvas.height;
  const shortest  = Math.min(w, h);
  const wmWidth   = shortest * (options.scaleRatio ?? 0.15);
  const wmHeight  = wmWidth * (watermarkImg.naturalHeight / watermarkImg.naturalWidth);
  const edgePad   = shortest * 0.05;
  const offsetX   = options.offsetX ?? 0;
  const offsetY   = options.offsetY ?? 0;

  let x = 0, y = 0;
  switch (options.position) {
    case 'top-left':      x = edgePad;              y = edgePad; break;
    case 'top-center':    x = w / 2 - wmWidth / 2;  y = edgePad; break;
    case 'top-right':     x = w - wmWidth - edgePad; y = edgePad; break;
    case 'center-left':   x = edgePad;              y = h / 2 - wmHeight / 2; break;
    case 'center':        x = w / 2 - wmWidth / 2;  y = h / 2 - wmHeight / 2; break;
    case 'center-right':  x = w - wmWidth - edgePad; y = h / 2 - wmHeight / 2; break;
    case 'bottom-left':   x = edgePad;              y = h - wmHeight - edgePad; break;
    case 'bottom-center': x = w / 2 - wmWidth / 2;  y = h - wmHeight - edgePad; break;
    case 'bottom-right':  x = w - wmWidth - edgePad; y = h - wmHeight - edgePad; break;
  }

  ctx.globalAlpha = options.opacity ?? 1.0;
  ctx.drawImage(watermarkImg, x + offsetX, y + offsetY, wmWidth, wmHeight);
  ctx.globalAlpha = 1.0;

  // keep PNG as PNG so transparency isn't flattened to black
  const outputType = mimeType === 'image/png' ? 'image/png' : 'image/jpeg';

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => (blob ? resolve(blob) : reject(new Error('toBlob returned null'))),
      outputType,
      0.95
    );
  });
}
