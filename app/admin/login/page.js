'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin/dashboard';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || 'Login failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      // Successful login
      router.push(from);
      router.refresh();
    } catch (err) {
      setError('A network error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-8">
      <div className="text-center mb-7">
        <div className="inline-flex p-1.5 rounded-full bg-navy/10 ring-2 ring-silver/50 mb-3">
          <Image
            src="/assets/logo.png"
            alt="GCO Foundation Logo"
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-contain"
            priority
          />
        </div>
        <h1 className="font-display font-extrabold text-2xl text-navy">Admin Portal</h1>
        <p className="text-xs text-slate-500 mt-1">
          Global Connection Welfare Organization
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 flex items-start gap-2.5">
          <i className="fa-solid fa-circle-exclamation mt-0.5 text-rose-500 shrink-0"></i>
          <div>{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Username
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <i className="fa-solid fa-user text-xs"></i>
            </span>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-colors"
              autoComplete="username"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <i className="fa-solid fa-lock text-xs"></i>
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-colors"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              aria-label="Toggle password visibility"
            >
              <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 mt-2 shadow-md hover:shadow-lg disabled:opacity-70"
        >
          {loading ? (
            <>
              <i className="fa-solid fa-spinner fa-spin text-sm"></i>
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <i className="fa-solid fa-right-to-bracket text-sm"></i>
              <span>Sign In to Admin</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-100 text-center">
        <p className="text-[11px] text-slate-400">
          Secure admin access protected by signed JWT session.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-navy-dark via-navy to-brand">
      <Suspense
        fallback={
          <div className="w-full max-w-md bg-white rounded-2xl p-12 text-center text-xs text-slate-400 shadow-2xl">
            <i className="fa-solid fa-spinner fa-spin text-xl text-brand mb-2"></i>
            <div>Loading admin login...</div>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}