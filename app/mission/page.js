import Link from 'next/link';
import PageHero from '@/components/PageHero';
import SectionTitle from '@/components/SectionTitle';
import { site } from '@/lib/site';

export const metadata = {
  title: 'Mission & Vision | GCO Foundation Pakistan',
  description: `${site.tagline} ${site.mission}`,
};

export default function MissionPage() {
  return (
    <>
      <PageHero
        title="Mission & Vision"
        crumb="Mission & Vision"
        bgImage="/assets/hero-mission-bg.jpg"
        bgAlt="Love, faith, and care for our daughters at Source of Life Friendly Home Orphanage"
        bgPosition="center 32%"
      />

      <section className="pt-16 md:pt-20">
        <div className="max-w-[1180px] mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionTitle eyebrow="What Drives Us" title={site.tagline} align="left" />
            <p className="text-muted text-[15.5px] leading-[1.85] mt-6">
              Working on the ground in {site.location}, {site.fullName} stands beside orphan children, helpless elders, brick kiln families, women and underserved communities — bringing practical care, education, and lasting hope.
            </p>
            <div className="mt-6 rounded-xl bg-bgsoft border border-silver/40 px-5 py-4 flex gap-3 items-start">
              <i className="fa-solid fa-circle-check text-leaf mt-1 shrink-0"></i>
              <div className="text-sm text-navy leading-relaxed">
                <strong className="font-display">Our Promise:</strong> {site.promise}
              </div>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border-4 border-white ring-1 ring-silver/50 card-shadow bg-white">
            <img
              src="/assets/mission.jpg"
              alt="Connecting Hearts, Changing Lives at Global Connection Welfare Organization"
              className="w-full h-64 md:h-72 object-cover"
            />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-[1180px] mx-auto px-6 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl p-9 md:p-11 bg-bgsoft border border-silver/40">
            <div className="w-[52px] h-[52px] rounded-2xl bg-brand text-white flex items-center justify-center text-xl mb-5">
              <i className="fa-solid fa-eye"></i>
            </div>
            <span className="text-brand font-bold text-xs tracking-[.12em] uppercase block mb-2 font-display">Our Vision</span>
            <h3 className="text-navy font-bold text-2xl mb-4 font-display">Love, Equality, Education &amp; Freedom for All</h3>
            <p className="text-muted text-[15px] leading-[1.85]">{site.vision}</p>
          </div>
          <div className="rounded-2xl p-9 md:p-11 bg-bggreen border border-leaf/20">
            <div className="w-[52px] h-[52px] rounded-2xl bg-leaf text-white flex items-center justify-center text-xl mb-5">
              <i className="fa-solid fa-bullseye"></i>
            </div>
            <span className="text-leaf font-bold text-xs tracking-[.12em] uppercase block mb-2 font-display">Our Mission</span>
            <h3 className="text-navy font-bold text-2xl mb-4 font-display">Respect &amp; a Better Future for Every Life</h3>
            <p className="text-muted text-[15px] leading-[1.85]">{site.mission}</p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-bgsoft border-t border-silver/30">
        <div className="max-w-[1180px] mx-auto px-6">
          <SectionTitle eyebrow="What We Stand For" title="Our Values" />
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            {site.values.map((v, i) => (
              <div
                key={v.title}
                className="w-full md:w-[calc(33.333%-16px)] bg-white rounded-2xl p-7 border border-silver/40 card-shadow text-center"
              >
                <div
                  className={`w-[56px] h-[56px] rounded-full text-white flex items-center justify-center text-xl mx-auto mb-4 ${i % 2 ? 'bg-leaf' : 'bg-brand'
                    }`}
                >
                  <i className={`fa-solid ${v.icon}`}></i>
                </div>
                <h4 className="text-navy font-bold text-lg mb-1.5 font-display">{v.title}</h4>
                <p className="text-muted text-[14px] leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-2xl bg-navy text-white p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-silver/30">
            <div className="max-w-2xl">
              <span className="text-silver-light font-bold text-xs tracking-[.12em] uppercase block mb-2 font-display">
                Our Promise
              </span>
              <h3 className="font-display font-bold text-xl md:text-2xl mb-2">100% Transparency on the Ground</h3>
              <p className="text-blue-100 text-sm md:text-[15px] leading-relaxed">{site.promise}</p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link href="/projects" className="btn-outline-white px-6 py-2.5 text-sm inline-flex items-center gap-2">
                Our Projects
              </Link>
              <Link href="/donate" className="bg-leaf hover:bg-leaf-dark text-white font-semibold rounded-md px-6 py-2.5 text-sm inline-flex items-center gap-2 transition-colors">
                <i className="fa-solid fa-heart"></i> Donate Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
