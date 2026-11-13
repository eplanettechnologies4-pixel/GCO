import PageHero from '@/components/PageHero';
import DonateExperience from '@/components/DonateExperience';
import { site } from '@/lib/site';
import { projects } from '@/lib/projects';

export const metadata = {
  title: 'Donate | GCO Foundation Pakistan',
  description: `Support ${site.fullName} projects in Gujranwala, Punjab, Pakistan. Every contribution creates real change.`,
};

export default function DonatePage() {
  const campaigns = [
    ...projects.map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      image: p.image,
      tag: `${site.location}`,
    })),
    {
      slug: 'christmas-joy-appeal',
      title: 'Christmas Joy Appeal 2026',
      description: `New clothes, warm wear, and a festive celebration for the ${site.daughters} daughters of ${site.home}.`,
      image: '/projects/christmas.jpg',
      tag: `PKR 13,000 ($46.99) per daughter kit`,
    },
  ];

  return (
    <>
      <PageHero
        title="Make a Donation"
        subtitle="Every contribution creates real change"
        bgImage="/assets/hero-donate-bg.jpg"
        bgAlt="Support Global Connection Welfare Organization programs in Pakistan"
        bgPosition="center 55%"
      />

      <DonateExperience
        campaigns={campaigns}
        paymentMethods={site.paymentMethods}
        whatsapp={site.whatsapp}
        phone={site.phone}
      />
    </>
  );
}
