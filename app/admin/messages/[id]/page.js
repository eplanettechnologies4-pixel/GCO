'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MessageDetailPage({ params }) {
  const router = useRouter();
  // Unwrap Next.js App Router dynamic route params
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Fetch message on load
  const fetchMessage = async () => {
    setLoading(true);
    setFeedback({ type: '', message: '' });
    try {
      const res = await fetch(`/api/messages/${id}`);
      const data = await res.json();
      if (res.ok && data.data) {
        setMessage(data.data);
      } else {
        setFeedback({
          type: 'error',
          message: data.error || 'Message could not be found.',
        });
      }
    } catch (err) {
      console.error('Fetch message detail error:', err);
      setFeedback({ type: 'error', message: 'Failed to connect to messages service.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchMessage();
    }
  }, [id]);

  // Toggle Read / Unread Status
  const handleToggleRead = async () => {
    if (!message) return;
    setUpdating(true);
    try {
      const newStatus = !message.is_read;
      const res = await fetch(`/api/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_read: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update message status.');
      }
      setMessage((prev) => ({ ...prev, is_read: newStatus }));
      setFeedback({
        type: 'success',
        message: newStatus ? 'Marked as read.' : 'Marked as unread.',
      });
      setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
    } catch (err) {
      console.error('Status change error:', err);
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setUpdating(false);
    }
  };

  // Delete message and return to list
  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete message.');
      }
      router.push('/admin/messages');
    } catch (err) {
      console.error('Delete message error:', err);
      setFeedback({ type: 'error', message: err.message });
      setDeleting(false);
      setDeleteConfirmOpen(false);
    }
  };

  // Copy message text to clipboard
  const handleCopyMessage = async () => {
    if (!message) return;
    try {
      await navigator.clipboard.writeText(
        `From: ${message.name} <${message.email}>\nSubject: ${message.subject}\nDate: ${new Date(message.created_at).toLocaleString()}\n\n${message.message}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="p-5 md:p-8 space-y-6 max-w-5xl w-full mx-auto">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/admin/dashboard" className="hover:text-navy transition-colors">
            Dashboard
          </Link>
          <i className="fa-solid fa-chevron-right text-[9px] text-slate-400"></i>
          <Link href="/admin/messages" className="hover:text-navy transition-colors">
            Messages
          </Link>
          <i className="fa-solid fa-chevron-right text-[9px] text-slate-400"></i>
          <span className="font-semibold text-slate-800 truncate max-w-xs">
            {message ? message.subject : 'Message Details'}
          </span>
        </div>

        <Link
          href="/admin/messages"
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-2 shadow-sm transition-colors"
        >
          <i className="fa-solid fa-arrow-left text-[10px]"></i>
          <span>Back to Messages</span>
        </Link>
      </div>

      {/* Global Feedback Banner */}
      {feedback.message && (
        <div
          className={`rounded-xl p-4 text-xs font-medium flex items-center justify-between shadow-sm transition-all ${
            feedback.type === 'error'
              ? 'bg-rose-50 border border-rose-200 text-rose-700'
              : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <i
              className={`fa-solid ${
                feedback.type === 'error'
                  ? 'fa-triangle-exclamation text-rose-500'
                  : 'fa-circle-check text-emerald-600'
              }`}
            ></i>
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback({ type: '', message: '' })}
            className="text-slate-400 hover:text-slate-600"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 card-shadow p-16 text-center text-xs text-slate-400">
          <i className="fa-solid fa-spinner fa-spin text-2xl text-brand mb-3"></i>
          <div>Loading message details...</div>
        </div>
      ) : !message ? (
        <div className="bg-white rounded-2xl border border-slate-200 card-shadow p-16 text-center">
          <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-2xl mx-auto mb-3">
            <i className="fa-solid fa-circle-exclamation"></i>
          </div>
          <div className="text-base font-semibold text-slate-800">Message not found</div>
          <p className="text-xs text-slate-400 mt-1">
            This message may have been deleted or the link is invalid.
          </p>
          <Link
            href="/admin/messages"
            className="mt-4 inline-flex items-center gap-2 btn-primary px-4 py-2 text-xs font-semibold rounded-lg"
          >
            <i className="fa-solid fa-arrow-left text-xs"></i>
            <span>Return to Messages</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 card-shadow overflow-hidden">
          {/* Header Bar */}
          <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex items-start gap-4">
                {/* Initials Avatar */}
                <div className="w-12 h-12 rounded-xl bg-navy text-white font-display font-bold text-lg flex items-center justify-center shrink-0 shadow-sm">
                  {message.name
                    ? message.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()
                    : 'M'}
                </div>

                <div>
                  <h1 className="font-display font-bold text-xl md:text-2xl text-navy">
                    {message.subject}
                  </h1>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-xs text-slate-600">
                    <span className="font-semibold text-slate-900">{message.name}</span>
                    <span className="text-slate-300">•</span>
                    <a
                      href={`mailto:${message.email}`}
                      className="text-brand hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      <i className="fa-regular fa-envelope text-[11px]"></i>
                      <span>{message.email}</span>
                    </a>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-400">
                      {message.created_at
                        ? new Date(message.created_at).toLocaleString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="self-start">
                {!message.is_read ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand/10 text-brand border border-brand/20 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
                    Unread Message
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <i className="fa-solid fa-check text-[10px]"></i>
                    Read Message
                  </span>
                )}
              </div>
            </div>

            {/* Quick Action Toolbar */}
            <div className="flex flex-wrap items-center gap-2.5 mt-6 pt-5 border-t border-slate-200/60">
              {/* Primary Reply */}
              <a
                href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}`}
                className="btn-primary px-4 py-2 text-xs font-semibold rounded-lg inline-flex items-center gap-2 shadow-sm"
              >
                <i className="fa-solid fa-reply"></i>
                <span>Reply via Email</span>
              </a>

              {/* Copy Full Message */}
              <button
                type="button"
                onClick={handleCopyMessage}
                className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 inline-flex items-center gap-2 transition-colors shadow-sm"
              >
                <i
                  className={`fa-solid ${
                    copied ? 'fa-check text-leaf' : 'fa-copy text-slate-400'
                  }`}
                ></i>
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
              </button>

              {/* Toggle Read/Unread */}
              <button
                type="button"
                onClick={handleToggleRead}
                disabled={updating}
                className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 inline-flex items-center gap-2 transition-colors shadow-sm"
              >
                {updating ? (
                  <i className="fa-solid fa-spinner fa-spin text-xs"></i>
                ) : message.is_read ? (
                  <i className="fa-solid fa-envelope text-amber-600"></i>
                ) : (
                  <i className="fa-solid fa-envelope-open text-slate-400"></i>
                )}
                <span>{message.is_read ? 'Mark as Unread' : 'Mark as Read'}</span>
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(true)}
                className="ml-auto px-3.5 py-2 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-xs font-semibold text-rose-600 inline-flex items-center gap-2 transition-colors shadow-sm"
              >
                <i className="fa-regular fa-trash-can"></i>
                <span>Delete</span>
              </button>
            </div>
          </div>

          {/* Message Body */}
          <div className="p-6 md:p-8">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Message Content
            </div>
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans selection:bg-brand/20">
              {message.message}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 card-shadow border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xl mx-auto mb-4">
              <i className="fa-solid fa-trash-can"></i>
            </div>
            <h3 className="font-display font-bold text-center text-lg text-slate-800">
              Permanently delete message?
            </h3>
            <p className="text-xs text-center text-slate-500 mt-2">
              This will permanently delete the message from {message?.name}. This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                disabled={deleting}
                className="w-1/2 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="w-1/2 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                {deleting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin text-xs"></i>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-regular fa-trash-can"></i>
                    <span>Yes, Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
