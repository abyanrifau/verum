// Grades the editorial stock photos to one cool, neutral look and writes src/data/photos.ts.
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const meta = JSON.parse(await fs.readFile(path.join(root, '_source/research/editorial.json'), 'utf8'));
const outDir = path.join(root, 'src/assets/editorial');
await fs.mkdir(outDir, { recursive: true });

for (const m of meta) {
  const src = path.join(root, m.file);
  const out = path.join(outDir, `${m.key}.jpg`);
  await sharp(src)
    .rotate()
    .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
    .modulate({ saturation: 0.78, brightness: 1.02 })
    // cool, neutral: pull red/yellow down a touch, lift blue
    .recomb([
      [0.95, 0.04, 0.01],
      [0.01, 0.98, 0.01],
      [0.0, 0.03, 1.0],
    ])
    .linear(1.04, -4)
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(out);
  console.log('graded', m.key);
}
