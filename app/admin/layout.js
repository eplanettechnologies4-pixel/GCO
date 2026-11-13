'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { site } from '@/lib/site';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Login page has its own minimal layout
  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoggingOut(false);
    }
  };

  const navLinks = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: 'fa-gauge' },
    { label: 'Our Projects', href: '/admin/projects', icon: 'fa-folder-open' },
    { label: 'Messages', href: '/admin/messages', icon: 'fa-envelope' },
  ];

  const isActive = (href) =>
    pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href));

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row">
      {/* Sidebar (Desktop) - Styled according to GCO Logo Dark Navy & Royal Blue */}
      <aside className="hidden md:flex flex-col w-64 bg-navy-dark text-white shrink-0 min-h-screen border-r border-navy/50 shadow-xl">
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <Image
            src="/assets/logo.png"
            alt="GCO Logo"
            width={44}
            height={44}
            className="w-10 h-10 rounded-full object-contain bg-white/10 p-0.5 shrink-0 ring-1 ring-silver/30"
          />
          <div className="min-w-0">
            <div className="font-display font-bold text-sm tracking-wide text-white truncate">
              Global Connection
            </div>
            <div className="text-xs font-semibold text-blue-300 tracking-wider">
              Admin Panel
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1">
          {navLinks.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-brand text-white shadow-md font-semibold ring-1 ring-white/10'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <i
                  className={`fa-solid ${item.icon} w-5 text-center text-sm ${
                    active ? 'text-white' : 'text-blue-300/70'
                  }`}
                ></i>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <i className="fa-solid fa-arrow-up-right-from-square w-5 text-center text-slate-400"></i>
            <span>View Site</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold text-rose-300 hover:bg-rose-500/20 hover:text-rose-100 transition-colors"
          >
            <i className="fa-solid fa-arrow-right-from-bracket w-5 text-center"></i>
            <span>{loggingOut ? 'Signing out...' : 'Logout'}</span>
          </button>
        </div>
      </aside>

      {/* Topbar (Mobile) */}
      <header className="md:hidden bg-navy-dark text-white px-4 py-3 flex items-center justify-between border-b border-navy/50 shadow-md">
        <div className="flex items-center gap-2.5">
          <Image
            src="/assets/logo.png"
            alt="GCO Logo"
            width={34}
            height={34}
            className="w-8 h-8 rounded-full object-contain bg-white/10 p-0.5 ring-1 ring-silver/30"
          />
          <div>
            <div className="font-display font-bold text-sm text-white">Global Connection</div>
            <div className="text-[10px] font-semibold text-blue-300">Admin Panel</div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white text-xl p-1.5"
          aria-label="Toggle navigation"
        >
          <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy-dark text-white px-4 py-3 border-b border-white/10 space-y-1.5 shadow-xl animate-in slide-in-from-top-2 duration-150">
          {navLinks.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active ? 'bg-brand text-white font-semibold shadow' : 'text-slate-300'
                }`}
              >
                <i className={`fa-solid ${item.icon} w-5 text-center`}></i>
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-white/10 space-y-1">
            <Link
              href="/"
              target="_blank"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-300"
            >
              <i className="fa-solid fa-arrow-up-right-from-square w-5 text-center"></i>
              <span>View Site</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-rose-300 font-semibold"
            >
              <i className="fa-solid fa-arrow-right-from-bracket w-5 text-center"></i>
              <span>{loggingOut ? 'Signing out...' : 'Logout'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#f8fafc]">
        {children}
      </main>
    </div>
  );
}