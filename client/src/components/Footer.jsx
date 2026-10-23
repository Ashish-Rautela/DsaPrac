import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-visa-blue flex items-center justify-center text-white">
                <span className="font-extrabold italic text-sm text-visa-gold">V</span>
              </div>
              <span className="font-bold text-slate-900">Visa OA Prep Platform</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-md">
              A student-first assessment prep collection focused on recurring algorithmic patterns, transaction system models, and high-frequency problem topics encountered in Software Engineering Intern Online Assessments.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Preparation</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/questions" className="hover:text-visa-blue transition">All Visa Questions</Link>
              </li>
              <li>
                <Link to="/questions?difficulty=Easy" className="hover:text-visa-blue transition">Easy Fundamentals</Link>
              </li>
              <li>
                <Link to="/questions?difficulty=Medium" className="hover:text-visa-blue transition">Medium Core Patterns</Link>
              </li>
              <li>
                <Link to="/questions?difficulty=Hard" className="hover:text-visa-blue transition">Hard Advanced OA</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Access & Pricing</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/checkout" className="hover:text-visa-blue transition">₹20 Lifetime Access</Link>
              </li>
              <li>
                <Link to="/payment-status" className="hover:text-visa-blue transition">Payment Status</Link>
              </li>
              <li>
                <span className="text-slate-400 text-xs">Direct UPI Activation</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400">
          <p>© 2026 Visa OA Prep Platform. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <span>Lifetime Access</span>
            <span>•</span>
            <span>160+ Curated Problems</span>
            <span>•</span>
            <span>One-Time ₹20</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
