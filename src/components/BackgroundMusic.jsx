import React, { useState, useEffect, useRef } from "react";
import { Music, VolumeX, Volume2 } from "lucide-react";

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStartedOnce, setHasStartedOnce] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Initialize audio element with 15% volume (subtle, non-distracting background level)
    const audio = new Audio("/audio/bgm.mp3");
    audio.loop = true;
    audio.volume = 0.15; // Controlled background volume
    audioRef.current = audio;

    // Autoplay on first user interaction anywhere on the document (browser autoplay policy compliant)
    const handleFirstInteraction = () => {
      if (!hasStartedOnce && audioRef.current) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setHasStartedOnce(true);
          })
          .catch(() => {});
      }
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };

    window.addEventListener("click", handleFirstInteraction, { once: true });
    window.addEventListener("keydown", handleFirstInteraction, { once: true });
    window.addEventListener("touchstart", handleFirstInteraction, { once: true });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, []);

  const toggleBgm = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasStartedOnce(true);
        })
        .catch(() => {});
    }
  };

  return (
    <div className="fixed bottom-3 left-3 sm:bottom-4 sm:left-4 z-50 select-none font-mono">
      <button
        onClick={toggleBgm}
        className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl backdrop-blur-md border transition-all flex items-center gap-2 text-[11px] sm:text-xs font-bold cursor-pointer shadow-2xl active:scale-95 ${
          isPlaying
            ? "bg-black/80 border-cyan-500/40 text-cyan-300 hover:bg-black/95 hover:border-cyan-400"
            : "bg-black/80 border-white/15 text-slate-400 hover:text-slate-200 hover:border-white/30"
        }`}
        title={isPlaying ? "Mute Background Music" : "Play Background Music"}
      >
        {isPlaying ? (
          <>
            <div className="flex items-end gap-0.5 h-3.5 w-3.5 pb-0.5">
              <span className="w-0.5 bg-cyan-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-full" />
              <span className="w-0.5 bg-cyan-400 rounded-full animate-[pulse_1.1s_ease-in-out_infinite] h-2/3" />
              <span className="w-0.5 bg-cyan-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-4/5" />
            </div>
            <span>BGM: ON</span>
          </>
        ) : (
          <>
            <VolumeX size={14} className="text-slate-500" />
            <span>BGM: OFF</span>
          </>
        )}
      </button>
    </div>
  );
}
