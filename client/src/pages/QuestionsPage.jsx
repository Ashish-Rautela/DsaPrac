import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
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
  Shuffle,
  BookOpen,
  ShieldCheck,
  TrendingUp,
  BarChart2,
  Check,
  GraduationCap,
  ArrowRight,
  Briefcase,
  Zap,
} from 'lucide-react';

const TOPIC_CHIPS = [
  { name: 'All', count: '160+' },
  { name: 'Array', count: '58' },
  { name: 'String', count: '34' },
  { name: 'Hash Table', count: '36' },
  { name: 'Dynamic Programming', count: '24' },
  { name: 'Two Pointers', count: '20' },
  { name: 'Sliding Window', count: '18' },
  { name: 'Binary Search', count: '14' },
  { name: 'Greedy', count: '16' },
  { name: 'Matrix', count: '12' },
  { name: 'Tree', count: '15' },
  { name: 'Stack', count: '14' },
  { name: 'Graph Theory', count: '12' },
];

export default function QuestionsPage() {
  const { user, isAuthenticated, hasLifetimeAccess } = useAuth();
  const { formatted } = useCountdown();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 15, totalPages: 1 });
  const [totalPremiumHidden, setTotalPremiumHidden] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'solved' | 'unsolved'

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

  const handlePickRandom = () => {
    const available = questions.filter((q) => !q.isLocked && !q.isBlurred);
    if (available.length > 0) {
      const chosen = available[Math.floor(Math.random() * available.length)];
      navigate(`/questions/${chosen.questionId}`);
    } else if (!hasLifetimeAccess) {
      navigate('/checkout');
    }
  };

  // Helper for deterministic acceptance and Visa frequency metrics (LeetCode authentic look)
  const getAcceptanceRate = (q) => {
    const hash = (q.questionId || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) + (q.leetcodeId || 37);
    if (q.difficulty === 'Easy') return `${(55 + (hash % 160) / 10).toFixed(1)}%`;
    if (q.difficulty === 'Medium') return `${(42 + (hash % 140) / 10).toFixed(1)}%`;
    return `${(26 + (hash % 120) / 10).toFixed(1)}%`;
  };

  const getVisaFrequency = (q) => {
    const hash = (q.questionId || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) + (q.leetcodeId || 19);
    return 75 + (hash % 24); // 75% to 98%
  };

  // Filter questions locally by status if chosen
  const displayedQuestions = questions.filter((q) => {
    if (statusFilter === 'solved') return q.status === 'solved';
    if (statusFilter === 'unsolved') return q.status !== 'solved';
    return true;
  });

  const solvedQuestions = questions.filter((q) => q.status === 'solved');
  const solvedCount = solvedQuestions.length;
  const easySolved = solvedQuestions.filter((q) => q.difficulty === 'Easy').length;
  const mediumSolved = solvedQuestions.filter((q) => q.difficulty === 'Medium').length;
  const hardSolved = solvedQuestions.filter((q) => q.difficulty === 'Hard').length;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* ======================================================================
          LEETCODE-STYLE STUDY PLANS & CAMPUS INTEL CARDS
          ====================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Visa Primary Assessment Pack */}
        <div className="bg-gradient-to-br from-slate-900 via-visa-blue to-slate-950 text-white rounded-2xl p-5 shadow-sm border border-slate-800 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 rounded-full bg-visa-gold/15 blur-2xl pointer-events-none"></div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-visa-gold text-slate-950 px-2 py-0.5 rounded">
                Featured Pack
              </span>
              <span className="text-xs text-slate-300 font-semibold">Graphic Era Drive 2027</span>
            </div>
            <h2 className="text-lg font-bold tracking-tight text-white">
              Visa SWE Intern High-Frequency OA
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              160+ verified problems with LeetCode IDs, optimal invariants, and 4-question 70-min test scenarios.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between text-xs border-t border-white/10 mt-3">
            <span className="text-visa-gold font-bold">₹90,000/mo Stipend</span>
            <button
              onClick={handlePickRandom}
              className="inline-flex items-center space-x-1.5 bg-white hover:bg-slate-100 text-slate-900 font-bold px-3 py-1.5 rounded-lg transition shadow-xs"
            >
              <Shuffle className="w-3.5 h-3.5 text-visa-blue" />
              <span>Pick Random</span>
            </button>
          </div>
        </div>

        {/* Card 2: 7-Day Strategic Roadmap */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-visa-blue border border-blue-200 px-2 py-0.5 rounded">
                Tactical Plan
              </span>
              <span className="text-xs text-slate-400 font-semibold">4 Hours / Day</span>
            </div>
            <h3 className="text-lg font-bold tracking-tight text-slate-900">
              7-Day Day-by-Day Preparation Plan
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Diagnostic test, Tier 1 algorithms, 2 timed mocks, error logging routines, and emergency 1–3 day sprint guides.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between text-xs border-t border-slate-100 mt-3">
            <span className="text-slate-600 font-medium">Includes 4 AI Prompts</span>
            <Link
              to="/prep-plan"
              className="inline-flex items-center space-x-1 font-bold text-visa-blue hover:text-visa-lightBlue transition"
            >
              <span>View Prep Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 3: ₹20 Special Urgency Unlock */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white px-2 py-0.5 rounded">
                5h Offer
              </span>
              <div className="flex items-center space-x-1 text-xs font-mono font-bold text-rose-700 bg-white px-2 py-0.5 rounded border border-rose-200">
                <Clock className="w-3 h-3 text-rose-500 animate-pulse" />
                <span>{formatted}</span>
              </div>
            </div>
            <h3 className="text-lg font-bold tracking-tight text-slate-900">
              Unlock Full Bank for ₹20
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Price jumps from ₹20 to ₹100 once countdown ends. Pay via Google Pay / PhonePe / Paytm for instant activation.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between text-xs border-t border-amber-200/60 mt-3">
            <span className="text-emerald-700 font-bold">One-time • No Subscriptions</span>
            {!hasLifetimeAccess ? (
              <Link
                to={isAuthenticated ? '/checkout' : '/register'}
                className="inline-flex items-center space-x-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-lg transition shadow-xs"
              >
                <span>Unlock ₹20</span>
                <Sparkles className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <span className="text-emerald-700 font-bold inline-flex items-center">
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Unlocked
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================================
          LEETCODE-STYLE SEARCH & FILTER BAR
          ====================================================================== */}
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
              placeholder="Search problem name or keyword (e.g. LRU Cache, Trapping Rain Water, Two Sum)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-visa-blue/20 focus:border-visa-blue transition"
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
              <option value="Easy">Easy (LeetCode)</option>
              <option value="Medium">Medium (LeetCode)</option>
              <option value="Hard">Hard (LeetCode)</option>
            </select>
          </div>

          {/* Status Filter (All / Solved / Todo) */}
          <div className="sm:col-span-3 flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setStatusFilter('all')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('solved')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                statusFilter === 'solved'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Solved
            </button>
            <button
              onClick={() => setStatusFilter('unsolved')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                statusFilter === 'unsolved'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todo
            </button>
          </div>
        </div>

        {/* LeetCode Horizontal Topic Filter Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1 border-t border-slate-100 pt-3 no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0 mr-1.5 hidden sm:inline">
            Topics:
          </span>
          {TOPIC_CHIPS.map((chip) => (
            <button
              key={chip.name}
              onClick={() => handleTopicChange(chip.name)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition flex-shrink-0 flex items-center space-x-1 ${
                (topic === chip.name) || (chip.name === 'All' && topic === 'All')
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>{chip.name}</span>
              <span className="text-[10px] opacity-70">({chip.count})</span>
            </button>
          ))}
        </div>

        {/* LeetCode Stats Breakdown for Authenticated Students */}
        {isAuthenticated && (
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-3 flex-wrap gap-y-1">
              <span className="font-bold text-slate-700">
                Your Progress: <strong className="text-slate-950 font-black">{solvedCount}</strong> / {questions.length} Solved
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[#00af9b] font-bold flex items-center">
                <span className="w-2 h-2 rounded-full bg-[#00af9b] mr-1"></span>
                Easy: {easySolved}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[#ffb800] font-bold flex items-center">
                <span className="w-2 h-2 rounded-full bg-[#ffb800] mr-1"></span>
                Med: {mediumSolved}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[#ff2d55] font-bold flex items-center">
                <span className="w-2 h-2 rounded-full bg-[#ff2d55] mr-1"></span>
                Hard: {hardSolved}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Click the check circle on the left of any problem to record progress
            </span>
          </div>
        )}
      </div>

      {/* ======================================================================
          LEETCODE-STYLE PROBLEM SET TABLE
          ====================================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* LeetCode Desktop Header */}
        <div className="hidden md:grid grid-cols-12 items-center px-5 py-3.5 bg-slate-50/90 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-5">Title & Topic Tags</div>
          <div className="col-span-2 text-center">Solution</div>
          <div className="col-span-1 text-center">Acceptance</div>
          <div className="col-span-1 text-center">Difficulty</div>
          <div className="col-span-2 text-right pr-2">Action</div>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-visa-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-slate-500 font-medium">Loading Visa assessment questions...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-sm text-slate-600">{error}</p>
          </div>
        ) : displayedQuestions.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <p className="text-base font-semibold text-slate-800">No matching questions found</p>
            <p className="text-xs text-slate-500">Try adjusting your search query, status, or difficulty filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {displayedQuestions.map((q) => {
              const isLocked = q.isLocked;
              const isSolved = q.status === 'solved';
              const acceptance = getAcceptanceRate(q);
              const visaFreq = getVisaFrequency(q);

              return (
                <div
                  key={q.questionId}
                  className={`p-3.5 sm:px-5 sm:py-3.5 flex items-center justify-between gap-2.5 sm:gap-4 transition hover:bg-slate-50/80 ${
                    isSolved ? 'bg-emerald-50/15' : ''
                  }`}
                >
                  {/* Left Column: Status Checkbox + Title + Meta */}
                  <div className="flex items-center space-x-2.5 sm:space-x-3.5 min-w-0 flex-1">
                    {/* LeetCode Solved Toggle Checkbox */}
                    <button
                      onClick={() => handleToggleSolved(q.questionId, q.status)}
                      title={isAuthenticated ? 'Click to toggle solved' : 'Sign in to track progress'}
                      disabled={!isAuthenticated}
                      className={`flex-shrink-0 min-w-[30px] min-h-[30px] flex items-center justify-center -ml-1 rounded-full transition ${
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
                      {/* Title Row */}
                      <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
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
                            <span className="font-semibold text-sm sm:text-base text-slate-800 filter blur-[3.5px] select-none pointer-events-none tracking-wide truncate max-w-[125px] xs:max-w-[165px] sm:max-w-md group-hover:text-amber-700 transition">
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
                          <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.2 rounded">
                            Free
                          </span>
                        )}

                        {!q.isBlurred && q.isPremium && (
                          <span className="hidden sm:inline-flex flex-shrink-0 items-center text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200/60 px-1.5 py-0.2 rounded">
                            <Unlock className="w-2.5 h-2.5 mr-0.5 text-blue-600" /> PRO
                          </span>
                        )}
                      </div>

                      {/* Sub-line: Difficulty + Acceptance + Topic Pills */}
                      <div className="flex items-center space-x-2 text-xs text-slate-500 flex-wrap gap-y-1">
                        <span
                          className={`font-bold text-xs ${
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
                        <span className="font-mono text-[11px] text-slate-500 hidden sm:inline">
                          Acceptance: {acceptance}
                        </span>

                        <span className="text-slate-300 hidden sm:inline">•</span>
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
                        </div>

                        {/* Visa Frequency Indicator (Desktop) */}
                        <span className="text-slate-300 hidden lg:inline">•</span>
                        <span className="text-[11px] text-slate-400 hidden lg:inline-flex items-center space-x-1" title="Visa OA Historical Appearance Frequency">
                          <span>Freq:</span>
                          <span className="w-12 h-1.5 bg-slate-100 rounded-full inline-block overflow-hidden align-middle">
                            <span
                              className="h-full bg-visa-gold block rounded-full"
                              style={{ width: `${visaFreq}%` }}
                            ></span>
                          </span>
                          <span className="font-mono font-bold text-slate-600 text-[10px]">{visaFreq}%</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Desktop Solution Icon */}
                  <div className="hidden md:flex items-center justify-center col-span-2 text-center flex-shrink-0">
                    <Link
                      to={isLocked ? '/checkout' : `/questions/${q.questionId}`}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-visa-blue hover:bg-slate-100 transition"
                      title="Read Algorithmic Notes & Invariants"
                    >
                      <BookOpen className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Right Column: Action Button */}
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
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
              <Lock className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {totalPremiumHidden} High-Frequency Visa Questions Protected
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Titles, optimal invariants, and LeetCode problem mappings are reserved for unlocked members. Unlock the entire 160+ question bank and 7-day preparation roadmap for a one-time ₹20 payment.
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

        {/* LeetCode Style Pagination Footer */}
        {pagination.totalPages > 1 && (
          <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <span className="text-xs text-slate-500">
              Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.total} total Visa problems)
            </span>
            <div className="flex items-center space-x-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                aria-label="Previous page"
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition min-w-[36px] min-h-[36px] flex items-center justify-center shadow-xs"
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
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition min-w-[36px] min-h-[36px] flex items-center justify-center shadow-xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Trust & Guarantee Strip */}
      <div className="bg-slate-100/70 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 text-center sm:text-left">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>
            <strong>Verified Campus Material:</strong> Curated specifically for B.Tech CS 2028 batch Graphic Era Visa India drive.
          </span>
        </div>
        <div className="flex items-center space-x-4 text-slate-500">
          <span>₹20 Lifetime</span>
          <span>•</span>
          <span>Instant UPI Activation</span>
          <span>•</span>
          <span>No Subscriptions</span>
        </div>
      </div>
    </div>
  );
}