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
    <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 text-slate-950 font-medium text-xs sm:text-sm py-2 px-3 sm:px-4 shadow-sm relative z-30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 font-semibold leading-tight">
          <span className="flex h-2 w-2 relative flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950"></span>
          </span>
          <span className="inline-flex items-center space-x-1">
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-slate-950 text-slate-950 inline flex-shrink-0" />
            <span className="font-extrabold tracking-tight uppercase text-[11px] sm:text-xs">Limited Offer:</span>
          </span>
          <span>
            Get lifetime access for <strong className="underline decoration-slate-950 font-black">₹20</strong> before price jumps to <span className="line-through font-bold opacity-75">₹100</span>!
          </span>
        </div>

        <div className="flex items-center justify-center space-x-2 sm:space-x-3 w-full sm:w-auto">
          <div className="flex items-center space-x-1.5 bg-slate-950 text-amber-400 px-2.5 py-1 rounded-lg font-mono font-bold text-xs shadow-inner">
            <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse flex-shrink-0" />
            <span>{formatted}</span>
          </div>
          <Link
            to={isAuthenticated ? '/checkout' : '/register'}
            className="bg-slate-950 hover:bg-slate-900 active:scale-95 text-white font-bold text-xs px-3.5 py-1 rounded-lg transition inline-flex items-center space-x-1 shadow-sm whitespace-nowrap min-h-[32px]"
          >
            <span>Buy Fast</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
