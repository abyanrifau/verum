import type { DeliveryZone } from './types';

/** Everything a shop owner would edit lives here. */
export const site = {
  name: 'VERUM',
  tagline: 'Formula first.',
  headline: 'Shop skincare that earns its place.',
  description:
    'VERUM is a skincare shop in Malé, Maldives, reselling Korean and Western brands. Every product is bought directly and formula-checked before we stock it.',
  concept: {
    studio: 'Nuit Works',
    url: 'https://nuit.works',
    line: 'A Nuit Works concept. VERUM is a fictional business.',
    demoNote: 'This is a Nuit Works concept. No order is placed and no payment is taken.',
  },
  contact: {
    email: 'hello@verum.mv',
    tradeEmail: 'trade@verum.mv',
    whatsappDisplay: '+960 700 0000',
    whatsappNumber: '9607000000',
    instagram: 'https://www.instagram.com/verum.mv',
    instagramHandle: '@verum.mv',
  },
  address: {
    building: 'Placeholder House, ground floor',
    street: 'Majeedhee Magu',
    district: 'Henveiru',
    city: 'Malé',
    postalCode: '20026',
    country: 'MV',
    countryName: 'Maldives',
  },
  geo: { lat: 4.1755, lng: 73.5093 },
  currency: 'MVR',
  locale: 'en-MV',
  timezone: 'Indian/Maldives',
  /** Prices include GST. */
  gstRate: 0.08,
  /** Bundle discount. Each different product in the cart counts as one routine step. */
  discountTiers: [
    { minSteps: 3, percent: 10 },
    { minSteps: 5, percent: 15 },
  ],
  /** Same-day cut-off in Malé, 24h clock, Malé time. */
  sameDayCutoffHour: 16,
  pickup: {
    label: 'VERUM shop, Malé',
    days: 'Sunday to Thursday',
    hours: '10am to 6pm',
    opens: '10:00',
    closes: '18:00',
    dayCodes: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    readyIn: 'Ready in about 2 hours during opening hours',
  },
  lowStockAt: 5,
  bml: {
    bank: 'Bank of Maldives (demo details)',
    accountName: 'VERUM Concept (demo)',
    accountNumber: '7730-000000-000 (demo)',
    currency: 'MVR',
  },
} as const;

export const deliveryZones: DeliveryZone[] = [
  {
    id: 'male',
    label: 'Delivery in Malé',
    short: 'Malé',
    fee: 0,
    feeLabel: 'Free',
    timing: 'Usually same day for orders before 4pm',
    needs: 'address',
    areas: ['Henveiru', 'Galolhu', 'Maafannu', 'Machchangolhi'],
  },
  {
    id: 'hulhumale',
    label: 'Delivery in Hulhumalé or Villimalé',
    short: 'Hulhumalé or Villimalé',
    fee: 0,
    feeLabel: 'Free',
    timing: 'Next day',
    needs: 'address',
    areas: ['Hulhumalé Phase 1', 'Hulhumalé Phase 2', 'Villimalé'],
  },
  {
    id: 'islands',
    label: 'Another island or resort',
    short: 'Other islands and resorts',
    fee: null,
    feeLabel: 'On request',
    timing: 'We will message you a quote on WhatsApp',
    needs: 'island',
  },
  {
    id: 'pickup',
    label: 'Pickup in Malé',
    short: 'Pickup in Malé',
    fee: 0,
    feeLabel: 'Free',
    timing: 'Sunday to Thursday, until 6pm',
    needs: 'none',
  },
];

export const nav = [
  { href: '/shop', label: 'Shop' },
  { href: '/quiz', label: 'Find your routine' },
  { href: '/routine', label: 'Routine builder' },
  { href: '/ingredients', label: 'Ingredients' },
  { href: '/philosophy', label: 'Philosophy' },
] as const;

export const trustPoints = [
  { id: 'authentic', title: '100% authentic', text: 'Bought directly, never grey market' },
  { id: 'delivery', title: 'Free same-day delivery', text: 'In Malé, for orders before 4pm' },
  { id: 'pickup', title: 'Pickup in Malé', text: 'Sunday to Thursday, until 6pm' },
  { id: 'checked', title: 'Formula-checked', text: 'Read before we agree to stock it' },
] as const;

export const whatsappLink = (text?: string) =>
  `https://wa.me/${site.contact.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
