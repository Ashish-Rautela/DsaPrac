import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Lock, Mail, User, ArrowRight, Check } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/questions', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-visa-blue text-white flex items-center justify-center mx-auto text-2xl font-black italic shadow-sm">
            <span className="text-visa-gold">V</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Free Account</h2>
          <p className="text-xs text-slate-500">Sign up to practice free starter problems and track your progress.</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-2.5 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Johnson"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-visa-blue/20 focus:border-visa-blue transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@student.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-visa-blue/20 focus:border-visa-blue transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-visa-blue/20 focus:border-visa-blue transition"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Minimum 8 characters with strong entropy.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-visa-blue text-white font-bold text-sm hover:bg-visa-lightBlue transition shadow-md disabled:opacity-50 flex items-center justify-center space-x-2 min-h-[44px]"
          >
            {loading ? (
              <span>Creating account...</span>
            ) : (
              <>
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-visa-blue hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
