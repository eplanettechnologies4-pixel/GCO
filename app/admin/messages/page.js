'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'read'
  const [search, setSearch] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Delete Confirmation State
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Status updating state for optimistic/loading feedback
  const [updatingId, setUpdatingId] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    setFeedback({ type: '', message: '' });
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      if (res.ok && Array.isArray(data.data)) {
        setMessages(data.data);
      } else {
        setFeedback({
          type: 'error',
          message: data.error || 'Failed to load messages from server.',
        });
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setFeedback({ type: 'error', message: 'Failed to connect to messages service.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Toggle Read/Unread Status
  const handleToggleRead = async (id, currentStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_read: !currentStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update message status.');
      }

      // Update state locally
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_read: !currentStatus } : m))
      );
      setFeedback({
        type: 'success',
        message: !currentStatus ? 'Message marked as read.' : 'Message marked as unread.',
      });
      setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
    } catch (err) {
      console.error('Toggle status error:', err);
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete Message
  const handleDeleteMessage = async () => {
    if (!deleteConfirmId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/messages/${deleteConfirmId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete message.');
      }

      setMessages((prev) => prev.filter((m) => m.id !== deleteConfirmId));
      setDeleteConfirmId(null);
      setFeedback({ type: 'success', message: 'Message permanently deleted.' });
      setTimeout(() => setFeedback({ type: '', message: '' }), 3500);
    } catch (err) {
      console.error('Delete error:', err);
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setDeleting(false);
    }
  };

  // Filter & Search Logic
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      // Filter by read status
      if (filter === 'unread' && m.is_read) return false;
      if (filter === 'read' && !m.is_read) return false;

      // Filter by search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = m.name?.toLowerCase().includes(q);
        const matchesEmail = m.email?.toLowerCase().includes(q);
        const matchesSubject = m.subject?.toLowerCase().includes(q);
        const matchesMessage = m.message?.toLowerCase().includes(q);
        return matchesName || matchesEmail || matchesSubject || matchesMessage;
      }
      return true;
    });
  }, [messages, filter, search]);

  const totalCount = messages.length;
  const unreadCount = messages.filter((m) => !m.is_read).length;
  const readCount = totalCount - unreadCount;

  return (
    <div className="p-5 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-2xl md:text-3xl text-navy">
              Messages &amp; Inquiries
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand/10 text-brand border border-brand/20">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Review and respond to messages submitted through the website&apos;s contact form.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchMessages}
            disabled={loading}
            className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-colors"
          >
            <i className={`fa-solid fa-arrows-rotate ${loading ? 'fa-spin' : ''}`}></i>
            <span>Refresh</span>
          </button>
        </div>
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

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 card-shadow p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg self-start">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-white text-navy shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filter === 'unread'
                ? 'bg-white text-brand shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {unreadCount > 0 && <span className="w-2 h-2 rounded-full bg-brand"></span>}
            <span>Unread ({unreadCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilter('read')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              filter === 'read'
                ? 'bg-white text-navy shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Read ({readCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sender, email, subject..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-brand transition-colors"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-xl border border-slate-200 card-shadow overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-slate-400">
            <i className="fa-solid fa-spinner fa-spin text-2xl text-brand mb-3"></i>
            <div>Loading messages from database...</div>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mx-auto mb-3">
              <i className="fa-regular fa-envelope-open"></i>
            </div>
            <div className="text-base font-semibold text-slate-700">No messages found</div>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {search
                ? `No messages matched the search term "${search}".`
                : filter === 'unread'
                ? 'You have responded to all inquiries! No unread messages.'
                : 'No contact form submissions recorded yet.'}
            </p>
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="mt-4 text-xs font-semibold text-brand hover:underline"
              >
                Clear Search Filter
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-5 w-24">Status</th>
                  <th className="py-3 px-5">Sender</th>
                  <th className="py-3 px-5">Subject &amp; Message</th>
                  <th className="py-3 px-5 whitespace-nowrap">Date</th>
                  <th className="py-3 px-5 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    className={`transition-colors ${
                      !msg.is_read
                        ? 'bg-amber-50/50 hover:bg-amber-50 font-medium'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Status Badge */}
                    <td className="py-4 px-5 whitespace-nowrap align-top">
                      {!msg.is_read ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-brand/10 text-brand border border-brand/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></span>
                          Unread
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
                          <i className="fa-solid fa-check text-[10px] text-slate-400"></i>
                          Read
                        </span>
                      )}
                    </td>

                    {/* Sender Details */}
                    <td className="py-4 px-5 align-top whitespace-nowrap">
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <span>{msg.name}</span>
                      </div>
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-[11px] text-brand hover:underline inline-flex items-center gap-1 mt-0.5"
                      >
                        <i className="fa-regular fa-envelope text-[10px]"></i>
                        <span>{msg.email}</span>
                      </a>
                    </td>

                    {/* Subject & Preview */}
                    <td className="py-4 px-5 align-top">
                      <Link
                        href={`/admin/messages/${msg.id}`}
                        className="font-semibold text-navy hover:text-brand transition-colors block text-sm mb-1"
                      >
                        {msg.subject}
                      </Link>
                      <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                        {msg.message}
                      </p>
                    </td>

                    {/* Timestamp */}
                    <td className="py-4 px-5 whitespace-nowrap text-slate-500 text-[11px] align-top">
                      <div>
                        {msg.created_at
                          ? new Date(msg.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : '—'}
                      </div>
                      <div className="text-slate-400 mt-0.5">
                        {msg.created_at
                          ? new Date(msg.created_at).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : ''}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 whitespace-nowrap text-right align-top">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Open Details */}
                        <Link
                          href={`/admin/messages/${msg.id}`}
                          title="View Message"
                          className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-colors text-xs"
                        >
                          <i className="fa-regular fa-eye"></i>
                        </Link>

                        {/* Toggle Read/Unread */}
                        <button
                          type="button"
                          onClick={() => handleToggleRead(msg.id, msg.is_read)}
                          disabled={updatingId === msg.id}
                          title={msg.is_read ? 'Mark as Unread' : 'Mark as Read'}
                          className={`w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center transition-colors text-xs ${
                            msg.is_read ? 'text-amber-600' : 'text-slate-600'
                          }`}
                        >
                          {updatingId === msg.id ? (
                            <i className="fa-solid fa-spinner fa-spin text-[10px]"></i>
                          ) : msg.is_read ? (
                            <i className="fa-solid fa-envelope"></i>
                          ) : (
                            <i className="fa-solid fa-envelope-open"></i>
                          )}
                        </button>

                        {/* Reply via Email */}
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                          title="Reply via Email"
                          className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-leaf flex items-center justify-center transition-colors text-xs"
                        >
                          <i className="fa-solid fa-reply"></i>
                        </a>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(msg.id)}
                          title="Delete Message"
                          className="w-8 h-8 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 flex items-center justify-center transition-colors text-xs"
                        >
                          <i className="fa-regular fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 card-shadow border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xl mx-auto mb-4">
              <i className="fa-solid fa-trash-can"></i>
            </div>
            <h3 className="font-display font-bold text-center text-lg text-slate-800">
              Delete this message?
            </h3>
            <p className="text-xs text-center text-slate-500 mt-2">
              This action cannot be undone. The message will be permanently removed from your database.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                disabled={deleting}
                className="w-1/2 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteMessage}
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
