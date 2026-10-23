import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { paymentApi } from '../services/api';
import {
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ArrowRight,
  CreditCard,
  AlertCircle,
  Calendar,
  Hash,
  X,
} from 'lucide-react';

export default function PaymentStatusPage() {
  const { user, refreshUser } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [error, setError] = useState('');

  const loadPayments = async () => {
    try {
      const data = await paymentApi.getMyPayments();
      setPayments(data.payments || []);
    } catch (err) {
      setError(err.message || 'Failed to retrieve payments.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadPayments(), refreshUser()]);
  };

  const formatDate = (isoStr) => {
    if (!isoStr) return '—';
    try {
      return new Date(isoStr).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Payment History</h1>
          <p className="text-xs text-slate-500">Track the status of your payment submissions.</p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Status'}</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-visa-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-slate-500">Checking payment verification records...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center space-y-3 bg-white rounded-3xl border border-rose-200">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
          <p className="text-sm text-slate-700">{error}</p>
        </div>
      ) : payments.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 text-center space-y-4 max-w-lg mx-auto">
          <CreditCard className="w-12 h-12 text-slate-400 mx-auto" />
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">No Payment Submissions Found</h2>
            <p className="text-xs text-slate-500">
              You haven't submitted any UPI payment references yet. Unlock all Visa OA questions for ₹20.
            </p>
          </div>
          <Link
            to="/checkout"
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-visa-blue text-white font-bold text-xs hover:bg-visa-lightBlue transition shadow-sm"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((p) => {
            const isApproved = p.status === 'approved';
            const isPending = p.status === 'pending';
            const isRejected = p.status === 'rejected';

            return (
              <div
                key={p.paymentId}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 transition hover:border-slate-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-3">
                    {isApproved && (
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                    )}
                    {isPending && (
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 animate-pulse" />
                      </div>
                    )}
                    {isRejected && (
                      <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0">
                        <XCircle className="w-6 h-6" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-base text-slate-900">₹{p.amountPaise / 100} INR</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                            isApproved
                              ? 'bg-emerald-100 text-emerald-800'
                              : isPending
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono">UTR: {p.utr}</p>
                    </div>
                  </div>

                  {isApproved && (
                    <Link
                      to="/questions"
                      className="px-4 py-2 rounded-xl bg-visa-blue text-white font-bold text-xs hover:bg-visa-lightBlue transition inline-flex items-center space-x-1.5 self-start sm:self-center shadow-sm"
                    >
                      <span>Access Questions</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}

                  {isRejected && (
                    <Link
                      to="/checkout"
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition inline-flex items-center space-x-1.5 self-start sm:self-center shadow-sm"
                    >
                      <span>Submit New UTR</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Submitted: {formatDate(p.submittedAt)}</span>
                  </div>

                  {p.reviewedAt && (
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>Reviewed: {formatDate(p.reviewedAt)}</span>
                    </div>
                  )}
                </div>

                {/* Rejection notice */}
                {isRejected && p.rejectionReason && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
                    <p className="font-bold flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1 text-rose-600" />
                      Reason:
                    </p>
                    <p className="pl-5 text-rose-700">{p.rejectionReason}</p>
                  </div>
                )}

                {/* Uploaded Screenshot Proof */}
                {p.screenshot && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-3">
                    <img
                      src={p.screenshot}
                      alt="Uploaded receipt"
                      onClick={() => setSelectedScreenshot(p.screenshot)}
                      className="w-12 h-12 object-contain bg-white rounded-lg border border-slate-200 cursor-pointer hover:opacity-80 transition"
                    />
                    <div className="text-xs">
                      <p className="font-semibold text-slate-800">Uploaded Payment Proof</p>
                      <button
                        type="button"
                        onClick={() => setSelectedScreenshot(p.screenshot)}
                        className="text-[11px] text-visa-blue hover:underline font-medium"
                      >
                        Click to view full screenshot
                      </button>
                    </div>
                  </div>
                )}

                {/* Pending explanation */}
                {isPending && (
                  <p className="text-[11px] text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200/80 font-medium">
                    Payment proof received. Please wait for admin approval — your account will be activated once verified. You can click "Refresh Status" above at any time.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Screenshot Preview Lightbox Modal */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Your Uploaded Payment Screenshot</h3>
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[65vh] overflow-auto flex items-center justify-center bg-slate-50 p-2 rounded-2xl border border-slate-200">
              <img
                src={selectedScreenshot}
                alt="Proof Full"
                className="max-h-[60vh] max-w-full object-contain rounded-xl"
              />
            </div>
            <div className="text-right">
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
