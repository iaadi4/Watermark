"use client";

import { useState, useRef, useEffect, useCallback, ChangeEvent } from "react";
import { processIntoDirectory, processAndDownloadFallback, InputSource } from "../lib/processEngine";
import { 
  Folder, 
  Download, 
  Settings2, 
  Trash2, 
  Image as ImageIcon,
  CheckCircle2,
  Eye,
  Sliders
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Position = 
  | 'top-left' | 'top-center' | 'top-right'
  | 'center-left' | 'center' | 'center-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

// ─── Live Preview ──────────────────────────────────────────────
function LivePreview({
  imageUrl,
  watermarkUrl,
  position,
  scale,
  opacity,
  offsetX,
  offsetY,
}: {
  imageUrl: string;
  watermarkUrl: string;
  position: Position;
  scale: number;
  opacity: number;
  offsetX: number;
  offsetY: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [wmNatural, setWmNatural] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const img = new Image();
    img.onload = () => setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = imageUrl;
  }, [imageUrl]);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setWmNatural({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = watermarkUrl;
  }, [watermarkUrl]);

  const getWatermarkStyle = useCallback((): React.CSSProperties => {
    if (!containerRef.current || !naturalSize.w || !wmNatural.w) {
      return { display: 'none' };
    }

    const displayW = containerRef.current.clientWidth;
    const ratio = displayW / naturalSize.w;

    const shortestSide = Math.min(naturalSize.w, naturalSize.h);
    const wmWidthNat = shortestSide * scale;
    const wmRatio = wmNatural.h / wmNatural.w;
    const wmHeightNat = wmWidthNat * wmRatio;
    const edgePadding = shortestSide * 0.05;

    let x = 0, y = 0;

    switch (position) {
      case 'top-left':      x = edgePadding; y = edgePadding; break;
      case 'top-center':    x = (naturalSize.w / 2) - (wmWidthNat / 2); y = edgePadding; break;
      case 'top-right':     x = naturalSize.w - wmWidthNat - edgePadding; y = edgePadding; break;
      case 'center-left':   x = edgePadding; y = (naturalSize.h / 2) - (wmHeightNat / 2); break;
      case 'center':        x = (naturalSize.w / 2) - (wmWidthNat / 2); y = (naturalSize.h / 2) - (wmHeightNat / 2); break;
      case 'center-right':  x = naturalSize.w - wmWidthNat - edgePadding; y = (naturalSize.h / 2) - (wmHeightNat / 2); break;
      case 'bottom-left':   x = edgePadding; y = naturalSize.h - wmHeightNat - edgePadding; break;
      case 'bottom-center': x = (naturalSize.w / 2) - (wmWidthNat / 2); y = naturalSize.h - wmHeightNat - edgePadding; break;
      case 'bottom-right':  x = naturalSize.w - wmWidthNat - edgePadding; y = naturalSize.h - wmHeightNat - edgePadding; break;
    }

    x += offsetX;
    y += offsetY;

    return {
      position: 'absolute',
      left: x * ratio,
      top: y * ratio,
      width: wmWidthNat * ratio,
      height: wmHeightNat * ratio,
      opacity,
      pointerEvents: 'none',
      transition: 'all 0.15s ease-out',
    };
  }, [naturalSize, wmNatural, position, scale, opacity, offsetX, offsetY]);

  const [wmStyle, setWmStyle] = useState<React.CSSProperties>({ display: 'none' });

  useEffect(() => { setWmStyle(getWatermarkStyle()); }, [getWatermarkStyle]);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => setWmStyle(getWatermarkStyle()));
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [getWatermarkStyle]);

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden border-[3px] border-black bg-[repeating-conic-gradient(#e5e5e5_0%_25%,#fff_0%_50%)] bg-[length:16px_16px]"
    >
      <img src={imageUrl} alt="Preview" className="w-full h-auto block" onLoad={() => setWmStyle(getWatermarkStyle())} />
      <img src={watermarkUrl} alt="Watermark" style={wmStyle} className="object-contain" />
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────
export default function WatermarkApp() {
  const [sources, setSources] = useState<InputSource[]>([]);
  const [watermarkUrl, setWatermarkUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0, currentFile: '' });
  const [isDone, setIsDone] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
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
    setProgress({ current: 0, total: 0, currentFile: '' });
    setIsDone(false);
    setErrorCount(0);
  };

  const handleWatermarkUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      if (watermarkUrl) URL.revokeObjectURL(watermarkUrl);
      setWatermarkUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const startProcessing = async () => {
    if (!watermarkUrl || sources.length === 0) return;

    let useZip = false;
    let dirHandle;

    if ('showDirectoryPicker' in window) {
      try {
        // @ts-ignore
        dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
      } catch (err: any) {
        if (err.name === 'AbortError') {
          return; // user cancelled folder selection
        }
        useZip = true;
      }
    } else {
      useZip = true;
    }

    setDialogOpen(false);
    setIsProcessing(true);
    setIsDone(false);
    setErrorCount(0);
    setProgress({ current: 0, total: sources.length, currentFile: '' });

    try {
      let result;
      const optionsPayload = {
        items: sources,
        watermarkUrl,
        options: { position, scaleRatio: scale, opacity, offsetX, offsetY },
        onProgress: (current: number, total: number, currentFile: string) =>
          setProgress({ current, total, currentFile }),
      };

      if (useZip) {
        result = await processAndDownloadFallback(optionsPayload);
      } else {
        result = await processIntoDirectory({ ...optionsPayload, dirHandle });
      }

      setErrorCount(result.errors);
    } catch (e) {
      console.error('Processing pipeline error:', e);
      setErrorCount(sources.length); // treat all as failed
    } finally {
      setIsProcessing(false);
      setIsDone(true);
    }
  };

  const positions: Position[] = [
    'top-left', 'top-center', 'top-right',
    'center-left', 'center', 'center-right',
    'bottom-left', 'bottom-center', 'bottom-right'
  ];

  const canConfigure = sources.length > 0 && watermarkUrl;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Upload Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Step 1: Load Photos */}
        <div className="p-8 bg-white border-[4px] border-black rounded-[40px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-6">
          <h2 className="text-2xl font-black flex items-center gap-3">
            <Folder className="w-8 h-8 text-[var(--color-primary)] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]" />
            1. Load Photos
          </h2>
          
          <div className="group relative border-[4px] border-dashed border-gray-300 rounded-3xl p-10 hover:border-black transition-colors cursor-pointer bg-gray-50 flex flex-col items-center justify-center text-center flex-1">
            <input 
              type="file" 
              // @ts-expect-error non-standard attributes
              webkitdirectory="true" 
              directory="true" 
              multiple 
              onChange={handleFolderSelect}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform pointer-events-none">
              <UploadCloud className="w-8 h-8 text-white" />
            </div>
            <p className="font-black text-xl mb-1 pointer-events-none">Select Input Folder</p>
            <p className="text-sm font-bold text-gray-500 pointer-events-none">Only images will be processed</p>
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

        {/* Step 2: Add Watermark */}
        <div className="p-8 bg-white border-[4px] border-black rounded-[40px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-6">
          <h2 className="text-2xl font-black flex items-center gap-3">
            <ImageIcon className="w-8 h-8 text-[var(--color-primary)] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]" />
            2. Add Watermark
          </h2>
          
          <div className="group relative border-[4px] border-dashed border-gray-300 rounded-3xl p-10 hover:border-black transition-colors cursor-pointer bg-gray-50 flex flex-col items-center justify-center text-center flex-1">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleWatermarkUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {watermarkUrl ? (
              <div className="w-20 h-20 border-[3px] border-black rounded-2xl bg-white flex items-center justify-center overflow-hidden mb-4 pointer-events-none">
                <img src={watermarkUrl} className="w-full h-full object-contain p-2" alt="Watermark" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform pointer-events-none">
                <ImageIcon className="w-8 h-8 text-white" />
              </div>
            )}
            <p className="font-black text-xl mb-1 pointer-events-none">{watermarkUrl ? 'Watermark loaded' : 'Upload Watermark'}</p>
            <p className="text-sm font-bold text-gray-500 pointer-events-none">{watermarkUrl ? 'Click to change' : 'PNG with transparency recommended'}</p>
          </div>

          {watermarkUrl && (
            <div className="flex items-center justify-between p-4 bg-[var(--color-primary)] border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6" />
                <span className="font-black text-lg">Watermark ready</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Configure & Generate Button */}
      <button
        onClick={() => setDialogOpen(true)}
        disabled={!canConfigure || isProcessing}
        className={cn(
          "w-full flex items-center justify-center gap-4 font-black text-2xl py-6 rounded-[32px] border-[4px] border-black transition-all",
          canConfigure && !isProcessing
            ? "bg-black text-white shadow-[8px_8px_0px_0px_rgba(178,255,76,1)] hover:shadow-[12px_12px_0px_0px_rgba(178,255,76,1)] hover:-translate-y-1 active:translate-y-0 cursor-pointer"
            : "bg-gray-100 text-gray-300 border-gray-300 cursor-not-allowed"
        )}
      >
        <Sliders className="w-8 h-8" />
        Configure & Preview
      </button>

      {/* ─── Preview + Controls Dialog ─────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogTitle className="flex items-center gap-3 mb-1">
            <Eye className="w-7 h-7 text-[var(--color-primary)] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]" />
            Configure & Preview
          </DialogTitle>
          <DialogDescription>
            Position your watermark, then generate output. Changes update live.
          </DialogDescription>

          <div className="grid lg:grid-cols-2 gap-8 mt-6">
            {/* Left: Live Preview */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-400">
                <Eye className="w-4 h-4" />
                Preview
              </div>
              {canConfigure && (
                <LivePreview
                  imageUrl={sources[0].url}
                  watermarkUrl={watermarkUrl!}
                  position={position}
                  scale={scale}
                  opacity={opacity}
                  offsetX={offsetX}
                  offsetY={offsetY}
                />
              )}
              <p className="text-xs font-bold text-gray-400 text-center">
                First image from queue · {sources.length} total
              </p>
            </div>

            {/* Right: Controls */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-400">
                <Settings2 className="w-4 h-4" />
                Controls
              </div>

              {/* Position Grid */}
              <div className="space-y-3">
                <label className="font-black text-sm uppercase tracking-wider text-gray-400">Position</label>
                <div className="grid grid-cols-3 gap-2 w-fit">
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
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
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
                <div className="space-y-2">
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

              {/* Offsets */}
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

              {/* Generate Button */}
              <button
                onClick={startProcessing}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-4 bg-black text-white font-black text-xl py-5 rounded-[24px] border-[4px] border-black shadow-[6px_6px_0px_0px_rgba(178,255,76,1)] hover:shadow-[10px_10px_0px_0px_rgba(178,255,76,1)] transition-all disabled:opacity-20 disabled:shadow-none hover:-translate-y-1 active:translate-y-0"
              >
                <Download className="w-6 h-6" />
                Process into Folder...
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Progress Bar */}
      {isProcessing && (
        <div className="p-8 bg-black border-[4px] border-black rounded-[40px] text-white space-y-4 shadow-[8px_8px_0px_0px_var(--color-primary)]">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black uppercase tracking-widest">Active Pipeline</h3>
            <span className="font-black text-[var(--color-primary)]">
              {progress.total > 0 ? ((progress.current / progress.total) * 100).toFixed(0) : 0}%
            </span>
          </div>
          <div className="w-full h-8 bg-gray-800 border-[3px] border-black rounded-2xl overflow-hidden relative">
            <div
              className="h-full bg-[var(--color-primary)] transition-all duration-300 border-r-[3px] border-black"
              style={{ width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%` }}
            />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Do not close this tab until processing completes</p>
            <p className="text-xs font-bold text-gray-400 truncate max-w-[40%] text-right">{progress.currentFile}</p>
          </div>
          <p className="text-sm font-black text-gray-300">{progress.current} / {progress.total} images</p>
        </div>
      )}

      {/* Done Banner */}
      {isDone && !isProcessing && (
        <div className={cn(
          "p-8 border-[4px] border-black rounded-[40px] space-y-2",
          errorCount === 0
            ? "bg-[var(--color-primary)] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            : "bg-yellow-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        )}>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8" />
            <h3 className="text-xl font-black uppercase tracking-widest">
              {errorCount === 0 ? 'All done!' : `Done with ${errorCount} error${errorCount > 1 ? 's' : ''}`}
            </h3>
          </div>
          <p className="text-sm font-bold">
            {progress.total - errorCount} of {progress.total} images saved.
            {errorCount > 0 && ' Check the console for details on failed files.'}
          </p>
        </div>
      )}
    </div>
  );
}

function UploadCloud({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  );
}
