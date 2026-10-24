import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCountdown } from '../utils/useCountdown';
import {
  BookOpen,
  Lock,
  Unlock,
  Sparkles,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Layers,
  Terminal,
  Zap,
  ArrowRight,
  ChevronRight,
  AlertCircle,
  FileText,
  Code,
  Database,
  Cpu,
  Globe,
  Server,
  Bot,
  Calendar,
  DollarSign,
  MapPin,
  GraduationCap,
  Briefcase,
  HelpCircle,
} from 'lucide-react';

export default function PrepPlanPage() {
  const { user, isAuthenticated, hasLifetimeAccess } = useAuth();
  const { formatted } = useCountdown();
  const [copiedPromptId, setCopiedPromptId] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const PROMPTS = [
    {
      id: 'prompt-1',
      title: 'Prompt 1 — Personalized OA Plan',
      category: 'Planning & Weakness Diagnosis',
      text: `I am preparing for the Visa 2027 Software Engineering Intern campus OA in India. I have solved 600+ LeetCode problems, have a rating above 1600, and use C++ for DSA.

I have [N] days remaining and [H] hours available daily.

Create a targeted preparation plan based on reported Visa internship OA patterns: arrays, strings, hashing, prefix sums, sliding window, two pointers, greedy, binary search, implementation, and basic graphs/DP.

Do not give me random problems. Select problems that test distinct patterns and expose weaknesses. For every day, specify the topic, problem count, time limit, and review task. Start with a diagnostic test. Do not assume the actual Visa OA format is confirmed.`,
    },
    {
      id: 'prompt-2',
      title: 'Prompt 2 — Debug Without Spoiling the Solution',
      category: 'Socratic Mentorship',
      text: `Act as a strict C++ DSA mentor. I will provide the problem statement, constraints, and my code.

Do not immediately give me the optimal solution.

1. Find the earliest logical flaw.
2. Construct the smallest failing test case.
3. Explain the violated assumption.
4. Give me one hint at a time.
5. Provide corrected code only if I explicitly request it.

After the bug is fixed, analyse time and space complexity, integer overflow, boundary conditions, and hidden-test risks.`,
    },
    {
      id: 'prompt-3',
      title: 'Prompt 3 — Timed Mock Assessment',
      category: 'Real-Time Simulation',
      text: `Act as a coding assessment designer. Create a 70-minute C++ practice assessment with three original problems: one easy implementation problem, one medium array/string problem, and one medium problem requiring a non-obvious optimization.

Do not reveal solutions or topic labels in advance. State constraints, input/output format and examples clearly. Avoid reproducing proprietary or leaked Visa questions.

I will return with my code and completion times. Evaluate correctness, complexity, edge cases and time management. This is a practice simulation, not a claim about the real assessment format.`,
    },
    {
      id: 'prompt-4',
      title: 'Prompt 4 — Technical Interview',
      category: 'Mock Interviewer',
      text: `Act as a Visa software engineering intern technical interviewer. Conduct a realistic interview one question at a time.

Cover DSA, OOP, DBMS/SQL, OS, computer networks and my backend projects. Ask follow-up questions when my answer is vague. Do not reveal the answer before I attempt it.

At the end, score my correctness, problem-solving, communication and technical depth. Identify my three biggest weaknesses and provide a focused revision plan.`,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-visa-blue text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-visa-gold" />
            <span>Campus Recruitment Intelligence • Summer 2027</span>
          </div>

          {hasLifetimeAccess ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              Full Unlocked Plan Active
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
              <Lock className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
              Locked Content (₹20 Lifetime Pass Required)
            </span>
          )}
        </div>

        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Visa 2027 SWE Intern — OA Research & Preparation Plan
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            Consolidated candidate intelligence, timeline distribution, 7-day tactical roadmap, exact AI coaching prompts, and core CS fundamentals for the Visa India campus recruitment drive.
          </p>
        </div>

        {/* Quick Intel Pill Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center">
              <GraduationCap className="w-3.5 h-3.5 mr-1 text-slate-500" /> Eligible
            </div>
            <div className="text-sm font-black text-slate-900 mt-0.5">B.Tech CS 2028</div>
            <div className="text-[11px] text-slate-500">Min 7.0 CGPA • 0 Backlogs</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center">
              <DollarSign className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Stipend
            </div>
            <div className="text-sm font-black text-emerald-700 mt-0.5">₹90,000 / month</div>
            <div className="text-[11px] text-slate-500">+ ₹1,00,000 Relocation</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-rose-500" /> Registration
            </div>
            <div className="text-sm font-black text-rose-600 mt-0.5">26 Oct 2026</div>
            <div className="text-[11px] text-slate-500">9:00 AM Sharp</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1 text-visa-blue" /> Location
            </div>
            <div className="text-sm font-black text-slate-900 mt-0.5">Bengaluru</div>
            <div className="text-[11px] text-slate-500">May – Mid-July 2027</div>
          </div>
        </div>
      </div>

      {/* If NOT Unlocked: Show Teaser and Paywall Lock */}
      {!hasLifetimeAccess ? (
        <div className="space-y-6">
          {/* Paywall CTA Card */}
          <div className="bg-gradient-to-br from-slate-900 via-visa-blue to-slate-950 text-white p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden text-center space-y-6">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-visa-gold/15 blur-3xl pointer-events-none"></div>

            <div className="max-w-2xl mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto border border-white/20 shadow-inner">
                <Lock className="w-8 h-8 text-visa-gold animate-bounce" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
                  Premium Student Intel • ₹20 Lifetime Access
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  Unlock Complete Visa 2027 OA Plan & AI Prompts
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed max-w-lg mx-auto">
                  Access the complete 7-day tactical roadmap, emergency 1–3 day timelines, 4 copyable AI DSA mentor prompts, CS fundamentals checklist, and technical interview questions.
                </p>
              </div>

              {/* Urgency Box */}
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs sm:text-sm font-bold">
                <Clock className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>Price rises to ₹100 in {formatted}! Get lifetime access now for only ₹20.</span>
              </div>

              <div className="pt-2">
                <Link
                  to={isAuthenticated ? '/checkout' : '/register'}
                  className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl bg-visa-gold hover:bg-visa-goldHover text-slate-950 font-black text-base transition shadow-lg transform hover:-translate-y-0.5"
                >
                  <span>Unlock Lifetime Access (₹20)</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Table of Contents Preview */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-visa-blue" />
              <span>What's Inside This Unlocked Preparation Plan:</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {[
                { title: '1. Recruitment Details & Direct Registration Link', desc: 'Graphic Era eligibility, ₹90K/mo stipend details, registration constraints.' },
                { title: '2. Research: When Does OA Happen After Notification?', desc: 'Analysis of 9 candidate reports across LeetCode, Reddit & Glassdoor with 4 timeline scenarios.' },
                { title: '3. Likely OA Format & Assessment Strategy', desc: '4-problem 70-min benchmark and the 6 tactical scoring rules to clear test cases.' },
                { title: '4. Coding Topics Prioritized by Tiers', desc: 'Tier 1 high-frequency vs Tier 2 & 3, plus representative problem patterns.' },
                { title: '5. 7-Day Day-by-Day Preparation Plan', desc: 'Hour-by-hour task distribution, diagnostic test, 2 timed mocks, and emergency plans for 1–3 days.' },
                { title: '6. Recommended 4-Hour Daily Time Allocation', desc: 'Optimized division between DSA, CS fundamentals, projects, and error logging.' },
                { title: '7. How to Use AI Effectively + 4 Copyable Prompts', desc: 'Exact copy-paste prompts for personalized OA plan, non-spoiler debugging, mock tests, and mock interview.' },
                { title: '8. Core CS Fundamentals for the Interview', desc: 'Checklists for OOP, DBMS/SQL, Operating Systems, Computer Networks, and AI Engineering.' },
                { title: '9. Project & Resume Interview Questions', desc: 'The 8 critical backend architecture walkthrough questions + payment security topics.' },
                { title: '10. Curated Practice Resources & Final Strategy', desc: 'Direct problem sets, communities, and execution principles.' },
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Lock className="w-3.5 h-3.5 text-amber-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Blurred Teaser Document Preview */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white p-6 sm:p-8 space-y-6 select-none opacity-60 filter blur-[2px]">
            <h2 className="text-xl font-bold text-slate-900">1. Recruitment Details</h2>
            <p className="text-sm text-slate-600">According to the placement notice from Graphic Era...</p>
            <h2 className="text-xl font-bold text-slate-900">5. Seven-Day Preparation Plan</h2>
            <div className="h-24 bg-slate-100 rounded-xl"></div>
            <h2 className="text-xl font-bold text-slate-900">7. How to Use AI Effectively</h2>
            <div className="h-32 bg-slate-100 rounded-xl"></div>
          </div>
        </div>
      ) : (
        /* Unlocked Full Plan */
        <div className="space-y-8">
          {/* Section 1: Recruitment Details */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-visa-blue">
              <Briefcase className="w-5 h-5" />
              <h2 className="text-xl font-extrabold text-slate-900">1. Recruitment Details</h2>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              According to the official placement notice from Graphic Era for the Visa Software Engineering Intern (Summer 2027) drive:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900">Eligible Batch:</span>
                <p className="text-slate-600 text-xs">B.Tech Computer Science, 2028 passing-out batch.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900">Academic Criteria:</span>
                <p className="text-slate-600 text-xs">Minimum CGPA 7.0 through 4th semester. Strictly no backlogs allowed.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900">Selection Process:</span>
                <p className="text-slate-600 text-xs">Online coding assessment (OA) followed by 1 technical interview.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900">Internship Window & Compensation:</span>
                <p className="text-slate-600 text-xs">Early May to mid-July 2027 (Min 10 weeks). ₹90,000/month stipend + ₹1,00,000 relocation bonus.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
              <div className="space-y-1">
                <div className="font-bold text-visa-blue flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-visa-blue" />
                  <span>Registration Closes: 9:00 AM, 26 October 2026</span>
                </div>
                <p className="text-xs text-slate-600">
                  Register with your <strong>personal email address</strong> and do not change it during recruitment.
                </p>
              </div>

              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLScB3jAdQeT2fVtTSHVA2jwqf8QqQYuABX7UqVDByIUL-JVmTg/viewform?usp=publish-editor"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-visa-blue hover:bg-visa-lightBlue text-white font-bold text-xs inline-flex items-center space-x-1.5 transition flex-shrink-0 shadow-sm"
              >
                <span>Open Registration Form</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </section>

          {/* Section 2: Research Question - Timeline */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-visa-blue">
              <HelpCircle className="w-5 h-5" />
              <h2 className="text-xl font-extrabold text-slate-900">
                2. Research Question: How Many Days After Notification Does the OA Happen?
              </h2>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              There is no universal fixed timeline for Visa campus recruitment. Candidate experiences from Reddit, LeetCode, and Glassdoor show online assessments can arrive anywhere from <strong>the same day registration closes</strong> to <strong>within 1–4 days</strong> or slightly later.
            </p>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-semibold flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                <strong>Tactical Rule for Graphic Era:</strong> Prepare as if the OA could happen immediately after registration closes on 26 October. Do not wait for an official date announcement to start practice.
              </span>
            </div>

            {/* Planning Scenarios Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full min-w-[460px] text-left text-sm">
                <thead className="bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Time Available After Notification</th>
                    <th className="py-3 px-4">Recommended Strategic Approach</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700 text-xs sm:text-sm">
                  <tr className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-bold text-rose-600">1–3 Days</td>
                    <td className="py-3 px-4">Emergency mode: High-frequency DSA (Tier 1 topics) and one 70-min timed mock test.</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-bold text-amber-600">4–7 Days</td>
                    <td className="py-3 px-4">Core DSA patterns, two timed mock tests, and targeted revision on failed patterns.</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-bold text-blue-600">8–14 Days</td>
                    <td className="py-3 px-4">DSA mastery + CS fundamentals (OOP, DBMS, OS, Networks) + Project interview walkthroughs.</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-bold text-emerald-600">&gt; 14 Days</td>
                    <td className="py-3 px-4">Repeat mock-and-review cycles based on measured weak spots and deep algorithm intuition.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Direct Links to Source Discussions */}
            <div className="pt-2 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Primary Candidate Discussions Analyzed:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  { name: 'Reddit LeetcodeDesi — Visa Intern OA On-Campus', url: 'https://www.reddit.com/r/LeetcodeDesi/comments/1vum3sa/visa_intern_oa_oncampus/' },
                  { name: 'Reddit csMajors — Visa SWE Intern 2027 Timeline', url: 'https://www.reddit.com/r/csMajors/comments/1wobs70/visa_swe_intern_2027_sophomore_anyone_received/' },
                  { name: 'LeetCode — Visa OA Experience & Format', url: 'https://www.reddit.com/r/leetcode/comments/1n2a675/visa_oa_experience/' },
                  { name: 'Glassdoor — Visa SWE Intern Interview Questions', url: 'https://www.glassdoor.co.in/Interview/Visa-Inc-Interview-Questions-E3035.htm?filter.jobTitleExact=Software+Engineer%28Internship%29' },
                ].map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Section 3: Likely OA Format */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-visa-blue">
              <Code className="w-5 h-5" />
              <h2 className="text-xl font-extrabold text-slate-900">3. Likely OA Format & Assessment Strategy</h2>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Visa technical assessments typically consist of <strong>3 to 4 coding questions</strong> in approximately <strong>70 to 90 minutes</strong> (often hosted on HackerRank or CodeSignal).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Question 1</span>
                <div className="font-extrabold text-sm mt-0.5">Easy Implementation</div>
                <p className="text-[11px] text-emerald-800 mt-1">String manipulation, basic math, or direct simulation.</p>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Question 2</span>
                <div className="font-extrabold text-sm mt-0.5">Easy-to-Medium</div>
                <p className="text-[11px] text-blue-800 mt-1">Arrays, frequency hash maps, prefix sums, or two pointers.</p>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Question 3</span>
                <div className="font-extrabold text-sm mt-0.5">Medium Optimization</div>
                <p className="text-[11px] text-amber-800 mt-1">Sliding window, greedy choice, binary search on answer.</p>
              </div>

              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Question 4</span>
                <div className="font-extrabold text-sm mt-0.5">Medium-to-Hard</div>
                <p className="text-[11px] text-rose-800 mt-1">Graph/matrix traversal, monotonic stack, or DP state machine.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Assessment Tactics for Maximizing Cutoff Score:
              </span>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-1.5 list-disc list-inside">
                <li><strong>Read all questions before committing:</strong> Identify the 2 easiest questions and lock in those points first.</li>
                <li><strong>Do not get trapped:</strong> Avoid spending 40+ minutes chasing 100% on a single tricky problem if you haven't solved the others.</li>
                <li><strong>Check constraint sizes:</strong> If N ≤ 10^5, an O(N^2) solution will TLE. Target O(N) or O(N log N).</li>
                <li><strong>Handle edge cases defensively:</strong> Zero elements, negative numbers, all duplicate values, integer overflow (use <code>long long</code> in C++ / BigInt).</li>
                <li><strong>Leave a 10-minute compilation buffer:</strong> Avoid rushing final submissions at the 1-minute warning.</li>
              </ul>
            </div>
          </section>

          {/* Section 4: Likely Coding Topics */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-visa-blue">
              <Layers className="w-5 h-5" />
              <h2 className="text-xl font-extrabold text-slate-900">4. High-Yield Coding Topics (Prioritized Tiers)</h2>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-200 text-emerald-900">
                    Tier 1 • Absolute Highest Priority
                  </span>
                  <span className="text-xs font-semibold text-emerald-800">80%+ of test cases test these</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700">
                  Arrays & Strings, Hash Maps & Frequency Counting, Prefix Sums & Subarrays, Sliding Window, Two Pointers, Sorting, Greedy Decisions, Binary Search, Simulation.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-200 text-blue-900">
                    Tier 2 • Important
                  </span>
                  <span className="text-xs font-semibold text-blue-800">Frequently used in Questions 3 & 4</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700">
                  Stacks & Queues, Monotonic Stacks, Priority Queues / Heaps, Binary Trees, BFS / DFS Traversal, Matrix Grid Operations, Basic Dynamic Programming, Backtracking.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-200 text-slate-800">
                    Tier 3 • Lower Priority in Short Window
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Advanced DP on Trees, Segment Trees, Advanced Number Theory, Complex Geometry. Focus on Tier 1 and Tier 2 accuracy first.
                </p>
              </div>
            </div>

            {/* Representative Problem Types */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 pt-2">
              <table className="w-full min-w-[500px] text-left text-sm">
                <thead className="bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Representative Visa OA Pattern</th>
                    <th className="py-3 px-4">Skills & Invariants Tested</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700 text-xs sm:text-sm">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900">Sum elements greater than neighbours</td>
                    <td className="py-3 px-4">Array traversal, boundary handling, 1D/2D neighbor checks.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900">Subarrays with at least k distinct values</td>
                    <td className="py-3 px-4">Hash map counting, sliding window invariant contraction.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900">String formatting, justification & alignment</td>
                    <td className="py-3 px-4">Implementation accuracy, edge whitespace handling.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900">Scheduling with sorted time intervals</td>
                    <td className="py-3 px-4">Two pointers, sorting by end times, greedy interval merging.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900">Min operations to form palindrome / string target</td>
                    <td className="py-3 px-4">Greedy choices, frequency parity counting, two pointers.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900">Matrix grid routing / minimum path cost</td>
                    <td className="py-3 px-4">BFS/DFS, queue states, boundary checks, visited array.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 5: Seven-Day Tactical Plan */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-visa-blue">
              <Calendar className="w-5 h-5" />
              <h2 className="text-xl font-extrabold text-slate-900">5. Seven-Day Preparation Plan (4 Hours Daily)</h2>
            </div>

            <p className="text-sm text-slate-600">
              Structured for maximum retention and test-condition readiness:
            </p>

            <div className="space-y-3">
              {[
                { day: 'Day 1', focus: 'Diagnostic & Core Arrays', tasks: 'Take a 60–70 min mixed coding test. Review arrays, hashing, prefix sums and sliding window. Record all failed or slow problems in an error log.' },
                { day: 'Day 2', focus: 'Core Algorithm Patterns', tasks: 'Two pointers, binary search, greedy algorithms, stacks and heaps. Solve 2 implementation-heavy problems and re-solve 1 failed problem from Day 1.' },
                { day: 'Day 3', focus: 'Trees, Graphs & Optimization', tasks: 'BFS & DFS traversals, matrix grid BFS, basic shortest paths, and fundamental 1D dynamic programming.' },
                { day: 'Day 4', focus: 'First Full Timed Mock', tasks: 'Attempt a fresh timed assessment (3-4 problems in 70 mins). Zero AI hints during test. Record time per problem and classify failed test cases.' },
                { day: 'Day 5', focus: 'Targeted Weakness Revision', tasks: 'Drill the 2 weakest patterns revealed in the mock. Solve 1 tricky string-parsing/simulation problem. Re-test failed test cases.' },
                { day: 'Day 6', focus: 'Second Mock & Interview Prep', tasks: 'Take another full timed assessment. Practice explaining one solution aloud (brute force -> optimal). Revise OOP, SQL, and your main backend project.' },
                { day: 'Day 7', focus: 'Final Readiness & Calm', tasks: 'Review error log. Revisit common edge cases (overflow, 0, null). Short 20-min warm-up problem. Test laptop, webcam, and stable internet connection.' },
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5 sm:w-1/3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-visa-blue bg-blue-100 px-2 py-0.5 rounded">
                      {item.day}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-sm mt-1">{item.focus}</h4>
                  </div>
                  <p className="text-xs text-slate-600 sm:w-2/3 leading-relaxed">{item.tasks}</p>
                </div>
              ))}
            </div>

            {/* If OA happens earlier callouts */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-950">
                <strong className="block text-rose-800 font-bold mb-1">If only 1–3 Days Remain:</strong>
                Spend 70% time on timed Tier 1 patterns (arrays, sliding window, two pointers, greedy). Take 1 timed mock. Do not start new advanced topics.
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950">
                <strong className="block text-amber-800 font-bold mb-1">If 4–7 Days Remain:</strong>
                Follow the 7-day plan completely. Take 2 full mocks. Revise OOP and SQL in parallel for the follow-up interview.
              </div>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-950">
                <strong className="block text-blue-800 font-bold mb-1">If 8–14 Days Remain:</strong>
                Add OS, DBMS, networking, and distributed systems walkthroughs. Repeat mock cycles to achieve consistent sub-15 minute solution speed.
              </div>
            </div>
          </section>

          {/* Section 6: Recommended Daily Time Allocation */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-visa-blue">
              <Clock className="w-5 h-5" />
              <h2 className="text-xl font-extrabold text-slate-900">6. Recommended Daily Time Allocation (4-Hour Session)</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-2xl font-black text-visa-blue">2 Hours</div>
                <div className="text-xs font-bold text-slate-800 mt-1">DSA & Timed Coding</div>
                <p className="text-[11px] text-slate-500 mt-1">Uninterrupted problem solving under clock</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-2xl font-black text-amber-600">1 Hour</div>
                <div className="text-xs font-bold text-slate-800 mt-1">Core CS Fundamentals</div>
                <p className="text-[11px] text-slate-500 mt-1">OOP, SQL, OS, Computer Networks</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-2xl font-black text-emerald-600">35 Mins</div>
                <div className="text-xs font-bold text-slate-800 mt-1">Project & Interview Prep</div>
                <p className="text-[11px] text-slate-500 mt-1">Architectural walkthroughs, trade-offs</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-2xl font-black text-rose-600">25 Mins</div>
                <div className="text-xs font-bold text-slate-800 mt-1">Review & Error Log</div>
                <p className="text-[11px] text-slate-500 mt-1">Catalog bugs, edge case mistakes</p>
              </div>
            </div>
          </section>

          {/* Section 7: How to Use AI Effectively + Copyable Prompts */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center space-x-2 text-visa-blue">
              <Bot className="w-5 h-5" />
              <h2 className="text-xl font-extrabold text-slate-900">
                7. How to Use AI Effectively + 4 Copyable Master Prompts
              </h2>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Do not use AI simply to give you solutions. Use AI as a <strong>strict Socratic DSA coach</strong>, mock test generator, and technical interviewer. Copy and paste these exact prompts into Claude, ChatGPT, or Gemini:
            </p>

            <div className="space-y-4">
              {PROMPTS.map((prompt) => (
                <div
                  key={prompt.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden shadow-sm"
                >
                  <div className="bg-slate-100 px-4 py-3 flex items-center justify-between border-b border-slate-200 flex-wrap gap-2">
                    <div className="flex items-center space-x-2">
                      <Terminal className="w-4 h-4 text-visa-blue" />
                      <span className="font-bold text-xs sm:text-sm text-slate-900">{prompt.title}</span>
                      <span className="text-[10px] uppercase font-bold bg-white text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                        {prompt.category}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(prompt.id, prompt.text)}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 transition inline-flex items-center space-x-1.5 shadow-sm"
                    >
                      {copiedPromptId === prompt.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copy Prompt</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 bg-slate-950 text-slate-100 font-mono text-[11px] sm:text-xs overflow-x-auto whitespace-pre-wrap break-words leading-relaxed select-all">
                    {prompt.text}
                  </div>
                </div>
              ))}
            </div>

            {/* AI Usage Rules */}
            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-amber-950 space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Strict AI Usage Rules:</span>
              </span>
              <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                <li>Attempt problems independently for at least 25 minutes before requesting hints.</li>
                <li>Demand that AI produces minimal failing test cases instead of code rewrites.</li>
                <li>Verify AI-generated code against hidden boundary cases (integer limits, null checks).</li>
                <li>Never paste real assessment questions during an active monitored online exam.</li>
              </ul>
            </div>
          </section>

          {/* Section 8: Core CS Fundamentals */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-visa-blue">
              <Cpu className="w-5 h-5" />
              <h2 className="text-xl font-extrabold text-slate-900">
                8. Core CS Fundamentals for the Technical Interview
              </h2>
            </div>

            <p className="text-sm text-slate-600">
              The Graphic Era notice specifies one follow-up technical interview. Be prepared for:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-extrabold text-slate-900 flex items-center space-x-2">
                  <Code className="w-4 h-4 text-visa-blue" />
                  <span>OOP & Software Design</span>
                </h4>
                <ul className="text-slate-600 space-y-1 list-disc list-inside text-xs">
                  <li>Encapsulation, abstraction, inheritance & polymorphism</li>
                  <li>Composition over inheritance</li>
                  <li>SOLID principles with practical examples</li>
                  <li>Singleton, Factory, and Strategy design patterns</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-extrabold text-slate-900 flex items-center space-x-2">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span>DBMS & SQL</span>
                </h4>
                <ul className="text-slate-600 space-y-1 list-disc list-inside text-xs">
                  <li>Joins (INNER, LEFT, RIGHT), window functions, subqueries</li>
                  <li>B-Tree indexing and query execution plans (EXPLAIN)</li>
                  <li>ACID properties, isolation levels, and phantom reads</li>
                  <li>Deadlocks and concurrency control</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-extrabold text-slate-900 flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-amber-600" />
                  <span>Operating Systems</span>
                </h4>
                <ul className="text-slate-600 space-y-1 list-disc list-inside text-xs">
                  <li>Processes vs Threads, memory layout, PCB</li>
                  <li>Mutex vs Semaphore, race conditions, critical sections</li>
                  <li>Virtual memory, paging, and page replacement algorithms</li>
                  <li>CPU scheduling algorithms</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-extrabold text-slate-900 flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span>Computer Networks</span>
                </h4>
                <ul className="text-slate-600 space-y-1 list-disc list-inside text-xs">
                  <li>TCP 3-way handshake vs UDP performance trade-offs</li>
                  <li>HTTP/1.1 vs HTTP/2 vs HTTP/3, HTTPS & TLS handshake</li>
                  <li>DNS resolution lifecycle</li>
                  <li>REST API design principles and HTTP status codes</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-extrabold text-slate-900 flex items-center space-x-2">
                  <Server className="w-4 h-4 text-purple-600" />
                  <span>Backend & Payments Architecture</span>
                </h4>
                <ul className="text-slate-600 space-y-1 list-disc list-inside text-xs">
                  <li>Idempotency keys in payment processing</li>
                  <li>Database transactions and rollback mechanisms</li>
                  <li>Caching strategies (Redis, Cache-Aside, Write-Through)</li>
                  <li>Message queues (Kafka, SQS) & asynchronous workers</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-extrabold text-slate-900 flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-rose-600" />
                  <span>AI Engineering Fundamentals</span>
                </h4>
                <ul className="text-slate-600 space-y-1 list-disc list-inside text-xs">
                  <li>LLM tokens and context window limitations</li>
                  <li>Prompt engineering & structured JSON outputs</li>
                  <li>RAG (Retrieval-Augmented Generation) & embeddings</li>
                  <li>Agentic execution loops and tool calling</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 9: Project & Behavioral Interview Prep */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-visa-blue">
              <CheckCircle2 className="w-5 h-5" />
              <h2 className="text-xl font-extrabold text-slate-900">
                9. Project Walkthrough & Visa Specific Questions
              </h2>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Be Ready to Answer These 8 Core Technical Project Questions:
              </span>
              <ol className="text-xs sm:text-sm text-slate-600 space-y-1.5 list-decimal list-inside">
                <li>Explain your system's architecture and the end-to-end lifecycle of a client request.</li>
                <li>Why did you choose your database (SQL vs NoSQL) and how is the schema normalized/indexed?</li>
                <li>How do you guarantee idempotency if a network timeout causes a client to retry?</li>
                <li>What happens when a downstream dependency (payment gateway, third-party API) fails?</li>
                <li>How did you test your application under high concurrency and load?</li>
                <li>What architectural trade-offs did you make due to time or resource constraints?</li>
                <li>Describe the most challenging bug you diagnosed and the tools you used to fix it.</li>
                <li>What was your exact individual contribution versus the rest of your team?</li>
              </ol>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2 text-xs sm:text-sm">
              <strong className="text-visa-blue font-bold block">
                Visa Behavioral & Payments Questions:
              </strong>
              <ul className="text-slate-600 space-y-1 list-disc list-inside text-xs">
                <li>Why Visa and why payments infrastructure over consumer tech?</li>
                <li>Tell me about a time you took ownership when requirements were ambiguous.</li>
                <li>Describe a technical disagreement with a peer and how you resolved it with data.</li>
                <li>How would you design a fault-tolerant payment confirmation flow?</li>
              </ul>
            </div>
          </section>

          {/* Section 10 & 11: Resources & Final Strategy */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-visa-blue">
              <Zap className="w-5 h-5" />
              <h2 className="text-xl font-extrabold text-slate-900">10. Final Strategy Checklist</h2>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Success in the Visa OA is determined by <strong>accuracy under time constraints</strong> and <strong>graceful handling of unfamiliar problems</strong>, not just high LeetCode problem counts.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Timed implementation of unfamiliar problems (practice with a 20-min countdown).</span>
              </div>
              <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Maintaining an active error log of off-by-one, boundary, and overflow bugs.</span>
              </div>
              <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Completing 2 realistic 70-min mock assessments without any external assistance.</span>
              </div>
              <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Revising OOP, SQL, and preparing an architectural walkthrough of your primary project.</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <span>Document Status: Verified campus research plan for Graphic Era Visa SWE Intern drive.</span>
              <Link
                to="/questions"
                className="px-4 py-2 rounded-xl bg-visa-blue text-white font-bold text-xs hover:bg-visa-lightBlue transition inline-flex items-center space-x-1"
              >
                <span>Practice Visa Question Bank</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
