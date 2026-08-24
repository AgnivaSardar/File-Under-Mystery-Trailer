import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HelpCircle, Briefcase, Volume2, VolumeX, ChevronLeft, ChevronRight, Pause, Play, Trophy, Radio } from "lucide-react";
import AnswerSubmissionBox from "../components/AnswerSubmissionBox.jsx";
import EvidenceVaultModal from "../components/EvidenceVaultModal.jsx";
import HintModal from "../components/HintModal.jsx";
import ImageCanvas from "./renderers/ImageCanvas.jsx";
import AudioLab from "./renderers/AudioLab.jsx";
import { TRAILER_CONFIG } from "../config/trailerConfig.js";
import { useGameStore } from "../store/useGameStore.js";

export default function LabEngine() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { isLevelSolved, getScore } = useGameStore();
  const liveScore = getScore();

  // Route Guard / Anti-Bypass:
  useEffect(() => {
    if (levelId === "level2" && !isLevelSolved("level1")) {
      navigate("/investigate/level1", { replace: true });
      return;
    }
    if (levelId !== "level1" && levelId !== "level2") {
      navigate("/investigate/level1", { replace: true });
      return;
    }
  }, [levelId, isLevelSolved, navigate]);

  const config = TRAILER_CONFIG.levels[levelId] || TRAILER_CONFIG.levels.level1;

  const [viewMode, setViewMode] = useState("briefing"); // 'briefing' | 'workbench'
  const [showVaultModal, setShowVaultModal] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);

  // Synchronized Briefing State
  const [activeLineIdx, setActiveLineIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const audioRef = useRef(null);

  const storyLines = config.storyBriefing || [
    "Forensic artifact decrypted.",
    "Inspect raw evidence data in the workbench."
  ];

  // Background video path for this level
  const bgVideoSrc = `/script_bg/${config.id}_bg.mp4`;

  useEffect(() => {
    setViewMode("briefing");
    setActiveLineIdx(0);
    setIsPlaying(true);
  }, [levelId]);

  // Autoplay Studio Briefing MP3 and advance on end
  const playStudioBriefingAudio = (lvlId, idx) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (!voiceEnabled) return;

    const audioUrl = `/audio/briefing_${lvlId}_${idx}.mp3`;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.onended = () => {
      if (idx < storyLines.length - 1) {
        setActiveLineIdx(idx + 1);
      } else {
        setIsPlaying(false);
        setTimeout(() => {
          setViewMode("workbench");
        }, 300);
      }
    };

    audio.onerror = () => {
      setTimeout(() => {
        if (idx < storyLines.length - 1) {
          setActiveLineIdx(idx + 1);
        } else {
          setIsPlaying(false);
          setViewMode("workbench");
        }
      }, 4000);
    };

    audio.play().catch(() => {
      setTimeout(() => {
        if (idx < storyLines.length - 1) {
          setActiveLineIdx(idx + 1);
        } else {
          setIsPlaying(false);
          setViewMode("workbench");
        }
      }, 4000);
    });
  };

  useEffect(() => {
    if (viewMode === "briefing" && isPlaying) {
      playStudioBriefingAudio(config.id, activeLineIdx);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [viewMode, activeLineIdx, isPlaying, voiceEnabled, config.id]);

  const handleNextLevel = () => {
    if (audioRef.current) audioRef.current.pause();
    if (config.nextLevelId === "cliffhanger") {
      navigate("/cliffhanger");
    } else if (config.nextLevelId) {
      navigate(`/investigate/${config.nextLevelId}`);
    }
  };

  const handleReplayBriefing = () => {
    if (audioRef.current) audioRef.current.pause();
    setActiveLineIdx(0);
    setIsPlaying(true);
    setViewMode("briefing");
  };

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="fixed inset-0 h-screen w-screen bg-black text-white flex flex-col font-mono select-none overflow-hidden"
    >
      {/* Background Video Layer */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <video
          key={bgVideoSrc}
          src={bgVideoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40 filter brightness-45 saturate-80"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
      </div>

      {/* TOP STATUS BAR HUD (MOBILE OPTIMIZED) */}
      <div className="h-12 border-b border-white/10 px-3 sm:px-5 flex items-center justify-between text-xs font-mono bg-black/80 backdrop-blur-md relative z-20 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-white/10 border border-white/20 text-white font-bold tracking-wider text-[11px] sm:text-xs">
            <Trophy size={13} className="text-white" />
            <span>{liveScore} PTS</span>
          </div>

          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-400 uppercase tracking-widest text-[10px] sm:text-[11px]">
            // {config.id.toUpperCase()}
          </span>
        </div>

        {/* Top-Right Quick Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {viewMode === "briefing" ? (
            <button
              onClick={() => {
                if (voiceEnabled && audioRef.current) audioRef.current.pause();
                setVoiceEnabled(!voiceEnabled);
              }}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-black/60 border border-white/10 hover:bg-white/15 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-mono cursor-pointer backdrop-blur"
              title="Toggle Voice Narration"
            >
              {voiceEnabled ? <Volume2 size={14} className="text-white" /> : <VolumeX size={14} className="text-slate-500" />}
              <span className="hidden sm:inline">{voiceEnabled ? "Voice: ON" : "Voice: OFF"}</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleReplayBriefing}
                className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-black/60 hover:bg-white/15 border border-white/20 text-slate-200 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur shadow-md text-xs font-bold"
                title="Re-play pre-level briefing narration"
              >
                <Radio size={13} className="text-white animate-pulse" />
                <span className="hidden md:inline">BRIEFING</span>
              </button>

              <button
                onClick={() => setShowVaultModal(true)}
                className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-black/60 hover:bg-white/15 border border-white/15 text-slate-200 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur text-xs"
                title="Open Case Vault"
              >
                <Briefcase size={14} />
                <span className="hidden sm:inline">VAULT</span>
              </button>

              <button
                onClick={() => setShowHintModal(true)}
                className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-black/60 hover:bg-white/15 border border-white/15 text-slate-200 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur text-xs"
                title="View Hints"
              >
                <HelpCircle size={14} />
                <span className="hidden sm:inline">HINTS ({(config.hints || []).length})</span>
                <span className="sm:hidden">({(config.hints || []).length})</span>
              </button>
            </>
          )}
        </div>
      </div>

      {viewMode === "briefing" ? (
        /* 1. CINEMATIC STORY BRIEFING */
        <div className="w-full h-[calc(100vh-3rem)] flex flex-col justify-between p-3 sm:p-6 relative z-10 overflow-hidden box-border">
          {/* Centered Floating Subtitles */}
          <div className="flex-1 flex items-center justify-center relative w-full overflow-hidden px-2">
            <div className="w-full flex flex-col items-center justify-center relative max-w-5xl">
              {storyLines.map((line, idx) => {
                const isCurrent = idx === activeLineIdx;
                const isNext = idx === activeLineIdx + 1;

                if (idx > activeLineIdx + 1) return null;

                return (
                  <div
                    key={idx}
                    className="text-center font-mono transition-all duration-500 ease-out absolute w-full px-2 sm:px-4"
                    style={{
                      transform: isCurrent
                        ? "translateY(0px) scale(1)"
                        : isNext
                        ? "translateY(55px) scale(0.92)"
                        : "translateY(-55px) scale(0.92)",
                      opacity: isCurrent ? 1 : isNext ? 0.35 : 0,
                      filter: isCurrent ? "blur(0px)" : isNext ? "blur(4px)" : "blur(8px)",
                      color: isCurrent ? "#FFFFFF" : isNext ? "#94A3B8" : "#475569",
                      fontWeight: isCurrent ? 700 : 400,
                      fontSize: isCurrent ? "clamp(16px, 4vw, 26px)" : "clamp(13px, 3vw, 18px)",
                      lineHeight: "1.45",
                      textShadow: isCurrent ? "0 0 25px rgba(0,0,0,0.95), 0 2px 10px rgba(0,0,0,0.9)" : "none",
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
          <div className="flex items-center justify-between border-t border-white/10 pt-3 font-mono text-xs px-1 sm:px-2 shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <button
                onClick={() => {
                  if (audioRef.current) audioRef.current.pause();
                  setActiveLineIdx((prev) => Math.max(0, prev - 1));
                }}
                disabled={activeLineIdx === 0}
                className="p-2 rounded-xl bg-black/60 border border-white/10 hover:bg-white/15 disabled:opacity-30 text-white transition-all cursor-pointer backdrop-blur"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                onClick={() => {
                  if (isPlaying) {
                    if (audioRef.current) audioRef.current.pause();
                    setIsPlaying(false);
                  } else {
                    setIsPlaying(true);
                    if (audioRef.current) audioRef.current.play();
                    else playStudioBriefingAudio(config.id, activeLineIdx);
                  }
                }}
                className="p-2 rounded-xl bg-white text-black font-bold hover:bg-slate-200 transition-all cursor-pointer"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>

              <button
                onClick={() => {
                  if (audioRef.current) audioRef.current.pause();
                  if (activeLineIdx < storyLines.length - 1) {
                    setActiveLineIdx((prev) => prev + 1);
                  } else {
                    setIsPlaying(false);
                    setViewMode("workbench");
                  }
                }}
                className="p-2 rounded-xl bg-black/60 border border-white/10 hover:bg-white/15 text-white transition-all cursor-pointer backdrop-blur"
              >
                <ChevronRight size={16} />
              </button>

              <span className="text-slate-400 text-[10px] sm:text-xs ml-1 font-mono whitespace-nowrap">
                {activeLineIdx + 1} / {storyLines.length}
              </span>
            </div>

            <button
              onClick={() => {
                if (audioRef.current) audioRef.current.pause();
                setIsPlaying(false);
                setViewMode("workbench");
              }}
              className="px-3.5 sm:px-5 py-2 bg-white hover:bg-slate-200 text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer text-[11px] sm:text-xs whitespace-nowrap"
            >
              Skip &rarr;
            </button>
          </div>
        </div>
      ) : (
        /* 2. FORENSIC WORKBENCH */
        <div className="flex-1 flex flex-col justify-between overflow-y-auto px-3 sm:px-6 py-2 sm:py-3 animate-fade-in relative z-10 w-full">
          <div className="flex-1 flex items-center justify-center py-1 max-w-6xl mx-auto w-full">
            {config.id === "level1" && <ImageCanvas config={config} />}
            {config.id === "level2" && <AudioLab config={config} />}
          </div>

          {/* VERIFICATION TERMINAL DOCK */}
          <div className="max-w-4xl mx-auto w-full pt-1">
            <AnswerSubmissionBox
              levelConfig={config}
              onSolveSuccess={handleNextLevel}
            />
          </div>
        </div>
      )}

      {/* Case Vault Modal */}
      {showVaultModal && (
        <EvidenceVaultModal
          onClose={() => setShowVaultModal(false)}
          currentLevelId={config.id}
        />
      )}

      {/* Hint Modal */}
      {showHintModal && (
        <HintModal
          config={config}
          onClose={() => setShowHintModal(false)}
        />
      )}
    </div>
  );
}
