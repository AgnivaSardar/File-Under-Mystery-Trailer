import React from "react";
import { Briefcase, X, FileText, CheckCircle2, Lock } from "lucide-react";
import { TRAILER_CONFIG } from "../config/trailerConfig.js";
import { useGameStore } from "../store/useGameStore.js";

export default function EvidenceVaultModal({ onClose, currentLevelId }) {
  const { isLevelSolved } = useGameStore();

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-black border border-white/20 rounded-2xl max-w-2xl w-full p-6 font-mono text-xs shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Briefcase size={18} />
            <span>CASE EVIDENCE VAULT // ACTIVE DOSSIER</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
          {Object.values(TRAILER_CONFIG.levels).map((lvl, idx) => {
            const solved = isLevelSolved(lvl.id);
            const isCurrent = lvl.id === currentLevelId;

            return (
              <div
                key={lvl.id}
                className={`p-4 rounded-xl border flex flex-col gap-2 transition-all ${
                  solved
                    ? "bg-white/10 border-white/30 text-white"
                    : isCurrent
                    ? "bg-white/5 border-white/40 text-slate-200"
                    : "bg-black/50 border-white/10 text-slate-500"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase">EVIDENCE #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                  {solved ? (
                    <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-bold">
                      <CheckCircle2 size={12} /> VERIFIED
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-slate-500 text-[10px]">
                      <Lock size={12} /> LOCKED
                    </span>
                  )}
                </div>

                <div className="font-bold text-slate-200">{lvl.title}</div>
                <div className="text-[10px] text-slate-400 font-mono">Format: {lvl.evidenceType.toUpperCase()}</div>

                {solved && (
                  <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-cyan-300">
                    Recovered Key: <code className="font-bold">{lvl.correctAnswer}</code>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-[11px] text-slate-400 leading-relaxed">
          The main event contains 12 complete forensic evidence items spanning steganography, cellular automata, Fourier transforms, and network packet dumps.
        </div>
      </div>
    </div>
  );
}
