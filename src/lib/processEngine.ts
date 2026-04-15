import { applyWatermark, loadImage, WatermarkOptions } from './watermarkCanvas';

export type InputSource = { type: 'local'; file: File; url: string };

export interface ProcessTask {
  items: InputSource[];
  watermarkUrl: string;
  options: WatermarkOptions;
  dirHandle?: any; // FileSystemDirectoryHandle (optional, undefined for fallback)
  onProgress?: (current: number, total: number, currentFile: string) => void;
}

export interface ProcessResult {
  errors: number;
}

export async function processIntoDirectory(task: ProcessTask): Promise<ProcessResult> {
  const { items, watermarkUrl, options, dirHandle, onProgress } = task;
  const watermarkImg = await loadImage(watermarkUrl);
  let errors = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    try {
      const blob = await applyWatermark(item.url, watermarkImg, item.file.type, options);
      const fh = await dirHandle.getFileHandle(item.file.name, { create: true });
      const ws = await fh.createWritable();
      await ws.write(blob);
      await ws.close();
    } catch (e) {
      console.error(`[watermark] failed: ${item.file.name}`, e);
      errors++;
    }
    onProgress?.(i + 1, items.length, item.file.name);
    await new Promise<void>(r => setTimeout(r, 30));
  }
  return { errors };
}

export async function processAndDownloadFallback(task: ProcessTask): Promise<ProcessResult> {
  const { items, watermarkUrl, options, onProgress } = task;
  const watermarkImg = await loadImage(watermarkUrl);
  let errors = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    try {
      const blob = await applyWatermark(item.url, watermarkImg, item.file.type, options);
      
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = item.file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup ObjectURL
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 2000);
    } catch (e) {
      console.error(`[watermark] failed: ${item.file.name}`, e);
      errors++;
    }
    
    onProgress?.(i + 1, items.length, item.file.name);
    
    // Add slightly larger delay to pace browser downloads
    // otherwise the browser may block hundreds of rapid simultaneous triggers
    await new Promise<void>(r => setTimeout(r, 200));
  }

  return { errors };
}
