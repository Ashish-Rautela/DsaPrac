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

  const solvedCount = questions.filter((q) => q.status === 'solved').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Visa OA Question Bank
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-visa-blue">
              160+ Curated Problems
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
              SWE Intern / New Grad 2026
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Real questions encountered in Visa Online Assessments, ranked by interview frequency with direct LeetCode problem mappings.
          </p>
        </div>

        {!hasLifetimeAccess && (
          <div className="flex-shrink-0 bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:max-w-xs space-y-2.5">
            <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Unlock All 160+ Questions</span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-rose-700 font-bold bg-rose-50 border border-rose-200 px-2 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-rose-600 animate-pulse flex-shrink-0" />
              <span>Price rises to ₹100 in {formatted}</span>
            </div>
            <p className="text-xs text-amber-800">
              Only ₹20 for permanent lifetime access. Buy fast before deadline!
            </p>
            <Link
              to="/checkout"
              className="inline-block w-full py-2 px-3 text-center bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition shadow-sm"
            >
              Unlock Lifetime Access (₹20)
            </Link>
          </div>
        )}
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
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
              placeholder="Search by title (e.g. Text Justification, LRU Cache, Two Sum)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-visa-blue/20 focus:border-visa-blue transition"
            />
          </div>

          {/* Difficulty Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={difficulty}
              onChange={(e) => handleDifficultyChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-visa-blue/20 focus:border-visa-blue transition bg-white"
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
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-visa-blue/20 focus:border-visa-blue transition bg-white"
            >
              {POPULAR_TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t === 'All' ? 'All Topics' : t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Progress summary for authenticated users */}
        {isAuthenticated && (
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Page status: <strong className="text-slate-800">{solvedCount}</strong> of {questions.length} marked solved
            </span>
            <span className="text-[11px] text-slate-400">Click circle on left to track your progress</span>
          </div>
        )}
      </div>

      {/* Question Table / List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-visa-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-slate-500">Loading Visa OA questions...</p>
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
                  className={`p-4 sm:p-5 flex items-center justify-between gap-4 transition hover:bg-slate-50/80 ${
                    isSolved ? 'bg-emerald-50/20' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    {/* Solved toggle checkbox */}
                    <button
                      onClick={() => handleToggleSolved(q.questionId, q.status)}
                      title={isAuthenticated ? 'Click to toggle solved' : 'Sign in to track progress'}
                      disabled={!isAuthenticated}
                      className={`flex-shrink-0 transition ${
                        !isAuthenticated ? 'cursor-not-allowed opacity-40' : 'hover:scale-110'
                      }`}
                    >
                      {isSolved ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                      )}
                    </button>

                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        {q.leetcodeId && !q.isBlurred && (
                          <span className="text-xs font-mono font-bold text-slate-400">
                            #{q.leetcodeId}
                          </span>
                        )}

                        {q.isBlurred ? (
                          <Link
                            to="/checkout"
                            className="inline-flex items-center space-x-2 group/blur"
                          >
                            <span className="font-bold text-sm sm:text-base text-slate-700 filter blur-[4.5px] select-none pointer-events-none tracking-wide group-hover/blur:text-slate-900 transition">
                              {q.blurredPlaceholder || 'Visa Algorithm Pattern Screening Question'}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                              <Lock className="w-3 h-3 mr-1 text-amber-600" /> Premium (₹20)
                            </span>
                          </Link>
                        ) : (
                          <Link
                            to={`/questions/${q.questionId}`}
                            className="font-bold text-sm sm:text-base text-slate-900 hover:text-visa-blue transition truncate"
                          >
                            {q.title}
                          </Link>
                        )}

                        {!q.isBlurred && !q.isPremium && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                            Free Starter
                          </span>
                        )}

                        {!q.isBlurred && q.isPremium && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-visa-blue">
                            <Unlock className="w-3 h-3 mr-1 text-visa-blue" /> Unlocked
                          </span>
                        )}
                      </div>

                      {/* Difficulty and Topic Pills */}
                      <div className="flex items-center space-x-2 text-xs text-slate-500 flex-wrap gap-y-1">
                        <span
                          className={`font-bold ${
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
                        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                          {q.topics.slice(0, 4).map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-medium"
                            >
                              {t}
                            </span>
                          ))}
                          {q.topics.length > 4 && (
                            <span className="text-[10px] text-slate-400">+{q.topics.length - 4} more</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {!isLocked && q.leetcodeUrl && (
                      <a
                        href={q.leetcodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Practice on LeetCode"
                        className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                      >
                        <span>Solve</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {isLocked ? (
                      <Link
                        to="/checkout"
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition flex items-center space-x-1.5 shadow-sm"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Unlock ₹20</span>
                      </Link>
                    ) : (
                      <Link
                        to={`/questions/${q.questionId}`}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-visa-blue hover:bg-visa-lightBlue text-white transition flex items-center space-x-1 shadow-sm"
                      >
                        <span>Notes</span>
                        <ChevronRight className="w-3.5 h-3.5" />
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
          <div className="p-8 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-t border-amber-200/80 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                {totalPremiumHidden} Premium Visa Questions Hidden
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The titles, solutions, and direct LeetCode problem mappings of high-frequency Visa OA questions are strictly protected. Unlock permanent lifetime access to the complete 160+ problem bank for a one-time ₹20 payment.
              </p>
            </div>
            <Link
              to="/checkout"
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-visa-blue hover:bg-visa-lightBlue text-white font-bold text-xs transition shadow-md"
            >
              <span>Unlock Full Question Bank (₹20)</span>
              <Sparkles className="w-3.5 h-3.5 text-visa-gold" />
            </Link>
          </div>
        )}

        {/* Pagination Footer */}
        {pagination.totalPages > 1 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Showing page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.total} total questions)
            </span>
            <div className="flex items-center space-x-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition"
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
