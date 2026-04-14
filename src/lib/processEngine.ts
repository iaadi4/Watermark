import { applyWatermark } from './watermarkCanvas';

export type InputSource = 
  | { type: 'google'; id: string; url: string }
  | { type: 'local'; file: File; url: string };

export interface ProcessTask {
  items: InputSource[];
  watermarkUrl: string;
  accessToken: string;
  albumId: string;
  onProgress?: (current: number, total: number) => void;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function uploadToGooglePhotos(blob: Blob, fileName: string, accessToken: string): Promise<string> {
  const uploadRes = await fetch('https://photoslibrary.googleapis.com/v1/uploads', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/octet-stream',
      'X-Goog-Upload-Content-Type': blob.type,
      'X-Goog-Upload-Protocol': 'raw',
      'X-Goog-Upload-File-Name': fileName
    },
    body: blob
  });

  if (!uploadRes.ok) {
    throw new Error(`Upload failed: ${uploadRes.statusText}`);
  }

  return uploadRes.text(); // uploadToken
}

async function createMediaItem(uploadToken: string, albumId: string, fileName: string, accessToken: string) {
  const createRes = await fetch('https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      albumId: albumId,
      newMediaItems: [
        {
          description: "Watermarked " + fileName,
          simpleMediaItem: {
            uploadToken: uploadToken,
            fileName: fileName
          }
        }
      ]
    })
  });

  if (!createRes.ok) {
    throw new Error(`Batch create failed: ${createRes.statusText}`);
  }

  return createRes.json();
}

export async function processAndUploadImages(task: ProcessTask): Promise<void> {
  const { items, watermarkUrl, accessToken, albumId, onProgress } = task;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    try {
      // Phase 1: Apply Watermark
      const watermarkedBlob = await applyWatermark(item.url, {
        watermarkUrl: watermarkUrl,
        position: 'bottom-right',
        scaleRatio: 0.15
      });

      const fileName = item.type === 'local' ? item.file.name : `google_photo_${item.id}.jpg`;

      // Phase 2: Upload to Google Photos
      const uploadToken = await uploadToGooglePhotos(watermarkedBlob, fileName, accessToken);
      await createMediaItem(uploadToken, albumId, fileName, accessToken);

      // Report progress
      if (onProgress) {
        onProgress(i + 1, items.length);
      }
    } catch (e) {
      console.error("Failed processing item", item, e);
    } finally {
      // Phase 3: Aggressive Memory Management
      // Always revoke object URLs explicitly created for local files
      if (item.type === 'local') {
        URL.revokeObjectURL(item.url);
      }
    }

    // Phase 4: Rate Limiting
    // Artificial 1.5s delay to prevent HTTP 429 Too Many Requests
    await delay(1500); 
  }
}
