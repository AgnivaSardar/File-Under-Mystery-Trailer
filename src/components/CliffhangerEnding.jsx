import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Radio, 
  ExternalLink, 
  Share2, 
  Copy, 
  Check, 
  Calendar, 
  Clock, 
  MapPin, 
  ListOrdered,
  AlertTriangle
} from "lucide-react";
import { TRAILER_CONFIG } from "../config/trailerConfig.js";
import { useGameStore } from "../store/useGameStore.js";

export default function CliffhangerEnding() {
  const navigate = useNavigate();
  const { isLevelSolved } = useGameStore();
  const [copied, setCopied] = useState(false);

  // Route Guard / Anti-Bypass:
  useEffect(() => {
    if (!isLevelSolved("level1")) {
      navigate("/investigate/level1", { replace: true });
    } else if (!isLevelSolved("level2")) {
      navigate("/investigate/level2", { replace: true });
    }
  }, [isLevelSolved, navigate]);

  const config = TRAILER_CONFIG;
  const event = config.mainEvent;
  const cliffhanger = config.cliffhanger;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(event.registrationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = () => {
    const text = `We solved the opening anomalies for File Under Mystery. Register on TechnoVIT here: ${event.registrationUrl}`;
    if (navigator.share) {
      navigator.share({
        title: "File Under Mystery - The Marrow Protocol",
        text: text,
        url: event.registrationUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="w-full min-h-full flex flex-col items-center justify-start py-8 sm:py-10 px-3 sm:px-4 select-none relative z-10 animate-fade-in font-mono box-border"
    >
      <div className="w-full max-w-5xl flex flex-col items-center gap-6">
        {/* 1. TOP INTERRUPTED TRANSMISSION ALERT */}
        <div className="w-full flex flex-col items-center text-center gap-2 mb-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/80 border border-rose-500/50 text-rose-400 text-xs font-bold tracking-widest uppercase animate-pulse">
            <AlertTriangle size={14} />
            <span>{cliffhanger.badge}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wider text-glow mt-1">
            {cliffhanger.headline}
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl font-sans">
            You have deciphered both opening forensic anomalies. The full investigation awaits in the main event.
          </p>
        </div>

        {/* 2. DR. MARROW'S DECRYPTED RADIO CLUSTER */}
        <div className="w-full bg-black/90 border border-white/20 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Radio size={140} />
          </div>

          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Radio size={15} className="text-cyan-400 animate-pulse" />
              <span className="text-white font-bold tracking-wider text-[11px] sm:text-xs">RECOVERED SIGNAL // AIR-GAPPED SSD INTERCEPT</span>
            </div>
            <span className="text-emerald-400 font-bold text-[10px] sm:text-xs">2/2 CODES DECRYPTED</span>
          </div>

          <div className="flex flex-col gap-2.5 text-xs sm:text-sm text-slate-200 leading-relaxed font-mono">
            {cliffhanger.interruptedTransmission.map((line, idx) => (
              <p key={idx} className={idx === 2 || idx === 3 ? "text-white font-bold" : "text-slate-300"}>
                {line}
              </p>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center text-xs text-slate-400">
            <span className="text-cyan-300 italic text-[11px] sm:text-xs">{cliffhanger.marrowSignature}</span>
            <span className="text-[10px] uppercase font-bold text-slate-500">// UPLINK SEVERED</span>
          </div>
        </div>

        {/* 3. MAIN EVENT REGISTRATION & TECHNOVIT PORTAL CARD */}
        <div className="w-full bg-gradient-to-b from-white/10 via-black to-black border-2 border-white/30 rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(255,255,255,0.15)] flex flex-col gap-5 relative overflow-hidden mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-1">
                THE MAIN EVENT IS CALLING
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                {event.title}
              </h2>
              <p className="text-xs text-slate-300 font-sans mt-1">
                {event.subtitle}
              </p>
            </div>

            {/* CLICK HERE TO REGISTER BUTTON */}
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 sm:py-4 bg-white hover:bg-slate-200 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-2xl transition-all shadow-[0_0_30px_rgba(255,255,255,0.35)] flex items-center justify-center gap-2 group cursor-pointer shrink-0"
            >
              <span>CLICK HERE TO REGISTER</span>
              <ExternalLink size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Event Schedule Grid (3-Column Layout: Date, Timings, Venue) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-black/60 border border-white/10 rounded-xl flex items-center gap-3">
              <Calendar size={18} className="text-white shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Date</div>
                <div className="text-xs font-bold text-white">{event.eventDate}</div>
              </div>
            </div>

            <div className="p-3 bg-black/60 border border-white/10 rounded-xl flex items-center gap-3">
              <Clock size={18} className="text-white shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Timings</div>
                <div className="text-xs font-bold text-white">{event.eventTime}</div>
              </div>
            </div>

            <div className="p-3 bg-black/60 border border-white/10 rounded-xl flex items-center gap-3">
              <MapPin size={18} className="text-white shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Venue</div>
                <div className="text-xs font-bold text-white">{event.venue}</div>
              </div>
            </div>
          </div>

          {/* STEP-BY-STEP REGISTRATION GUIDE FOR TECHNOVIT */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <ListOrdered size={16} className="text-cyan-400" />
              <span>HOW TO REGISTER ON TECHNOVIT:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {(event.registrationSteps || []).map((step, idx) => (
                <div key={idx} className="p-3 bg-black/50 border border-white/10 rounded-xl flex flex-col gap-1">
                  <div className="text-[10px] font-bold text-cyan-400">STEP {step.step}</div>
                  <div className="font-bold text-white text-[11px]">{step.title}</div>
                  <p className="text-[10px] text-slate-400 font-sans leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {cliffhanger.marketingHighlights.map((item, idx) => (
              <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col gap-1">
                <div className="font-bold text-xs text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  {item.label}
                </div>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Action Bottom Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-black hover:bg-white/15 border border-white/20 text-slate-200 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all text-xs"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? "Portal Link Copied!" : "Copy TechnoVIT Link"}</span>
              </button>

              <button
                onClick={handleShare}
                className="px-4 py-2 bg-black hover:bg-white/15 border border-white/20 text-slate-200 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all text-xs"
              >
                <Share2 size={14} />
                <span>Share With Teammates</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="text-slate-400 hover:text-white underline underline-offset-4 cursor-pointer text-xs"
              >
                Replay Investigation &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
