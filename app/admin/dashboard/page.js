'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalMessages: 0,
    unreadMessages: 0,
    recentMessages: [],
  });
  const [adminUser, setAdminUser] = useState({ username: 'admin', email: 'admin@gcofoundation.org' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch current admin profile
      try {
        const resAdmin = await fetch('/api/admin/me');
        if (resAdmin.ok) {
          const dataAdmin = await resAdmin.json();
          if (dataAdmin?.user) {
            setAdminUser(dataAdmin.user);
          }
        }
      } catch {}

      // 2. Fetch projects
      const resProjects = await fetch('/api/projects');
      const dataProjects = await resProjects.json();
      const projectList = Array.isArray(dataProjects.data) ? dataProjects.data : [];

      // 3. Fetch messages
      const resMessages = await fetch('/api/messages');
      const dataMessages = await resMessages.json();
      const messageList = Array.isArray(dataMessages.data) ? dataMessages.data : [];

      const totalProjects = projectList.length;
      const totalMessages = messageList.length;
      const unreadMessages = messageList.filter((m) => !m.is_read).length;
      const recentMessages = messageList.slice(0, 5);

      setStats({
        totalProjects,
        totalMessages,
        unreadMessages,
        recentMessages,
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Could not load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl w-full mx-auto">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-navy">
            Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            GCO Foundation Pakistan Overview &amp; Inquiries
          </p>
        </div>

        {/* User profile with circular icon and email - Brand Colors */}
        <div className="flex items-center gap-2.5 bg-white px-4 py-2 rounded-full border border-silver/40 shadow-sm ring-1 ring-brand/10">
          <i className="fa-solid fa-circle-user text-xl text-brand"></i>
          <span className="text-xs md:text-sm font-semibold text-navy">
            {adminUser.email || adminUser.username}
          </span>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-700 flex items-center gap-3">
          <i className="fa-solid fa-triangle-exclamation text-rose-500"></i>
          <span>{error}</span>
        </div>
      )}

      {/* 3 Metric Cards Grid (Matching GCO Logo Blue & Navy Palette) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* PROJECTS */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:border-brand/30 flex flex-col justify-between hover:shadow-md transition-all">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>PROJECTS</span>
            <i className="fa-solid fa-folder-open text-brand/60 text-sm"></i>
          </div>
          <div className="text-3xl md:text-4xl font-extrabold text-navy mt-3">
            {loading ? (
              <span className="text-slate-300 animate-pulse text-2xl">...</span>
            ) : (
              stats.totalProjects
            )}
          </div>
        </div>

        {/* TOTAL MESSAGES */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:border-brand/30 flex flex-col justify-between hover:shadow-md transition-all">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>TOTAL MESSAGES</span>
            <i className="fa-solid fa-envelope text-brand/60 text-sm"></i>
          </div>
          <div className="text-3xl md:text-4xl font-extrabold text-navy mt-3">
            {loading ? (
              <span className="text-slate-300 animate-pulse text-2xl">...</span>
            ) : (
              stats.totalMessages
            )}
          </div>
        </div>

        {/* UNREAD MESSAGES - Logo Blue / Sapphire Highlight */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:border-brand/30 flex flex-col justify-between hover:shadow-md transition-all">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>UNREAD MESSAGES</span>
            <i className="fa-solid fa-envelope-circle-check text-brand text-sm"></i>
          </div>
          <div className="text-3xl md:text-4xl font-extrabold text-brand mt-3">
            {loading ? (
              <span className="text-slate-300 animate-pulse text-2xl">...</span>
            ) : (
              stats.unreadMessages
            )}
          </div>
        </div>
      </div>

      {/* Recent Messages Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <h2 className="font-display font-bold text-base md:text-lg text-navy">
            Recent Messages
          </h2>
          <Link
            href="/admin/messages"
            className="text-xs md:text-sm font-semibold text-brand hover:text-navy transition-colors inline-flex items-center gap-1.5"
          >
            <span>View All</span>
            <i className="fa-solid fa-arrow-right text-xs"></i>
          </Link>
        </div>

        {loading ? (
          <div className="py-10 text-center text-xs text-slate-400">
            <i className="fa-solid fa-spinner fa-spin text-lg text-brand mb-2"></i>
            <div>Loading messages...</div>
          </div>
        ) : stats.recentMessages.length === 0 ? (
          <div className="py-12 text-slate-400 text-sm text-center md:text-left">
            No messages yet.
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Sender</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4 whitespace-nowrap">Received</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      !msg.is_read ? 'bg-blue-50/40 font-medium' : ''
                    }`}
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      {!msg.is_read ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand/10 text-brand border border-brand/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></span>
                          Unread
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
                          Read
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{msg.name}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">{msg.email}</div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="text-slate-800 truncate font-medium">{msg.subject}</div>
                      <div className="text-[11px] text-slate-400 truncate">{msg.message}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {msg.created_at
                        ? new Date(msg.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <Link
                        href={`/admin/messages/${msg.id}`}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-brand font-semibold inline-flex items-center gap-1 text-[11px] transition-colors"
                      >
                        <span>View</span>
                        <i className="fa-solid fa-chevron-right text-[9px]"></i>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}