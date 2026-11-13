'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { navItems, site } from '@/lib/site';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Hide public navbar on all admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 flex items-center justify-between h-24 gap-4">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/assets/logo.png"
            alt={`${site.name} ${site.country}`}
            width={80}
            height={80}
            className="object-contain w-16 h-16 md:w-20 md:h-20 rounded-full"
            priority
          />
          <div className="leading-tight whitespace-nowrap">
            <div className="font-display font-bold text-base md:text-lg text-navy">
              Global Connection <span className="text-leaf"> <br />Welfare Organization</span>
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link font-medium ${
                isActive(item.href) ? 'active text-navy font-semibold' : 'text-slate-700'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <Link
            href="/donate"
            className="hidden sm:inline-flex items-center gap-2 btn-primary text-xs md:text-sm px-4 md:px-5 py-2.5 rounded-lg shadow-sm"
          >
            <i className="fa-solid fa-heart"></i>
            <span>Donate Now</span>
          </Link>
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white text-xs md:text-sm font-semibold px-3.5 md:px-4 py-2.5 rounded-lg shadow-sm hover:shadow transition-all"
          >
            <i className="fa-solid fa-user text-xs"></i>
            <span>Login as Admin</span>
          </Link>
          <button
            type="button"
            className="lg:hidden text-2xl text-navy ml-1 p-1"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation menu"
          >
            <i className={`fa-solid ${open ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-slate-100 px-5 py-4 flex flex-col gap-3 bg-white text-sm shadow-lg animate-in slide-in-from-top-2 duration-150">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`font-medium py-1 ${
                isActive(item.href) ? 'text-navy font-bold' : 'text-slate-700'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2 mt-1">
            <Link
              href="/donate"
              onClick={() => setOpen(false)}
              className="btn-primary text-center px-5 py-2.5 inline-flex items-center justify-center gap-2 rounded-lg"
            >
              <i className="fa-solid fa-heart"></i> Donate Now
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="bg-brand hover:bg-brand-dark text-white text-center font-semibold px-5 py-2.5 inline-flex items-center justify-center gap-2 rounded-lg transition-colors"
            >
              <i className="fa-solid fa-user"></i> Login as Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}