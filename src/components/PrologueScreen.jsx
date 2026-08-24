import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, ArrowRight, Play, Pause, ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { TRAILER_CONFIG } from "../config/trailerConfig.js";
import { useGameStore } from "../store/useGameStore.js";

export default function PrologueScreen() {
  const navigate = useNavigate();
  const { resetProgress } = useGameStore();

  // Mode: 'start' (initial splash) | 'cinema' (active prologue reader)
  const [mode, setMode] = useState("start");

  // Cinematic Engine State
  const [activeLineIdx, setActiveLineIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const audioRef = useRef(null);
  const storyLines = TRAILER_CONFIG.prologueLines;

  const handleStart = () => {
    // Reset puzzle progress so answers are not prefilled or automatically marked solved
    resetProgress();

    // Request browser fullscreen mode
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen().catch(() => {});
      }
    } catch (e) {}

    setMode("cinema");
    setActiveLineIdx(0);
    setIsPlaying(true);
  };

  // Play 100% matched female studio audio and advance on end
  const playStudioAudio = (idx) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (!voiceEnabled || mode !== "cinema") return;

    const audioUrl = `/audio/prologue_${idx}.mp3`;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.onended = () => {
      if (isPlaying) {
        setActiveLineIdx((prev) => {
          if (prev < storyLines.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }
    };

    audio.onerror = () => {
      if (isPlaying) {
        setTimeout(() => {
          setActiveLineIdx((prev) => (prev < storyLines.length - 1 ? prev + 1 : prev));
        }, 3200);
      }
    };

    audio.play().catch(() => {});
  };

  useEffect(() => {
    if (mode === "cinema") {
      playStudioAudio(activeLineIdx);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [mode, activeLineIdx, isPlaying, voiceEnabled]);

  const handlePrevLine = () => {
    if (audioRef.current) audioRef.current.pause();
    setActiveLineIdx((prev) => Math.max(0, prev - 1));
  };

  const handleNextLine = () => {
    if (audioRef.current) audioRef.current.pause();
    if (activeLineIdx < storyLines.length - 1) {
      setActiveLineIdx((prev) => prev + 1);
    } else {
      handleEnterLab();
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      if (audioRef.current) audioRef.current.play();
      else playStudioAudio(activeLineIdx);
    }
  };

  const handleEnterLab = () => {
    if (audioRef.current) audioRef.current.pause();
    navigate("/investigate/level1");
  };

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="w-full h-full max-h-screen flex items-center justify-center select-none px-3 sm:px-4 relative overflow-hidden font-mono"
    >
      {/* Looping Atmospheric Background Video */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <video
          src="/script_bg/prologue.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40 brightness-40 contrast-125 scale-105"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      {mode === "start" ? (
        /* INITIAL START SCREEN (MOBILE & DESKTOP RESPONSIVE) */
        <div className="w-full max-w-md p-4 sm:p-6 relative z-10 flex flex-col items-center text-center gap-5 sm:gap-6 animate-rise-up">
          <div>
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-wider text-white">
              FILE UNDER MYSTERY
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-400 font-mono tracking-widest uppercase mt-1">
              {TRAILER_CONFIG.mainEvent.clubName} // Forensic Terminal
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-[11px] sm:text-xs text-slate-300 font-mono max-w-md leading-relaxed">
            A classified signal has breached the campus network. Reconstruct the opening evidence and unlock the Blackbox protocol.
          </div>

          <button
            onClick={handleStart}
            className="w-full py-3.5 sm:py-4 bg-white hover:bg-slate-200 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-2xl transition-all shadow-[0_0_35px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 cursor-pointer group"
          >
            <Shield size={16} />
            <span>START INVESTIGATION</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      ) : (
        /* CINEMATIC PROLOGUE READER (MOBILE & DESKTOP RESPONSIVE) */
        <div className="w-full max-w-6xl h-full max-h-screen flex flex-col justify-between py-4 sm:py-6 px-3 sm:px-6 animate-rise-up relative z-10 box-border">
          {/* Top Header & Audio Toggle */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5 sm:pb-3 shrink-0">
            <div>
              <h2 className="text-xs sm:text-base font-bold tracking-wider text-white">FILE UNDER MYSTERY</h2>
              <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                {TRAILER_CONFIG.mainEvent.clubName} // Prologue
              </p>
            </div>

            <button
              onClick={() => {
                if (voiceEnabled && audioRef.current) audioRef.current.pause();
                setVoiceEnabled(!voiceEnabled);
              }}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-black/60 border border-white/10 hover:bg-white/15 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-mono cursor-pointer backdrop-blur"
            >
              {voiceEnabled ? <Volume2 size={15} className="text-white" /> : <VolumeX size={15} className="text-slate-500" />}
              <span className="hidden sm:inline">{voiceEnabled ? "Voice: ON" : "Voice: OFF"}</span>
            </button>
          </div>

          {/* CINEMATIC SUBTITLES VIEWPORT */}
          <div className="flex-1 relative flex items-center justify-center overflow-hidden my-auto w-full px-2">
            <div className="w-full flex flex-col items-center justify-center relative">
              {storyLines.map((line, idx) => {
                const isCurrent = idx === activeLineIdx;
                const isNext = idx === activeLineIdx + 1;

                if (idx > activeLineIdx + 1) return null;

                return (
                  <div
                    key={idx}
                    className="text-center font-mono transition-all duration-500 ease-out absolute w-full px-2 sm:px-6 max-w-5xl"
                    style={{
                      transform: isCurrent
                        ? "translateY(0px) scale(1)"
                        : isNext
                        ? "translateY(65px) scale(0.92)"
                        : "translateY(-65px) scale(0.92)",
                      opacity: isCurrent ? 1 : isNext ? 0.35 : 0,
                      filter: isCurrent ? "blur(0px)" : isNext ? "blur(4px)" : "blur(8px)",
                      color: isCurrent ? "#FFFFFF" : isNext ? "#94A3B8" : "#475569",
                      fontWeight: isCurrent ? 700 : 400,
                      fontSize: isCurrent ? "clamp(16px, 4vw, 28px)" : "clamp(13px, 3vw, 20px)",
                      lineHeight: "1.45",
                      textShadow: isCurrent ? "0 0 25px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.9)" : "none",
                      pointerEvents: "none"
                    }}
                  >
                    "{line}"
                  </div>
                );
              })}
            </div>
          </div>

          {/* BOTTOM CONTROLS */}
          <div className="flex items-center justify-between gap-2 border-t border-white/10 pt-3 font-mono text-xs shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-3">
              <button
                onClick={handlePrevLine}
                disabled={activeLineIdx === 0}
                className="p-2 sm:p-2.5 rounded-xl bg-black/60 border border-white/10 hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none text-white transition-all cursor-pointer backdrop-blur"
                title="Previous Line"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                onClick={togglePlay}
                className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white text-black font-bold flex items-center gap-1.5 hover:bg-slate-200 transition-all cursor-pointer shadow-xl text-xs"
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                <span>{isPlaying ? "Pause" : "Play"}</span>
              </button>

              <button
                onClick={handleNextLine}
                className="p-2 sm:p-2.5 rounded-xl bg-black/60 border border-white/10 hover:bg-white/15 text-white transition-all cursor-pointer backdrop-blur"
                title="Next Line"
              >
                <ChevronRight size={16} />
              </button>

              <span className="text-slate-400 text-[10px] sm:text-[11px] ml-1 bg-black/40 px-2 py-1 rounded-lg border border-white/5 whitespace-nowrap">
                {activeLineIdx + 1} / {storyLines.length}
              </span>
            </div>

            <button
              onClick={handleEnterLab}
              className="px-3.5 sm:px-6 py-2 sm:py-2.5 bg-white hover:bg-slate-200 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_25px_rgba(255,255,255,0.25)] text-[11px] sm:text-xs whitespace-nowrap"
            >
              <Shield size={14} />
              <span className="hidden sm:inline">ENTER INVESTIGATION LAB &rarr;</span>
              <span className="sm:hidden">ENTER LAB &rarr;</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
