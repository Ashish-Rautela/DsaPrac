import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { paymentApi } from '../services/api';
import { compressImage } from '../utils/imageCompressor';
import { useCountdown } from '../utils/useCountdown';
import qr1 from '../assets/qr/qr1.jpg';
import qr2 from '../assets/qr/qr2.jpg';
import {
  CreditCard,
  QrCode,
  Copy,
  Check,
  AlertCircle,
  Clock,
  CheckCircle2,
  ArrowRight,
  Info,
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  Sparkles,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';

export default function CheckoutPage() {
  const { user, isAuthenticated, hasLifetimeAccess, refreshUser } = useAuth();
  const { formatted } = useCountdown();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedQr, setSelectedQr] = useState('both'); // 'both' | 'qr1' | 'qr2'
  const [utr, setUtr] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successSubmission, setSuccessSubmission] = useState(null);

  const processFile = async (file) => {
    if (!file) return;
    setError('');
    setIsCompressing(true);

    try {
      const result = await compressImage(file);
      setScreenshot(result);
    } catch (err) {
      setError(err.message || 'Failed to process screenshot.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer?.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemoveScreenshot = () => {
    setScreenshot(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (!screenshot && !utr.trim()) {
      setError('Please upload your payment screenshot or enter your 12-digit UTR reference.');
      return;
    }

    // Auto-generate reference tag if user only submitted screenshot
    const effectiveUtr = utr.trim()
      ? utr.trim().toUpperCase()
      : `PROOF${Date.now().toString().slice(-8)}`;

    setLoading(true);

    try {
      const res = await paymentApi.submit({
        utr: effectiveUtr,
        screenshot: screenshot ? screenshot.dataUrl : null,
      });
      setSuccessSubmission(res.payment);
      refreshUser();
    } catch (err) {
      setError(err.message || 'Payment submission failed. Please verify your reference.');
    } finally {
      setLoading(false);
    }
  };

  if (hasLifetimeAccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900">Lifetime Access Active</h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            You already possess full lifetime access to all Visa OA questions, solutions, and algorithmic notes. No further payments are required.
          </p>
        </div>
        <div className="pt-4">
          <Link
            to="/questions"
            className="px-6 py-3 rounded-xl bg-visa-blue text-white font-bold text-sm hover:bg-visa-lightBlue transition inline-flex items-center space-x-2"
          >
            <span>Go to Question Bank</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3.5 py-1 rounded-full inline-block">
          One-Time Payment • <span className="font-black text-emerald-950">₹20</span> Lifetime Access
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Unlock Visa OA Lifetime Access
        </h1>
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
          Pay ₹20 on <strong>either of the two QR codes</strong> below, upload your payment screenshot, and wait for admin approval to get full lifetime access.
        </p>

        {/* 5-Hour Deadline Countdown Banner */}
        <div className="bg-white border border-red-200/80 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-800 shadow-[0_4px_16px_rgba(239,68,68,0.06)]">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 border border-red-200/70 flex items-center justify-center flex-shrink-0 font-bold shadow-xs">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center space-x-2">
                <span className="text-[11px] uppercase font-black bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-red-600 animate-ping"></span>
                  Limited Offer
                </span>
                <span>Special ₹20 Launch Offer Ending!</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Subscription will increase to <strong className="font-bold text-red-600">₹100</strong> once the countdown ends. Buy fast!
              </p>
            </div>
          </div>
          <div className="bg-red-50 border border-red-200/80 text-red-700 font-mono font-bold text-sm px-3.5 py-1.5 rounded-xl whitespace-nowrap shadow-xs">
            {formatted}
          </div>
        </div>
      </div>

      {successSubmission ? (
        /* Submission Success / Waiting for Approval Notice */
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.04)] p-8 sm:p-10 text-center space-y-6 max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Payment Submitted Successfully</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Your payment proof has been submitted with reference <strong className="font-mono text-slate-900">{successSubmission.utr}</strong>.
            </p>
          </div>

          {/* Screenshot Preview in Confirmation */}
          {successSubmission.screenshot && (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 max-w-xs mx-auto space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Uploaded Payment Screenshot
              </span>
              <img
                src={successSubmission.screenshot}
                alt="Payment proof"
                className="w-full max-h-48 object-contain rounded-xl border border-slate-200 bg-white"
              />
            </div>
          )}

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-900 space-y-1">
            <p className="font-bold text-sm">Please wait for admin approval</p>
            <p className="text-amber-800">
              An administrator will verify your payment screenshot and grant your lifetime access shortly.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/payment-status"
              className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition shadow-[0_4px_14px_rgba(59,130,246,0.3)]"
            >
              Track Payment Status
            </Link>
            <Link
              to="/questions"
              className="w-full sm:w-auto px-6 py-2.5 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
            >
              Return to Questions
            </Link>
          </div>
        </div>
      ) : (
        /* Two Column Checkout Flow */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Step 1: Scan & Pay Details with 2 QRs */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-base">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-extrabold">
                  1
                </span>
                <span>Pay on Either QR Code</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-100">
                Exact ₹20
              </span>
            </div>

            {/* Instruction Banner */}
            <div className="p-3.5 bg-blue-50/50 border border-blue-100/70 rounded-2xl text-xs text-slate-600 flex items-start space-x-2.5">
              <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Scan and pay <strong>₹20</strong> on <strong>either QR Code 1 or QR Code 2</strong> using any UPI app (Google Pay, PhonePe, Paytm, BHIM, or bank app). Both accounts are active.
              </p>
            </div>

            {/* 2 QR Codes Display Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* QR Code 1 */}
              <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-100 flex flex-col items-center justify-center space-y-3 hover:border-slate-200 transition">
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-white">
                  QR Code 1
                </div>
                <div className="bg-white p-2 rounded-2xl shadow-xs border border-slate-100">
                  <img
                    src={qr1}
                    alt="Payment QR Code 1"
                    className="w-44 h-44 object-contain rounded-xl"
                  />
                </div>
                <p className="text-[11px] text-slate-400 font-medium text-center">
                  Scan with GPay, PhonePe, or Paytm
                </p>
              </div>

              {/* QR Code 2 */}
              <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-100 flex flex-col items-center justify-center space-y-3 hover:border-slate-200 transition">
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-white">
                  QR Code 2
                </div>
                <div className="bg-white p-2 rounded-2xl shadow-xs border border-slate-100">
                  <img
                    src={qr2}
                    alt="Payment QR Code 2"
                    className="w-44 h-44 object-contain rounded-xl"
                  />
                </div>
                <p className="text-[11px] text-slate-400 font-medium text-center">
                  Scan with GPay, PhonePe, or Paytm
                </p>
              </div>
            </div>

            {/* Price Details summary */}
            <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Access Type</span>
                <span className="font-bold text-slate-900">Lifetime (All 160+ Questions)</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                <span className="text-slate-500 font-medium">Total Amount to Pay</span>
                <span className="font-black text-base text-emerald-950 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-lg shadow-xs">₹20 INR</span>
              </div>
            </div>
          </div>

          {/* Step 2: Upload Screenshot & Reference */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 sm:p-8 space-y-6">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-4">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-extrabold">
                2
              </span>
              <span>Upload Payment Screenshot</span>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-start space-x-2.5 text-rose-700 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* File Upload Dropzone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Payment Screenshot (Required)
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {screenshot ? (
                  <div className="border border-emerald-200/80 bg-emerald-50/30 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-emerald-700 font-semibold text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Screenshot Attached</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveScreenshot}
                        className="text-xs text-rose-600 hover:text-rose-800 font-medium inline-flex items-center space-x-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden border border-emerald-200/80 bg-white">
                      <img
                        src={screenshot.dataUrl}
                        alt="Preview"
                        className="w-full max-h-44 object-contain bg-slate-900/5 p-2"
                      />
                    </div>

                    <p className="text-[11px] text-slate-400 truncate">
                      {screenshot.originalName} ({Math.round(screenshot.originalSize / 1024)} KB)
                    </p>
                  </div>
                ) : (
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2 ${
                      dragActive
                        ? 'border-blue-500 bg-blue-50/50'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
                      {isCompressing ? (
                        <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
                      ) : (
                        <UploadCloud className="w-6 h-6" />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-800">
                        {isCompressing ? 'Optimizing image...' : 'Click to upload screenshot'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        or drag and drop payment receipt (PNG, JPG, WEBP)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* UTR Input Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  UPI Transaction ID / UTR (Optional)
                </label>
                <input
                  type="text"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                  placeholder="e.g. 428719827364"
                  maxLength={24}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 font-mono text-base sm:text-sm uppercase tracking-wider text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  12-digit number found on your UPI receipt.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-900 space-y-1">
                <p className="font-semibold flex items-center text-amber-950">
                  <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />
                  Wait for Admin Approval:
                </p>
                <p className="text-amber-800 leading-relaxed">
                  After you submit your screenshot, an admin will review the payment and activate your lifetime access.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || isCompressing || (!screenshot && utr.trim().length < 8)}
                className="w-full py-4 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm transition shadow-[0_4px_14px_rgba(16,185,129,0.35)] disabled:opacity-40 flex items-center justify-center space-x-2 min-h-[48px]"
              >
                {loading ? (
                  <span>Submitting Payment Proof...</span>
                ) : (
                  <>
                    <span>Submit Payment Proof & Unlock Lifetime</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
