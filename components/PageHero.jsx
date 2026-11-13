import Link from 'next/link';

export default function PageHero({ title, subtitle, crumb, bgImage, bgAlt, bgPosition = 'center center' }) {
  return (
    <section
      className="relative overflow-hidden border-b-2 border-silver/40 bg-navy-dark"
      style={
        !bgImage
          ? {
              backgroundColor: '#062463',
              backgroundImage:
                'radial-gradient(rgba(220,224,229,.12) 2px, transparent 2px), linear-gradient(105deg, #011648 0%, #062463 55%, #054ea0 100%)',
              backgroundSize: '24px 24px, 100% 100%',
            }
          : undefined
      }
    >
      {bgImage && (
        <>
          <img
            src={bgImage}
            alt={bgAlt || title}
            style={{ objectPosition: bgPosition }}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(rgba(220,224,229,.10) 2px, transparent 2px), linear-gradient(105deg, rgba(1,22,72,0.86) 0%, rgba(6,36,99,0.72) 55%, rgba(5,78,160,0.56) 100%)',
              backgroundSize: '24px 24px, 100% 100%',
            }}
          />
        </>
      )}
      <div className="relative z-10 max-w-[1180px] mx-auto px-6 py-16 md:py-24">
        <h1 className="text-white font-display font-extrabold text-4xl md:text-5xl mb-3 drop-shadow-sm">{title}</h1>
        {subtitle && <p className="text-white/90 text-sm md:text-base mb-3 max-w-xl drop-shadow-sm">{subtitle}</p>}
        <div className="flex items-center gap-2 text-white/85 text-sm font-medium">
          <Link href="/" className="hover:text-white">Home</Link>
          <i className="fa-solid fa-chevron-right text-[11px] text-silver-light/70"></i>
          <span className="text-white font-semibold">{crumb || title}</span>
        </div>
      </div>
    </section>
  );
}
