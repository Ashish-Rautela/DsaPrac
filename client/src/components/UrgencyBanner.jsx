import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCountdown } from '../utils/useCountdown';
import { Flame, ArrowRight } from 'lucide-react';

export default function UrgencyBanner() {
  const { hasLifetimeAccess, isAuthenticated } = useAuth();
  const { hours, minutes, seconds } = useCountdown();

  // Hide the banner if the user already has lifetime access
  if (hasLifetimeAccess) return null;

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="bg-red-600 text-white text-xs sm:text-sm py-2 px-3 sm:px-4 shadow-md border-b border-red-700/80 relative z-30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 text-center md:text-left">
        {/* Urgency message with loss aversion & scarcity */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 font-medium leading-tight">
          {/* Pulsing Flash Sale Badge */}
          <span className="inline-flex items-center gap-1.5 bg-yellow-400 text-slate-950 font-black text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm animate-pulse flex-shrink-0">
            <Flame className="w-3.5 h-3.5 text-red-600 fill-red-600" />
            <span>Flash Sale Ending</span>
          </span>

          {/* Scarcity chip */}
          <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-black bg-red-950/60 border border-red-400/40 text-amber-200 px-2.5 py-0.5 rounded-full shadow-inner flex-shrink-0">
            <span className="flex h-1.5 w-1.5 relative flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-90"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400"></span>
            </span>
            <span>Only 4 spots left at ₹20!</span>
          </span>

          {/* Loss Aversion Headline */}
          <span className="text-white flex items-center flex-wrap justify-center md:justify-start gap-1 font-bold">
            <span>Price jumps to</span>
            <span className="line-through font-extrabold text-red-200 decoration-2">₹100</span>
            <span className="text-yellow-300 font-black">forever</span>
            <span>when timer ends. Get Lifetime Access for</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-yellow-300 text-slate-950 font-black text-xs sm:text-sm shadow-xs border border-yellow-400 mx-0.5">
              ₹20
            </span>
          </span>
        </div>

        {/* Ticking Digital Bomb Clock + High Urgency Action Button */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-shrink-0 w-full md:w-auto">
          {/* Digital Timer */}
          <div className="flex items-center gap-1 bg-black/60 border border-white/20 px-2 sm:px-2.5 py-1 rounded-xl shadow-inner font-mono text-xs sm:text-sm">
            <span className="text-[10px] text-yellow-300/90 font-sans font-black uppercase tracking-wider hidden sm:inline mr-1">
              Expires In:
            </span>
            <div className="flex items-center space-x-0.5 font-bold">
              <span className="bg-slate-950 text-amber-300 px-1.5 py-0.5 rounded font-black border border-amber-400/30">
                {pad(hours)}
              </span>
              <span className="text-amber-300 font-black animate-pulse">:</span>
              <span className="bg-slate-950 text-amber-300 px-1.5 py-0.5 rounded font-black border border-amber-400/30">
                {pad(minutes)}
              </span>
              <span className="text-amber-300 font-black animate-pulse">:</span>
              <span className="bg-slate-950 text-amber-300 px-1.5 py-0.5 rounded font-black border border-amber-400/30">
                {pad(seconds)}
              </span>
            </div>
          </div>

          {/* Glowing High-Conversion CTA */}
          <Link
            to={isAuthenticated ? '/checkout' : '/register'}
            className="group relative inline-flex items-center space-x-1.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black text-xs sm:text-sm px-3.5 sm:px-4 py-1.5 rounded-xl transition shadow-[0_0_15px_rgba(16,185,129,0.55)] ring-2 ring-emerald-300/80 whitespace-nowrap min-h-[32px]"
          >
            <span>Lock In ₹20 Now</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
