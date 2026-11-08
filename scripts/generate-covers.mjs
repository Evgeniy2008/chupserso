#!/usr/bin/env node
/**
 * Generates monochrome placeholder visuals for every project:
 *   public/projects/<slug>/{cover,detail-a,detail-b}.svg
 *
 * They are deterministic (seeded), tiny, and designed to sit inside the site's
 * visual language until real screenshots replace them.
 *
 *   npm run covers
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'projects');
const W = 1600;
const H = 1000;

// ── helpers ────────────────────────────────────────────────────────────────
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const f = (n) => Math.round(n * 10) / 10;
const line = (x1, y1, x2, y2, o = 0.2, w = 1) => `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="#fff" stroke-opacity="${o}" stroke-width="${w}"/>`;
const poly = (pts, attrs) => `<polygon points="${pts.map(([x, y]) => `${f(x)},${f(y)}`).join(' ')}" ${attrs}/>`;
const path = (d, attrs) => `<path d="${d}" ${attrs}/>`;

function frame(body, { lx = 0.78, ly = 0.22, glow = 0.32, grid = true } = {}) {
  const gridLines = [];
  if (grid) {
    for (let x = 0; x <= W; x += 100) gridLines.push(line(x, 0, x, H, 0.035));
    for (let y = 0; y <= H; y += 100) gridLines.push(line(0, y, W, y, 0.035));
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs>
<radialGradient id="light" cx="${lx}" cy="${ly}" r="0.75"><stop offset="0" stop-color="#dfe4ec" stop-opacity="${glow}"/><stop offset="0.45" stop-color="#c9ced6" stop-opacity="${glow * 0.25}"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<linearGradient id="fadeDown" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="fadeRight" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="0.85"/></linearGradient>
<radialGradient id="sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffffff"/><stop offset="0.6" stop-color="#e6e9ee" stop-opacity="0.85"/><stop offset="1" stop-color="#c9ced6" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="#0a0a0b"/>
<rect width="${W}" height="${H}" fill="url(#light)"/>
${gridLines.join('')}
${body}
</svg>`;
}

// ── WorldDrop: isometric room ──────────────────────────────────────────────
function iso(s, cx, cy) {
  const c = Math.cos(Math.PI / 6);
  return (x, y, z) => [cx + (x - y) * c * s, cy + (x + y) * 0.5 * s - z * s];
}
function isoCube(P, x, y, z, a, o = 0.6) {
  const v = [P(x, y, z), P(x + a, y, z), P(x + a, y + a, z), P(x, y + a, z), P(x, y, z + a), P(x + a, y, z + a), P(x + a, y + a, z + a), P(x, y + a, z + a)];
  const top = poly([v[4], v[5], v[6], v[7]], `fill="#fff" fill-opacity="${o * 0.16}" stroke="#fff" stroke-opacity="${o}" stroke-width="1.2"`);
  const left = poly([v[3], v[2], v[6], v[7]], `fill="#fff" fill-opacity="${o * 0.05}" stroke="#fff" stroke-opacity="${o * 0.8}" stroke-width="1"`);
  const right = poly([v[1], v[2], v[6], v[5]], `fill="#fff" fill-opacity="${o * 0.1}" stroke="#fff" stroke-opacity="${o * 0.8}" stroke-width="1"`);
  return left + right + top;
}
function room(variant) {
  const r = rng(11 + variant);
  const s = variant === 1 ? 92 : 58;
  const P = iso(s, variant === 1 ? 640 : 800, variant === 1 ? 260 : 330);
  const n = 8;
  const out = [];
  // floor grid
  for (let i = 0; i <= n; i++) {
    out.push(line(...P(i, 0, 0), ...P(i, n, 0), 0.16));
    out.push(line(...P(0, i, 0), ...P(n, i, 0), 0.16));
  }
  // walls
  for (let i = 0; i <= n; i++) {
    out.push(line(...P(i, 0, 0), ...P(i, 0, 6), 0.07));
    out.push(line(...P(0, i, 0), ...P(0, i, 6), 0.07));
  }
  for (let k = 0; k <= 6; k++) {
    out.push(line(...P(0, 0, k), ...P(n, 0, k), 0.07));
    out.push(line(...P(0, 0, k), ...P(0, n, k), 0.07));
  }
  out.push(line(...P(0, 0, 0), ...P(0, 0, 6), 0.5, 1.4));
  // window + light beam
  const w = [P(0, 2, 2.2), P(0, 4.6, 2.2), P(0, 4.6, 4.6), P(0, 2, 4.6)];
  out.push(poly(w, 'fill="#fff" fill-opacity="0.22" stroke="#fff" stroke-opacity="0.8" stroke-width="1.2"'));
  out.push(poly([w[0], w[1], P(5.5, 6.2, 0), P(4.2, 2.4, 0)], 'fill="url(#fadeDown)" fill-opacity="0.08"'));
  // objects
  out.push(isoCube(P, 4.6, 4.2, 0, 1.6, 0.85));
  out.push(isoCube(P, 6.2, 2, 0, 1.1, 0.6));
  out.push(isoCube(P, 2.6, 6, 0, 0.9, 0.55));
  for (let i = 0; i < (variant === 2 ? 14 : 7); i++) {
    const a = 0.25 + r() * 0.45;
    out.push(isoCube(P, 1 + r() * 6, 1 + r() * 6, 2 + r() * 3.5, a, 0.35 + r() * 0.5));
  }
  // floating sphere
  const [sx, sy] = P(5.2, 5.4, 3.6);
  out.push(`<circle cx="${f(sx)}" cy="${f(sy)}" r="${f(s * 0.7)}" fill="#fff" fill-opacity="0.06" stroke="#fff" stroke-opacity="0.75"/>`);
  out.push(`<ellipse cx="${f(sx)}" cy="${f(sy)}" rx="${f(s * 0.7)}" ry="${f(s * 0.22)}" fill="none" stroke="#fff" stroke-opacity="0.35"/>`);
  out.push(`<ellipse cx="${f(sx)}" cy="${f(sy)}" rx="${f(s * 0.24)}" ry="${f(s * 0.7)}" fill="none" stroke="#fff" stroke-opacity="0.25"/>`);
  return frame(out.join(''), { lx: 0.3, ly: 0.3 });
}

// ── ClickShield: particles through a gate ──────────────────────────────────
function shield(variant) {
  const r = rng(23 + variant);
  const gate = variant === 1 ? 760 : 900;
  const out = [];
  out.push(`<rect x="${gate - 90}" y="0" width="180" height="${H}" fill="url(#fadeRight)" fill-opacity="0.05"/>`);
  out.push(line(gate, 0, gate, H, 0.75, 1.4));
  for (let y = 40; y < H; y += 40) out.push(line(gate - 8, y, gate + 8, y, 0.4));
  const lanes = 14;
  const count = variant === 2 ? 160 : 260;
  for (let i = 0; i < count; i++) {
    const x0 = r() * (gate - 120) + 40;
    const y0 = r() * H;
    const bot = r() < 0.12;
    const lane = 110 + Math.floor(r() * lanes) * ((H - 220) / (lanes - 1));
    const rad = 2 + r() * 3.5;
    if (bot) {
      const ex = gate + 120 + r() * 380;
      out.push(path(`M${f(x0)} ${f(y0)} Q ${f(gate - 30)} ${f(y0)} ${f(ex)} ${f(H + 40)}`, 'fill="none" stroke="#fff" stroke-opacity="0.14" stroke-dasharray="3 6"'));
      out.push(`<circle cx="${f(x0)}" cy="${f(y0)}" r="${f(rad)}" fill="none" stroke="#fff" stroke-opacity="0.6"/>`);
    } else {
      out.push(`<circle cx="${f(x0)}" cy="${f(y0)}" r="${f(rad * 0.8)}" fill="#fff" fill-opacity="${f(0.25 + r() * 0.5)}"/>`);
      if (r() < 0.35) {
        const ex = gate + 60 + r() * (W - gate - 120);
        out.push(path(`M${f(x0)} ${f(y0)} C ${f(gate - 120)} ${f(y0)} ${f(gate - 60)} ${f(lane)} ${f(gate)} ${f(lane)} L ${f(ex)} ${f(lane)}`, 'fill="none" stroke="#fff" stroke-opacity="0.12"'));
        out.push(`<circle cx="${f(ex)}" cy="${f(lane)}" r="${f(rad)}" fill="#fff" fill-opacity="0.9"/>`);
      }
    }
  }
  if (variant === 2) {
    for (let i = 0; i < 28; i++) {
      const h = 60 + Math.abs(Math.sin(i * 0.55) * 260) + r() * 90;
      const x = gate + 70 + i * 22;
      out.push(`<rect x="${x}" y="${f(H - 120 - h)}" width="12" height="${f(h)}" fill="#fff" fill-opacity="${f(0.15 + (i / 28) * 0.6)}"/>`);
    }
  }
  return frame(out.join(''), { lx: gate / W, ly: 0.35, glow: 0.28 });
}

// ── Krevoo: orbits and connections ─────────────────────────────────────────
function network(variant) {
  const r = rng(37 + variant);
  const cx = variant === 1 ? 560 : 820;
  const cy = 520;
  const out = [];
  const nodes = [];
  const rings = variant === 2 ? 4 : 6;
  for (let k = 1; k <= rings; k++) {
    const rx = 90 * k + 40;
    const ry = rx * 0.62;
    out.push(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${f(ry)}" fill="none" stroke="#fff" stroke-opacity="${f(0.06 + 0.025 * (rings - k))}"/>`);
    const count = 3 + k * 2;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + r() * 0.5 + k;
      nodes.push({ x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry, s: 2 + r() * (8 - k) });
    }
  }
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
      if (d < 150 && r() < 0.55) out.push(line(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y, f(0.05 + (1 - d / 150) * 0.25)));
    }
  }
  for (const n of nodes) {
    out.push(`<circle cx="${f(n.x)}" cy="${f(n.y)}" r="${f(n.s)}" fill="#fff" fill-opacity="${f(0.35 + r() * 0.6)}"/>`);
    if (n.s > 6) out.push(`<circle cx="${f(n.x)}" cy="${f(n.y)}" r="${f(n.s * 2.4)}" fill="none" stroke="#fff" stroke-opacity="0.25"/>`);
  }
  out.push(`<circle cx="${cx}" cy="${cy}" r="70" fill="url(#sun)" fill-opacity="0.55"/>`);
  out.push(`<circle cx="${cx}" cy="${cy}" r="16" fill="#fff"/>`);
  return frame(out.join(''), { lx: cx / W, ly: cy / H, glow: 0.22 });
}

// ── ViraText: waveform becomes text ────────────────────────────────────────
function waveform(variant) {
  const r = rng(41 + variant);
  const out = [];
  const mid = 500;
  const split = variant === 1 ? 1100 : 760;
  for (let x = 120; x < split; x += 12) {
    const env = Math.sin(((x - 120) / (split - 120)) * Math.PI) ** 0.6;
    const h = (20 + r() * 260 * env) * (0.4 + 0.6 * Math.abs(Math.sin(x * 0.021)));
    const fade = Math.min(1, (split - x) / 220);
    out.push(`<rect x="${x}" y="${f(mid - h / 2)}" width="5" height="${f(h)}" rx="2.5" fill="#fff" fill-opacity="${f(0.2 + 0.6 * fade)}"/>`);
  }
  if (variant !== 1) {
    const x0 = split + 80;
    out.push(`<rect x="${x0}" y="250" width="${f(560 * 0.75)}" height="34" rx="4" fill="#fff" fill-opacity="0.92"/>`);
    let y = 330;
    for (let p = 0; p < 3; p++) {
      const linesN = 3 + Math.floor(r() * 3);
      for (let i = 0; i < linesN; i++) {
        const w = i === linesN - 1 ? 180 + r() * 220 : 500 + r() * 80;
        out.push(`<rect x="${x0}" y="${y}" width="${f(w)}" height="10" rx="5" fill="#fff" fill-opacity="${f(0.22 + r() * 0.2)}"/>`);
        y += 26;
      }
      y += 30;
    }
    for (let i = 0; i < 9; i++) out.push(line(split - 40 + i * 14, mid - 60 + i * 8, split + 60, 270 + i * 30, 0.08));
  }
  return frame(out.join(''), { lx: 0.55, ly: 0.4, glow: 0.24 });
}

// ── CatalogFlow: messy grid → ordered template ─────────────────────────────
function catalog(variant) {
  const r = rng(53 + variant);
  const out = [];
  const cols = variant === 1 ? 12 : 7;
  const rows = variant === 1 ? 14 : 12;
  const cw = variant === 1 ? 104 : 74;
  const ch = 48;
  const ox = variant === 1 ? 170 : 140;
  const oy = (H - rows * ch) / 2;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = ox + i * cw;
      const y = oy + j * ch;
      const fill = r() < 0.18 ? f(0.12 + r() * 0.3) : 0;
      out.push(`<rect x="${x}" y="${y}" width="${cw}" height="${ch}" fill="#fff" fill-opacity="${fill}" stroke="#fff" stroke-opacity="0.1"/>`);
      if (r() < 0.65) out.push(`<rect x="${x + 10}" y="${y + 20}" width="${f(12 + r() * (cw - 30))}" height="6" rx="3" fill="#fff" fill-opacity="${f(0.15 + r() * 0.25)}"/>`);
    }
  }
  if (variant !== 1) {
    const tx = 1000;
    const tw = 440;
    for (let j = 0; j < rows; j++) {
      const y = oy + j * ch;
      const out_ = j === 0 ? 0.9 : 0.06;
      out.push(`<rect x="${tx}" y="${y}" width="${tw}" height="${ch}" fill="#fff" fill-opacity="${out_}" stroke="#fff" stroke-opacity="0.18"/>`);
      [0, 150, 290].forEach((cx, k) => {
        if (j > 0) out.push(`<rect x="${tx + cx + 14}" y="${y + 21}" width="${[96, 80, 110][k] - r() * 30}" height="6" rx="3" fill="#fff" fill-opacity="0.55"/>`);
      });
      if (j > 0 && j % 2 === 1) {
        const sx = ox + cols * cw;
        out.push(path(`M${sx} ${oy + j * ch + ch / 2} C ${sx + 160} ${oy + j * ch + ch / 2} ${tx - 160} ${y + ch / 2} ${tx} ${y + ch / 2}`, 'fill="none" stroke="#fff" stroke-opacity="0.22"'));
      }
    }
    for (const cx of [150, 290]) out.push(line(tx + cx, oy, tx + cx, oy + rows * ch, 0.18));
  }
  return frame(out.join(''), { lx: 0.75, ly: 0.3, glow: 0.26 });
}

// ── HalfKnives: grass, sun, blade ──────────────────────────────────────────
function blade(variant) {
  const r = rng(67 + variant);
  const out = [];
  const horizon = variant === 2 ? 420 : 640;
  if (variant !== 2) {
    out.push(`<circle cx="1060" cy="${horizon - 20}" r="300" fill="url(#sun)" fill-opacity="0.75"/>`);
    out.push(`<circle cx="1060" cy="${horizon - 20}" r="120" fill="#fff" fill-opacity="0.92"/>`);
    out.push(`<rect x="0" y="${horizon}" width="${W}" height="${H - horizon}" fill="#0a0a0b"/>`);
    out.push(line(0, horizon, W, horizon, 0.5));
    // sword planted in the ground
    const sx = 520;
    out.push(poly([[sx - 7, horizon - 330], [sx + 7, horizon - 330], [sx + 5, horizon + 40], [sx, horizon + 70], [sx - 5, horizon + 40]], 'fill="#fff" fill-opacity="0.9"'));
    out.push(`<rect x="${sx - 62}" y="${horizon - 342}" width="124" height="10" rx="3" fill="#fff"/>`);
    out.push(`<rect x="${sx - 5}" y="${horizon - 420}" width="10" height="78" fill="#fff" fill-opacity="0.75"/>`);
    out.push(`<circle cx="${sx}" cy="${horizon - 428}" r="12" fill="#fff"/>`);
    const blades = variant === 1 ? 900 : 620;
    for (let i = 0; i < blades; i++) {
      const x = r() * W;
      const depth = r();
      const base = horizon + 10 + depth * (H - horizon);
      const h = (30 + r() * 120) * (0.35 + depth);
      const lean = (r() - 0.35) * h * 0.6;
      out.push(path(`M${f(x)} ${f(base)} q ${f(lean * 0.3)} ${f(-h * 0.6)} ${f(lean)} ${f(-h)}`, `fill="none" stroke="#fff" stroke-opacity="${f(0.12 + depth * 0.55)}" stroke-width="${f(0.6 + depth * 1.4)}"`));
    }
  } else {
    // Verlet cloth mesh
    const cols = 26;
    const rows = 16;
    const pts = [];
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const u = i / (cols - 1);
        const v = j / (rows - 1);
        const x = 260 + u * 1080 + Math.sin(v * 3 + u * 2) * 40 * v;
        const y = 180 + v * 640 + Math.sin(u * 6.2 + v * 2) * 34 * v + v * v * 60;
        pts.push([x, y]);
      }
    }
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const p = pts[j * cols + i];
        const o = f(0.1 + (1 - j / rows) * 0.35);
        if (i < cols - 1) out.push(line(...p, ...pts[j * cols + i + 1], o));
        if (j < rows - 1) out.push(line(...p, ...pts[(j + 1) * cols + i], o));
        if (j === 0 && i % 5 === 0) out.push(`<circle cx="${f(p[0])}" cy="${f(p[1])}" r="5" fill="#fff"/>`);
      }
    }
  }
  return frame(out.join(''), { lx: 0.66, ly: horizon / H - 0.05, glow: 0.4, grid: variant === 2 });
}

// ── write ──────────────────────────────────────────────────────────────────
const projects = { worlddrop: room, clickshield: shield, krevoo: network, viratext: waveform, catalogflow: catalog, halfknives: blade };
const names = ['cover', 'detail-a', 'detail-b'];
let bytes = 0;
for (const [slug, draw] of Object.entries(projects)) {
  const dir = join(root, slug);
  mkdirSync(dir, { recursive: true });
  names.forEach((name, variant) => {
    const svg = draw(variant).replace(/\n/g, '');
    writeFileSync(join(dir, `${name}.svg`), svg);
    bytes += svg.length;
  });
}
console.log(`covers: ${Object.keys(projects).length * names.length} files, ${(bytes / 1024).toFixed(0)} KB total`);
