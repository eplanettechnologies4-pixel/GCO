import PageHero from '@/components/PageHero';
import SectionTitle from '@/components/SectionTitle';
import { site } from '@/lib/site';

export const metadata = {
  title: 'About Us | GCO Foundation Pakistan',
  description: site.whoWeAre,
};

export default function AboutPage() {
  const doing = [
    { icon: 'fa-house', t: 'Orphanage Care', d: `Shelter, food, education, health and love for orphan children, including our ${site.daughters} daughters at ${site.home}.` },
    { icon: 'fa-person-cane', t: 'Old Age Home Care', d: 'Daily meals, medical support, companionship and respect for elderly people who have no one else.' },
    { icon: 'fa-dove', t: 'Brick Kiln Families', d: 'Food distribution, schooling for children and freedom from bonded debt and slavery.' },
    { icon: 'fa-scissors', t: 'Women Development', d: 'Education, sewing, vocational training and practical skills so women can become independent.' },
    { icon: 'fa-droplet', t: 'Community Uplift', d: 'Clean water, medical health camps, school support and awareness programs for needy communities.' },
  ];

  return (
    <>
      <PageHero
        title="About Us"
        bgImage="/assets/hero-about-bg.jpg"
        bgAlt="Global Connection Welfare Organization community outreach and care in Pakistan"
        bgPosition="center 52%"
      />

      <section className="py-16 md:py-24">
        <div className="max-w-[1180px] mx-auto px-6 space-y-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionTitle eyebrow="Our Story" title="Who We Are" align="left" />
              <p className="text-muted text-[15.5px] leading-[1.85] mt-5">{site.whoWeAre}</p>
              <p className="text-muted text-[15.5px] leading-[1.85] mt-4">
                Through {site.home} and our grassroots outreach programs across Punjab, we stand with orphan children, helpless elders, brick kiln families, women and vulnerable communities — sharing hope backed by honest, transparent reporting.
              </p>
              <p className="text-navy font-bold text-base mt-4 font-display">{site.tagline}</p>
            </div>

            <div className="rounded-2xl overflow-hidden border-4 border-white ring-1 ring-silver/50 card-shadow bg-white">
              <img
                src="/assets/about-story.jpg"
                alt="Who We Are - Global Connection Welfare Organization caring for children and elders"
                className="w-full h-72 md:h-80 object-cover"
              />
            </div>
          </div>

          <div className="rounded-[22px] bg-bgsoft border border-silver/40 p-8 md:p-10">
            <i className="fa-solid fa-quote-left text-3xl mb-3 text-silver"></i>
            <h3 className="text-brand font-bold text-xl mb-3 font-display">A Message from Our Pastors</h3>
            <p className="text-slate-600 text-[15px] leading-[1.85]">
              Your love and kindness always bring great happiness to the children and families we serve. We are truly grateful for your continuous prayers and support — {site.promise}
            </p>
            <p className="text-navy font-semibold mt-5">{site.leaders.join(' / ')}</p>
            <p className="text-muted text-sm">{site.fullName} — {site.location}</p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-bgsoft border-y border-silver/30">
        <div className="max-w-[1180px] mx-auto px-6">
          <SectionTitle eyebrow="What We Do" title="How We Serve on the Ground" />
          <div className="flex flex-wrap justify-center gap-5 mt-12 text-center">
            {doing.map((x, i) => (
              <div
                key={x.t}
                className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] bg-white border border-silver/40 rounded-2xl p-7 card-shadow"
              >
                <div className={`w-[60px] h-[60px] rounded-full text-white flex items-center justify-center text-xl mx-auto mb-4 ${i % 2 ? 'bg-leaf' : 'bg-brand'}`}>
                  <i className={`fa-solid ${x.icon}`}></i>
                </div>
                <h4 className="text-navy font-bold text-[15.5px] mb-2 font-display">{x.t}</h4>
                <p className="text-muted text-[13.5px] leading-relaxed">{x.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-white border border-silver/50 p-6 md:p-8 flex flex-col md:flex-row items-center gap-5 card-shadow">
            <div className="w-12 h-12 rounded-full bg-bggreen text-leaf flex items-center justify-center text-xl shrink-0">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div>
              <div className="font-display font-bold text-navy text-base mb-1">Our Promise of Transparency</div>
              <p className="text-muted text-sm leading-relaxed">{site.promise}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-[1180px] mx-auto px-6">
          <SectionTitle eyebrow="Reach Us" title="Get in Touch" />
          <div className="grid md:grid-cols-3 gap-5 mt-12">
            {[
              { icon: 'fa-location-dot', t: 'Head Office', v: site.address, c: 'bg-brand' },
              { icon: 'fa-phone', t: 'Phone', v: site.phone, c: 'bg-leaf' },
              { icon: 'fa-envelope', t: 'Email', v: site.email, c: 'bg-brand' },
            ].map((c) => (
              <div key={c.t} className="bg-bgsoft border border-silver/30 rounded-2xl p-7 flex gap-4 items-start">
                <div className={`w-12 h-12 rounded-xl ${c.c} text-white flex items-center justify-center text-lg shrink-0`}>
                  <i className={`fa-solid ${c.icon}`}></i>
                </div>
                <div className="min-w-0">
                  <h4 className="text-navy font-bold text-[15.5px] mb-1.5 font-display">{c.t}</h4>
                  <p className="text-muted text-[13.5px] leading-relaxed break-words">{c.v}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
