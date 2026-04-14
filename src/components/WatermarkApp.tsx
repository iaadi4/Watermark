"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { processAndDownloadZip, InputSource } from "../lib/processEngine";
import { 
  Folder, 
  Download, 
  Settings2, 
  Trash2, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Position = 
  | 'top-left' | 'top-center' | 'top-right'
  | 'center-left' | 'center' | 'center-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

export default function WatermarkApp() {
  const [sources, setSources] = useState<InputSource[]>([]);
  const [watermarkUrl, setWatermarkUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Watermark Settings
  const [position, setPosition] = useState<Position>('bottom-right');
  const [scale, setScale] = useState(0.15);
  const [opacity, setOpacity] = useState(1.0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const handleFolderSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).filter((f) => f.type.startsWith('image/'));
    const normalized: InputSource[] = files.map((file) => ({
      type: 'local',
      file,
      url: URL.createObjectURL(file)
    }));
    setSources(prev => [...prev, ...normalized]);
  };

  const clearQueue = () => {
    sources.forEach(s => URL.revokeObjectURL(s.url));
    setSources([]);
    setProgress({ current: 0, total: 0 });
  };

  const handleWatermarkUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      if (watermarkUrl) URL.revokeObjectURL(watermarkUrl);
      setWatermarkUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const startProcessing = async () => {
    if (!watermarkUrl || sources.length === 0) return;
    setIsProcessing(true);
    
    await processAndDownloadZip({
      items: sources,
      watermarkUrl,
      options: {
        position,
        scaleRatio: scale,
        opacity,
        offsetX,
        offsetY
      },
      onProgress: (current, total) => setProgress({ current, total })
    });

    setIsProcessing(false);
  };

  const positions: Position[] = [
    'top-left', 'top-center', 'top-right',
    'center-left', 'center', 'center-right',
    'bottom-left', 'bottom-center', 'bottom-right'
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Step 1: Assets */}
        <div className="space-y-6">
          <div className="p-8 bg-white border-[4px] border-black rounded-[40px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-6">
            <h2 className="text-2xl font-black flex items-center gap-3">
              <Folder className="w-8 h-8 text-[var(--color-primary)] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]" />
              1. Load Photos
            </h2>
            
            <div className="group relative border-[4px] border-dashed border-gray-300 rounded-3xl p-10 hover:border-black transition-colors cursor-pointer bg-gray-50 flex flex-col items-center justify-center text-center">
              <input 
                type="file" 
                // @ts-expect-error non-standard attributes
                webkitdirectory="true" 
                directory="true" 
                multiple 
                onChange={handleFolderSelect}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8 text-white" />
              </div>
              <p className="font-black text-xl mb-1">Select Input Folder</p>
              <p className="text-sm font-bold text-gray-500">Only images will be processed</p>
            </div>

            {sources.length > 0 && (
              <div className="flex items-center justify-between p-4 bg-[var(--color-primary)] border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6" />
                  <span className="font-black text-lg">{sources.length} items queued</span>
                </div>
                <button onClick={clearQueue} className="p-2 hover:bg-black hover:text-white rounded-lg transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="p-8 bg-white border-[4px] border-black rounded-[40px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-6">
            <h2 className="text-2xl font-black flex items-center gap-3">
              <ImageIcon className="w-8 h-8 text-[var(--color-primary)] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]" />
              2. Add Watermark
            </h2>
            
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 border-[3px] border-black rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                {watermarkUrl ? (
                  <img src={watermarkUrl} className="w-full h-full object-contain p-2" alt="Watermark preview" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleWatermarkUpload}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-xl file:border-[3px] file:border-black
                    file:text-sm file:font-black
                    file:bg-black file:text-white
                    hover:file:bg-[var(--color-primary)] hover:file:text-black transition-all cursor-pointer"
                />
                <p className="text-xs font-bold text-gray-400">Recommended: PNG with transparency</p>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Controls */}
        <div className="space-y-6">
          <div className="p-8 bg-white border-[4px] border-black rounded-[40px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-8">
            <h2 className="text-2xl font-black flex items-center gap-3">
              <Settings2 className="w-8 h-8 text-[var(--color-primary)] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]" />
              3. Style & Position
            </h2>

            <div className="space-y-6">
              {/* Position Grid */}
              <div className="space-y-3">
                <label className="font-black text-sm uppercase tracking-wider text-gray-400">Snapping Position</label>
                <div className="grid grid-cols-3 gap-2 w-fit mx-auto sm:mx-0">
                  {positions.map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setPosition(pos)}
                      className={cn(
                        "w-12 h-12 border-[3px] border-black rounded-lg transition-all",
                        position === pos ? "bg-[var(--color-primary)] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" : "bg-gray-100 hover:bg-gray-200"
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Sliders */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <label className="font-black text-sm uppercase tracking-wider text-gray-400">Scale</label>
                    <span className="font-black text-xs">{(scale * 100).toFixed(0)}%</span>
                  </div>
                  <input 
                    type="range" min="0.05" max="0.5" step="0.01" 
                    value={scale} onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="w-full accent-black cursor-pointer"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <label className="font-black text-sm uppercase tracking-wider text-gray-400">Opacity</label>
                    <span className="font-black text-xs">{(opacity * 100).toFixed(0)}%</span>
                  </div>
                  <input 
                    type="range" min="0.1" max="1.0" step="0.1" 
                    value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="w-full accent-black cursor-pointer"
                  />
                </div>
              </div>

              {/* Adjustments */}
              <div className="grid grid-cols-2 gap-6 pt-4 border-t-[3px] border-black">
                <div className="space-y-2">
                  <label className="font-black text-sm">X Offset</label>
                  <input 
                    type="number" value={offsetX} 
                    onChange={(e) => setOffsetX(parseInt(e.target.value) || 0)}
                    className="w-full border-[3px] border-black rounded-xl p-3 font-black focus:outline-none focus:bg-[var(--color-primary)]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-black text-sm">Y Offset</label>
                  <input 
                    type="number" value={offsetY} 
                    onChange={(e) => setOffsetY(parseInt(e.target.value) || 0)}
                    className="w-full border-[3px] border-black rounded-xl p-3 font-black focus:outline-none focus:bg-[var(--color-primary)]"
                  />
                </div>
              </div>
            </div>

            <button
               onClick={startProcessing}
               disabled={isProcessing || !watermarkUrl || sources.length === 0}
               className="w-full flex items-center justify-center gap-4 bg-black text-white font-black text-2xl py-6 rounded-[32px] border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(178,255,76,1)] hover:shadow-[12px_12px_0px_0px_rgba(178,255,76,1)] transition-all disabled:opacity-20 disabled:shadow-none hover:-translate-y-1 active:translate-y-0"
            >
              {isProcessing ? (
                <>Processing {progress.current}/{progress.total}...</>
              ) : (
                <>
                  Generate Output
                  <Download className="w-8 h-8" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {isProcessing && (
        <div className="p-8 bg-black border-[4px] border-black rounded-[40px] text-white space-y-4 shadow-[8px_8px_0px_0px_var(--color-primary)]">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black uppercase tracking-widest">Active Pipeline</h3>
            <span className="font-black text-[var(--color-primary)]">{(progress.current/progress.total * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full h-8 bg-gray-800 border-[3px] border-black rounded-2xl overflow-hidden relative">
            <div 
              className="h-full bg-[var(--color-primary)] transition-all duration-300 border-r-[3px] border-black" 
              style={{ width: `${(progress.current/progress.total * 100)}%` }}
            />
          </div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Do not close this tab until processing completes</p>
        </div>
      )}
    </div>
  );
}

function UploadCloud({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  );
}
