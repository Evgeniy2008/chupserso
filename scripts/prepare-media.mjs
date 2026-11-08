#!/usr/bin/env node
/**
 * Builds web-ready images from the originals in media/originals/:
 *   public/images/portrait.jpg, public/images/avatar.jpg
 *   public/projects/<slug>/{cover,detail-*}.jpg
 *
 *   npm run media
 *
 * Crops are explicit (in source pixels) so the result is deterministic.
 */
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = (f) => join(root, 'media/originals', f);
const out = (f) => {
  const p = join(root, 'public', f);
  mkdirSync(dirname(p), { recursive: true });
  return p;
};
const JPG = { quality: 84, mozjpeg: true, chromaSubsampling: '4:4:4' };

async function crop(file, { left, top, width, height }, target, resizeWidth) {
  let img = sharp(src(file)).extract({ left, top, width, height });
  if (resizeWidth) img = img.resize({ width: resizeWidth, kernel: 'lanczos3' });
  await img.flatten({ background: '#0a0a0b' }).jpeg(JPG).toFile(out(target));
  console.log('✓', target);
}

/** Phone mock-up: the screenshot in a rounded device frame on a dark, softly lit canvas. */
async function phoneComposition(file, target, { width, height, phoneHeight, crop: c, glow = '#ff2a2a', x }) {
  const meta = await sharp(src(file)).metadata();
  const region = c ?? { left: 0, top: 0, width: meta.width, height: meta.height };
  const screenH = phoneHeight - 28;
  const screenW = Math.round((region.width / region.height) * screenH);
  const phoneW = screenW + 28;
  const px = x ?? Math.round((width - phoneW) / 2);
  const py = Math.round((height - phoneHeight) / 2);
  const radius = 44;

  const screen = await sharp(src(file))
    .extract(region)
    .resize({ width: screenW, height: screenH, fit: 'cover', position: 'top', kernel: 'lanczos3' })
    .composite([{ input: Buffer.from(`<svg width="${screenW}" height="${screenH}"><rect width="${screenW}" height="${screenH}" rx="${radius - 14}" fill="#fff"/></svg>`), blend: 'dest-in' }])
    .png()
    .toBuffer();

  const backdrop = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <radialGradient id="g" cx="${(px + phoneW / 2) / width}" cy="0.55" r="0.6"><stop offset="0" stop-color="${glow}" stop-opacity="0.32"/><stop offset="0.5" stop-color="${glow}" stop-opacity="0.06"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
      <radialGradient id="w" cx="0.82" cy="0.1" r="0.7"><stop offset="0" stop-color="#dfe4ec" stop-opacity="0.14"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
      <filter id="s" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="36"/></filter>
    </defs>
    <rect width="100%" height="100%" fill="#0a0a0b"/>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <rect width="100%" height="100%" fill="url(#w)"/>
    ${Array.from({ length: Math.ceil(width / 100) + 1 }, (_, i) => `<line x1="${i * 100}" y1="0" x2="${i * 100}" y2="${height}" stroke="#fff" stroke-opacity="0.035"/>`).join('')}
    ${Array.from({ length: Math.ceil(height / 100) + 1 }, (_, i) => `<line x1="0" y1="${i * 100}" x2="${width}" y2="${i * 100}" stroke="#fff" stroke-opacity="0.035"/>`).join('')}
    <rect x="${px + 6}" y="${py + 30}" width="${phoneW - 12}" height="${phoneHeight}" rx="${radius}" fill="#000" opacity="0.75" filter="url(#s)"/>
    <rect x="${px}" y="${py}" width="${phoneW}" height="${phoneHeight}" rx="${radius}" fill="#111214" stroke="#ffffff" stroke-opacity="0.22" stroke-width="2"/>
  </svg>`;

  await sharp(Buffer.from(backdrop))
    .composite([{ input: screen, left: px + 14, top: py + 14 }])
    .jpeg(JPG)
    .toFile(out(target));
  console.log('✓', target);
}


/** Browser-window mock-up: the screenshot in a framed window that bleeds off the bottom-right. */
async function browserComposition(file, target, { width = 2400, height = 1500, crop: c, glow, x, y, windowWidth }) {
  const meta = await sharp(src(file)).metadata();
  const region = c ?? { left: 0, top: 0, width: meta.width, height: meta.height };
  const bar = 64;
  const radius = 28;
  const shotW = windowWidth;
  const shotH = Math.round((region.height / region.width) * shotW);
  const winH = shotH + bar;

  const shot = await sharp(src(file)).extract(region).resize({ width: shotW, kernel: 'lanczos3' }).png().toBuffer();
  const dots = [0, 1, 2].map((i) => `<circle cx="${x + 40 + i * 30}" cy="${y + bar / 2}" r="8" fill="#ffffff" fill-opacity="0.22"/>`).join('');
  const frame = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <radialGradient id="g" cx="${(x + Math.min(shotW, width - x) / 2) / width}" cy="${(y + 200) / height}" r="0.75"><stop offset="0" stop-color="${glow}" stop-opacity="0.34"/><stop offset="0.55" stop-color="${glow}" stop-opacity="0.07"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
      <radialGradient id="w" cx="0.15" cy="0.05" r="0.6"><stop offset="0" stop-color="#dfe4ec" stop-opacity="0.08"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
      <filter id="s" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="40"/></filter>
    </defs>
    <rect width="100%" height="100%" fill="#0a0a0b"/>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <rect width="100%" height="100%" fill="url(#w)"/>
    ${Array.from({ length: Math.ceil(width / 100) + 1 }, (_, i) => `<line x1="${i * 100}" y1="0" x2="${i * 100}" y2="${height}" stroke="#fff" stroke-opacity="0.035"/>`).join('')}
    ${Array.from({ length: Math.ceil(height / 100) + 1 }, (_, i) => `<line x1="0" y1="${i * 100}" x2="${width}" y2="${i * 100}" stroke="#fff" stroke-opacity="0.035"/>`).join('')}
    <rect x="${x + 20}" y="${y + 40}" width="${shotW}" height="${winH}" rx="${radius}" fill="#000" opacity="0.8" filter="url(#s)"/>
    <rect x="${x}" y="${y}" width="${shotW}" height="${winH}" rx="${radius}" fill="#141416" stroke="#ffffff" stroke-opacity="0.2" stroke-width="2"/>
    ${dots}
    <rect x="${x + 150}" y="${y + 18}" width="${Math.min(520, shotW - 300)}" height="28" rx="14" fill="#ffffff" fill-opacity="0.06"/>
  </svg>`;
  // Round the screenshot's top corners off under the bar line (bar covers them), clip at canvas edge.
  const visibleW = Math.min(shotW, width - x - 1);
  const visibleH = Math.min(shotH, height - y - bar - 1);
  const clipped = await sharp(shot).extract({ left: 0, top: 0, width: visibleW, height: visibleH }).toBuffer();
  await sharp(Buffer.from(frame))
    .composite([{ input: clipped, left: x, top: y + bar }])
    .jpeg(JPG)
    .toFile(out(target));
  console.log('✓', target);
}

