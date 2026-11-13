export const dynamic = 'force-dynamic';

import Link from 'next/link';
import SectionTitle from '@/components/SectionTitle';
import ProjectCard from '@/components/ProjectCard';
import AppealTable from '@/components/AppealTable';
import { getProjects } from '@/lib/db-projects';
import { site, appeal, appealTotals, fmt } from '@/lib/site';

export default async function HomePage() {
  const latestProjects = await getProjects({ limit: 4 });
  const allProjects = await getProjects();
  const total = appealTotals();
  const stats = [
    { n: String(site.daughters), l: 'Daughters in our home' },
    { n: String(allProjects.length), l: 'Active welfare projects' },
    { n: `PKR ${fmt(total.pkr)}`, l: 'Christmas appeal target' },
    { n: 'Gujranwala', l: 'Punjab, Pakistan' },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b-2 border-silver/40 bg-navy-dark">
        <img
          src="/assets/hero-home-bg.jpg"
          alt="Source of Life Friendly Home Orphanage courtyard and daughters"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(rgba(220,224,229,.10) 2px, transparent 2px), linear-gradient(105deg, rgba(1,22,72,0.88) 0%, rgba(6,36,99,0.68) 48%, rgba(5,78,160,0.34) 100%)',
            backgroundSize: '24px 24px, 100% 100%',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-5 py-20 md:py-28">
          <div className="max-w-2xl text-white">
            <div className="text-xs tracking-[3px] font-semibold text-silver-light mb-4 uppercase drop-shadow-sm">{site.tagline}</div>
            <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-tight drop-shadow-sm">
              A Home, Hope &amp; <br />a Future for Every Child
            </h1>
            <p className="text-slate-100 mt-5 max-w-xl drop-shadow-sm">
              {site.fullName}  working in {site.location} to serve orphan children, helpless elders, brick kiln families, women and communities.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <Link href="/donate" className="btn-primary px-7 py-3 inline-flex items-center gap-2">
                <i className="fa-solid fa-gift"></i> Christmas Joy Appeal
              </Link>
              <Link href="/projects" className="btn-outline-white px-7 py-3 inline-flex items-center gap-2">
                Our Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white shadow-md border-b border-silver/30 relative z-10">
        <div className="max-w-6xl mx-auto px-5 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.l}>
              <div className="text-2xl md:text-3xl font-display font-extrabold text-navy">{s.n}</div>
              <div className="text-muted text-sm mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* OUR PROJECTS */}
      <section className="py-16 px-5 max-w-7xl mx-auto">
        <SectionTitle title="Our Projects" />
        <div className="flex flex-wrap justify-center gap-6 mt-10">
          {latestProjects.map((p) => (
            <div key={p.slug || p.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex">
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
      </section>

      {/* MISSION */}
      <section className="py-16 px-5 bg-bgsoft border-y border-silver/30">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="eyebrow">Our Mission</span>
            <h2 className="font-display font-bold text-3xl mb-4 text-navy">{site.tagline}</h2>
            <p className="text-slate-600 leading-relaxed mb-4">{site.mission}</p>
            <ul className="space-y-3 mb-6">
              {[
                'Serving orphan children, elders, brick kiln families & women.',
                'Providing food, shelter, education, health care & freedom.',
                site.promise,
              ].map((t) => (
                <li key={t} className="flex gap-2 text-slate-700">
                  <i className="fa-solid fa-circle-check mt-1 text-leaf"></i> {t}
                </li>
              ))}
            </ul>
            <Link href="/mission" className="btn-primary px-6 py-2.5 inline-flex items-center gap-2">
              Read More <i className="fa-solid fa-arrow-right text-xs"></i>
            </Link>
          </div>
          <div className="flex justify-center">
            <div className="w-full rounded-2xl overflow-hidden border-4 border-white ring-1 ring-silver/50 card-shadow bg-white">
              <img
                src="/assets/mission.jpg"
                alt="Compassion is Our Mission - Daughters growing in faith, learning, and care"
                className="w-full h-72 md:h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CHRISTMAS APPEAL */}
      <section className="py-16 px-5 max-w-5xl mx-auto">
        <SectionTitle eyebrow="Christmas 2026" title={appeal.title} />
        <p className="text-slate-600 leading-relaxed text-center max-w-3xl mx-auto mt-6 mb-8">
          We humbly invite you to share the joy of Christmas with {appeal.forWhom}, by providing new clothes, warm wear and a special festive celebration. Contribute whatever you can easily give.
        </p>
        <AppealTable />
        <div className="text-center mt-8">
          <Link href="/donate" className="btn-primary px-7 py-3 inline-flex items-center gap-2">
            <i className="fa-solid fa-heart"></i> I Want to Help
          </Link>
        </div>
      </section>

      {/* DONATION BANNER */}
      <section className="pb-16 px-5">
        <div className="max-w-6xl mx-auto rounded-xl px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6 bg-leaf border border-silver/30">
          <div className="flex items-center gap-4 text-white">
            <div className="w-14 h-14 rounded-full bg-white/15 ring-1 ring-silver/40 flex items-center justify-center text-2xl shrink-0">
              <i className="fa-solid fa-heart"></i>
            </div>
            <div>
              <div className="font-display font-bold text-xl">Your small donation can change someone&apos;s whole life.</div>
              <div className="text-silver-light text-sm mt-1">Be the reason for a daughter&apos;s smile this Christmas.</div>
            </div>
          </div>
          <Link href="/donate" className="btn-outline-white px-7 py-3 inline-flex items-center gap-2">
            <i className="fa-solid fa-heart"></i> Donate Now
          </Link>
        </div>
      </section>
    </>
  );
}