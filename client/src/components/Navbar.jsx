import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Code2,
  ShieldCheck,
  CheckCircle,
  Clock,
  Sparkles,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  CreditCard,
  Lock,
  BookOpen,
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, hasLifetimeAccess, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-[#f0f4f9]/80 backdrop-blur-md border-b border-slate-200/50 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo with Soft Rounded Multi-Color Accent Mark */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex items-center justify-center group-hover:scale-105 transition">
              <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none">
                <path d="M8 18C8 12.5 11.5 8 16 8" stroke="#3B82F6" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M16 8C20.5 8 24 12.5 24 18" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M11 23C13.5 25 18.5 25 21 23" stroke="#F43F5E" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">Visa Prep</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                  OA 2027
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">SWE Intern Question Bank</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1.5">
            <Link
              to="/questions"
              className={`px-4 py-2 rounded-2xl text-sm font-semibold transition ${
                isActive('/questions')
                  ? 'bg-white text-blue-600 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              Question Bank
            </Link>

            <Link
              to="/prep-plan"
              className={`px-4 py-2 rounded-2xl text-sm font-semibold transition flex items-center space-x-1.5 ${
                isActive('/prep-plan')
                  ? 'bg-white text-blue-600 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>Prep Plan</span>
              {!hasLifetimeAccess ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 font-bold flex items-center">
                  <Lock className="w-2.5 h-2.5 mr-0.5" /> PRO
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold flex items-center">
                  <CheckCircle className="w-2.5 h-2.5 mr-0.5" /> UNLOCKED
                </span>
              )}
            </Link>

            {isAuthenticated && !hasLifetimeAccess && (
              <Link
                to="/checkout"
                className="px-4 py-2 rounded-2xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_4px_14px_rgba(16,185,129,0.3)] transition flex items-center space-x-1.5"
              >
                <Sparkles className="w-4 h-4 text-emerald-100" />
                <span>Unlock Lifetime — <span className="bg-emerald-800/60 px-1.5 py-0.5 rounded-lg text-emerald-200 font-black">₹20</span></span>
              </Link>
            )}

            {isAuthenticated && (
              <Link
                to="/payment-status"
                className={`px-4 py-2 rounded-2xl text-sm font-semibold transition flex items-center space-x-1.5 ${
                  isActive('/payment-status')
                    ? 'bg-white text-blue-600 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <CreditCard className="w-4 h-4 text-slate-500" />
                <span>My Payments</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-2xl text-sm font-bold transition flex items-center space-x-1.5 ${
                  isActive('/admin')
                    ? 'bg-white text-indigo-700 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100'
                    : 'text-indigo-700 hover:bg-indigo-50/70'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Admin Console</span>
              </Link>
            )}
          </nav>

          {/* User Auth controls */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* Entitlement Badge */}
                {hasLifetimeAccess ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                    <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    Lifetime Access
                  </span>
                ) : (
                  <Link
                    to="/checkout"
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100 transition"
                  >
                    <Lock className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    Unlock Lifetime (<span className="font-black text-emerald-900">₹20</span>)
                  </Link>
                )}

                <div className="flex items-center space-x-2 pl-3 border-l border-slate-200/60">
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-800 leading-tight">{user.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase">{user.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-2xl text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-white/80 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-2xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-[0_4px_14px_rgba(59,130,246,0.3)]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer & Backdrop */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-[105px] sm:top-[97px] bg-slate-950/40 backdrop-blur-xs z-30 md:hidden animate-in fade-in duration-150"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-1.5 shadow-xl rounded-b-3xl relative z-40 animate-in slide-in-from-top-2 duration-150 max-h-[calc(100vh-100px)] overflow-y-auto">
            <Link
              to="/questions"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center min-h-[44px] px-3.5 py-2.5 rounded-2xl text-base font-semibold text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 transition"
            >
              Question Bank
            </Link>
            <Link
              to="/prep-plan"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between min-h-[44px] px-3.5 py-2.5 rounded-2xl text-base font-semibold text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 transition"
            >
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span>Prep Plan</span>
              </div>
              {!hasLifetimeAccess ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 font-bold flex items-center">
                  <Lock className="w-2.5 h-2.5 mr-1" /> PRO
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold flex items-center">
                  <CheckCircle className="w-2.5 h-2.5 mr-1" /> UNLOCKED
                </span>
              )}
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/payment-status"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center min-h-[44px] px-3.5 py-2.5 rounded-2xl text-base font-semibold text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 transition"
                >
                  My Payments
                </Link>
                {!hasLifetimeAccess && (
                  <Link
                    to="/checkout"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between min-h-[44px] px-4 py-2.5 rounded-2xl text-base font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-[0_4px_14px_rgba(16,185,129,0.3)] transition"
                  >
                    <span>Unlock Lifetime Access</span>
                    <span className="text-xs bg-white text-emerald-800 px-2.5 py-1 rounded-xl font-black shadow-xs">₹20</span>
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center min-h-[44px] px-3.5 py-2.5 rounded-2xl text-base font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition"
                  >
                    Admin Console
                  </Link>
                )}
                <div className="pt-3 mt-2 border-t border-slate-100">
                  <div className="px-3.5 py-1.5 mb-2">
                    <p className="text-sm font-bold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left flex items-center min-h-[44px] px-3.5 py-2 rounded-2xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
            {!isAuthenticated && (
              <div className="pt-3 flex flex-col space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center flex items-center justify-center min-h-[44px] px-4 py-2.5 rounded-2xl text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center flex items-center justify-center min-h-[44px] px-4 py-2.5 rounded-2xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition shadow-[0_4px_14px_rgba(59,130,246,0.3)]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
}
