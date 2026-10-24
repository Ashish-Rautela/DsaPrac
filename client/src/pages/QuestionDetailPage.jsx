import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { questionApi, progressApi } from '../services/api';
import {
  ArrowLeft,
  Lock,
  ExternalLink,
  CheckCircle2,
  Circle,
  Sparkles,
  BookOpen,
  Building,
  Tag,
  AlertTriangle,
  Percent,
} from 'lucide-react';

export default function QuestionDetailPage() {
  const { id } = useParams();
  const { isAuthenticated, hasLifetimeAccess } = useAuth();

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  const fetchQuestion = async () => {
    setLoading(true);
    setError(null);
    setIsLocked(false);

    try {
      const data = await questionApi.getById(id);
      setQuestion(data.question);
    } catch (err) {
      if (err.status === 403 || err.code === 'PREMIUM_ACCESS_REQUIRED') {
        setIsLocked(true);
      } else {
        setError(err.message || 'Failed to load question details.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [id, hasLifetimeAccess]);

  const handleToggleSolved = async () => {
    if (!question || !isAuthenticated) return;
    const nextStatus = question.status === 'solved' ? 'unsolved' : 'solved';

    setQuestion((prev) => ({ ...prev, status: nextStatus }));

    try {
      await progressApi.updateProgress(question.questionId, nextStatus);
    } catch (err) {
      setQuestion((prev) => ({ ...prev, status: question.status }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link
          to="/questions"
          className="inline-flex items-center space-x-2 text-sm text-slate-500 hover:text-slate-900 mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Question Bank</span>
        </Link>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.04)] p-8 sm:p-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-8 h-8 text-amber-500" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Premium Visa OA Question
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              This problem analysis, recurring variant pattern, and LeetCode problem mapping are exclusively available to platform members with verified lifetime access.
            </p>
          </div>

          <div className="bg-gradient-to-b from-blue-50/60 to-slate-50/40 rounded-3xl p-6 border border-blue-100/60 max-w-md mx-auto space-y-3">
            <div className="flex items-baseline justify-center space-x-2">
              <span className="text-3xl font-black text-slate-900 bg-amber-100 text-amber-950 px-2.5 py-0.5 rounded-xl border border-amber-300 shadow-xs">₹20</span>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                / One-Time Lifetime
              </span>
            </div>
            <p className="text-xs text-slate-500">
              One-time UPI payment • Unlocks all 160+ questions & notes
            </p>
            <Link
              to="/checkout"
              className="block w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm transition shadow-[0_4px_14px_rgba(16,185,129,0.35)]"
            >
              Unlock Lifetime Access (₹20)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Unable to load question</h2>
        <p className="text-sm text-slate-500">{error || 'Question not found.'}</p>
        <Link
          to="/questions"
          className="inline-flex items-center space-x-2 text-sm font-semibold text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Question Bank</span>
        </Link>
      </div>
    );
  }

  const isSolved = question.status === 'solved';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <Link
        to="/questions"
        className="inline-flex items-center space-x-2 text-sm text-slate-500 hover:text-slate-900 font-medium transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Question Bank</span>
      </Link>

      {/* Main Problem Header */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              {question.leetcodeId && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700">
                  #{question.leetcodeId}
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">
                {question.company}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  question.difficulty === 'Easy'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    : question.difficulty === 'Medium'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200/80'
                    : 'bg-rose-50 text-rose-700 border border-rose-100'
                }`}
              >
                {question.difficulty}
              </span>
              {question.isPremium ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/80">
                  Premium
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  Free Starter
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {question.title}
            </h1>
          </div>

          {/* Solved toggle button */}
          {isAuthenticated && (
            <button
              onClick={handleToggleSolved}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center space-x-2 border flex-shrink-0 min-h-[40px] self-start sm:self-center ${
                isSolved
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {isSolved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Solved</span>
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4 text-slate-400" />
                  <span>Mark as Solved</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Tags */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
          <Tag className="w-4 h-4 text-slate-400" />
          {question.topics.map((topic) => (
            <span
              key={topic}
              className="px-3 py-1 rounded-xl bg-slate-50 text-slate-600 text-xs font-medium border border-slate-100"
            >
              {topic}
            </span>
          ))}
        </div>

        {/* LeetCode Direct Link Box */}
        {question.leetcodeUrl && (
          <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5 min-w-0">
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Direct LeetCode Problem Link
              </p>
              <p className="text-xs text-slate-400 font-mono truncate max-w-md">
                {question.leetcodeUrl}
              </p>
            </div>
            <a
              href={question.leetcodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-xs self-start sm:self-center flex-shrink-0 min-h-[40px]"
            >
              <span>Solve on LeetCode</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Notes & Algorithmic Intuition */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-base">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>Algorithmic Pattern & Visa OA Intuition</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/40 border border-blue-100/60 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-mono sm:font-sans overflow-x-auto break-words">
            {question.description || 'No additional notes provided for this question.'}
          </div>
        </div>
      </div>
    </div>
  );
}