// ── Portrait ────────────────────────────────────────────────────────────────
// 640×640 source → 4:5 crop around the face, gently upscaled. Colour is kept;
// the site renders it monochrome and reveals colour on hover.
await sharp(src('portrait.jpg'))
  .extract({ left: 108, top: 0, width: 512, height: 640 })
  .resize({ width: 1024, kernel: 'lanczos3' })
  .sharpen({ sigma: 0.6 })
  .jpeg({ ...JPG, quality: 88 })
  .toFile(out('images/portrait.jpg'));
console.log('✓ images/portrait.jpg');

await sharp(src('portrait.jpg'))
  .extract({ left: 120, top: 20, width: 400, height: 400 })
  .resize({ width: 192, kernel: 'lanczos3' })
  .grayscale()
  .linear(1.12, -10)
  .jpeg({ ...JPG, quality: 86 })
  .toFile(out('images/avatar.jpg'));
console.log('✓ images/avatar.jpg');

// ── PBC Game (2560×2142 desktop screenshot) ────────────────────────────────
await browserComposition('pbc-game.png', 'projects/pbc-game/cover.jpg', { crop: { left: 0, top: 0, width: 2560, height: 1500 }, glow: '#e0303a', x: 820, y: 470, windowWidth: 1900 });
await crop('pbc-game.png', { left: 1150, top: 80, width: 1410, height: 1058 }, 'projects/pbc-game/detail-a.jpg', 1600);
await crop('pbc-game.png', { left: 290, top: 600, width: 1440, height: 1080 }, 'projects/pbc-game/detail-b.jpg', 1600);

// ── ContentBuilder AI (2401×1704 landing screenshot; cookie banner cropped out) ─
await browserComposition('contentbuilder.png', 'projects/contentbuilder-ai/cover.jpg', { crop: { left: 0, top: 0, width: 2401, height: 1180 }, glow: '#6b5cff', x: 820, y: 470, windowWidth: 1900 });
await crop('contentbuilder.png', { left: 400, top: 150, width: 1600, height: 1200 }, 'projects/contentbuilder-ai/detail-a.jpg', 1600);

// ── PRO Casino (861×1585 mobile screenshot) ────────────────────────────────
await phoneComposition('pro-casino.png', 'projects/pro-casino/cover.jpg', { width: 2400, height: 1500, phoneHeight: 1320, x: 1320 });
await phoneComposition('pro-casino.png', 'projects/pro-casino/detail-a.jpg', {
  width: 1600,
  height: 1200,
  phoneHeight: 1060,
  crop: { left: 0, top: 640, width: 861, height: 945 },
});
