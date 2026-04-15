import { applyWatermark, WatermarkOptions } from './watermarkCanvas';

export type InputSource = 
  | { type: 'local'; file: File; url: string };

export interface ProcessTask {
  items: InputSource[];
  watermarkUrl: string;
  options: Omit<WatermarkOptions, 'watermarkUrl'>;
  dirHandle: any; // Using any for FileSystemDirectoryHandle
  onProgress?: (current: number, total: number) => void;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function processIntoDirectory(task: ProcessTask): Promise<void> {
  const { items, watermarkUrl, options, dirHandle, onProgress } = task;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    try {
      // Phase 1: Apply Watermark
      const watermarkedBlob = await applyWatermark(item.url, {
        watermarkUrl,
        ...options
      });

      // Phase 2: Save to Output Directory
      const fileHandle = await dirHandle.getFileHandle(item.file.name, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(watermarkedBlob);
      await writable.close();

      // Report progress
      if (onProgress) {
        onProgress(i + 1, items.length);
      }
    } catch (e) {
      console.error("Failed processing file:", item.file.name, e);
    }

    // Tiny breathing room for browser thread
    await delay(30);
  }

  // Finalize Processing
  onProgress?.(items.length, items.length); 
}
