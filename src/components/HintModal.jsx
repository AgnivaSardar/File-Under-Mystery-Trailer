import React from "react";
import { HelpCircle, X } from "lucide-react";
import { useGameStore } from "../store/useGameStore.js";

export default function HintModal({ config, onClose }) {
  const { isHintRevealed, revealHint } = useGameStore();

  return (
    <div 
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="bg-black border border-white/20 rounded-2xl max-w-lg w-full p-4 sm:p-6 font-mono text-xs shadow-2xl flex flex-col gap-4 max-h-[85vh] relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with high-contrast, prominent touch close button */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 shrink-0 gap-3">
          <div className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm min-w-0 flex-1">
            <HelpCircle size={16} className="shrink-0 text-cyan-400" />
            <span className="truncate">HINTS // {config.id.toUpperCase()}</span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/25 active:bg-white/30 text-white border border-white/20 transition-all cursor-pointer shrink-0 flex items-center justify-center shadow-md touch-manipulation"
          >
            <X size={18} className="text-white" />
          </button>
        </div>

        <div className="flex flex-col gap-3 py-1 overflow-y-auto pr-1">
          {(config.hints || []).map((h, i) => {
            const revealed = isHintRevealed(config.id, i);
            return (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-white/10 bg-white/5 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-300">HINT 0{i + 1}</span>
                  {!revealed && (
                    <button
                      onClick={() => revealHint(config.id, i, h.cost || 3)}
                      className="px-2.5 py-1 bg-white text-black font-bold rounded-lg hover:bg-slate-200 cursor-pointer transition-all text-[11px] shrink-0"
                    >
                      Unlock (-{h.cost || 3} pts)
                    </button>
                  )}
                </div>
                {revealed ? (
                  <p className="text-white leading-relaxed text-xs">{h.text}</p>
                ) : (
                  <p className="text-slate-500 italic text-[11px]">
                    Hint locked. Consumes {h.cost || 3} points from investigation score.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
