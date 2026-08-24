import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Volume2, Radio } from "lucide-react";

export default function AudioLab({ config }) {
  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const filterNodeRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(26.0);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Audio DSP Filter States
  const [filterType, setFilterType] = useState("lowpass");
  const [frequency, setFrequency] = useState(800);

  const audioSrc = config.evidenceFile || "/evidence/trailer_beacon.wav";

  // Initialize Web Audio DSP Graph
  useEffect(() => {
    const audio = new Audio(audioSrc);
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;

    const updateDur = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    audio.onloadedmetadata = updateDur;
    audio.ondurationchange = updateDur;

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.onended = () => {
      setIsPlaying(false);
    };

    return () => {
      audio.pause();
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close();
      }
    };
  }, [audioSrc]);

  const initAudioContext = () => {
    if (!audioCtxRef.current && audioRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const source = ctx.createMediaElementSource(audioRef.current);
      sourceNodeRef.current = source;

      const filter = ctx.createBiquadFilter();
      filter.type = filterType === "bypass" ? "allpass" : filterType;
      filter.frequency.setValueAtTime(frequency, ctx.currentTime);
      filter.Q.setValueAtTime(4.0, ctx.currentTime);
      filterNodeRef.current = filter;

      source.connect(filter);
      filter.connect(ctx.destination);
    }
  };

  useEffect(() => {
    if (filterNodeRef.current && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      const filter = filterNodeRef.current;
      filter.type = filterType === "bypass" ? "allpass" : filterType;
      filter.frequency.setTargetAtTime(frequency, ctx.currentTime, 0.02);
    }
  }, [filterType, frequency]);

  const togglePlay = () => {
    initAudioContext();
    if (!audioRef.current) return;

    if (audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume();
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleRateChange = (rate) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="flex flex-col gap-3 w-full select-none font-mono text-xs max-w-5xl mx-auto"
    >
      {/* Sleek, Unified Forensic Audio Console */}
      <div className="bg-black p-3 sm:p-4 rounded-2xl border border-white/15 w-full flex flex-col gap-3 shadow-2xl">
        {/* Row 1: Play/Pause, Scrubber & Speeds */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <button
              onClick={togglePlay}
              className="px-3.5 sm:px-4 py-2 bg-white hover:bg-slate-200 text-black font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md text-xs whitespace-nowrap"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />} {isPlaying ? "Pause" : "Play Voicemail"}
            </button>
            <button
              onClick={() => {
                handleSeek(0);
                if (audioRef.current) audioRef.current.pause();
                setIsPlaying(false);
              }}
              className="p-2 bg-black border border-white/15 hover:border-white text-slate-300 rounded-xl cursor-pointer"
              title="Reset Track"
            >
              <RotateCcw size={13} />
            </button>

            {/* Speeds on small screens */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 sm:hidden">
              {[0.5, 1.0, 1.5].map((rate) => (
                <button
                  key={rate}
                  onClick={() => handleRateChange(rate)}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-all ${
                    playbackRate === rate
                      ? "bg-white text-black shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>

          {/* Timeline Scrubber */}
          <div className="flex-1 w-full flex items-center gap-2">
            <input
              type="range"
              min="0"
              max={duration}
              step="0.05"
              value={currentTime}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="w-full accent-white cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
              {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
            </span>
          </div>

          {/* Speeds on desktop */}
          <div className="hidden sm:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            {[0.25, 0.5, 1.0, 1.5, 2.0].map((rate) => (
              <button
                key={rate}
                onClick={() => handleRateChange(rate)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                  playbackRate === rate
                    ? "bg-white text-black shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Filter Mode Pills & Frequency Slider */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center pt-2.5 border-t border-white/10">
          {/* Filter Mode Selector Grid */}
          <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {[
              { id: "lowpass", label: "Low-Pass (Voice)" },
              { id: "bandpass", label: "Bandpass (Morse)" },
              { id: "highpass", label: "High-Pass" },
              { id: "bypass", label: "Bypass" }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  initAudioContext();
                  setFilterType(f.id);
                }}
                className={`py-1.5 px-2 rounded-lg border text-[10px] font-bold transition-all cursor-pointer text-center whitespace-nowrap ${
                  filterType === f.id
                    ? "bg-white text-black border-white shadow"
                    : "bg-black text-slate-400 border-white/10 hover:border-white/30"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Frequency Tuning Slider */}
          <div className="md:col-span-6 flex items-center gap-2.5">
            <span className="text-[10px] text-slate-400 whitespace-nowrap font-bold">
              Freq: <span className="text-white">{frequency} Hz</span>
            </span>
            <input
              type="range"
              min="200"
              max="4000"
              step="25"
              value={frequency}
              onChange={(e) => {
                initAudioContext();
                setFrequency(Number(e.target.value));
              }}
              disabled={filterType === "bypass"}
              className="w-full accent-white cursor-pointer disabled:opacity-30"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
