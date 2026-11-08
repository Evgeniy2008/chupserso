'use client';

import { useEffect, useRef } from 'react';

/**
 * "Liquid silver" — a single full-screen fragment shader (raw WebGL, no 3D
 * library). Domain-warped noise is mapped through a narrow sine ramp, which
 * reads as light sliding over folded metal or silk. The pointer bends the field
 * and pulls a soft key light.
 *
 * Budget: rendered at a fraction of CSS resolution (it's soft by nature), paused
 * off-screen and in background tabs, 30 fps on touch devices, and a single
 * still frame for reduced motion or low-power hardware.
 */

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uFade;

float hash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
  vec2 m = vec2((uMouse.x - 0.5) * aspect, uMouse.y - 0.5);
  float t = uTime * 0.03;

  // The pointer gently bends the field around it.
  vec2 d = p - m;
  float pull = exp(-dot(d, d) * 3.5);
  p -= d * 0.12 * pull;

  // Key light from the upper right; the field is biased towards it so the
  // composition stays lit there whatever the noise does over time.
  vec2 k = p - vec2(0.42 * aspect, 0.32);
  float key = exp(-dot(k, k) * 1.1);

  vec2 sp = p * 1.15 + vec2(0.0, 0.25);
  vec2 q = vec2(fbm(sp + vec2(0.0, t)), fbm(sp + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(sp + 2.4 * q + vec2(1.7, 9.2) + t * 0.6),
                fbm(sp + 2.4 * q + vec2(8.3, 2.8) - t * 0.4));
  float h = fbm(sp * 0.9 + 2.2 * r) + key * 0.16 - 0.04;

  // Narrow sine ramp over the height field = metallic highlights.
  float bands = 0.5 + 0.5 * sin(h * 15.0 + r.y * 5.0 - uTime * 0.12);
  float sheen = pow(bands, 9.0);
  float glint = pow(bands, 48.0); // crisp chrome edge on top of the soft sheen
  float body = smoothstep(0.3, 0.9, h);
  float lum = body * 0.08 + sheen * body * 1.1 + glint * body * 0.7;

  // Key light plus a soft light that follows the pointer.
  lum *= 0.24 + key * 1.15 + pull * 0.7;

  // Fall off to black towards the left (where the headline sits) and the edges.
  float side = smoothstep(-0.55 * aspect, 0.35 * aspect, p.x);
  // (smoothstep needs edge0 < edge1 — reversed edges are undefined behaviour on some GPUs)
  float vig = 1.0 - smoothstep(0.15, 1.35, length(vec2(p.x / aspect, p.y * 1.35)));
  lum *= mix(0.3, 1.0, side) * vig;

  lum = lum / (1.0 + lum * 0.9); // soft shoulder: highlights never blow out behind the headline
  vec3 col = vec3(lum) * vec3(0.9, 0.94, 1.0);
  col += vec3(0.0196); // matches the #050505 page background
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * (2.5 / 255.0); // dither, no banding
  gl_FragColor = vec4(col * uFade + vec3(0.0196) * (1.0 - uFade), 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (process.env.NODE_ENV !== 'production') console.warn(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function HeroCanvas({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    // A fresh canvas per mount: a context that was lost on unmount can't be reused
    // (StrictMode remounts, HMR, client navigation back to this page).
    const canvas = document.createElement('canvas');
    canvas.className = 'absolute inset-0 size-full';
    canvas.setAttribute('aria-hidden', 'true');
    host.appendChild(canvas);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    const lowPower = (nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) <= 2 || nav.connection?.saveData === true;
    const still = reduced || lowPower;

    const fail = () => {
      canvas.remove();
      return undefined;
    };
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'low-power', preserveDrawingBuffer: false });
    if (!gl) return fail();

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return fail();
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return fail();
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, 'uRes');
    const uTime = gl.getUniformLocation(program, 'uTime');
    const uMouse = gl.getUniformLocation(program, 'uMouse');
    const uFade = gl.getUniformLocation(program, 'uFade');

    const scale = coarse ? 0.42 : 0.55;
    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * scale));
      const h = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, w, h);
    };

    // Pointer, eased towards its target every frame.
    const mouse = { x: 0.72, y: 0.62, tx: 0.72, ty: 0.62 };
    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = (event.clientX - rect.left) / rect.width;
      mouse.ty = 1 - (event.clientY - rect.top) / rect.height;
    };

    const seed = 52 + Math.random() * 16; // a range of known-good compositions
    const start = performance.now();
    const introDelay = document.querySelector('.intro') && document.documentElement.dataset.intro !== 'off' ? 700 : 0;
    let raf = 0;
    let last = 0;
    let visible = true;
    let running = false;
    const frameInterval = coarse ? 1000 / 30 : 1000 / 60;

    const draw = (now: number) => {
      const elapsed = now - start;
      const fade = still ? 1 : Math.min(1, Math.max(0, (elapsed - introDelay) / 1800));
      mouse.x += (mouse.tx - mouse.x) * 0.045;
      mouse.y += (mouse.ty - mouse.y) * 0.045;
      gl.uniform1f(uTime, seed + (still ? 0 : elapsed / 1000));
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uFade, fade * fade * (3 - 2 * fade));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < frameInterval - 1) return;
      last = now;
      draw(now);
    };

    const play = () => {
      if (running || still || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    draw(performance.now());
    host.dataset.ready = 'true';

    const ro = new ResizeObserver(() => {
      resize();
      if (!running) draw(performance.now());
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) play();
      else pause();
    });
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? pause() : play());
    document.addEventListener('visibilitychange', onVisibility);
    if (!coarse) window.addEventListener('pointermove', onPointer, { passive: true });

    const onLost = (event: Event) => {
      event.preventDefault();
      pause();
    };
    canvas.addEventListener('webglcontextlost', onLost);

    play();

    return () => {
      pause();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointer);
      canvas.removeEventListener('webglcontextlost', onLost);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
      delete host.dataset.ready;
    };
  }, []);

  return <div ref={hostRef} aria-hidden className={className} />;
}
