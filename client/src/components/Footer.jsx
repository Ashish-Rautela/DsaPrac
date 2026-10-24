import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white/70 backdrop-blur-xs border-t border-slate-200/60 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center">
                <svg viewBox="0 0 32 32" className="w-4 h-4" fill="none">
                  <path d="M8 18C8 12.5 11.5 8 16 8" stroke="#3B82F6" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M16 8C20.5 8 24 12.5 24 18" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M11 23C13.5 25 18.5 25 21 23" stroke="#F43F5E" strokeWidth="3.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="font-extrabold text-slate-900 tracking-tight">Visa Prep Platform</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-md">
              A student-first assessment prep collection focused on recurring algorithmic patterns, transaction system models, and high-frequency problem topics encountered in Software Engineering Intern Online Assessments.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Preparation</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/questions" className="hover:text-blue-600 transition">All Visa Questions</Link>
              </li>
              <li>
                <Link to="/prep-plan" className="hover:text-blue-600 transition">OA Research & Plan</Link>
              </li>
              <li>
                <Link to="/questions?difficulty=Easy" className="hover:text-blue-600 transition">Easy Fundamentals</Link>
              </li>
              <li>
                <Link to="/questions?difficulty=Medium" className="hover:text-blue-600 transition">Medium Core Patterns</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Access & Pricing</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/checkout" className="hover:text-blue-600 transition">₹20 Lifetime Access</Link>
              </li>
              <li>
                <Link to="/payment-status" className="hover:text-blue-600 transition">Payment Status</Link>
              </li>
              <li>
                <span className="text-slate-400 text-xs">Direct UPI Verification</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400">
          <p>© 2026 Visa Prep Platform. Crafted for 2027 SWE Interns.</p>
          <div className="flex space-x-3 mt-2 sm:mt-0 font-medium">
            <span className="text-emerald-600">● Lifetime Access</span>
            <span>•</span>
            <span>160+ Curated Problems</span>
            <span>•</span>
            <span>Launch Offer ₹20</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
