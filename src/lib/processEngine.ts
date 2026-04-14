import { applyWatermark, WatermarkOptions } from './watermarkCanvas';
import JSZip from 'jszip';

export type InputSource = 
  | { type: 'local'; file: File; url: string };

export interface ProcessTask {
  items: InputSource[];
  watermarkUrl: string;
  options: Omit<WatermarkOptions, 'watermarkUrl'>;
  onProgress?: (current: number, total: number) => void;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function processAndDownloadZip(task: ProcessTask): Promise<void> {
  const { items, watermarkUrl, options, onProgress } = task;
  const zip = new JSZip();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    try {
      // Phase 1: Apply Watermark
      const watermarkedBlob = await applyWatermark(item.url, {
        watermarkUrl,
        ...options
      });

      // Phase 2: Add to ZIP
      zip.file(item.file.name, watermarkedBlob);

      // Report progress
      if (onProgress) {
        onProgress(i + 1, items.length);
      }
    } catch (e) {
      console.error("Failed processing file:", item.file.name, e);
    } finally {
      URL.revokeObjectURL(item.url);
    }

    // Tiny breathing room for browser thread
    await delay(30);
  }

  // Finalize Local Download
  onProgress?.(items.length, items.length); 
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(zipBlob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `watermark_pack_${Date.now()}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
}
