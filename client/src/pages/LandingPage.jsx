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
} from 'lucide-react';

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
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-visa-blue text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-visa-gold animate-pulse"></span>
              <span>160+ High-Frequency Visa SWE Intern & New Grad Questions</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Master the Exact Questions of the <span className="text-visa-blue underline decoration-visa-gold decoration-4">Visa OA</span>
            </h1>

            <p className="text-base sm:text-xl text-slate-600 leading-relaxed font-normal">
              160+ actual assessment problems with LeetCode mappings, interview appearance frequencies, algorithmic intuition, and pattern breakdowns — all for ₹20 lifetime access.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                to="/questions"
                className="w-full sm:w-auto px-6 sm:px-7 py-3.5 rounded-xl bg-visa-blue text-white font-bold text-sm sm:text-base hover:bg-visa-lightBlue transition shadow-lg shadow-blue-900/10 flex items-center justify-center space-x-2 min-h-[48px]"
              >
                <span>Browse Question Bank</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/prep-plan"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white border-2 border-slate-200 hover:border-visa-blue hover:bg-blue-50/50 text-slate-800 hover:text-visa-blue font-bold text-sm sm:text-base transition shadow-sm flex items-center justify-center space-x-2 min-h-[48px]"
              >
                <BookOpen className="w-5 h-5 text-visa-blue" />
                <span>Check Prep Plan</span>
              </Link>

              {!hasLifetimeAccess && (
                <Link
                  to={isAuthenticated ? '/checkout' : '/register'}
                  className="w-full sm:w-auto px-6 sm:px-7 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm sm:text-base transition shadow-sm flex items-center justify-center space-x-2 min-h-[48px]"
                >
                  <Zap className="w-5 h-5 text-slate-950" />
                  <span>Unlock Lifetime — ₹20</span>
                </Link>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-3 text-xs font-medium text-slate-500">
              <span className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5" />
                One-time ₹20 payment
              </span>
              <span className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5" />
                No subscriptions
              </span>
              <span className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5" />
                LeetCode problem mappings
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-visa-blue flex items-center justify-center">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Visa Domain Scenarios</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Visa OA questions disguise standard data structures as payment gateways, disk storage clusters, and fraud detection graphs. Learn to translate narrative problem prompts into clean algorithmic patterns.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Original Intuition Notes</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Don’t memorize boilerplate code. Each problem contains concise algorithmic breakdowns covering the key invariants, edge cases, and time/space complexity expectations required to pass automated test suites.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Student-Friendly ₹20 Price</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              High-quality assessment prep shouldn’t cost thousands. Get unlimited, permanent access to the complete Visa question bank for less than the cost of a cup of chai.
            </p>
          </div>
        </div>
      </section>

      {/* Question Bank Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Sample Visa Questions</h2>
              <p className="text-sm text-slate-500">Preview the problem collection and structural breakdowns.</p>
            </div>
            <Link
              to="/questions"
              className="text-sm font-semibold text-visa-blue hover:text-visa-lightBlue flex items-center space-x-1"
            >
              <span>View All Questions</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400">Loading questions...</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {previewQuestions.map((q) => (
                <div key={q.questionId} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className="font-semibold text-slate-900 text-sm sm:text-base">{q.title}</span>
                      {q.isPremium ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800">
                          <Lock className="w-3 h-3 mr-1" /> Premium
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                          Free Starter
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-500 flex-wrap">
                      <span
                        className={`font-semibold ${
                          q.difficulty === 'Easy'
                            ? 'text-emerald-600'
                            : q.difficulty === 'Medium'
                            ? 'text-amber-600'
                            : 'text-rose-600'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                      <span>•</span>
                      <span className="truncate">{q.topics.join(', ')}</span>
                    </div>
                  </div>

                  <Link
                    to={q.isPremium && !hasLifetimeAccess ? '/checkout' : `/questions/${q.questionId}`}
                    className="self-start sm:self-center flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 transition text-slate-700 min-h-[36px] inline-flex items-center justify-center shadow-xs"
                  >
                    {q.isPremium && !hasLifetimeAccess ? 'Unlock ₹20' : 'Practice'}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Transparent Pricing Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-visa-blue to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-visa-gold/10 blur-3xl pointer-events-none"></div>

          <div className="text-center max-w-xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-bold animate-pulse">
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              <span>5-Hour Deadline Active • Price increases to ₹100 in {formatted}!</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              One-Time ₹20. Lifetime Access.
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Limited launch price. Once the timer expires, price becomes ₹100. Full unlock of all present and future curated Visa OA questions.
            </p>

            <div className="py-6">
              <div className="inline-block bg-white/10 backdrop-blur-md rounded-2xl px-5 sm:px-8 py-4 border border-white/20 max-w-full">
                <div className="flex items-baseline justify-center space-x-3">
                  <span className="text-2xl sm:text-3xl text-slate-400 line-through font-bold">₹100</span>
                  <span className="text-4xl sm:text-5xl font-black text-visa-gold">₹20</span>
                  <span className="text-slate-300 text-sm font-medium">/ lifetime</span>
                </div>
                <div className="mt-2 flex items-center justify-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold">Save 80%</span>
                  <span className="text-xs text-amber-300">Price will be ₹100 after deadline</span>
                </div>
              </div>
            </div>

            <ul className="text-sm text-slate-200 space-y-2 text-left max-w-sm mx-auto">
              <li className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
                <span>All 160+ curated Visa OA problems & solutions</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
                <span>7-Day Tactical OA Roadmap & Timeline Strategy</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
                <span>4 Copyable Socratic AI Master Prompts</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
                <span>Original algorithmic intuition & pattern analysis</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
                <span>Core CS fundamentals & Project interview guide</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
                <span>Zero recurring fees or automatic renewals</span>
              </li>
            </ul>

            <div className="pt-6">
              <Link
                to={isAuthenticated ? '/checkout' : '/register'}
                className="inline-block w-full sm:w-auto px-8 py-3.5 rounded-xl bg-visa-gold hover:bg-visa-goldHover text-slate-950 font-bold text-base transition shadow-md"
              >
                Get Lifetime Access Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
