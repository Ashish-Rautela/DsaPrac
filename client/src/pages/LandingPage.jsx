import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCountdown } from '../utils/useCountdown';
import { questionApi } from '../services/api';
import {
  Code2,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Zap,
  BookOpen,
  DollarSign,
  ExternalLink,
  ChevronRight,
  Terminal,
  Clock,
  Sparkles,
  Calendar,
  GraduationCap,
} from 'lucide-react';

// Mini Zen Bear SVG matching the aesthetic
function MiniZenBear() {
  return (
    <svg viewBox="0 0 200 200" className="w-24 h-24 sm:w-28 sm:h-28 object-contain select-none" fill="none">
      <circle cx="65" cy="55" r="22" fill="#FFFFFF" stroke="#334155" strokeWidth="3" />
      <circle cx="65" cy="55" r="13" fill="#FBBF24" />
      <circle cx="135" cy="55" r="22" fill="#FFFFFF" stroke="#334155" strokeWidth="3" />
      <circle cx="135" cy="55" r="13" fill="#FBBF24" />
      <ellipse cx="100" cy="95" rx="56" ry="48" fill="#FFFFFF" stroke="#334155" strokeWidth="3" />
      <path d="M76 93 C81 87, 89 87, 94 93" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
      <path d="M106 93 C111 87, 119 87, 124 93" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="100" cy="100" rx="5" ry="4" fill="#334155" />
      <path d="M96 105 C98 108, 100 108, 100 105 C100 108, 102 108, 104 105" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="72" cy="105" rx="9" ry="5.5" fill="#FDA4AF" />
      <ellipse cx="128" cy="105" rx="9" ry="5.5" fill="#FDA4AF" />
      <path d="M72 135 C72 125, 128 125, 128 135 L145 168 C145 178, 55 178, 55 168 Z" fill="#FFFFFF" stroke="#334155" strokeWidth="3" />
      <path d="M52 165 C52 150, 92 150, 98 165 C88 176, 62 176, 52 165 Z" fill="#FFFFFF" stroke="#334155" strokeWidth="2.5" />
      <path d="M148 165 C148 150, 108 150, 102 165 C112 176, 138 176, 148 165 Z" fill="#FFFFFF" stroke="#334155" strokeWidth="2.5" />
      <rect x="94" y="132" width="22" height="24" rx="4" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
      <path d="M116 138 C122 138, 122 150, 116 150" stroke="#1D4ED8" strokeWidth="2" fill="none" />
      <path d="M99 126 C99 122, 103 120, 103 116" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
      <path d="M106 126 C106 122, 110 120, 110 116" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function LandingPage() {
  const { isAuthenticated, hasLifetimeAccess } = useAuth();
  const { formatted } = useCountdown();
  const [previewQuestions, setPreviewQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    questionApi
      .list({ limit: 4 })
      .then((data) => setPreviewQuestions(data.questions || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 sm:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>160+ High-Frequency Visa SWE Intern Questions</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Master the Exact Questions of the{' '}
              <span className="text-[#1A1F71] italic font-black underline decoration-[#F7B600] decoration-4 sm:decoration-[6px] underline-offset-[6px] sm:underline-offset-[8px] whitespace-nowrap">
                Visa OA
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              160+ actual assessment problems with LeetCode mappings, interview appearance frequencies, algorithmic intuition, and pattern breakdowns — all for <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-amber-100 text-amber-950 font-black border border-amber-300 text-sm shadow-xs">₹20</span> lifetime access.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/questions"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-blue-600 text-white font-bold text-sm sm:text-base hover:bg-blue-700 transition shadow-[0_4px_14px_rgba(59,130,246,0.3)] flex items-center justify-center space-x-2 min-h-[48px]"
              >
                <span>Browse Question Bank</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/prep-plan"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 text-slate-800 font-bold text-sm sm:text-base transition shadow-xs flex items-center justify-center space-x-2 min-h-[48px]"
              >
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span>Check Prep Plan</span>
              </Link>

              {!hasLifetimeAccess && (
                <Link
                  to={isAuthenticated ? '/checkout' : '/register'}
                  className="w-full sm:w-auto px-6 sm:px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base transition shadow-[0_4px_14px_rgba(16,185,129,0.35)] flex items-center justify-center space-x-2 min-h-[48px]"
                >
                  <Zap className="w-4 h-4 text-emerald-100" />
                  <span>Unlock Lifetime — ₹20</span>
                </Link>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-xs font-medium text-slate-500">
              <span className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5" />
                One-time ₹20 payment
              </span>
              <span className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5" />
                No recurring fees
              </span>
              <span className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5" />
                LeetCode problem mappings
              </span>
            </div>
          </div>

          {/* Soft Bento Hero Preview Card */}
          <div className="mt-12 max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-md text-center sm:text-left">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Summer 2027 Recruitment</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Complete Preparation Workspace
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Organized topic breakdowns, frequency ranks, direct LeetCode problem links, Socratic AI coaching prompts, and 7-day tactical roadmap.
              </p>
              <div className="pt-1 flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700">
                  ₹90,000/mo Stipend
                </span>
                <span className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700">
                  B.Tech CS 2028
                </span>
                <span className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-200/70 text-xs font-bold text-amber-800">
                  ₹20 Full Access
                </span>
              </div>
            </div>

            <div className="flex-shrink-0 flex items-center justify-center p-3 bg-blue-50/40 rounded-3xl border border-blue-50">
              <MiniZenBear />
            </div>
          </div>
        </div>
      </section>

      {/* Value Pillars in Soft Bento Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-4 hover:shadow-[0_12px_36px_rgb(0,0,0,0.05)] transition">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 border border-blue-100/60 flex items-center justify-center">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Visa Domain Scenarios</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Visa OA questions disguise standard data structures as payment gateways, disk storage clusters, and fraud detection graphs. Learn to translate narrative problem prompts into clean algorithmic patterns.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-4 hover:shadow-[0_12px_36px_rgb(0,0,0,0.05)] transition">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 border border-rose-100/60 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Original Intuition Notes</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Don’t memorize boilerplate code. Each problem contains concise algorithmic breakdowns covering the key invariants, edge cases, and time/space complexity expectations required to pass automated test suites.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-4 hover:shadow-[0_12px_36px_rgb(0,0,0,0.05)] transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 border border-emerald-100/60 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Student-Friendly ₹20 Price</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              High-quality assessment prep shouldn’t cost thousands. Get unlimited, permanent access to the complete Visa question bank for less than the cost of a cup of chai.
            </p>
          </div>
        </div>
      </section>

      {/* Question Bank Preview Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Sample Visa Questions</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Preview the problem collection and structural breakdowns.</p>
            </div>
            <Link
              to="/questions"
              className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>View All 160+ Questions</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400">Loading questions...</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {previewQuestions.map((q) => (
                <div key={q.questionId} className="py-3.5 sm:py-4 flex items-center justify-between gap-3">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="font-bold text-slate-900 text-sm sm:text-base truncate block min-w-0">
                        {q.title}
                      </span>
                      {q.isPremium ? (
                        <span className="flex-shrink-0 inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-200/80 px-2 py-0.5 rounded-full">
                          <Lock className="w-2.5 h-2.5 mr-0.5 text-amber-700" /> PRO
                        </span>
                      ) : (
                        <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                          Free
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-400 flex-wrap">
                      <span
                        className={`font-semibold ${
                          q.difficulty === 'Easy'
                            ? 'text-emerald-600'
                            : q.difficulty === 'Medium'
                            ? 'text-amber-600'
                            : 'text-rose-500'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                      <span>•</span>
                      <span className="truncate max-w-[180px] sm:max-w-none text-[11px] text-slate-500">
                        {q.topics.slice(0, 3).join(', ')}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={q.isPremium && !hasLifetimeAccess ? '/checkout' : `/questions/${q.questionId}`}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition min-h-[34px] inline-flex items-center justify-center shadow-xs whitespace-nowrap ${
                      q.isPremium && !hasLifetimeAccess
                        ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    {q.isPremium && !hasLifetimeAccess ? 'Unlock ₹20' : 'Practice'}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Transparent Pricing Bento Card */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.04)] p-8 sm:p-12 text-slate-900 relative overflow-hidden text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-black shadow-xs">
            <span className="flex h-2 w-2 relative flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <span className="uppercase tracking-wider">Limited Offer:</span>
            <span>Price jumps to ₹100 in {formatted}!</span>
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              One-Time ₹20. Lifetime Access.
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Special launch price. Once the countdown expires, price becomes ₹100. Full unlock of all present and future curated Visa OA questions.
            </p>
          </div>

          <div className="py-2">
            <div className="inline-block bg-gradient-to-b from-blue-50/60 to-slate-50/40 rounded-3xl px-8 py-5 border border-blue-100/60 max-w-full">
              <div className="flex items-baseline justify-center space-x-3">
                <span className="text-2xl sm:text-3xl text-slate-400 line-through font-bold">₹100</span>
                <span className="text-4xl sm:text-5xl font-black text-slate-900 bg-amber-100/90 text-amber-950 px-3 py-1 rounded-2xl border border-amber-300 shadow-sm">
                  ₹20
                </span>
                <span className="text-slate-500 text-sm font-medium">/ lifetime</span>
              </div>
              <div className="mt-3 flex items-center justify-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">Save 80%</span>
                <span className="text-xs text-red-600 font-semibold">Price will be ₹100 after deadline</span>
              </div>
            </div>
          </div>

          <ul className="text-xs sm:text-sm text-slate-600 space-y-2.5 text-left max-w-sm mx-auto">
            <li className="flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2.5 flex-shrink-0" />
              <span>All 160+ curated Visa OA problems & solutions</span>
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2.5 flex-shrink-0" />
              <span>7-Day Tactical OA Roadmap & Timeline Strategy</span>
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2.5 flex-shrink-0" />
              <span>4 Copyable Socratic AI Master Prompts</span>
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2.5 flex-shrink-0" />
              <span>Original algorithmic intuition & pattern analysis</span>
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2.5 flex-shrink-0" />
              <span>Core CS fundamentals & Project interview guide</span>
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2.5 flex-shrink-0" />
              <span>Zero recurring fees or subscriptions</span>
            </li>
          </ul>

          <div className="pt-3">
            <Link
              to={isAuthenticated ? '/checkout' : '/register'}
              className="inline-block w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base transition shadow-[0_8px_24px_rgba(16,185,129,0.35)]"
            >
              Unlock Lifetime Access Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
