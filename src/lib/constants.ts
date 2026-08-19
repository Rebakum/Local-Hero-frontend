import type { TradeCategory } from '../types';

export const TRADE_ICONS: Record<string, string> = {
  Wrench: 'Wrench',
  Zap: 'Zap',
  Sparkles: 'Sparkles',
  Paintbrush: 'Paintbrush',
  Trees: 'Trees',
  Hammer: 'Hammer',
  Key: 'Key',
  Home: 'Home',
};

export const NAV_LINKS = [
  { label: 'Services', path: '/services', sectionId: 'services' },
  { label: 'About', path: '/about', sectionId: 'about' },
  { label: 'Professionals', path: '/professionals', sectionId: 'professionals' },
  { label: 'How it Works', path: '/how-it-works', sectionId: 'how-it-works' },
  { label: 'FAQ', path: '/faq', sectionId: 'faq' },
  { label: 'Contact-Us', path: '/contact', sectionId: 'contact' },
] as const;

export const URGENCY_OPTIONS = [
  { id: 'Standard' as const, label: 'Standard booking', desc: 'Pick date & time', eta: 'Next available slot' },
  { id: 'Urgent (Same Day)' as const, label: 'Urgent today', desc: 'Within 3 – 6 hours', eta: 'Arrival in 3 – 6 hours' },
  { id: 'Emergency 24/7 (45 Mins)' as const, label: 'Emergency 24/7', desc: '45 min arrival', eta: 'Arrival in ~45 minutes' },
];

export const BOOKING_STEPS = ['Trade', 'Location', 'Schedule', 'Confirm'] as const;

export const EMERGENCY_TRADES: { id: TradeCategory; label: string; iconName: string }[] = [
  { id: 'Plumber', label: 'Leak / Plumbing', iconName: 'Flame' },
  { id: 'Electrician', label: 'Power Outage', iconName: 'Zap' },
  { id: 'Locksmith', label: 'Lockout 24/7', iconName: 'Key' },
];

export const SERVICE_LINKS = [
  { label: 'Plumbers', iconName: 'Wrench' },
  { label: 'Electricians', iconName: 'Zap' },
  { label: 'Cleaners', iconName: 'Sparkles' },
  { label: 'Painters', iconName: 'Paintbrush' },
  { label: 'Gardeners', iconName: 'Trees' },
  { label: 'Carpenters', iconName: 'Hammer' },
  { label: 'Locksmiths', iconName: 'Key' },
  { label: 'Roofers', iconName: 'Home' },
];

export const COMPANY_LINKS = [
  { label: 'About LocalHero', to: '/about' },
  { label: 'Become a Pro', to: '/professionals' },
  { label: 'Trust & Safety', to: '/about' },
  { label: 'Careers', to: '/about' },
  { label: 'Press Kit', to: '/about' },
  { label: 'Blog', to: '/about' },
];

export const HELP_LINKS = [
  { label: 'FAQ & Help Centre', to: '/faq' },
  { label: 'Contact Us', to: '/faq' },
  { label: '£2M Guarantee', to: '/faq' },
  { label: 'Terms of Service', to: '/faq' },
  { label: 'Privacy Policy', to: '/faq' },
  { label: 'Sitemap', to: '/faq' },
];

export const SOCIAL_LINKS = [
  { label: 'Facebook', iconName: 'Facebook' },
  { label: 'Instagram', iconName: 'Instagram' },
  { label: 'LinkedIn', iconName: 'Linkedin' },
  { label: 'Twitter', iconName: 'Twitter' },
];

export const DASHBOARD_SIDEBAR = [
  { label: 'Dashboard', active: true },
  { label: 'Bookings' },
  { label: 'Messages' },
  { label: 'Payouts' },
  { label: 'Reviews' },
];

export const DASHBOARD_STATS = [
  { label: 'This month', value: '£4,280', delta: '+18%', iconName: 'PoundSterling' },
  { label: 'Jobs completed', value: '36', delta: '+6', iconName: 'Check' },
  { label: 'Avg. rating', value: '4.98', delta: '+0.02', iconName: 'Star' },
  { label: 'Response time', value: '12 min', delta: '-3 min', iconName: 'Clock' },
];

export const EARNINGS_BARS = [42, 58, 45, 72, 66, 88, 54, 78, 92, 70, 84, 96];
export const WEEK_LABELS = Array.from({ length: 12 }, (_, i) => `W${i + 1}`);

