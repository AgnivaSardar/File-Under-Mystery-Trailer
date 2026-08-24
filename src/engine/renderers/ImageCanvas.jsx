import React, { useRef, useEffect, useState } from "react";
import { Sliders, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";
import { histogramStretch } from "../filters/histogramStretch.js";
import { brightness } from "../filters/brightness.js";
import { contrast } from "../filters/contrast.js";
import { gamma } from "../filters/gamma.js";

export default function ImageCanvas({ config }) {
  const canvasRef = useRef(null);
  const originalRef = useRef(null);

  // Filter states
  const [minStretch, setMinStretch] = useState(0);
  const [maxStretch, setMaxStretch] = useState(255);
  const [brightVal, setBrightVal] = useState(0);
  const [contrastVal, setContrastVal] = useState(0);
  const [gammaVal, setGammaVal] = useState(1.0);
  const [invert, setInvert] = useState(false);
  const [channelSolo, setChannelSolo] = useState("all"); // 'all' | 'red' | 'green' | 'blue'
  const [thresholdVal, setThresholdVal] = useState(0);

  // Zoom and Drag-to-Pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const img = new Image();
    img.src = config.evidenceFile || "/evidence/forest.png";
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      originalRef.current = ctx.getImageData(0, 0, img.width, img.height);
      applyAllFilters();
    };
  }, [config.evidenceFile]);

  const applyAllFilters = () => {
    if (!originalRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const imgData = new ImageData(
      new Uint8ClampedArray(originalRef.current.data),
      originalRef.current.width,
      originalRef.current.height
    );
    const d = imgData.data;

    // 1. Histogram Stretch
    if (minStretch !== 0 || maxStretch !== 255) {
      histogramStretch(imgData, { min: minStretch, max: maxStretch });
    }

    // 2. Brightness & Contrast & Gamma
    if (brightVal !== 0) brightness(imgData, { value: brightVal });
    if (contrastVal !== 0) contrast(imgData, { contrast: contrastVal });
    if (gammaVal !== 1.0) gamma(imgData, { gamma: gammaVal });

    // 3. Channel Isolation
    if (channelSolo !== "all") {
      for (let i = 0; i < d.length; i += 4) {
        if (channelSolo === "red") { d[i + 1] = 0; d[i + 2] = 0; }
        else if (channelSolo === "green") { d[i] = 0; d[i + 2] = 0; }
        else if (channelSolo === "blue") { d[i] = 0; d[i + 1] = 0; }
      }
    }

    // 4. Invert
    if (invert) {
      for (let i = 0; i < d.length; i += 4) {
        d[i] = 255 - d[i];
        d[i + 1] = 255 - d[i + 1];
        d[i + 2] = 255 - d[i + 2];
      }
    }

    // 5. Binary Threshold
    if (thresholdVal > 0) {
      for (let i = 0; i < d.length; i += 4) {
        const avg = (d[i] + d[i + 1] + d[i + 2]) / 3;
        const val = avg >= thresholdVal ? 255 : 0;
        d[i] = val; d[i + 1] = val; d[i + 2] = val;
      }
    }

    ctx.putImageData(imgData, 0, 0);
  };

  useEffect(() => {
    applyAllFilters();
  }, [minStretch, maxStretch, brightVal, contrastVal, gammaVal, invert, channelSolo, thresholdVal]);

  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setPan({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleZoomChange = (delta) => {
    setZoom((prev) => {
      const next = Math.max(1, Math.min(3.5, prev + delta));
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetAll = () => {
    setMinStretch(0);
    setMaxStretch(255);
    setBrightVal(0);
    setContrastVal(0);
    setGammaVal(1.0);
    setInvert(false);
    setChannelSolo("all");
    setThresholdVal(0);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="flex flex-col gap-4 w-full select-none max-w-5xl mx-auto"
    >
      {/* Centered Large Widescreen Evidence Canvas Viewport with Drag-to-Pan */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative rounded-2xl overflow-hidden border border-white/15 flex flex-col items-center justify-center p-3 bg-black shadow-2xl min-h-[380px] max-h-[440px] w-full select-none"
        style={{ cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default" }}
      >
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-black/80 backdrop-blur border border-white/15 px-2.5 py-1 rounded-xl text-xs font-mono text-slate-300">
          <button onClick={() => handleZoomChange(-0.25)} className="p-1 hover:text-white cursor-pointer"><ZoomOut size={13} /></button>
          <span className="font-bold text-white px-1">{Math.round(zoom * 100)}%</span>
          <button onClick={() => handleZoomChange(0.25)} className="p-1 hover:text-white cursor-pointer"><ZoomIn size={13} /></button>
          <button onClick={handleResetAll} className="p-1 hover:text-white ml-1 cursor-pointer" title="Reset All Filters"><RefreshCw size={13} /></button>
        </div>

        <div className="flex items-center justify-center w-full h-full overflow-hidden">
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-[420px] object-contain transition-transform duration-75"
            style={{
              transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`
            }}
          />
        </div>
      </div>

      {/* Forensic Laboratory Filter Controls (Widescreen Spacious Grid) */}
      <div className="flex flex-col gap-3 w-full font-mono text-xs">
        {/* Dynamic Range Stretch */}
        <div className="p-3.5 bg-black rounded-2xl border border-white/15 flex flex-col gap-2.5">
          <div className="flex justify-between items-center text-slate-300 font-bold text-xs uppercase border-b border-white/10 pb-2">
            <span>Dynamic Range Histogram Stretch</span>
            <span className="text-white">[{minStretch} , {maxStretch}]</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-400">Min Luminance Cutoff: {minStretch}</span>
              <input
                type="range"
                min="0"
                max="254"
                value={minStretch}
                onChange={(e) => setMinStretch(Math.min(Number(e.target.value), maxStretch - 1))}
                className="w-full accent-white cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-400">Max Luminance Cutoff: {maxStretch}</span>
              <input
                type="range"
                min="1"
                max="255"
                value={maxStretch}
                onChange={(e) => setMaxStretch(Math.max(Number(e.target.value), minStretch + 1))}
                className="w-full accent-white cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Sliders Grid: Brightness, Contrast, Gamma */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-black rounded-2xl border border-white/15">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-slate-300 text-[10px] font-bold">
              <span>Brightness</span>
              <span className="text-white">{brightVal}</span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={brightVal}
              onChange={(e) => setBrightVal(Number(e.target.value))}
              className="w-full accent-white cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-slate-300 text-[10px] font-bold">
              <span>Contrast</span>
              <span className="text-white">{contrastVal}</span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={contrastVal}
              onChange={(e) => setContrastVal(Number(e.target.value))}
              className="w-full accent-white cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-slate-300 text-[10px] font-bold">
              <span>Gamma Curve</span>
              <span className="text-white">{gammaVal.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="4.0"
              step="0.05"
              value={gammaVal}
              onChange={(e) => setGammaVal(Number(e.target.value))}
              className="w-full accent-white cursor-pointer"
            />
          </div>
        </div>

        {/* Channel Solo & Binary Inversion */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-black rounded-xl border border-white/15 flex items-center justify-between">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Channel Filter:</span>
            <div className="flex gap-1.5">
              {["all", "red", "green", "blue"].map((ch) => (
                <button
                  key={ch}
                  onClick={() => setChannelSolo(ch)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    channelSolo === ch
                      ? "bg-white text-black"
                      : "bg-black text-slate-400 border border-white/10 hover:border-white/30"
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-black rounded-xl border border-white/15 flex items-center justify-between gap-2">
            <button
              onClick={() => setInvert(!invert)}
              className={`flex-1 py-1.5 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                invert ? "bg-white text-black border-white" : "bg-black border-white/20 text-slate-300"
              }`}
            >
              Negative Invert: {invert ? "ON" : "OFF"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
