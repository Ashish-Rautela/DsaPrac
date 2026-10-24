import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { paymentApi, questionApi } from '../services/api';
import {
  ShieldCheck,
  CreditCard,
  BookOpen,
  Check,
  X,
  Plus,
  Trash2,
  Edit2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  ExternalLink,
  Lock,
  Unlock,
  RefreshCw,
  Eye,
  Image as ImageIcon,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('payments'); // 'payments' | 'questions'

  // Payments state
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [paymentFilter, setPaymentFilter] = useState('pending'); // 'all' | 'pending' | 'approved' | 'rejected'
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [rejectModalPayment, setRejectModalPayment] = useState(null);
  const [screenshotModalPayment, setScreenshotModalPayment] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('UTR not found in bank statement for ₹20.');

  // Questions state
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questionFormData, setQuestionFormData] = useState({
    title: '',
    difficulty: 'Medium',
    topics: '',
    leetcodeUrl: '',
    description: '',
    isPremium: true,
  });

  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadPayments = async () => {
    setPaymentsLoading(true);
    try {
      const data = await paymentApi.listAdminPayments(
        paymentFilter === 'all' ? null : paymentFilter
      );
      setPayments(data.payments || []);
    } catch (err) {
      showNotification('error', err.message || 'Failed to load payments.');
    } finally {
      setPaymentsLoading(false);
    }
  };

  const loadQuestions = async () => {
    setQuestionsLoading(true);
    try {
      const data = await questionApi.list({ limit: 100 });
      setQuestions(data.questions || []);
    } catch (err) {
      showNotification('error', err.message || 'Failed to load questions.');
    } finally {
      setQuestionsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'payments') {
      loadPayments();
    } else {
      loadQuestions();
    }
  }, [activeTab, paymentFilter]);

  // Payment approval
  const handleApprove = async (paymentId) => {
    if (!window.confirm('Confirm that this ₹20 UPI transfer appears in your bank statement?')) {
      return;
    }

    setActionLoadingId(paymentId);
    try {
      await paymentApi.approve(paymentId);
      showNotification('success', 'Payment approved and lifetime access unlocked.');
      loadPayments();
    } catch (err) {
      showNotification('error', err.message || 'Approval failed.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Payment rejection
  const handleConfirmReject = async () => {
    if (!rejectModalPayment) return;
    setActionLoadingId(rejectModalPayment.paymentId);

    try {
      await paymentApi.reject(rejectModalPayment.paymentId, rejectionReason);
      showNotification('success', 'Payment marked as rejected.');
      setRejectModalPayment(null);
      loadPayments();
    } catch (err) {
      showNotification('error', err.message || 'Rejection failed.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Question save (create or update)
  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    const payload = {
      title: questionFormData.title,
      difficulty: questionFormData.difficulty,
      topics: questionFormData.topics.split(',').map((t) => t.trim()).filter(Boolean),
      leetcodeUrl: questionFormData.leetcodeUrl,
      description: questionFormData.description,
      isPremium: questionFormData.isPremium,
    };

    try {
      if (editingQuestion) {
        await questionApi.update(editingQuestion.questionId, payload);
        showNotification('success', 'Question updated successfully.');
      } else {
        await questionApi.create(payload);
        showNotification('success', 'Question created successfully.');
      }
      setQuestionModalOpen(false);
      setEditingQuestion(null);
      loadQuestions();
    } catch (err) {
      showNotification('error', err.message || 'Failed to save question.');
    }
  };

  const handleEditQuestion = (q) => {
    setEditingQuestion(q);
    setQuestionFormData({
      title: q.title || '',
      difficulty: q.difficulty || 'Medium',
      topics: (q.topics || []).join(', '),
      leetcodeUrl: q.leetcodeUrl || '',
      description: q.description || '',
      isPremium: Boolean(q.isPremium),
    });
    setQuestionModalOpen(true);
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question record?')) {
      return;
    }

    try {
      await questionApi.delete(questionId);
      showNotification('success', 'Question deleted.');
      loadQuestions();
    } catch (err) {
      showNotification('error', err.message || 'Failed to delete question.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Console</h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800">
                Staff Only
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Logged in as <strong className="text-slate-700">{user.email}</strong>
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200/80">
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'payments'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>UPI Payments</span>
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'questions'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Question Bank</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center space-x-2 shadow-sm ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* ========================================================================
          TAB 1: PAYMENTS REVIEW
          ======================================================================== */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              {['pending', 'all', 'approved', 'rejected'].map((f) => (
                <button
                  key={f}
                  onClick={() => setPaymentFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                    paymentFilter === f
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <button
              onClick={loadPayments}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center space-x-1 font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {paymentsLoading ? (
              <div className="py-20 text-center text-slate-400 text-sm">Loading submissions...</div>
            ) : payments.length === 0 ? (
              <div className="py-20 text-center space-y-1">
                <p className="font-bold text-slate-800">No {paymentFilter} payments found</p>
                <p className="text-xs text-slate-400">All submissions in this category have been processed.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">UTR Reference</th>
                      <th className="py-3 px-4">Payment Proof</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Submitted At</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {payments.map((p) => {
                      const isPending = p.status === 'pending';
                      const isLoading = actionLoadingId === p.paymentId;

                      return (
                        <tr key={p.paymentId} className="hover:bg-slate-50/70 transition">
                          <td className="py-3 px-4">
                            <p className="font-bold text-slate-900">{p.userName || 'Anonymous'}</p>
                            <p className="text-[11px] text-slate-400">{p.userEmail}</p>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-900 select-all">
                            {p.utr}
                          </td>
                          <td className="py-3 px-4">
                            {p.screenshot ? (
                              <button
                                onClick={() => setScreenshotModalPayment(p)}
                                className="group flex items-center space-x-2 text-left hover:opacity-90 transition"
                                title="Click to inspect full screenshot"
                              >
                                <img
                                  src={p.screenshot}
                                  alt="Proof thumbnail"
                                  className="w-10 h-10 object-cover rounded-xl border border-slate-200 bg-slate-50 group-hover:border-blue-500 shadow-xs"
                                />
                                <span className="inline-flex items-center text-[11px] font-semibold text-blue-600 group-hover:underline">
                                  <Eye className="w-3 h-3 mr-1" />
                                  Inspect
                                </span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">No image</span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900">
                            ₹{p.amountPaise / 100}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                p.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : p.status === 'pending'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {p.status}
                            </span>
                            {p.rejectionReason && (
                              <p className="text-[10px] text-rose-600 mt-0.5 truncate max-w-xs" title={p.rejectionReason}>
                                {p.rejectionReason}
                              </p>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-500 text-[11px]">
                            {new Date(p.submittedAt).toLocaleString('en-IN', {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {isPending ? (
                              <div className="flex items-center justify-end space-x-1.5">
                                <button
                                  onClick={() => handleApprove(p.paymentId)}
                                  disabled={isLoading}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition shadow-sm flex items-center space-x-1 disabled:opacity-40"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Approve</span>
                                </button>
                                <button
                                  onClick={() => setRejectModalPayment(p)}
                                  disabled={isLoading}
                                  className="px-2.5 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-[11px] transition flex items-center space-x-1 disabled:opacity-40"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Reject</span>
                                </button>
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-400">
                                {p.reviewedBy ? `by ${p.reviewedBy}` : 'Processed'}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================
          TAB 2: QUESTION MANAGEMENT
          ======================================================================== */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Visa OA Questions ({questions.length})</h3>
              <p className="text-xs text-slate-500">Create, edit, or toggle questions between Free and Premium.</p>
            </div>

            <button
              onClick={() => {
                setEditingQuestion(null);
                setQuestionFormData({
                  title: '',
                  difficulty: 'Medium',
                  topics: '',
                  leetcodeUrl: '',
                  description: '',
                  isPremium: true,
                });
                setQuestionModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center space-x-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Question</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {questionsLoading ? (
              <div className="py-20 text-center text-slate-400 text-sm">Loading questions...</div>
            ) : questions.length === 0 ? (
              <div className="py-20 text-center text-slate-500 text-sm">No questions in database.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {questions.map((q) => (
                  <div key={q.questionId} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-sm truncate">{q.title}</span>
                        {q.isPremium ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            Premium
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Free
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">{q.difficulty}</span>
                        <span>•</span>
                        <span>{(q.topics || []).join(', ')}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <button
                        onClick={() => handleEditQuestion(q)}
                        className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
                        title="Edit question"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q.questionId)}
                        className="p-2 rounded-lg border border-slate-200 text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition"
                        title="Delete question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================
          MODAL: REJECT PAYMENT WITH REASON
          ======================================================================== */}
      {rejectModalPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center space-x-2 text-rose-600 font-bold">
              <XCircle className="w-5 h-5" />
              <span>Reject Payment Submission</span>
            </div>

            <p className="text-xs text-slate-600">
              Rejecting UTR <strong className="font-mono text-slate-900">{rejectModalPayment.utr}</strong> submitted by {rejectModalPayment.userEmail}. Please state the reason for student transparency.
            </p>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Rejection Reason
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setRejectModalPayment(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================
          MODAL: ADD / EDIT QUESTION
          ======================================================================== */}
      {questionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-xl w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {editingQuestion ? 'Edit Visa Question' : 'Add New Visa Question'}
              </h3>
              <button
                onClick={() => setQuestionModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={questionFormData.title}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, title: e.target.value })}
                  placeholder="e.g. Transaction Sliding Window Maximum"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={questionFormData.difficulty}
                    onChange={(e) => setQuestionFormData({ ...questionFormData, difficulty: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Access Level
                  </label>
                  <label className="flex items-center space-x-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={questionFormData.isPremium}
                      onChange={(e) => setQuestionFormData({ ...questionFormData, isPremium: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span className="font-semibold text-slate-800">
                      {questionFormData.isPremium ? 'Premium (Locked for ₹20)' : 'Free Starter'}
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Topics (comma separated)
                </label>
                <input
                  type="text"
                  value={questionFormData.topics}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, topics: e.target.value })}
                  placeholder="Arrays, Sliding Window, Monotonic Queue"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  LeetCode URL (Original Problem)
                </label>
                <input
                  type="url"
                  value={questionFormData.leetcodeUrl}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, leetcodeUrl: e.target.value })}
                  placeholder="https://leetcode.com/problems/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Algorithmic Notes & Intuition Breakdown
                </label>
                <textarea
                  rows={5}
                  value={questionFormData.description}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, description: e.target.value })}
                  placeholder="Explain optimal data structure, invariant preservation, and time/space complexity analysis..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setQuestionModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-2xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-[0_4px_14px_rgba(59,130,246,0.3)]"
                >
                  {editingQuestion ? 'Update Question' : 'Create Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Screenshot Proof Inspection Modal */}
      {screenshotModalPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Payment Screenshot Proof</h3>
                <p className="text-xs text-slate-500">
                  Uploaded by <strong className="text-slate-800">{screenshotModalPayment.userName}</strong> ({screenshotModalPayment.userEmail})
                </p>
              </div>
              <button
                onClick={() => setScreenshotModalPayment(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info Strip */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">UTR Reference</span>
                <span className="font-mono text-slate-900 font-bold select-all">
                  {screenshotModalPayment.utr}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Amount</span>
                <span className="text-slate-900 font-bold">
                  ₹{screenshotModalPayment.amountPaise / 100} INR
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Status</span>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    screenshotModalPayment.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : screenshotModalPayment.status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {screenshotModalPayment.status}
                </span>
              </div>
            </div>

            {/* Screenshot Image Container */}
            <div className="flex-1 overflow-auto rounded-2xl border border-slate-200 bg-slate-900/5 p-3 flex items-center justify-center min-h-[280px]">
              <img
                src={screenshotModalPayment.screenshot}
                alt="Payment Receipt Screenshot"
                className="max-h-[55vh] max-w-full object-contain rounded-xl shadow-sm border border-slate-200 bg-white"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={() => setScreenshotModalPayment(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Close
              </button>

              {screenshotModalPayment.status === 'pending' && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      const p = screenshotModalPayment;
                      setScreenshotModalPayment(null);
                      setRejectModalPayment(p);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs transition"
                  >
                    Reject
                  </button>
                  <button
                    onClick={async () => {
                      const p = screenshotModalPayment;
                      setScreenshotModalPayment(null);
                      await handleApprove(p.paymentId);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm flex items-center space-x-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve & Grant Access</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
