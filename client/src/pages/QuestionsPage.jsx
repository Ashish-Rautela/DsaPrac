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
  Calendar,
  Wallet,
  Code2,
  Check,
  ChevronRight as ArrowRightIcon,
  Bell,
  CheckSquare,
  GraduationCap,
  Briefcase,
  Layers,
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

// Zen Mascot SVG directly inspired by user reference design
function ZenMascot() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain select-none drop-shadow-sm"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left Ear */}
      <circle cx="65" cy="55" r="22" fill="#FFFFFF" stroke="#334155" strokeWidth="3.5" />
      <circle cx="65" cy="55" r="13" fill="#FBBF24" />

      {/* Right Ear */}
      <circle cx="135" cy="55" r="22" fill="#FFFFFF" stroke="#334155" strokeWidth="3.5" />
      <circle cx="135" cy="55" r="13" fill="#FBBF24" />

      {/* Head */}
      <ellipse cx="100" cy="95" rx="56" ry="48" fill="#FFFFFF" stroke="#334155" strokeWidth="3.5" />

      {/* Peaceful closed smiling eyes */}
      <path d="M76 93 C81 87, 89 87, 94 93" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M106 93 C111 87, 119 87, 124 93" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" fill="none" />

      {/* Cute Nose and Mouth */}
      <ellipse cx="100" cy="100" rx="5" ry="4" fill="#334155" />
      <path d="M96 105 C98 108, 100 108, 100 105 C100 108, 102 108, 104 105" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Rosy Blush Cheeks */}
      <ellipse cx="72" cy="105" rx="9" ry="5.5" fill="#FDA4AF" />
      <ellipse cx="128" cy="105" rx="9" ry="5.5" fill="#FDA4AF" />

      {/* Body */}
      <path d="M72 135 C72 125, 128 125, 128 135 L145 168 C145 178, 55 178, 55 168 Z" fill="#FFFFFF" stroke="#334155" strokeWidth="3.5" />

      {/* Lotus Pose Crossed Legs */}
      <path d="M52 165 C52 150, 92 150, 98 165 C88 176, 62 176, 52 165 Z" fill="#FFFFFF" stroke="#334155" strokeWidth="3" />
      <path d="M148 165 C148 150, 108 150, 102 165 C112 176, 138 176, 148 165 Z" fill="#FFFFFF" stroke="#334155" strokeWidth="3" />

      {/* Arms holding coffee mug */}
      <path d="M68 136 C68 148, 88 156, 96 148" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M132 136 C132 148, 112 156, 104 148" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" fill="none" />

      {/* Coffee Mug */}
      <rect x="94" y="132" width="22" height="24" rx="4" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
      <path d="M116 138 C122 138, 122 150, 116 150" stroke="#1D4ED8" strokeWidth="2" fill="none" />
      {/* Steam lines */}
      <path d="M99 126 C99 122, 103 120, 103 116" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
      <path d="M106 126 C106 122, 110 120, 110 116" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
      {/* Coffee bean on mug */}
      <ellipse cx="105" cy="144" rx="3" ry="4.5" fill="#BFDBFE" transform="rotate(15 105 144)" />
    </svg>
  );
}

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* ======================================================================
          TOP ROW: ZEN GREETING HERO + NOTIFICATIONS WIDGET
          ====================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Hero Card with Zen Bear Mascot */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-4 max-w-md">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Visa SWE Intern Summer 2027
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Hi, {user ? user.name.split(' ')[0] : 'Candidate'}!
              </h1>
              <p className="text-sm text-slate-500 mt-1">What are we practicing today?</p>
            </div>

            {/* Quick Action Checklist Pills (Matching reference design) */}
            <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
              <Link
                to="/prep-plan"
                className="flex items-center space-x-2 text-slate-700 hover:text-visa-blue transition font-semibold"
              >
                <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">✓</span>
                <span>Check Prep Plan</span>
              </Link>

              <Link
                to="/questions?difficulty=Easy"
                className="flex items-center space-x-2 text-slate-700 hover:text-visa-blue transition font-semibold"
              >
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold">✓</span>
                <span>Easy Starters</span>
              </Link>

              <Link
                to="/prep-plan#prompts"
                className="flex items-center space-x-2 text-slate-700 hover:text-visa-blue transition font-semibold"
              >
                <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-bold">✓</span>
                <span>4 AI Prompts</span>
              </Link>

              {!hasLifetimeAccess ? (
                <Link
                  to="/checkout"
                  className="flex items-center space-x-2 text-slate-700 hover:text-visa-blue transition font-semibold"
                >
                  <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[10px] font-bold">✓</span>
                  <span>Unlock for ₹20</span>
                </Link>
              ) : (
                <span className="flex items-center space-x-2 text-emerald-700 font-semibold">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold">✓</span>
                  <span>Lifetime Active</span>
                </span>
              )}
            </div>
          </div>

          {/* Zen Bear Mascot Illustration */}
          <div className="flex-shrink-0 flex items-center justify-center pt-2 sm:pt-0">
            <ZenMascot />
          </div>
        </div>

        {/* Right Notifications Widget (Matching reference design) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">Key Recruitment Alerts</h2>
            </div>
            <span className="text-[11px] font-bold text-visa-blue">Live</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Urgency Notification Pill */}
            {!hasLifetimeAccess && (
              <Link
                to="/checkout"
                className="block p-3 rounded-2xl bg-amber-50/80 hover:bg-amber-100/70 border border-amber-200/70 transition space-y-0.5 group"
              >
                <div className="flex items-center justify-between text-amber-900 font-bold">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                    <span>₹20 Launch Access</span>
                  </span>
                  <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded-full border border-amber-200">
                    {formatted} left
                  </span>
                </div>
                <p className="text-[11px] text-amber-800">Price jumps to ₹100 when timer ends. Tap to unlock.</p>
              </Link>
            )}

            {/* Registration Cutoff Notification Pill */}
            <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200/60 space-y-0.5">
              <div className="flex items-center justify-between text-rose-900 font-bold">
                <span>Graphic Era Drive</span>
                <span className="text-[10px] bg-white px-1.5 py-0.5 rounded font-bold text-rose-700">26 Oct 9 AM</span>
              </div>
              <p className="text-[11px] text-rose-800">B.Tech CS 2028 batch • Min 7.0 CGPA • 0 Backlogs</p>
            </div>

            {/* Stipend Notification Pill */}
            <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/60 space-y-0.5">
              <div className="flex items-center justify-between text-blue-900 font-bold">
                <span>Stipend & Location</span>
                <span className="text-[10px] bg-white px-1.5 py-0.5 rounded font-bold text-blue-700">Bengaluru</span>
              </div>
              <p className="text-[11px] text-blue-800">₹90,000/month + ₹1,00,000 relocation package</p>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================================
          4 MODULAR STAT TILES (Directly from reference design bottom row)
          ====================================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Tile 1: Monthly Stipend (Soft Rose) */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col justify-between space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center font-bold">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Monthly Stipend</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">₹90,000</div>
            <p className="text-[11px] text-slate-400 mt-0.5">+ ₹1,00,000 Relocation</p>
          </div>
        </div>

        {/* Tile 2: Curated OA Questions (Soft Blue) */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col justify-between space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center font-bold">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Visa OA Bank</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">160+ Problems</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Direct LeetCode IDs</p>
          </div>
        </div>

        {/* Tile 3: Registration Cutoff (Soft Amber) */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col justify-between space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Registration Deadline</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">26 Oct, 9 AM</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Personal email only</p>
          </div>
        </div>

        {/* Tile 4: Assessment Format (Soft Emerald) */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col justify-between space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">OA Benchmark</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">4 Questions</div>
            <p className="text-[11px] text-slate-400 mt-0.5">70–90 Min Test Pattern</p>
          </div>
        </div>
      </div>

      {/* ======================================================================
          SEARCH & FILTER MODULE
          ====================================================================== */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search problems by name (e.g. LRU Cache, Two Sum, Justification)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-2xl border-0 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-visa-blue/20 transition"
            />
          </div>

          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={difficulty}
              onChange={(e) => handleDifficultyChange(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 rounded-2xl border-0 text-base sm:text-sm text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-visa-blue/20 transition w-full sm:w-auto"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            {/* Topic Dropdown */}
            <select
              value={topic}
              onChange={(e) => handleTopicChange(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 rounded-2xl border-0 text-base sm:text-sm text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-visa-blue/20 transition w-full sm:w-auto"
            >
              {POPULAR_TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t === 'All' ? 'All Topics' : t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Topic Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1 border-t border-slate-100 pt-3 no-scrollbar">
          {POPULAR_TOPICS.slice(0, 10).map((t) => (
            <button
              key={t}
              onClick={() => handleTopicChange(t)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition flex-shrink-0 ${
                (topic === t) || (t === 'All' && topic === 'All')
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================================
          QUESTION LIST MODULE (Clean, Beautiful, Zero Overlap)
          ====================================================================== */}
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden">
        {/* Table Header (Desktop) */}
        <div className="hidden sm:grid grid-cols-12 px-6 py-3.5 bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <div className="col-span-1">Status</div>
          <div className="col-span-7">Problem Title</div>
          <div className="col-span-2">Difficulty</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-visa-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-400">Loading Visa questions...</p>
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
                  className={`px-4 py-3.5 sm:px-6 sm:py-4 flex items-center justify-between gap-3 transition hover:bg-slate-50/60 ${
                    isSolved ? 'bg-emerald-50/20' : ''
                  }`}
                >
                  {/* Left Column: Status Checkbox + Title + Meta */}
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
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400 stroke-[1.5]" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center space-x-2 min-w-0">
                        {q.leetcodeId && !q.isBlurred && (
                          <span className="text-xs font-mono font-bold text-slate-400 flex-shrink-0">
                            #{q.leetcodeId}
                          </span>
                        )}

                        {q.isBlurred ? (
                          <Link
                            to="/checkout"
                            className="inline-flex items-center space-x-1.5 min-w-0 group"
                          >
                            <span className="text-sm font-medium text-slate-600 filter blur-[3.5px] select-none pointer-events-none truncate max-w-[130px] xs:max-w-[170px] sm:max-w-md group-hover:text-slate-900 transition">
                              {q.blurredPlaceholder || 'Visa Algorithm Pattern Question'}
                            </span>
                            <Lock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                          </Link>
                        ) : (
                          <Link
                            to={`/questions/${q.questionId}`}
                            className="text-sm font-bold text-slate-900 hover:text-visa-blue transition truncate block min-w-0"
                          >
                            {q.title}
                          </Link>
                        )}

                        {!q.isBlurred && !q.isPremium && (
                          <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded-md">
                            Free
                          </span>
                        )}
                      </div>

                      {/* Difficulty and topics */}
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
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
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500 text-[11px] truncate">
                          {q.topics.slice(0, 2).join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Clean Action Button (Zero overlap) */}
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {!isLocked && q.leetcodeUrl && (
                      <a
                        href={q.leetcodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden md:inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
                      >
                        <span>LeetCode</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    )}

                    {isLocked ? (
                      <Link
                        to="/checkout"
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 transition flex items-center space-x-1.5 shadow-sm whitespace-nowrap"
                      >
                        <Lock className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Unlock ₹20</span>
                      </Link>
                    ) : (
                      <Link
                        to={`/questions/${q.questionId}`}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 active:scale-95 text-white transition flex items-center space-x-1 shadow-sm whitespace-nowrap"
                      >
                        <span>Notes</span>
                        <ArrowRightIcon className="w-3.5 h-3.5 text-slate-300" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Clean, Modular Unlock Footer Banner */}
        {!hasLifetimeAccess && totalPremiumHidden > 0 && (
          <div className="p-6 sm:p-8 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-t border-amber-200/80 text-center space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <Lock className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              <strong>{totalPremiumHidden}</strong> high-frequency Visa OA questions and solution breakdowns are unlocked with permanent lifetime access.
            </p>
            <Link
              to="/checkout"
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-md"
            >
              <span>Unlock Full Bank for ₹20</span>
              <Sparkles className="w-3.5 h-3.5 text-visa-gold" />
            </Link>
          </div>
        )}

        {/* Modular Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong>
            </span>
            <div className="flex items-center space-x-1.5">
              <button
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition"
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