export const TRUST_PARTNERS_MARQUEE = [
  'Gas Safe',
  'NICEIC',
  'TrustMark',
  'Checkatrade',
  'CHAS',
  'NAPIT',
  'Federation of Master Builders',
  'SafeContractor',
  'Constructionline',
  'Which? Trusted Traders',
  'Trustpilot',
  'British Gas Approved',
];

export const HOW_IT_WORKS_STEPS = [
  {
    iconName: 'Search',
    number: '01',
    title: 'Post your job',
    desc: 'Describe the task, choose your service and postcode, and pick a date. Takes under 60 seconds — no account needed.',
    note: 'Free to post • No call-out fees',
  },
  {
    iconName: 'Zap',
    number: '02',
    title: 'Get matched instantly',
    desc: 'LocalHero pings up to 3 vetted professionals nearby. Compare fixed quotes, ratings and availability side by side.',
    note: 'Avg. 3 quotes in under 5 minutes',
  },
  {
    iconName: 'CheckCircle2',
    number: '03',
    title: 'Pay only when happy',
    desc: 'Money stays in secure escrow until you approve the finished job. Backed by our £2M guarantee and 12-month workmanship warranty.',
    note: 'Escrow protected • 0% risk',
  },
];

export const WHY_CHOOSE_FEATURES = [
  {
    iconName: 'ShieldCheck',
    title: '6-point professional vetting',
    desc: 'DBS checks, trade qualifications, insurance, references, identity and background verified before any pro goes live.',
  },
  {
    iconName: 'PoundSterling',
    title: 'Fixed upfront pricing',
    desc: 'Clear quotes with zero hidden call-out fees. The price you approve is the price you pay.',
  },
  {
    iconName: 'Lock',
    title: 'Escrow-protected payments',
    desc: 'Your money stays safe in escrow and is released only after you confirm the job is done right.',
  },
  {
    iconName: 'Clock',
    title: '24/7 emergency dispatch',
    desc: 'Burst pipe at midnight? Vetted pros reach 96% of UK postcodes in under 45 minutes.',
  },
];

export const APP_FEATURES = [
  { iconName: 'MapPin', title: 'Live pro tracking', desc: 'Watch your tradesperson arrive in real time with live ETA updates.' },
  { iconName: 'MessageSquare', title: 'In-app chat & photos', desc: 'Share photos and agree scope with your pro before the job starts.' },
  { iconName: 'ShieldCheck', title: 'Secure payments', desc: 'Escrow-held payments released only once you approve the work.' },
  { iconName: 'BellRing', title: 'Smart alerts', desc: 'Instant notifications for quotes, dispatch and job completion.' },
];

export const TESTIMONIAL_AGGREGATES = [
  { label: 'Trustpilot', value: '4.9 / 5', fill: '98%', note: 'Excellent rating • 14,200+ reviews' },
  { label: 'Google Reviews', value: '4.8 / 5', fill: '96%', note: '2,300+ verified reviews' },
  { label: 'Five-star jobs', value: '98%', fill: '98%', note: 'Rated 5 stars in the last 12 months' },
];

export const STATS_DATA = [
  {
    value: 25000,
    label: 'Jobs completed nationwide',
    format: (v: number) => `${Math.round(v).toLocaleString('en-GB')}+`,
  },
  {
    value: 12500,
    label: 'Vetted & verified pros',
    format: (v: number) => `${Math.round(v).toLocaleString('en-GB')}+`,
  },
  {
    value: 4.9,
    label: 'Average client rating',
    format: (v: number) => `${v.toFixed(1)} / 5`,
  },
  {
    value: 38,
    label: 'Avg. emergency response',
    format: (v: number) => `${Math.round(v)} min`,
  },
];

export const REVIEW_AVATARS = [
  '/images/avatar-placeholder.svg',
  '/images/avatar-placeholder-2.svg',
  '/images/avatar-placeholder-3.svg',
];

export const BEFORE_AFTER_CHECKLIST = [
  '100% escrow-protected payment',
  '12-month workmanship warranty',
  'Certified photos on completion',
];

export const CONTACT_INFO_CARDS = [
  { iconName: 'Phone', title: 'Call Us', subtitle: 'Mon-Sun, 24/7 Dispatch', detail: '0800 123 4567', href: 'tel:08001234567', isLink: true },
  { iconName: 'Mail', title: 'Email Us', subtitle: 'We reply within 2 hours', detail: 'support@localhero.com', href: 'mailto:support@localhero.com', isLink: true },
  { iconName: 'MapPin', title: 'Headquarters', subtitle: 'London HQ Office', detail: '100 Bishopsgate, London, EC2N 4AG', isLink: false },
  { iconName: 'Clock', title: 'Support Hours', subtitle: 'Emergency Response', detail: '24/7 Active', isLink: false, isGreen: true },
];

