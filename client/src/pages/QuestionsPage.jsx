import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { questionApi, progressApi } from '../services/api';
import { useCountdown } from '../utils/useCountdown';
import {
  Search,
  Lock,
  CheckCircle2,
  Circle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Clock,
  Sparkles,
  BookOpen,
  ChevronRight as ArrowRightIcon,
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
  'Binary Search',
  'Tree',
  'Sorting',
  'Graph Theory',
  'Prefix Sum',
  'Simulation',
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

    setQuestions((prev) =>
      prev.map((q) => (q.questionId === questionId ? { ...q, status: nextStatus } : q))
    );

    try {
      await progressApi.updateProgress(questionId, nextStatus);
    } catch (err) {
      setQuestions((prev) =>
        prev.map((q) => (q.questionId === questionId ? { ...q, status: currentStatus } : q))
      );
    }
  };

  const solvedCount = questions.filter((q) => q.status === 'solved').length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Simple, Elegant Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Visa OA Question Bank</h1>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              160+ Problems
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Curated problems for the Visa Software Engineering Intern Online Assessment.
          </p>
        </div>

        {!hasLifetimeAccess && (
          <Link
            to="/checkout"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition shadow-sm self-start sm:self-center"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Unlock Lifetime Access — ₹20</span>
            <span className="bg-slate-950 text-amber-400 px-1.5 py-0.5 rounded text-[10px] font-mono">
              {formatted}
            </span>
          </Link>
        )}
      </div>

      {/* Clean Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search problems by name..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 transition"
          />
        </div>

        {/* Difficulty */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={difficulty}
            onChange={(e) => handleDifficultyChange(e.target.value)}
            className="px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-base sm:text-sm text-slate-700 focus:outline-none focus:border-slate-400 transition w-full sm:w-auto"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Topic */}
          <select
            value={topic}
            onChange={(e) => handleTopicChange(e.target.value)}
            className="px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-base sm:text-sm text-slate-700 focus:outline-none focus:border-slate-400 transition w-full sm:w-auto"
          >
            {POPULAR_TOPICS.map((t) => (
              <option key={t} value={t}>
                {t === 'All' ? 'All Topics' : t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Authenticated Progress Note */}
      {isAuthenticated && (
        <div className="text-xs text-slate-500 flex items-center justify-between px-1">
          <span>
            Marked solved: <strong className="text-slate-800">{solvedCount}</strong> of {questions.length} on this page
          </span>
          <span className="text-slate-400 text-[11px]">Click circle to track status</span>
        </div>
      )}

      {/* Question List Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Simple Table Header (Desktop only) */}
        <div className="hidden sm:grid grid-cols-12 px-5 py-3 bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500">
          <div className="col-span-1">Status</div>
          <div className="col-span-7">Title</div>
          <div className="col-span-2">Difficulty</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-7 h-7 border-3 border-slate-800 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-500">Loading questions...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center space-y-2">
            <AlertCircle className="w-6 h-6 text-rose-500 mx-auto" />
            <p className="text-sm text-slate-600">{error}</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="py-16 text-center space-y-1">
            <p className="text-sm font-semibold text-slate-800">No questions found</p>
            <p className="text-xs text-slate-400">Try adjusting your search query or filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {questions.map((q) => {
              const isLocked = q.isLocked;
              const isSolved = q.status === 'solved';

              return (
                <div
                  key={q.questionId}
                  className={`px-4 py-3.5 sm:px-5 sm:py-3.5 flex items-center justify-between gap-3 transition hover:bg-slate-50/70 ${
                    isSolved ? 'bg-emerald-50/20' : ''
                  }`}
                >
                  {/* Left Column: Status + Title */}
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <button
                      onClick={() => handleToggleSolved(q.questionId, q.status)}
                      title={isAuthenticated ? 'Click to mark solved' : 'Sign in to track progress'}
                      disabled={!isAuthenticated}
                      className={`flex-shrink-0 transition ${
                        !isAuthenticated ? 'cursor-not-allowed opacity-30' : 'hover:scale-110 active:scale-95'
                      }`}
                    >
                      {isSolved ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400 stroke-[1.5]" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center space-x-2 min-w-0">
                        {q.leetcodeId && !q.isBlurred && (
                          <span className="text-xs font-mono text-slate-400 flex-shrink-0">
                            #{q.leetcodeId}
                          </span>
                        )}

                        {q.isBlurred ? (
                          <Link
                            to="/checkout"
                            className="inline-flex items-center space-x-1.5 min-w-0 group"
                          >
                            <span className="text-sm font-medium text-slate-600 filter blur-[3.5px] select-none pointer-events-none truncate max-w-[130px] xs:max-w-[180px] sm:max-w-md group-hover:text-slate-900 transition">
                              {q.blurredPlaceholder || 'Visa Algorithm Pattern Question'}
                            </span>
                            <Lock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                          </Link>
                        ) : (
                          <Link
                            to={`/questions/${q.questionId}`}
                            className="text-sm font-semibold text-slate-900 hover:text-visa-blue transition truncate block min-w-0"
                          >
                            {q.title}
                          </Link>
                        )}

                        {!q.isBlurred && !q.isPremium && (
                          <span className="flex-shrink-0 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded">
                            Free
                          </span>
                        )}
                      </div>

                      {/* Difficulty and topics */}
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
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
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500 text-[11px] truncate">
                          {q.topics.slice(0, 2).join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Action (Never overlaps) */}
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {!isLocked && q.leetcodeUrl && (
                      <a
                        href={q.leetcodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden md:inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
                      >
                        <span>LeetCode</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    )}

                    {isLocked ? (
                      <Link
                        to="/checkout"
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 transition flex items-center space-x-1 shadow-xs whitespace-nowrap"
                      >
                        <Lock className="w-3 h-3 flex-shrink-0" />
                        <span>Unlock ₹20</span>
                      </Link>
                    ) : (
                      <Link
                        to={`/questions/${q.questionId}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 transition flex items-center space-x-1 shadow-xs whitespace-nowrap"
                      >
                        <span>Notes</span>
                        <ArrowRightIcon className="w-3 h-3 text-slate-400" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Clean, Simple Unlock Prompt at Bottom */}
        {!hasLifetimeAccess && totalPremiumHidden > 0 && (
          <div className="p-6 bg-slate-50 border-t border-slate-200 text-center space-y-3">
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              <strong>{totalPremiumHidden}</strong> additional Visa OA questions with detailed solutions are available with lifetime access.
            </p>
            <Link
              to="/checkout"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-sm"
            >
              <span>Unlock All Questions (₹20)</span>
            </Link>
          </div>
        )}

        {/* Minimalist Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-3.5 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>
              Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong>
            </span>
            <div className="flex items-center space-x-1.5">
              <button
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition"
                aria-label="Next page"
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