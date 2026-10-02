import { site } from '../data/site';
import type { DeliveryZone } from '../data/types';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** Current weekday and hour in Malé, regardless of the visitor's timezone. */
export function maleClock(now: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: site.timezone,
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return { day: get('weekday'), hour: Number(get('hour')) % 24, minute: Number(get('minute')) };
}

const pickupDays = site.pickup.dayCodes as readonly string[];

/** Honest, specific timing for the chosen method, based on the real cut-off. */
export function deliveryTiming(method: DeliveryZone['id'], now = new Date()): string {
  const { day, hour } = maleClock(now);
  const idx = DAYS.indexOf(day);
  if (method === 'male') {
    return hour < site.sameDayCutoffHour
      ? 'Arrives today. Malé orders placed before 4pm usually arrive the same day.'
      : 'Arrives tomorrow. The same-day cut-off is 4pm.';
  }
  if (method === 'hulhumale') return `Arrives tomorrow, ${DAYS[(idx + 1) % 7]}.`;
  if (method === 'islands') return 'We will message you a quote on WhatsApp before anything is sent.';
  const open = pickupDays.includes(day);
  const oh = Number(site.pickup.opens.split(':')[0]);
  const ch = Number(site.pickup.closes.split(':')[0]);
  if (open && hour >= oh && hour < ch - 2) return 'Ready for pickup in about 2 hours, today until 6pm.';
  if (open && hour < oh) return 'Ready for pickup today from noon, until 6pm.';
  for (let i = 1; i <= 7; i++) {
    const d = DAYS[(idx + i) % 7];
    if (pickupDays.includes(d)) return `Ready for pickup ${i === 1 ? 'tomorrow' : `on ${d}`}, from 10am.`;
  }
  return 'Ready for pickup on the next opening day.';
}