export const CONTACT_FAQS = [
  { q: 'How quickly can a pro arrive?', a: 'Emergency bookings arrive within ~45 minutes across major UK cities.' },
  { q: 'Are tradespeople insured?', a: 'Yes, every hero carries up to £2,000,000 public liability insurance.' },
];

export const SERVICES_PAGE_FAQS = [
  { q: 'How much do services cost?', a: "Prices vary by trade and job size, but every quote is fixed upfront. You'll see the full cost before any work begins — no surprises." },
  { q: 'How quickly can a pro arrive?', a: 'Standard bookings are within 24–48 hours. For emergencies, we offer 45-minute dispatch across the UK, 24/7.' },
  { q: 'Are your professionals vetted?', a: 'Yes. Every pro is DBS-checked, fully insured (up to £2M), trade-qualified where applicable, and reviewed by real customers.' },
  { q: 'Do I need to pay upfront?', a: "No. You only pay after the work is completed and you're fully satisfied. No upfront fees, ever." },
  { q: "What if I'm not satisfied?", a: "We offer a 100% satisfaction guarantee. If something isn't right, we'll send the pro back to fix it free of charge." },
];

export const SERVICE_DETAILS_FAQS = (tradeName: string, estimatedPrice: string) => [
  { q: `How much does ${tradeName.toLowerCase()} services cost?`, a: `Prices start at ${estimatedPrice}. The final cost depends on the scope of work, materials needed and your location. We provide a fixed quote before any work begins — no hidden fees.` },
  { q: `How quickly can a ${tradeName.toLowerCase()} arrive?`, a: `Standard bookings are usually within 24–48 hours. For emergencies, we offer 45-minute dispatch across the UK, 24/7 including weekends and bank holidays.` },
  { q: 'Are your professionals vetted?', a: 'Yes. Every pro on LocalHero is DBS-checked, fully insured (up to £2M public liability), and reviewed by real customers. We also verify trade qualifications where applicable.' },
  { q: "What if I'm not satisfied with the work?", a: "We offer a 100% satisfaction guarantee. If something isn't right, we'll send the pro back to fix it at no extra cost. If that's not possible, you're covered by our £2M guarantee." },
  { q: 'Do I need to pay upfront?', a: "No. You only pay after the work is completed and you're fully satisfied. There are no upfront fees or hidden charges." },
];

export const WHY_LOCALHERO_FEATURES = [
  { iconName: 'ShieldCheck', text: 'DBS-checked & fully insured professionals' },
  { iconName: 'Clock', text: '45-minute emergency dispatch, 24/7' },
  { iconName: 'Star', text: 'Fixed upfront pricing — no hidden fees' },
  { iconName: 'Users', text: '25,000+ jobs completed nationwide' },
  { iconName: 'ThumbsUp', text: '100% satisfaction guarantee' },
];

export const WHY_LOCALHERO_STATS = [
  { iconName: 'CheckCircle2', value: '25,000+', label: 'Jobs Completed' },
  { iconName: 'Star', value: '4.9/5', label: 'Average Rating' },
  { iconName: 'Clock', value: '45 min', label: 'Emergency Response' },
  { iconName: 'ShieldCheck', value: '£2M', label: 'Insurance Cover' },
];

export const SERVICE_DETAILS_STATS = [
  { value: '25,000+', label: 'Jobs Completed' },
  { value: '4.9/5', label: 'Average Rating' },
  { value: '45 min', label: 'Emergency Response' },
  { value: '£2M', label: 'Insurance Cover' },
];

export const SERVICE_DETAILS_STEPS = [
  { iconName: 'ClipboardList', step: '1', title: 'Post Your Job', desc: 'Tell us what you need and pick a time that suits you.' },
  { iconName: 'Search', step: '2', title: 'Get Matched', desc: 'We connect you with up to 3 vetted local pros instantly.' },
  { iconName: 'ThumbsUp', step: '3', title: 'Choose Your Pro', desc: 'Compare quotes, check reviews and pick your favourite.' },
  { iconName: 'CheckCircle2', step: '4', title: 'Job Done', desc: "Work gets completed. Pay securely only when you're satisfied." },
];

export const WHY_CHOOSE_BENEFITS = [
  'DBS-checked & background verified professionals',
  'Public liability insurance up to £2M included',
  'Same-day emergency & scheduled appointments',
  'No upfront payment — pay only after completion',
  'Transparent fixed pricing with free instant quotes',
];
