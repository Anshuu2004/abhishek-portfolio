"use client";

import { useEffect, useRef } from "react";

import { getLenis } from "@/lib/lenis-store";

/**
 * Signature hero backdrop: a hand-written WebGL fragment shader rendering a
 * slow ember heat-field — fbm noise drifting upward in the accent hue over
 * the site's blue-charcoal base, warping gently toward the cursor.
 *
 * Motion-grammar status: documented ambient exception (see
 * docs/anti-patterns.md). The drift is sub-perceptual (full noise cycle
 * ≈ 60s) and the field responds to cursor position, so it reads as a live
 * material, not an animation loop.
 *
 * Performance contract:
 * - device-pixel-ratio capped at 1.5 (1 on coarse pointers)
 * - render loop pauses when the canvas leaves the viewport or tab hides
 * - bails out entirely (renders nothing) for prefers-reduced-motion or
 *   missing WebGL — the existing CSS HeroAmbient remains underneath as
 *   the static fallback.
 */

const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;

uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uScroll; // 0 at rest, ramps with scroll velocity (ignition)

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(13.7, 7.1);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = uv * vec2(uRes.x / uRes.y, 1.0) * 2.2;

  // Slow upward drift — the "heat" rises. Scroll velocity stokes it: the
  // field rushes upward and the embers brighten the faster you move.
  float t = uTime * (0.045 + uScroll * 0.10);
  vec2 drift = vec2(t * 0.35, -t);

  // Cursor warp: field bends toward the pointer with a soft falloff.
  vec2 m = uMouse * vec2(uRes.x / uRes.y, 1.0) * 2.2;
  float md = length(p - m);
  vec2 pull = (m - p) * 0.22 * exp(-md * 1.4);

  float n = fbm(p + drift + pull + fbm(p * 0.8 + drift * 0.6) * 0.9);

  // Concentrate energy toward the top of the hero, fade to nothing below.
  float topGlow = smoothstep(1.0, 0.18, uv.y);
  float horizon = smoothstep(0.0, 0.55, uv.y);
  float energy = pow(n, 2.6) * topGlow * horizon;

  // Cursor adds a faint warm swell of its own.
  energy += exp(-md * 2.6) * 0.05;

  // Ignition: scrolling lifts the whole field's energy so the embers flare.
  energy *= 1.0 + uScroll * 0.85;

  // Grade: deep blue-charcoal shadows -> ember core (accent hue 18deg).
  vec3 shadow = vec3(0.016, 0.024, 0.045);
  vec3 ember  = vec3(0.95, 0.42, 0.13);
  vec3 core   = vec3(1.0, 0.78, 0.45);

  vec3 col = mix(shadow, ember, smoothstep(0.05, 0.65, energy));
  col = mix(col, core, smoothstep(0.55, 1.0, energy));

  // Edge vignette so the field never touches the container borders.
  float vig = smoothstep(0.0, 0.25, uv.x) * smoothstep(1.0, 0.75, uv.x);

  gl_FragColor = vec4(col * vig, energy * vig);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function EmberField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const gl =
      canvas.getContext("webgl", { alpha: true, antialias: false }) ??
      canvas.getContext("experimental-webgl", { alpha: true });
    if (!(gl instanceof WebGLRenderingContext)) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    // Fullscreen triangle.
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uScroll = gl.getUniformLocation(prog, "uScroll");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const dprCap = coarse ? 1 : 1.5;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      const { clientWidth, clientHeight } = canvas;
      canvas.width = Math.max(1, Math.round(clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Pointer position, lerped per-frame so the warp feels like inertia.
    let targetX = 0.5;
    let targetY = 0.85;
    let mouseX = targetX;
    let mouseY = targetY;
    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetX = (e.clientX - rect.left) / Math.max(1, rect.width);
      targetY = 1 - (e.clientY - rect.top) / Math.max(1, rect.height);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let raf = 0;
    let running = true;
    let start = performance.now();
    let pausedAt = 0;
    let ignition = 0; // smoothed scroll-velocity drive for the shader

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      mouseX += (targetX - mouseX) * 0.06;
      mouseY += (targetY - mouseY) * 0.06;

      // Read Lenis scroll velocity (falls back to 0 if smooth scroll is off,
      // e.g. touch / reduced-motion) and ease toward it so flares decay.
      const lenis = getLenis();
      const v = lenis ? Math.min(Math.abs(lenis.velocity) / 28, 1) : 0;
      ignition += (v - ignition) * (v > ignition ? 0.25 : 0.05);

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uMouse, mouseX, mouseY);
      gl.uniform1f(uScroll, ignition);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const play = () => {
      if (running) return;
      running = true;
      start += performance.now() - pausedAt; // keep time continuous
      raf = requestAnimationFrame(frame);
    };
    const pause = () => {
      if (!running) return;
      running = false;
      pausedAt = performance.now();
      cancelAnimationFrame(raf);
    };

    raf = requestAnimationFrame(frame);

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) play();
      else pause();
    });
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) pause();
      else play();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full opacity-60 ${className}`}
    />
  );
}
