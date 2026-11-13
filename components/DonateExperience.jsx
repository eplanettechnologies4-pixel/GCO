'use client';

import { useEffect, useState } from 'react';

const DONATION_TYPES = [
  { id: 'one-time', label: 'One-Time', summaryLabel: 'One-Time Donation' },
  { id: 'monthly', label: 'Monthly Sponsorship', summaryLabel: 'Monthly Sponsorship' },
  { id: 'zakat', label: 'Zakat / Sadaqah', summaryLabel: 'Zakat / Sadaqah' },
];

const PRESET_AMOUNTS = [10, 25, 50, 100, 250];

const PAYMENT_TILES = [
  { id: 'card', label: 'Card', iconClass: 'fa-solid fa-credit-card', methodId: null },
  { id: 'paypal', label: 'PayPal', iconClass: 'fa-brands fa-paypal', methodId: null },
  { id: 'bank', label: 'Bank Transfer', iconClass: 'fa-solid fa-building-columns', methodId: 'bank' },
  { id: 'easypaisa', label: 'JazzCash / Easypaisa', iconClass: 'fa-solid fa-mobile-screen-button', methodId: 'easypaisa' },
];

const COUNTRIES = [
  'Pakistan',
  'United States',
  'United Kingdom',
  'Canada',
  'United Arab Emirates',
  'Saudi Arabia',
  'Australia',
  'Other',
];

