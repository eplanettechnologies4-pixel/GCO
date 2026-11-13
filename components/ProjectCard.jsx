import Link from 'next/link';
import { resolveImage } from '@/lib/media';

export default function ProjectCard({ project }) {
  const img = resolveImage(project.image);
  const icon = project.icon || 'fa-hand-holding-heart';
  const short = project.description && project.description.length > 120
    ? project.description.slice(0, 120).trim() + '...'
    : project.description || '';

  return (
    <div className="w-full rounded-xl overflow-hidden card-shadow border border-silver/30 bg-white flex flex-col">
      <div className="relative h-44">
        {img ? (
          <img src={img} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full dots-bg bg-gradient-to-br from-navy to-brand flex items-center justify-center text-white/90 text-5xl">
            <i className={`fa-solid ${icon}`}></i>
          </div>
        )}
        <div className="absolute -bottom-5 left-4 w-11 h-11 rounded-full flex items-center justify-center text-white text-lg bg-leaf ring-2 ring-white shadow-md">
          <i className={`fa-solid ${icon}`}></i>
        </div>
      </div>
      <div className="p-5 pt-8 flex-1 flex flex-col">
        <h3 className="font-display font-semibold text-lg mb-2 text-navy">{project.title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed">{short}</p>
        <Link href="/projects" className="text-sm font-semibold mt-auto pt-3 inline-flex items-center gap-1 text-leaf">
          Learn More <i className="fa-solid fa-arrow-right text-xs"></i>
        </Link>
      </div>
    </div>
  );
}