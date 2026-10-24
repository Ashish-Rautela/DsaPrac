import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { questionApi, progressApi } from '../services/api';
import { useCountdown } from '../utils/useCountdown';
import {
  Search,
  Filter,
  Lock,
  Unlock,
  CheckCircle2,
  Circle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Percent,
  AlertCircle,
  Layers,
  Clock,
} from 'lucide-react';

const POPULAR_TOPICS = [
  'All',
  'Array',
  'String',
  'Hash Table',
  'Dynamic Programming',
  'Sliding Window',
  'Matrix',
  'Two Pointers',
  'Greedy',
  'Stack',
  'Monotonic Stack',
  'Binary Search',
  'Tree',
  'Sorting',
  'Graph Theory',
  'Prefix Sum',
  'Simulation',
  'Design',
];

export default function QuestionsPage() {
  const { user, isAuthenticated, hasLifetimeAccess } = useAuth();
  const { formatted } = useCountdown();
  const [searchParams, setSearchParams] = useSearchParams();

  const [questions, setQuestions] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 15, totalPages: 1 });
  const [totalPremiumHidden, setTotalPremiumHidden] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const search = searchParams.get('search') || '';
  const difficulty = searchParams.get('difficulty') || 'All';
  const topic = searchParams.get('topic') || 'All';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const fetchQuestions = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await questionApi.list({
        search,
        difficulty: difficulty === 'All' ? '' : difficulty,
        topic: topic === 'All' ? '' : topic,
        page,
        limit: 15,
      });
      setQuestions(data.questions || []);
      setPagination(data.pagination || { total: 0, page: 1, limit: 15, totalPages: 1 });
      setTotalPremiumHidden(data.totalPremiumHidden || 0);
    } catch (err) {
      setError(err.message || 'Failed to load questions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [search, difficulty, topic, page, hasLifetimeAccess]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set('search', val);
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleDifficultyChange = (val) => {
    const newParams = new URLSearchParams(searchParams);
    if (val && val !== 'All') {
      newParams.set('difficulty', val);
    } else {
      newParams.delete('difficulty');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleTopicChange = (val) => {
    const newParams = new URLSearchParams(searchParams);
    if (val && val !== 'All') {
      newParams.set('topic', val);
    } else {
      newParams.delete('topic');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(newPage));
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSolved = async (questionId, currentStatus) => {
    if (!isAuthenticated) return;
    const nextStatus = currentStatus === 'solved' ? 'unsolved' : 'solved';

    // Optimistic UI update
    setQuestions((prev) =>
      prev.map((q) => (q.questionId === questionId ? { ...q, status: nextStatus } : q))
    );

    try {
      await progressApi.updateProgress(questionId, nextStatus);
    } catch (err) {
      // Revert on failure
      setQuestions((prev) =>
        prev.map((q) => (q.questionId === questionId ? { ...q, status: currentStatus } : q))
      );
    }
  };

  const solvedQuestions = questions.filter((q) => q.status === 'solved');
  const solvedCount = solvedQuestions.length;
  const easySolved = solvedQuestions.filter((q) => q.difficulty === 'Easy').length;
  const mediumSolved = solvedQuestions.filter((q) => q.difficulty === 'Medium').length;
  const hardSolved = solvedQuestions.filter((q) => q.difficulty === 'Hard').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner - Trustable Fintech & Campus Auth */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-900 text-white">
              Visa India OA
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-visa-blue border border-blue-200/60">
              Summer 2027 Campus Drive
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              160+ LeetCode Mapped
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Curated Assessment Problem Bank
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Exact algorithmic patterns and scenario variants asked in Visa software engineering assessments. Practice problems directly on LeetCode with original invariant analysis and edge case notes.
          </p>
        </div>

        {!hasLifetimeAccess && (
          <div className="flex-shrink-0 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4 sm:max-w-xs space-y-2 shadow-xs">
            <div className="flex items-center space-x-1.5 text-amber-950 font-bold text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Full Question Bank Unlock</span>
            </div>
            <div className="flex items-center space-x-1.5 text-[11px] text-rose-700 font-bold bg-white/80 border border-rose-200 px-2 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-rose-600 animate-pulse flex-shrink-0" />
              <span>Rises to ₹100 in {formatted}</span>
            </div>
            <p className="text-[11px] text-amber-900 leading-tight">
              One-time ₹20 payment grants lifetime unlock to all 160+ questions.
            </p>
            <Link
              to="/checkout"
              className="inline-block w-full py-2 px-3 text-center bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold text-xs rounded-xl transition shadow-xs"
            >
              Unlock Lifetime Access (₹20)
            </Link>
          </div>
        )}
      </div>

      {/* LeetCode Style Filters & Quick Topic Chips */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by problem name (e.g. LRU Cache, Two Sum, Justification)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-visa-blue/20 focus:border-visa-blue transition"
            />
          </div>

          {/* Difficulty Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={difficulty}
              onChange={(e) => handleDifficultyChange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-visa-blue/20 focus:border-visa-blue transition bg-white"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Topic Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={topic}
              onChange={(e) => handleTopicChange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-visa-blue/20 focus:border-visa-blue transition bg-white"
            >
              {POPULAR_TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t === 'All' ? 'All Topics' : t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* LeetCode Quick Topic Filter Chips (Scrollable) */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1 border-t border-slate-100 pt-2.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0 mr-1 hidden sm:inline">
            Quick Filter:
          </span>
          {POPULAR_TOPICS.slice(0, 11).map((t) => (
            <button
              key={t}
              onClick={() => handleTopicChange(t)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition flex-shrink-0 ${
                (topic === t) || (t === 'All' && topic === 'All')
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* LeetCode Style Progress Bar for Authenticated Users */}
        {isAuthenticated && (
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-3 flex-wrap gap-y-1">
              <span className="font-bold text-slate-700">
                Tracked Solved: <strong className="text-slate-950 font-black">{solvedCount}</strong> / {questions.length}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[#00af9b] font-semibold">Easy: {easySolved}</span>
              <span className="text-slate-300">•</span>
              <span className="text-[#ffb800] font-semibold">Med: {mediumSolved}</span>
              <span className="text-slate-300">•</span>
              <span className="text-[#ff2d55] font-semibold">Hard: {hardSolved}</span>
            </div>
            <span className="text-[11px] text-slate-400">
              Click the check circle on left of any question to track your practice
            </span>
          </div>
        )}
      </div>

      {/* LeetCode Style Question Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Header (Desktop & Tablet) */}
        <div className="hidden sm:grid grid-cols-12 items-center px-5 py-3 bg-slate-50/90 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-7">Title & Topics</div>
          <div className="col-span-2">Difficulty</div>
          <div className="col-span-2 text-right pr-2">Action</div>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-visa-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-slate-500 font-medium">Loading Visa OA questions...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-sm text-slate-600">{error}</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <p className="text-base font-semibold text-slate-800">No questions found</p>
            <p className="text-xs text-slate-500">Try adjusting your search query or difficulty filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {questions.map((q) => {
              const isLocked = q.isLocked;
              const isSolved = q.status === 'solved';

              return (
                <div
                  key={q.questionId}
                  className={`p-3.5 sm:px-5 sm:py-3.5 flex items-center justify-between gap-2.5 sm:gap-4 transition hover:bg-slate-50/80 ${
                    isSolved ? 'bg-emerald-50/15' : ''
                  }`}
                >
                  {/* Left Section: Solved Checkbox + Title + Tags */}
                  <div className="flex items-center space-x-2.5 sm:space-x-3.5 min-w-0 flex-1">
                    {/* Solved toggle checkbox (LeetCode Style) */}
                    <button
                      onClick={() => handleToggleSolved(q.questionId, q.status)}
                      title={isAuthenticated ? 'Click to toggle solved' : 'Sign in to track progress'}
                      disabled={!isAuthenticated}
                      className={`flex-shrink-0 min-w-[32px] min-h-[32px] flex items-center justify-center -ml-1 rounded-full transition ${
                        !isAuthenticated ? 'cursor-not-allowed opacity-35' : 'hover:scale-110 active:scale-95'
                      }`}
                    >
                      {isSolved ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400 stroke-[1.75]" />
                      )}
                    </button>

                    <div className="space-y-1 min-w-0 flex-1">
                      {/* Title Line */}
                      <div className="flex items-center space-x-2 min-w-0">
                        {q.leetcodeId && !q.isBlurred && (
                          <span className="text-xs font-mono font-semibold text-slate-400 flex-shrink-0">
                            {q.leetcodeId}.
                          </span>
                        )}

                        {q.isBlurred ? (
                          <Link
                            to="/checkout"
                            className="flex items-center space-x-1.5 min-w-0 group"
                          >
                            <span className="font-semibold text-sm sm:text-base text-slate-800 filter blur-[4px] select-none pointer-events-none tracking-wide truncate max-w-[130px] xs:max-w-[170px] sm:max-w-md group-hover:text-amber-700 transition">
                              {q.blurredPlaceholder || 'Visa Algorithm Assessment Problem'}
                            </span>
                            <Lock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                          </Link>
                        ) : (
                          <Link
                            to={`/questions/${q.questionId}`}
                            className="font-semibold text-sm sm:text-base text-slate-900 hover:text-visa-blue transition truncate block min-w-0"
                          >
                            {q.title}
                          </Link>
                        )}

                        {!q.isBlurred && !q.isPremium && (
                          <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded">
                            Free
                          </span>
                        )}

                        {!q.isBlurred && q.isPremium && (
                          <span className="hidden sm:inline-flex flex-shrink-0 items-center text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200/60 px-1.5 py-0.5 rounded">
                            <Unlock className="w-2.5 h-2.5 mr-0.5 text-blue-600" /> PRO
                          </span>
                        )}
                      </div>

                      {/* Difficulty and Topic Pills (LeetCode Colors) */}
                      <div className="flex items-center space-x-2 text-xs text-slate-500 flex-wrap gap-y-1">
                        <span
                          className={`font-semibold text-xs ${
                            q.difficulty === 'Easy'
                              ? 'text-[#00af9b]'
                              : q.difficulty === 'Medium'
                              ? 'text-[#ffb800]'
                              : 'text-[#ff2d55]'
                          }`}
                        >
                          {q.difficulty}
                        </span>
                        <span className="text-slate-300">•</span>
                        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                          {q.topics.slice(0, 2).map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium"
                            >
                              {t}
                            </span>
                          ))}
                          {q.topics.length > 2 && (
                            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">
                              {q.topics[2]}
                            </span>
                          )}
                          {q.topics.length > 3 && (
                            <span className="text-[10px] text-slate-400 hidden md:inline">
                              +{q.topics.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section: Action Button */}
                  <div className="flex items-center space-x-2 flex-shrink-0 self-center">
                    {!isLocked && q.leetcodeUrl && (
                      <a
                        href={q.leetcodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Practice on LeetCode"
                        className="hidden md:inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition min-h-[34px]"
                      >
                        <span>LeetCode</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {isLocked ? (
                      <Link
                        to="/checkout"
                        className="px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 transition flex items-center space-x-1.5 shadow-xs whitespace-nowrap min-h-[34px]"
                      >
                        <Lock className="w-3.5 h-3.5 flex-shrink-0 text-slate-950" />
                        <span>Unlock ₹20</span>
                      </Link>
                    ) : (
                      <Link
                        to={`/questions/${q.questionId}`}
                        className="px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold bg-visa-blue hover:bg-visa-lightBlue active:scale-95 text-white transition flex items-center space-x-1 shadow-xs whitespace-nowrap min-h-[34px]"
                      >
                        <span>Notes</span>
                        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Hidden Premium Questions Banner for Unpaid Users */}
        {!hasLifetimeAccess && totalPremiumHidden > 0 && (
          <div className="p-6 sm:p-8 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-t border-amber-200/80 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {totalPremiumHidden} Premium Visa Questions Hidden
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The titles, solutions, and direct LeetCode problem mappings of high-frequency Visa OA questions are strictly protected. Unlock permanent lifetime access to the complete 160+ problem bank for a one-time ₹20 payment.
              </p>
            </div>
            <Link
              to="/checkout"
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-visa-blue hover:bg-visa-lightBlue text-white font-bold text-xs transition shadow-md min-h-[40px]"
            >
              <span>Unlock Full Question Bank (₹20)</span>
              <Sparkles className="w-3.5 h-3.5 text-visa-gold" />
            </Link>
          </div>
        )}

        {/* Pagination Footer */}
        {pagination.totalPages > 1 && (
          <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <span className="text-xs text-slate-500">
              Showing page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.total} total questions)
            </span>
            <div className="flex items-center space-x-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                aria-label="Previous page"
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition min-w-[36px] min-h-[36px] flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-slate-700 px-2 sm:hidden">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
                aria-label="Next page"
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition min-w-[36px] min-h-[36px] flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
