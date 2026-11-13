export const dynamic = 'force-dynamic';

import Link from 'next/link';
import PageHero from '@/components/PageHero';
import { getProjects } from '@/lib/db-projects';
import { resolveImage } from '@/lib/media';

export const metadata = {
  title: 'Our Projects | GCO Foundation Pakistan',
  description: 'Orphanage Project, Old Age Home Project, Brick Kiln Project, Women Development Project, and Community Development Project in Gujranwala, Pakistan.',
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHero
        title="Our Projects"
        bgImage="/assets/hero-projects-bg.jpg"
        bgAlt="Volunteers organizing care packages and donations for GCO Foundation projects"
        bgPosition="center 25%"
      />
      <section className="py-16 px-5 max-w-7xl mx-auto space-y-16">
        {projects.map((p, i) => {
          const img = resolveImage(p.image);
          const icon = p.icon || 'fa-hand-holding-heart';
          const highlights = Array.isArray(p.highlights) ? p.highlights : [];

          return (
            <div key={p.slug || p.id} className="grid md:grid-cols-2 gap-10 items-center">
              <div className={i % 2 === 1 ? 'md:order-2' : ''}>
                {img ? (
                  <img src={img} alt={p.title} className="rounded-xl w-full h-72 object-cover card-shadow" />
                ) : (
                  <div className="rounded-xl w-full h-72 card-shadow dots-bg bg-gradient-to-br from-navy to-brand flex items-center justify-center text-white/90 text-7xl">
                    <i className={`fa-solid ${icon}`}></i>
                  </div>
                )}
              </div>
              <div>
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${
                  p.status === 'Appeal open'
                    ? 'bg-bgsilver text-navy border border-silver/70'
                    : 'bg-bggreen text-leaf border border-leaf/20'
                }`}>
                  {p.status}
                </span>
                <h3 className="font-display font-bold text-2xl mb-3 text-navy">{p.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-4">{p.description}</p>
                {highlights.length > 0 && (
                  <ul className="space-y-2 mb-5">
                    {highlights.map((h) => (
                      <li key={h} className="flex gap-2 text-sm text-slate-700">
                        <i className="fa-solid fa-circle-check mt-1 text-leaf"></i> {h}
                      </li>
                    ))}
                  </ul>
                )}
                <Link href="/donate" className="btn-primary px-6 py-2.5 inline-flex items-center gap-2 text-sm">
                  Support This Project <i className="fa-solid fa-arrow-right text-xs"></i>
                </Link>
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}