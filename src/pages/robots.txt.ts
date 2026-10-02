import type { APIRoute } from 'astro';
import { SITE_URL } from '../lib/seo';

export const GET: APIRoute = () =>
  new Response(
    [
      'User-agent: *',
      'Allow: /',
      'Disallow: /checkout/confirmed',
      'Disallow: /my-routine',
      '',
      `Sitemap: ${SITE_URL}/sitemap-index.xml`,
      '',
      '# VERUM is a fictional concept shop by Nuit Works (https://nuit.works). See /llms.txt.',
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
