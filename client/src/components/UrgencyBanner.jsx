import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCountdown } from '../utils/useCountdown';
import { Zap, Clock, ArrowRight } from 'lucide-react';

export default function UrgencyBanner() {
  const { hasLifetimeAccess, isAuthenticated } = useAuth();
  const { formatted } = useCountdown();

  // Hide the banner if the user already has lifetime access
  if (hasLifetimeAccess) return null;

  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-red-200/70 text-slate-800 font-medium text-xs sm:text-sm py-2 px-3 sm:px-4 shadow-[0_2px_12px_rgba(239,68,68,0.06)] relative z-30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 font-medium leading-tight">
          <span className="flex h-2.5 w-2.5 relative flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
          </span>
          <span className="inline-flex items-center space-x-1">
            <span className="font-extrabold tracking-tight uppercase text-[10px] sm:text-xs bg-red-50 text-red-600 border border-red-200 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
              <Zap className="w-3.5 h-3.5 text-red-600 fill-red-100 inline flex-shrink-0" />
              Limited Offer:
            </span>
          </span>
          <span className="text-slate-700 flex items-center flex-wrap gap-1">
            <span>Get lifetime access for</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-amber-100 text-amber-950 font-black border border-amber-300 text-xs sm:text-sm shadow-xs">
              ₹20
            </span>
            <span>before deadline price jumps to</span>
            <span className="line-through font-bold text-slate-400">₹100</span>!
          </span>
        </div>

        <div className="flex items-center justify-center space-x-2 sm:space-x-3 w-full sm:w-auto">
          <div className="flex items-center space-x-1.5 bg-red-50 border border-red-200/80 text-red-700 px-2.5 py-1 rounded-xl font-mono font-bold text-xs shadow-xs">
            <Clock className="w-3.5 h-3.5 text-red-500 animate-pulse flex-shrink-0" />
            <span>{formatted}</span>
          </div>
          <Link
            to={isAuthenticated ? '/checkout' : '/register'}
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition inline-flex items-center space-x-1 shadow-[0_4px_12px_rgba(16,185,129,0.3)] whitespace-nowrap min-h-[32px]"
          >
            <span>Unlock Lifetime</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
