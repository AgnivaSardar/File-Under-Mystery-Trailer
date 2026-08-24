import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Volume2, Radio } from "lucide-react";

export default function AudioLab({ config }) {
  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const filterNodeRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(20.25);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Audio DSP Filter States (Default: Low-Pass at 800 Hz -> Voice Only)
  const [filterType, setFilterType] = useState("lowpass"); // 'lowpass' | 'bandpass' | 'highpass' | 'bypass'
  const [frequency, setFrequency] = useState(800); // 800 Hz default

  const audioSrc = config.evidenceFile || "/evidence/voicemail.wav";

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
      className="flex flex-col gap-3.5 w-full select-none font-mono text-xs max-w-5xl mx-auto"
    >
      {/* Sleek, Unified Forensic Audio Console */}
      <div className="bg-black p-4 rounded-2xl border border-white/15 w-full flex flex-col gap-3">
        {/* Row 1: Play/Pause, Timeline Scrubber & Speed Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="px-4 py-2 bg-white hover:bg-slate-200 text-black font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md text-xs whitespace-nowrap"
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
          </div>

          {/* Timeline Scrubber */}
          <div className="flex-1 min-w-[200px] flex items-center gap-2">
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

          {/* Playback Speeds */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
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

        {/* Row 2: Filter Mode Pills & Frequency Slider (Compact 1-Row Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center pt-2.5 border-t border-white/10">
          {/* Filter Mode Selector Pills */}
          <div className="md:col-span-6 flex items-center gap-1.5">
            {[
              { id: "lowpass", label: "Voice Only (Low-Pass)" },
              { id: "bandpass", label: "Bandpass Isolator" },
              { id: "highpass", label: "High-Pass" },
              { id: "bypass", label: "Bypass" }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  initAudioContext();
                  setFilterType(f.id);
                }}
                className={`flex-1 py-1.5 px-2 rounded-lg border text-[10px] font-bold transition-all cursor-pointer text-center whitespace-nowrap ${
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
          <div className="md:col-span-6 flex items-center gap-3">
            <span className="text-[10px] text-slate-400 whitespace-nowrap font-bold">
              Frequency: <span className="text-white">{frequency} Hz</span>
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
