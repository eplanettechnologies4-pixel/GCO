'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { site, navItems } from '@/lib/site';
import { projects } from '@/lib/projects';

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on all admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="pt-14 pb-6 px-5 bg-navy-dark">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10 text-slate-300 text-sm">
        <div>
          <Link href="/" className="flex items-center gap-3 mb-3">
            <span className="rounded-full bg-navy ring-1 ring-silver/50 p-0.5 shrink-0">
              <Image src="/assets/logo.png" alt={site.name} width={52} height={52} className="w-[52px] h-[52px] rounded-full object-contain" />
            </span>
            <div>
              <div className="font-display font-bold text-white">GCO <span className="text-silver-light">Foundation</span></div>
              <div className="text-[10px] text-slate-400">{site.fullName}</div>
            </div>
          </Link>
          <p className="text-slate-400 leading-relaxed">
            {site.tagline} A non-profit welfare organization working in {site.location} to serve orphan children, elders, brick kiln families, women and communities.
          </p>
        </div>

        <div>
          <div className="text-white font-display font-semibold mb-3">Quick Links</div>
          <ul className="space-y-2">
            {navItems.map((n) => (
              <li key={n.href}><Link href={n.href} className="hover:text-white transition-colors">{n.label}</Link></li>
            ))}
            <li><Link href="/donate" className="hover:text-white transition-colors">Donate</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-white font-display font-semibold mb-3">Our Projects</div>
          <ul className="space-y-2">
            {projects.map((p) => (
              <li key={p.slug}><Link href="/projects" className="hover:text-white transition-colors">{p.title}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-white font-display font-semibold mb-3">Contact Us</div>
          <ul className="space-y-3">
            <li className="flex gap-2"><i className="fa-solid fa-phone mt-1"></i>
              <a href={`tel:${site.phoneHref}`} className="hover:text-white">{site.phone}</a></li>
            <li className="flex gap-2"><i className="fa-regular fa-envelope mt-1"></i>
              <a href={`mailto:${site.email}`} className="hover:text-white break-all">{site.email}</a></li>
            <li className="flex gap-2"><i className="fa-solid fa-location-dot mt-1"></i> {site.address}</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/10 mt-10 pt-5 flex flex-col md:flex-row justify-between text-slate-500 text-xs gap-2">
        <div>&copy; {new Date().getFullYear()} {site.fullName} ({site.name} {site.country}). All Rights Reserved.</div>
        <div>{site.tagline}</div>
      </div>
    </footer>
  );
}