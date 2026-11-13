// Poori site ki info yahan se aati hai. Kuch badalna ho to sirf yeh file edit karein.

export const site = {
  name: 'GCO Foundation',
  country: 'Pakistan',
  fullName: 'Global Connection Welfare Organization',
  tagline: 'Connecting Hearts, Changing Lives.',
  home: 'Source of Life Friendly Home Orphanage',
  location: 'Gujranwala, Punjab, Pakistan',
  whoWeAre:
    'Global Connection Welfare Organization is a non-profit welfare organization working in Gujranwala, Punjab, Pakistan. We connect kind hearts from around the world with needy people in Pakistan, to bring real change on the ground.',
  mission:
    'To serve orphan children, old age helpless people, brick kiln families, women and poor communities with love, dignity and hope by providing food, shelter, education, health care, and freedom from slavery, so every life can live with respect and a better future.',
  vision:
    'A world where no child sleeps hungry, no old person feels alone, no woman feels helpless, and no brick kiln family lives in slavery — a community built on love, equality, education and freedom for all.',
  promise:
    'Every donation reaches the real needy people. We share photos, videos and reports with full transparency.',
  values: [
    { icon: 'fa-heart', title: 'Love', description: 'Serve with heart' },
    { icon: 'fa-hand-holding-heart', title: 'Dignity', description: 'Every person matters' },
    { icon: 'fa-shield-halved', title: 'Honesty', description: 'Transparent use of donations' },
    { icon: 'fa-dove', title: 'Freedom', description: 'End slavery and bonded labour' },
    { icon: 'fa-seedling', title: 'Hope', description: 'Build a better future' },
  ],
  email: 'globalconnectionwelfareorg@gmail.com',
  phone: '+92 344 255 1102',
  phoneHref: '+923442551102',
  address: 'Nadeem Town, Apex College Near Awan Chowk, Gujranwala, Punjab, Pakistan',
  mapQuery: 'Nadeem Town Apex College Awan Chowk Gujranwala Punjab Pakistan',
  leaders: ['Pastor Qaiser Saleem', 'Pastor Nazish Qaiser'],
  daughters: 29,
  whatsapp: '923442551102',
  // Bank & Easypaisa details shown in the /donate popups.
  paymentMethods: [
    {
      id: 'bank',
      label: 'Bank Account',
      subtitle: 'Bank Alfalah Limited',
      modalTitle: 'Bank Account Details',
      headerColor: 'navy',
      icon: 'fa-building-columns',
      fields: [
        { label: 'Account Holder Name', value: 'GLOBAL CONNECTION WELFARE ORGANIZATION', copyable: false },
        {
          label: 'Bank Name',
          value: 'Bank Alfalah Limited',
          subvalue: 'Branch: 0048 - Abbot Road Branch, Lahore (Current Plus Account)',
          copyable: false,
        },
        {
          label: 'Account Number',
          value: '1011516653',
          copyable: true,
        },
        {
          label: 'IBAN Number',
          value: 'PK96ALFH0048001011516653',
          copyable: true,
        },
      ],
    },
    {
      id: 'easypaisa',
      label: 'Easypaisa',
      subtitle: 'Mobile Wallet Account',
      modalTitle: 'Easypaisa Account Details',
      headerColor: 'leaf',
      icon: 'fa-wallet',
      fields: [
        { label: 'Account Holder Name', value: 'Qaiser Saleem', copyable: false },
        { label: 'Easypaisa Number', value: '03446585686', copyable: true },
        { label: 'Platform', value: 'Easypaisa', copyable: false },
      ],
    },
  ],
  bank: null,
};

export const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Mission & Vision', href: '/mission' },
  { label: 'Our Projects', href: '/projects' },
  { label: 'Contact', href: '/contact' },
];

// Christmas Joy Appeal 2026 budget (PDF se).
// NOTE: PDF mein Shoes ka unit cost 3,000 likha tha lekin total 145,000 / $524.14 hai (yani 5,000 per pair),
// is liye yahan 5,000 rakha hai. PDF ka grand total 427,000 / $1543.71 line items se match nahi karta,
// is liye total neeche automatically line items ka jama hai. Agar PDF wala total chahiye to totalOverride set karein.
export const appeal = {
  title: 'Christmas Joy Appeal 2026',
  forWhom: `the ${site.daughters} daughters of ${site.home}`,
  items: [
    { item: 'Dresses', qty: 29, unitPkr: 5000, totalPkr: 145000, unitUsd: 18.07, totalUsd: 524.14 },
    { item: 'Under Garments', qty: 29, unitPkr: 3000, totalPkr: 87000, unitUsd: 10.85, totalUsd: 314.61 },
    { item: 'Shoes', qty: 29, unitPkr: 5000, totalPkr: 145000, unitUsd: 18.07, totalUsd: 524.14 },
  ],
  totalOverride: null, // e.g. { pkr: 427000, usd: 1543.71 }
};

export function appealTotals() {
  if (appeal.totalOverride) return appeal.totalOverride;
  return {
    pkr: appeal.items.reduce((s, i) => s + i.totalPkr, 0),
    usd: Math.round(appeal.items.reduce((s, i) => s + i.totalUsd, 0) * 100) / 100,
  };
}

export const fmt = (n) => n.toLocaleString('en-US');