export default function DonateExperience({ campaigns, paymentMethods, whatsapp, phone }) {
  const [donationType, setDonationType] = useState(DONATION_TYPES[0]);
  const [selectedAmount, setSelectedAmount] = useState(25);
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedCampaignSlug, setSelectedCampaignSlug] = useState(campaigns[0]?.slug || '');
  const [selectedTileId, setSelectedTileId] = useState('card');
  const [donor, setDonor] = useState({ name: '', email: '', phone: '', country: 'Pakistan' });
  const [modalState, setModalState] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const effectiveAmount = isCustomAmount ? Math.max(0, Number(customAmount) || 0) : selectedAmount;
  const activeCampaign = campaigns.find((c) => c.slug === selectedCampaignSlug) || campaigns[0];
  const activeTile = PAYMENT_TILES.find((t) => t.id === selectedTileId) || PAYMENT_TILES[0];
  const getMethodById = (id) => paymentMethods.find((m) => m.id === id);

  useEffect(() => {
    if (!modalState) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setModalState(null);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalState]);

  const handleCopy = async (key, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((prev) => (prev === key ? null : prev)), 2000);
    } catch {
      // Clipboard fallback ignored if blocked by browser
    }
  };

  const openForTile = (tile) => {
    setCopiedKey(null);
    if (tile.methodId) {
      const m = getMethodById(tile.methodId);
      if (m) {
        setModalState({ kind: 'details', method: m });
        return;
      }
    }
    setModalState({ kind: 'inquiry', tile });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    openForTile(activeTile);
  };

  const buildWhatsAppHref = (label) => {
    const lines = [
      'Hello GCO Foundation Pakistan,',
      `I would like to confirm my donation via ${label || 'Bank / Easypaisa'}:`,
      `- Donation Type: ${donationType.summaryLabel}`,
      `- Amount: $${effectiveAmount.toFixed(2)} USD`,
      `- Campaign: ${activeCampaign?.title || 'Where Most Needed'}`,
      donor.name ? `- Name: ${donor.name}` : '',
      donor.phone ? `- Phone: ${donor.phone}` : '',
      donor.email ? `- Email: ${donor.email}` : '',
      donor.country ? `- Country: ${donor.country}` : '',
    ].filter(Boolean);
    return `https://wa.me/${whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  const inputCls =
    'w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-colors';

  return (
    <section className="py-14 px-5 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-[1fr,340px] gap-10 items-start">
        {/* Left Interactive Donation Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Choose Donation Type */}
          <div>
            <h2 className="font-display font-bold text-lg text-navy mb-3.5">1. Choose Donation Type</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {DONATION_TYPES.map((type) => {
                const active = donationType.id === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setDonationType(type)}
                    className={`rounded-lg border px-4 py-3 text-sm font-semibold transition-all ${
                      active
                        ? 'bg-navy border-navy text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-brand hover:text-navy'
                    }`}
                  >
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Select Donation Amount (USD) */}
          <div>
            <h2 className="font-display font-bold text-lg text-navy mb-3.5">2. Select Donation Amount (USD)</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {PRESET_AMOUNTS.map((amt) => {
                const active = !isCustomAmount && selectedAmount === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setIsCustomAmount(false);
                      setSelectedAmount(amt);
                    }}
                    className={`rounded-lg border py-2.5 px-3 text-sm font-semibold transition-all ${
                      active
                        ? 'bg-leaf border-leaf text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-leaf hover:text-navy'
                    }`}
                  >
                    ${amt}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setIsCustomAmount(true)}
                className={`rounded-lg border py-2.5 px-3 text-sm font-semibold transition-all ${
                  isCustomAmount
                    ? 'bg-leaf border-leaf text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-leaf hover:text-navy'
                }`}
              >
                Custom
              </button>
            </div>
            {isCustomAmount && (
              <div className="mt-3 max-w-xs">
                <label className="block text-xs font-medium text-slate-500 mb-1">Enter Custom Amount (USD)</label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="e.g. 75"
                  className={inputCls}
                />
              </div>
            )}
          </div>

          {/* 3. Choose a Campaign */}
          <div>
            <h2 className="font-display font-bold text-lg text-navy mb-3.5">3. Choose a Campaign</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {campaigns.map((c) => {
                const active = activeCampaign?.slug === c.slug;
                return (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => setSelectedCampaignSlug(c.slug)}
                    className={`text-left rounded-xl overflow-hidden bg-white transition-all flex flex-col ${
                      active
                        ? 'border-2 border-navy ring-2 ring-brand/15 shadow-md'
                        : 'border border-slate-200 hover:border-silver card-shadow'
                    }`}
                  >
                    <div className="relative h-32 w-full bg-bgsoft shrink-0">
                      <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                      {active && (
                        <span className="absolute top-2.5 right-2.5 bg-leaf text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm inline-flex items-center gap-1">
                          <i className="fa-solid fa-check text-[10px]"></i> Selected
                        </span>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col w-full">
                      <div className="font-display font-bold text-sm text-navy leading-snug mb-1.5">{c.title}</div>
                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-3">{c.description}</p>
                      <div className="mt-auto w-full">
                        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden mb-1.5">
                          <div className={`h-full rounded-full transition-all ${active ? 'w-full bg-leaf' : 'w-2/3 bg-silver-light'}`} />
                        </div>
                        <div className="text-[11px] font-medium text-slate-500">{c.tag}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Your Details */}
          <div>
            <h2 className="font-display font-bold text-lg text-navy mb-3.5">4. Your Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                value={donor.name}
                onChange={(e) => setDonor({ ...donor, name: e.target.value })}
                placeholder="Enter your full name"
                className={inputCls}
              />
              <input
                type="email"
                value={donor.email}
                onChange={(e) => setDonor({ ...donor, email: e.target.value })}
                placeholder="Enter your email"
                className={inputCls}
              />
              <input
                type="tel"
                value={donor.phone}
                onChange={(e) => setDonor({ ...donor, phone: e.target.value })}
                placeholder="Enter your phone number"
                className={inputCls}
              />
              <select
                value={donor.country}
                onChange={(e) => setDonor({ ...donor, country: e.target.value })}
                className={inputCls}
              >
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 5. Payment Method */}
          <div>
            <h2 className="font-display font-bold text-lg text-navy mb-3.5">5. Payment Method</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PAYMENT_TILES.map((tile) => {
                const active = activeTile.id === tile.id;
                return (
                  <button
                    key={tile.id}
                    type="button"
                    onClick={() => setSelectedTileId(tile.id)}
                    className={`rounded-lg py-3.5 px-3 flex flex-col items-center justify-center gap-1.5 text-center transition-all ${
                      active
                        ? 'border-2 border-navy bg-white text-navy shadow-sm'
                        : 'border border-slate-200 bg-white text-slate-600 hover:border-silver hover:text-navy'
                    }`}
                  >
                    <i className={`${tile.iconClass} text-lg ${active ? 'text-brand' : 'text-slate-500'}`}></i>
                    <span className={`text-xs font-semibold leading-tight ${active ? 'text-navy' : 'text-slate-700'}`}>
                      {tile.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary CTA */}
          <div>
            <button
              type="submit"
              className="w-full btn-primary py-3.5 px-6 text-base inline-flex items-center justify-center gap-2.5"
            >
              <i className="fa-solid fa-heart"></i>
              <span>Donate Now Securely</span>
            </button>
            <p className="text-center text-xs text-slate-400 mt-2.5">
              Thank you! Your kindness brings hope and changes lives.
            </p>
          </div>
        </form>

        {/* Right Sticky Summary Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-28">
          {/* Your Donation Summary */}
          <div className="rounded-xl overflow-hidden card-shadow border border-slate-200 bg-white">
            <div className="bg-leaf text-white font-display font-semibold px-5 py-3.5 flex items-center gap-2 text-sm sm:text-base">
              <i className="fa-solid fa-heart"></i>
              <span>Your Donation Summary</span>
            </div>
            <div className="p-5 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500">Type</span>
                <span className="font-semibold text-navy text-right">{donationType.summaryLabel}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500">Amount</span>
                <span className="font-semibold text-navy">${effectiveAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500">Campaign</span>
                <span className="font-semibold text-navy text-right">{activeCampaign?.title}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500">Payment</span>
                <span className="font-semibold text-navy text-right">{activeTile.label}</span>
              </div>
              <div className="border-t border-slate-100 pt-3 mt-2 flex items-baseline justify-between gap-3">
                <span className="font-display font-bold text-navy">Total Amount</span>
                <span className="font-display font-extrabold text-xl text-leaf">
                  ${effectiveAmount.toFixed(2)} <span className="text-xs font-medium text-slate-400">USD</span>
                </span>
              </div>
            </div>
          </div>

          {/* Why Your Donation Matters */}
          <div className="rounded-xl p-5 text-white bg-navy border border-silver/30 card-shadow">
            <div className="font-display font-semibold mb-3">Why Your Donation Matters</div>
            <ul className="space-y-2.5 text-sm text-blue-100">
              <li className="flex gap-2.5 items-start">
                <i className="fa-solid fa-heart mt-1 text-silver-light"></i>
                <span>You bring hope and care to orphan children &amp; lonely elders.</span>
              </li>
              <li className="flex gap-2.5 items-start">
                <i className="fa-solid fa-people-group mt-1 text-silver-light"></i>
                <span>You help free brick kiln families and empower women.</span>
              </li>
              <li className="flex gap-2.5 items-start">
                <i className="fa-solid fa-seedling mt-1 text-silver-light"></i>
                <span>Every gift is shared with photos, videos &amp; full transparency.</span>
              </li>
            </ul>
          </div>

          {/* We Accept + WhatsApp */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 card-shadow space-y-4">
            <div>
              <div className="font-display font-semibold text-sm text-navy mb-3">We Accept</div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'visa', title: 'Card (Visa)', icon: 'fa-brands fa-cc-visa', tileId: 'card' },
                  { id: 'mc', title: 'Card (Mastercard)', icon: 'fa-brands fa-cc-mastercard', tileId: 'card' },
                  { id: 'card', title: 'Card', icon: 'fa-solid fa-credit-card', tileId: 'card' },
                  { id: 'paypal', title: 'PayPal', icon: 'fa-brands fa-paypal', tileId: 'paypal' },
                  { id: 'easypaisa', title: 'Easypaisa', icon: 'fa-solid fa-mobile-screen-button', tileId: 'easypaisa' },
                  { id: 'bank', title: 'Bank Transfer', icon: 'fa-solid fa-building-columns', tileId: 'bank' },
                ].map((badge) => (
                  <button
                    key={badge.id}
                    type="button"
                    title={badge.title}
                    onClick={() => setSelectedTileId(badge.tileId)}
                    className="h-10 rounded-lg border border-slate-200 bg-bgsoft/60 hover:border-brand text-slate-500 hover:text-navy flex items-center justify-center text-lg transition-colors"
                  >
                    <i className={badge.icon}></i>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <div className="text-xs text-slate-500 mb-2">Already donated? Send your screenshot on WhatsApp:</div>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-lg bg-[#eefbf3] border border-[#b7e4c7] hover:border-[#22c55e] py-2 px-3 font-semibold text-navy text-xs inline-flex items-center justify-center gap-2 transition-colors"
              >
                <i className="fa-brands fa-whatsapp text-[#22c55e] text-base"></i>
                <span>{phone}</span>
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* Payment Popup Modal */}
      {modalState && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/70 backdrop-blur-sm"
          onClick={() => setModalState(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="donate-modal-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-silver/50 overflow-hidden"
          >
            {modalState.kind === 'details' ? (
              <>
                <div
                  className={`px-5 py-4 text-white flex items-center justify-between gap-3 ${
                    modalState.method.headerColor === 'leaf' ? 'bg-leaf' : 'bg-navy'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center text-base shrink-0">
                      <i className={`fa-solid ${modalState.method.icon}`}></i>
                    </span>
                    <h4 id="donate-modal-title" className="font-display font-bold text-base sm:text-lg truncate">
                      {modalState.method.modalTitle || modalState.method.label}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalState(null)}
                    aria-label="Close popup"
                    className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors shrink-0"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>

                <div className="bg-bgsoft border-b border-slate-100 px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-navy">
                  <span className="font-semibold truncate">{activeCampaign?.title}</span>
                  <span className="font-bold text-leaf shrink-0">
                    ${effectiveAmount.toFixed(2)} USD ({donationType.label})
                  </span>
                </div>

                <div className="divide-y divide-slate-100 max-h-[65vh] overflow-y-auto">
                  {modalState.method.fields.map((field) => {
                    const key = `${modalState.method.id}-${field.label}`;
                    const isCopied = copiedKey === key;
                    return (
                      <div key={field.label} className="px-5 py-3.5 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-slate-500 mb-0.5">{field.label}</div>
                          <div className="font-bold text-navy text-sm sm:text-base break-words">{field.value}</div>
                          {field.subvalue && <div className="text-xs text-slate-500 mt-0.5">{field.subvalue}</div>}
                        </div>
                        {field.copyable !== false && (
                          <button
                            type="button"
                            onClick={() => handleCopy(key, field.value)}
                            className="shrink-0 border border-slate-200 hover:border-silver bg-white hover:bg-bgsoft rounded-lg px-3.5 py-1.5 text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 transition-colors"
                          >
                            <i className={isCopied ? 'fa-solid fa-check text-leaf' : 'fa-regular fa-copy text-slate-500'}></i>
                            <span>{isCopied ? 'Copied' : 'Copy'}</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {whatsapp && (
                  <div className="bg-[#eefbf3] border-t border-[#b7e4c7] px-5 py-4">
                    <p className="text-xs sm:text-sm text-slate-700 mb-3 leading-relaxed">
                      After donating, please send your payment screenshot and your name on WhatsApp:
                    </p>
                    <a
                      href={buildWhatsAppHref(modalState.method.label)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold text-sm py-2.5 px-4 inline-flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <i className="fa-brands fa-whatsapp text-lg"></i>
                      <span>WhatsApp: {phone}</span>
                    </a>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="px-5 py-4 text-white bg-navy flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center text-base shrink-0">
                      <i className={modalState.tile.iconClass}></i>
                    </span>
                    <h4 id="donate-modal-title" className="font-display font-bold text-base sm:text-lg truncate">
                      {modalState.tile.label} Donation
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalState(null)}
                    aria-label="Close popup"
                    className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors shrink-0"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>

                <div className="bg-bgsoft border-b border-slate-100 px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-navy">
                  <span className="font-semibold truncate">{activeCampaign?.title}</span>
                  <span className="font-bold text-leaf shrink-0">
                    ${effectiveAmount.toFixed(2)} USD ({donationType.label})
                  </span>
                </div>

                <div className="p-5 space-y-4 text-sm text-slate-600 leading-relaxed">
                  <p>
                    For international <strong>{modalState.tile.label}</strong> transfers or direct wire/remittance assistance (Wise, Remitly, or Western Union to our Bank Alfalah IBAN), contact us on WhatsApp or view our official bank details below.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const bank = getMethodById('bank');
                      if (bank) {
                        setSelectedTileId('bank');
                        setModalState({ kind: 'details', method: bank });
                      }
                    }}
                    className="w-full rounded-xl border border-navy text-navy hover:bg-navy hover:text-white font-semibold text-sm py-2.5 px-4 inline-flex items-center justify-center gap-2 transition-colors"
                  >
                    <i className="fa-solid fa-building-columns"></i>
                    <span>View Bank Account &amp; IBAN Details</span>
                  </button>
                </div>

                {whatsapp && (
                  <div className="bg-[#eefbf3] border-t border-[#b7e4c7] px-5 py-4">
                    <p className="text-xs sm:text-sm text-slate-700 mb-3 leading-relaxed">
                      Message us on WhatsApp to arrange your {modalState.tile.label} gift:
                    </p>
                    <a
                      href={buildWhatsAppHref(modalState.tile.label)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold text-sm py-2.5 px-4 inline-flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <i className="fa-brands fa-whatsapp text-lg"></i>
                      <span>WhatsApp: {phone}</span>
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

