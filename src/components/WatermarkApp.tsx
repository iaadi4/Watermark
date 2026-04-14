"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { processAndUploadImages, InputSource } from "../lib/processEngine";

interface WatermarkAppProps {
  accessToken: string;
}

export default function WatermarkApp({ accessToken }: WatermarkAppProps) {
  const [sources, setSources] = useState<InputSource[]>([]);
  const [watermarkUrl, setWatermarkUrl] = useState<string | null>(null);
  const [albumId, setAlbumId] = useState<string>("");
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [isProcessing, setIsProcessing] = useState(false);

  // Example handler for fetching images from a Google Photos album input
  const handleGooglePhotosFetch = async (e: FormEvent) => {
    e.preventDefault();
    /*
      In a real setup, this would fetch from 'https://photoslibrary.googleapis.com/v1/mediaItems:search'
      and map the results to the InputSource normalized type. 
      Important: Must append `=d` parameter to the `baseUrl` to actually fetch the image bytes.
    */
    const mockedGoogleFetchResponse = [
      { id: "photo1", baseUrl: "https://lh3.googleusercontent.com/mock-photo-url-1" },
      { id: "photo2", baseUrl: "https://lh3.googleusercontent.com/mock-photo-url-2" }
    ];

    const normalizedSources: InputSource[] = mockedGoogleFetchResponse.map(photo => ({
      type: 'google',
      id: photo.id,
      url: `${photo.baseUrl}=d` // Append "=d" so we can securely fetch raw bytes via Canvas
    }));

    setSources(prev => [...prev, ...normalizedSources]);
  };

  const handleFolderSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    // Normalize native file picker data
    const files = Array.from(e.target.files)
      .filter((f) => f.type.startsWith('image/'));
      
    const normalizedSources: InputSource[] = files.map((file) => ({
      type: 'local',
      file: file,
      url: URL.createObjectURL(file) // Convert File into an Object URL native to the browser
    }));

    setSources(prev => [...prev, ...normalizedSources]);
  };

  const handleWatermarkUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setWatermarkUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const startProcessing = async () => {
    if (!watermarkUrl || sources.length === 0 || !albumId) return;
    
    setIsProcessing(true);
    setProgress({ current: 0, total: sources.length });

    // Core execution of the sequential pipeline
    await processAndUploadImages({
      items: sources,
      watermarkUrl: watermarkUrl,
      accessToken,
      albumId,
      onProgress: (current, total) => setProgress({ current, total })
    });

    setIsProcessing(false);
    alert('Processing and uploading sequence completed!');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border max-w-2xl mx-auto space-y-8 text-black">
      <h2 className="text-2xl font-bold border-b pb-2">Image Watermarker Pipeline</h2>
      
      {/* Configuration Phase */}
      <div className="space-y-4">
        <div>
           <label className="block mb-1 font-semibold text-sm">Target Album ID</label>
           <input 
              type="text" 
              value={albumId} 
              onChange={(e) => setAlbumId(e.target.value)}
              placeholder="e.g. AExb1234..."
              className="border p-2 w-full rounded"
           />
        </div>
        
        <div>
           <label className="block mb-1 font-semibold text-sm">Upload Watermark PNG/JPG</label>
           <input type="file" accept="image/*" onChange={handleWatermarkUpload} className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100" 
            />
        </div>
      </div>

      {/* Input Handling Source Selectors */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border p-4 rounded bg-gray-50">
          <label className="block mb-2 font-semibold">Source A: Local Folder</label>
          <input 
            type="file"
            // @ts-expect-error React types don't officially support these non-standard attributes
            webkitdirectory="true" 
            directory="true" 
            multiple 
            onChange={handleFolderSelect} 
            className="text-xs max-w-full"
          />
        </div>

        <div className="border p-4 rounded bg-gray-50 flex flex-col justify-between">
          <label className="block mb-2 font-semibold">Source B: Google Album</label>
          <button onClick={handleGooglePhotosFetch} className="bg-gray-200 hover:bg-gray-300 text-sm py-2 px-4 rounded self-start">
            Fetch Mock Album
          </button>
        </div>
      </div>

      <div className="text-sm font-medium text-gray-700">
        Queued {sources.length} images to process.
      </div>

      {/* Execution Logic Trigger */}
      <button 
        onClick={startProcessing}
        disabled={isProcessing || !watermarkUrl || sources.length === 0 || !albumId}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isProcessing ? `Processing ${progress.current} of ${progress.total}...` : 'Start Sequential Processing'}
      </button>

      {isProcessing && (
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
             className="bg-blue-600 h-3 transition-all duration-300 ease-out" 
             style={{ width: `${(progress.current / progress.total) * 100}%` }}>
          </div>
        </div>
      )}
    </div>
  );
}
