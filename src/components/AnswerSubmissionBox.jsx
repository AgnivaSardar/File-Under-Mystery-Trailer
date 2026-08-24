import React, { useState } from "react";
import { Terminal, CheckCircle2, AlertCircle, ArrowRight, FastForward } from "lucide-react";
import { useGameStore } from "../store/useGameStore.js";

export default function AnswerSubmissionBox({ levelConfig, onSolveSuccess }) {
  const [inputVal, setInputVal] = useState("");
  const [status, setStatus] = useState("idle"); // 'idle' | 'checking' | 'correct' | 'wrong'
  const [feedback, setFeedback] = useState("");

  const { isLevelSolved, markLevelSolved } = useGameStore();
  const isSolved = isLevelSolved(levelConfig.id);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim() || isSolved) return;

    setStatus("checking");

    setTimeout(() => {
      const cleanInput = inputVal.trim().toUpperCase().replace(/[\s-_]/g, "");
      const cleanExpected = (levelConfig.correctAnswer || "").toUpperCase().replace(/[\s-_]/g, "");

      if (cleanInput === cleanExpected) {
        setStatus("correct");
        setFeedback("VERIFICATION SUCCESSFUL // ANOMALY RESOLVED");
        markLevelSolved(levelConfig.id, 10);
      } else {
        setStatus("wrong");
        setFeedback("INCORRECT TELEMETRY FLAG. RE-ANALYZE THE EVIDENCE.");
        setTimeout(() => {
          setStatus("idle");
        }, 2500);
      }
    }, 400);
  };

  const handleSkip = () => {
    markLevelSolved(levelConfig.id, 0);
    onSolveSuccess();
  };

  return (
    <div className="w-full bg-black border border-white/20 rounded-2xl p-3.5 sm:p-4 font-mono text-xs shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2 text-slate-300 font-bold">
          <Terminal size={14} className="text-white" />
          <span className="tracking-wider text-[11px] sm:text-xs">ANOMALY VERIFICATION TERMINAL</span>
        </div>
        {isSolved && (
          <span className="flex items-center gap-1 text-emerald-400 font-bold text-[10px] sm:text-[11px]">
            <CheckCircle2 size={13} />
            STATUS: RESOLVED (+10 PTS)
          </span>
        )}
      </div>

      {isSolved ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white/5 border border-white/20 rounded-xl">
          <div className="flex items-center gap-2 text-white w-full sm:w-auto">
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-xs">FLAG VERIFIED: <code className="text-emerald-300 font-mono">{levelConfig.correctAnswer}</code></div>
              <div className="text-[10px] sm:text-[11px] text-slate-400 italic font-mono mt-0.5">"{levelConfig.notebookFragment}"</div>
            </div>
          </div>
          <button
            onClick={onSolveSuccess}
            className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-slate-200 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.2)] shrink-0 text-xs"
          >
            <span>{levelConfig.id === "level2" ? "Access Uplink Intercept" : "Proceed to Level 02"}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="ENTER 5-CHARACTER DECRYPTED CODE..."
                disabled={status === "checking"}
                className="w-full bg-black border border-white/20 focus:border-white rounded-xl px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none uppercase font-mono transition-all text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={status === "checking" || !inputVal.trim()}
              className="w-full sm:w-auto px-6 py-2.5 bg-white hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md text-xs whitespace-nowrap"
            >
              <span>{status === "checking" ? "VERIFYING..." : "SUBMIT FLAG"}</span>
            </button>
          </form>

          {/* Under Submit: Clean, Non-wrapping Full/Flex Skip Level Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2.5 border-t border-white/10">
            <span className="text-[11px] text-slate-400 font-mono text-center sm:text-left">
              Want to skip ahead in this trailer?
            </span>
            <button
              type="button"
              onClick={handleSkip}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all flex items-center justify-center gap-2 text-xs font-mono cursor-pointer whitespace-nowrap shrink-0 shadow"
            >
              <FastForward size={13} className="text-cyan-400" />
              <span className="whitespace-nowrap">Skip Level &rarr;</span>
            </button>
          </div>
        </div>
      )}

      {status === "wrong" && (
        <div className="mt-2.5 flex items-center gap-2 text-rose-400 text-[11px] animate-fade-in font-bold">
          <AlertCircle size={13} />
          <span>{feedback}</span>
        </div>
      )}
    </div>
  );
}
