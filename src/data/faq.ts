import type { FaqItem } from './types';

/** Each answer opens with a direct, quotable sentence. */
export const faq: FaqItem[] = [
  {
    id: 'authentic',
    q: 'Are your products authentic?',
    a: 'Yes. Every product is bought directly from the brand or its authorised distributor, never from grey-market resellers. We keep the supplier record for every batch, and if you ever doubt a product, message us and we will show you where it came from.',
    short: true,
  },
  {
    id: 'delivery-male',
    q: 'How fast is delivery in Malé?',
    a: 'Delivery in Malé is free and usually arrives the same day for orders placed before 4pm. Orders after 4pm arrive the next day. Delivery to Hulhumalé and Villimalé is also free and arrives the next day.',
    short: true,
  },
  {
    id: 'resorts',
    q: 'Can you deliver to resorts and other islands?',
    a: 'Yes, on request. Choose “Another island or resort” at checkout and we will message you a delivery quote on WhatsApp before anything is sent. Timing depends on the island and the boat or cargo schedule.',
  },
  {
    id: 'bml',
    q: 'How does a BML transfer work here?',
    a: 'Choose BML transfer at checkout, send the total to the account shown and use your order number as the reference. You can attach the transfer slip at checkout or send it on WhatsApp. We confirm the order as soon as the transfer is checked, usually within the hour during opening times.',
    short: true,
  },
  {
    id: 'returns',
    q: 'Can I return an opened product?',
    a: 'Opened products cannot be returned unless they arrived damaged, faulty or not as described, because we cannot resell them. Unopened products can be returned within 7 days. If something does not suit you, message us: we would rather help you swap a step than leave it unused.',
  },
  {
    id: 'patch-test',
    q: 'Should I patch test new products?',
    a: 'Yes, patch test anything new, especially acids, retinoids and products with fragrance. Apply a small amount behind the ear or on the side of the neck once a day for 3 to 5 days. If you see redness, itching or bumps, stop using it.',
  },
  {
    id: 'sunscreen',
    q: 'How do I choose a sunscreen for the Maldives climate?',
    a: 'Choose SPF 50 with high UVA protection (PA++++ or a UVA logo) in a texture light enough that you will reapply it. In heat and humidity, gels, fluids and watery creams wear best. Use about two finger lengths for face and neck, and reapply every 2 hours outdoors and after swimming.',
    short: true,
  },
  {
    id: 'bundle',
    q: 'How does the bundle discount work?',
    a: 'Each different product in your cart counts as one routine step. With 3 steps you get 10% off your whole order, and with 5 or more you get 15% off. The discount applies automatically in the cart, the routine builder and your quiz results, so there is no code to remember.',
    short: true,
  },
  {
    id: 'sponsored',
    q: 'Do brands pay to be listed or ranked?',
    a: 'No. There are no sponsored placements, paid rankings or affiliate deals. Quiz results are ranked by a scoring function you can read on every result, and bestsellers are ranked by what actually sells.',
  },
  {
    id: 'not-published',
    q: 'What does “Not published” mean in a formula breakdown?',
    a: 'It means the brand does not publish that ingredient’s concentration. Where a brand publishes nothing, the row says so. We do not estimate, and we never back-calculate percentages from the ingredient list.',
  },
];
