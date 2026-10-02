import { site } from '../data/site';
import { faq } from '../data/faq';

export const SITE_URL = (import.meta.env.SITE as string | undefined)?.replace(/\/$/, '') ?? 'https://verum.nuit.works';
export const abs = (path: string) => (path.startsWith('http') ? path : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`);

type JsonLd = Record<string, unknown>;

export function storeLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    '@id': `${SITE_URL}/#store`,
    name: site.name,
    slogan: site.tagline,
    description: site.description,
    disambiguatingDescription:
      'VERUM is a fictional skincare shop created by the web design studio Nuit Works as a concept site. It is not a real business and does not take orders.',
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/icon-512.png`,
    image: `${SITE_URL}/og/home.png`,
    email: site.contact.email,
    telephone: site.contact.whatsappDisplay.replace(/\s/g, ''),
    currenciesAccepted: site.currency,
    paymentAccepted: 'Card, BML bank transfer',
    priceRange: 'MVR 150–900',
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${site.address.building}, ${site.address.street}`,
      addressLocality: site.address.city,
      addressRegion: 'Kaafu Atoll',
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
    areaServed: ['Malé', 'Hulhumalé', 'Villimalé', 'Maldives'].map((name) => ({ '@type': 'Place', name })),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: site.pickup.dayCodes.map((d) => `https://schema.org/${d}`),
        opens: site.pickup.opens,
        closes: site.pickup.closes,
      },
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: site.contact.email,
        telephone: site.contact.whatsappDisplay.replace(/\s/g, ''),
        availableLanguage: ['English', 'Dhivehi'],
        areaServed: 'MV',
      },
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        name: 'Brand and trade enquiries',
        email: site.contact.tradeEmail,
      },
    ],
    sameAs: [site.contact.instagram],
    parentOrganization: { '@type': 'Organization', name: site.concept.studio, url: site.concept.url },
  };
}

export function breadcrumbLd(items: { name: string; url: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: abs(it.url),
    })),
  };
}

export function itemListLd(name: string, urls: { url: string; name: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: urls.length,
    itemListElement: urls.map((u, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(u.url), name: u.name })),
  };
}

export function faqLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function productLd(p: {
  name: string;
  brand: string;
  code: string;
  url: string;
  image: string[];
  description: string;
  price: number;
  stock: number;
  category: string;
  size: string;
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    sku: p.code,
    mpn: p.code,
    brand: { '@type': 'Brand', name: p.brand },
    category: p.category,
    image: p.image.map(abs),
    description: p.description,
    url: abs(p.url),
    size: p.size,
    offers: {
      '@type': 'Offer',
      url: abs(p.url),
      sku: p.code,
      price: p.price.toFixed(2),
      priceCurrency: site.currency,
      availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': `${SITE_URL}/#store` },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: site.currency },
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: site.address.country },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'DAY' },
          transitTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: site.address.country,
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnInStore',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
  };
}
