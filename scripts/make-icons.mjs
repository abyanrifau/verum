// Builds the favicon set from one SVG mark: a V in a hairline square, sage detail.
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const pub = path.resolve(import.meta.dirname, '../public');
await fs.mkdir(pub, { recursive: true });

const mark = (bg = '#FAFAF8', pad = 0) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-pad} ${-pad} ${32 + pad * 2} ${32 + pad * 2}" width="512" height="512">
  <rect x="${-pad}" y="${-pad}" width="${32 + pad * 2}" height="${32 + pad * 2}" fill="${bg}"/>
  <rect x="1.5" y="1.5" width="29" height="29" fill="none" stroke="#141414" stroke-width="2"/>
  <path d="M8.5 8.5 16 24l7.5-15.5" fill="none" stroke="#141414" stroke-width="2.2" stroke-linejoin="miter"/>
  <rect x="23" y="23" width="5.5" height="5.5" fill="#8A9A86"/>
</svg>`;

// SVG favicon (no forced background, so it sits on any tab colour)
await fs.writeFile(
  path.join(pub, 'favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#FAFAF8"/><rect x="1.5" y="1.5" width="29" height="29" fill="none" stroke="#141414" stroke-width="2"/><path d="M8.5 8.5 16 24l7.5-15.5" fill="none" stroke="#141414" stroke-width="2.2"/><rect x="23" y="23" width="5.5" height="5.5" fill="#8A9A86"/></svg>\n`,
);

const png = (svg, size) => sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
await fs.writeFile(path.join(pub, 'apple-touch-icon.png'), await png(mark('#FAFAF8', 4), 180));
await fs.writeFile(path.join(pub, 'icon-192.png'), await png(mark('#FAFAF8', 2), 192));
await fs.writeFile(path.join(pub, 'icon-512.png'), await png(mark('#FAFAF8', 2), 512));
await fs.writeFile(path.join(pub, 'icon-maskable-512.png'), await png(mark('#FAFAF8', 9), 512));

// favicon.ico with 16, 32 and 48 px PNG entries
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((s) => png(mark('#FAFAF8', 0), s)));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const entries = sizes.map((s, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(s === 256 ? 0 : s, 0);
  e.writeUInt8(s === 256 ? 0 : s, 1);
  e.writeUInt8(0, 2);
  e.writeUInt8(0, 3);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(images[i].length, 8);
  e.writeUInt32LE(offset, 12);
  offset += images[i].length;
  return e;
});
await fs.writeFile(path.join(pub, 'favicon.ico'), Buffer.concat([header, ...entries, ...images]));

await fs.writeFile(
  path.join(pub, 'site.webmanifest'),
  JSON.stringify(
    {
      name: 'VERUM — Formula first.',
      short_name: 'VERUM',
      description: 'A Nuit Works concept. VERUM is a fictional skincare shop in Malé.',
      start_url: '/',
      display: 'standalone',
      background_color: '#FAFAF8',
      theme_color: '#FAFAF8',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    null,
    2,
  ) + '\n',
);
console.log('icons written');
