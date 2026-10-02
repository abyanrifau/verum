import { site } from '../data/site';

/** "MVR 385", "MVR 1,140". Whole MVR only; prices are set in whole rufiyaa. */
export const mvr = (n: number) => `MVR ${Math.round(n).toLocaleString('en-US')}`;

/** GST portion of a GST-inclusive amount, to 2 decimals. */
export const gstIncluded = (total: number, rate: number = site.gstRate) =>
  Math.round((total - total / (1 + rate)) * 100) / 100;

export const mvr2 = (n: number) =>
  `MVR ${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const pricePerUnit = (price: number, sizeValue: number, unit: string) => {
  if (unit === 'patches') return `${mvr(price / sizeValue)} per patch`;
  const per = (price / sizeValue) * 10;
  return `MVR ${per.toFixed(per < 100 ? 1 : 0)} per 10 ${unit}`;
};
