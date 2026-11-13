'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [f, setF] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const set = (e) => {
    setF({ ...f, [e.target.name]: e.target.value });
    if (status.message) setStatus({ type: '', message: '' });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(f),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({
          type: 'success',
          message: 'Thank you! Your message has been sent successfully. Our team will get back to you shortly.',
        });
        setF({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({
          type: 'error',
          message: data.error || 'Failed to send your message. Please try again.',
        });
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      setStatus({
        type: 'error',
        message: 'Network error. Please check your internet connection and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const input = 'w-full border border-slate-200 rounded-md px-4 py-2.5 text-sm outline-none focus:border-brand transition-colors';
  const label = 'text-sm font-medium text-slate-700 block mb-1';

  return (
    <form onSubmit={submit} className="space-y-5">
      {status.message && (
        <div
          className={`p-4 rounded-lg text-sm flex items-start gap-3 transition-all ${
            status.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <i
            className={`fa-solid mt-0.5 ${
              status.type === 'success'
                ? 'fa-circle-check text-emerald-600'
                : 'fa-triangle-exclamation text-rose-600'
            }`}
          ></i>
          <span className="leading-relaxed">{status.message}</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className={label}>Full Name *</label>
          <input
            name="name"
            required
            value={f.name}
            onChange={set}
            placeholder="Enter your full name"
            className={input}
            disabled={loading}
          />
        </div>
        <div>
          <label className={label}>Email Address *</label>
          <input
            name="email"
            type="email"
            required
            value={f.email}
            onChange={set}
            placeholder="Enter your email"
            className={input}
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <label className={label}>Subject *</label>
        <input
          name="subject"
          required
          value={f.subject}
          onChange={set}
          placeholder="Enter subject"
          className={input}
          disabled={loading}
        />
      </div>

      <div>
        <label className={label}>Message *</label>
        <textarea
          name="message"
          required
          rows={5}
          value={f.message}
          onChange={set}
          placeholder="Write your message here..."
          className={input}
          disabled={loading}
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary py-3 inline-flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <i className="fa-solid fa-spinner fa-spin"></i>
            <span>Sending Message...</span>
          </>
        ) : (
          <>
            <i className="fa-solid fa-paper-plane"></i>
            <span>Send Message</span>
          </>
        )}
      </button>

      <p className="text-center text-xs text-slate-400">
        Your information is kept private and will only be used to respond to your inquiry.
      </p>
    </form>
  );
}