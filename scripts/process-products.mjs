// Normalises official product images into one consistent tile:
// the studio background (flat or gradient) is flat-fielded to white, the product is trimmed,
// fitted with equal padding, then multiplied onto the --bone tile colour so mixed brand
// photography reads as one shop.
// Usage: node scripts/process-products.mjs [slug-or-file-base ...]
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const SRC = path.join(root, '_source/products');
const OUT = path.join(root, 'src/assets/products');
const SIZE = 1200;
const BOX = 980; // the product fits inside this box: ~9% padding on every side
const WORK = 1600; // working resolution
const BONE = { r: 0xf1, g: 0xf1, b: 0xec };

// Manual crops (fractions of the source) where an official packshot carries extras such as award badges.
const CROPS = JSON.parse(await fs.readFile(path.join(root, 'scripts/crops.json'), 'utf8').catch(() => '{}'));
// Images to leave out (lifestyle shots, info cards).
const EXCLUDE = new Set(CROPS._exclude ?? []);

await fs.mkdir(OUT, { recursive: true });
const only = process.argv.slice(2);
const files = (await fs.readdir(SRC)).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f)).sort();

/** Robust edge profile: for each position along an edge, the 80th percentile of a small window. */
function profile(get, len, depth, win) {
  const raw = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    let best = 0;
    for (let d = 0; d < depth; d++) best = Math.max(best, get(i, d));
    raw[i] = best;
  }
  const out = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const vals = [];
    for (let j = Math.max(0, i - win); j <= Math.min(len - 1, i + win); j++) vals.push(raw[j]);
    vals.sort((a, b) => a - b);
    out[i] = vals[Math.floor(vals.length * 0.8)];
  }
  return out;
}

/** Coons-patch background model from the four edges, per channel, then divide it out. */
function flatField(data, w, h) {
  const depth = Math.max(2, Math.round(Math.min(w, h) * 0.012));
  const win = Math.max(3, Math.round(Math.max(w, h) * 0.03));
  const out = Buffer.alloc(data.length);
  const edgeVals = [];
  for (let c = 0; c < 3; c++) {
    const at = (x, y) => data[(y * w + x) * 3 + c];
    const top = profile((x, d) => at(x, d), w, depth, win);
    const bottom = profile((x, d) => at(x, h - 1 - d), w, depth, win);
    const left = profile((y, d) => at(d, y), h, depth, win);
    const right = profile((y, d) => at(w - 1 - d, y), h, depth, win);
    for (const arr of [top, bottom, left, right]) for (const v of arr) edgeVals.push(v);
    const c00 = top[0], c10 = top[w - 1], c01 = bottom[0], c11 = bottom[w - 1];
    for (let y = 0; y < h; y++) {
      const v = h > 1 ? y / (h - 1) : 0;
      for (let x = 0; x < w; x++) {
        const u = w > 1 ? x / (w - 1) : 0;
        const B =
          (1 - v) * top[x] + v * bottom[x] + (1 - u) * left[y] + u * right[y] -
          ((1 - u) * (1 - v) * c00 + u * (1 - v) * c10 + (1 - u) * v * c01 + u * v * c11);
        const i = (y * w + x) * 3 + c;
        out[i] = Math.min(255, Math.round((data[i] * 255) / Math.max(150, B)));
      }
    }
  }
  edgeVals.sort((a, b) => a - b);
  // 10th percentile of the edge: robust to a reflection or a product touching one edge.
  return { out, minEdge: edgeVals[Math.floor(edgeVals.length * 0.1)] };
}

for (const f of files) {
  const base = f.replace(/\.[a-z]+$/i, '');
  const slug = base.replace(/-\d+$/, '');
  if (only.length && !only.includes(slug) && !only.includes(base)) continue;
  if (EXCLUDE.has(base)) {
    await fs.rm(path.join(OUT, `${base}.webp`), { force: true });
    console.log('excluded', base);
    continue;
  }
  try {
    let img = sharp(path.join(SRC, f), { limitInputPixels: false }).rotate();
    const meta = await img.metadata();
    const crop = CROPS[base];
    if (crop) {
      img = sharp(
        await img
          .extract({
            left: Math.round(crop.left * meta.width),
            top: Math.round(crop.top * meta.height),
            width: Math.round(crop.width * meta.width),
            height: Math.round(crop.height * meta.height),
          })
          .toBuffer(),
      );
    }
    // 1. Flatten transparency onto white, work at a sane resolution.
    const flat = await img
      .flatten({ background: '#ffffff' })
      .resize({ width: WORK, height: WORK, fit: 'inside', withoutEnlargement: true })
      .removeAlpha()
      .toColourspace('srgb')
      .raw()
      .toBuffer({ resolveWithObject: true });
    const { width: w, height: h } = flat.info;
    // 2. Flat-field the background to white (handles gradients and off-white studios).
    const { out, minEdge } = flatField(flat.data, w, h);
    if (minEdge < 185) {
      console.warn('SKIP (coloured background, not a clean packshot)', base, Math.round(minEdge));
      await fs.rm(path.join(OUT, `${base}.webp`), { force: true });
      continue;
    }
    const lifted = await sharp(out, { raw: { width: w, height: h, channels: 3 } }).png().toBuffer();
    // 3. Trim the now-white border.
    const trimmed = await sharp(lifted).trim({ background: '#ffffff', threshold: 22 }).png().toBuffer({ resolveWithObject: true });
    // 4. Fit inside the box, centred on a white square.
    const fitted = await sharp(trimmed.data)
      .resize({ width: BOX, height: BOX, fit: 'inside', kernel: 'lanczos3' })
      .png()
      .toBuffer({ resolveWithObject: true });
    const square = await sharp({ create: { width: SIZE, height: SIZE, channels: 3, background: '#ffffff' } })
      .composite([{ input: fitted.data, left: Math.round((SIZE - fitted.info.width) / 2), top: Math.round((SIZE - fitted.info.height) / 2) }])
      .png()
      .toBuffer();
    // 5. Multiply onto bone: white becomes the tile colour, the product keeps its colour.
    await sharp({ create: { width: SIZE, height: SIZE, channels: 3, background: BONE } })
      .composite([{ input: square, blend: 'multiply' }])
      .webp({ quality: 90, effort: 5 })
      .toFile(path.join(OUT, `${base}.webp`));
    console.log('ok', base, `${meta.width}x${meta.height}`, 'edge', Math.round(minEdge), '->', `${fitted.info.width}x${fitted.info.height}`);
  } catch (e) {
    console.error('FAIL', f, e.message);
  }
}
