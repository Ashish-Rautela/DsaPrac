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
    <div className="bg-red-600 text-white font-medium text-xs sm:text-sm py-2.5 px-3 sm:px-4 shadow-md relative z-30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 font-medium leading-tight">
          <span className="flex h-2.5 w-2.5 relative flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
          <span className="inline-flex items-center space-x-1">
            <span className="font-extrabold tracking-tight uppercase text-[10px] sm:text-xs bg-white text-red-600 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
              <Zap className="w-3.5 h-3.5 text-red-600 fill-red-600 inline flex-shrink-0" />
              LIMITED OFFER:
            </span>
          </span>
          <span className="text-white flex items-center flex-wrap gap-1 font-semibold">
            <span>Get lifetime access for</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-xs mx-0.5">
              ₹20
            </span>
            <span>before deadline price jumps to</span>
            <span className="line-through font-bold text-red-200">₹100</span>!
          </span>
        </div>

        <div className="flex items-center justify-center space-x-2 sm:space-x-3 w-full sm:w-auto">
          <div className="flex items-center space-x-1.5 bg-red-950/50 border border-red-400/40 text-amber-300 px-2.5 py-1 rounded-xl font-mono font-bold text-xs shadow-inner">
            <Clock className="w-3.5 h-3.5 text-amber-300 animate-pulse flex-shrink-0" />
            <span>{formatted}</span>
          </div>
          <Link
            to={isAuthenticated ? '/checkout' : '/register'}
            className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-extrabold text-xs px-4 py-1.5 rounded-xl transition inline-flex items-center space-x-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.25)] whitespace-nowrap min-h-[32px]"
          >
            <span>Unlock Lifetime</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
