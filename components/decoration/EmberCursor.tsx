"use client";

import { useEffect, useRef } from "react";

/**
 * Ember spark trail. A pooled 2D-canvas particle system that sheds glowing
 * embers from the cursor — they rise, cool from white-hot through the accent
 * hue, and fade. Spawn rate scales with pointer speed, so a flick throws a
 * shower and a still cursor emits almost nothing.
 *
 * Cheap and self-governing:
 * - fixed pool of 90 particles, no per-frame allocation
 * - additive blending for the glow, single canvas, DPR-capped at 2
 * - disabled for touch (hover:none) and prefers-reduced-motion
 * - loop parks itself when the pool is empty and wakes on the next move
 */

const POOL = 90;
const MAX_SPAWN_PER_MOVE = 3;

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 1 -> 0
  size: number;
  alive: boolean;
}

export function EmberCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const sparks: Spark[] = Array.from({ length: POOL }, () => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      size: 0,
      alive: false,
    }));
    let cursor = 0;

    let lastX = 0;
    let lastY = 0;
    let primed = false;
    let raf = 0;
    let running = false;

    const spawn = (x: number, y: number, speed: number) => {
      const count = Math.min(
        MAX_SPAWN_PER_MOVE,
        1 + Math.floor(speed / 14)
      );
      for (let i = 0; i < count; i++) {
        const s = sparks[cursor];
        cursor = (cursor + 1) % POOL;
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
        const mag = 0.4 + Math.random() * 1.4;
        s.x = x + (Math.random() - 0.5) * 6;
        s.y = y + (Math.random() - 0.5) * 6;
        s.vx = Math.cos(angle) * mag + (Math.random() - 0.5) * 0.6;
        s.vy = Math.sin(angle) * mag - 0.3;
        s.life = 1;
        s.size = 0.8 + Math.random() * 1.8;
        s.alive = true;
      }
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";
      let anyAlive = false;

      for (const s of sparks) {
        if (!s.alive) continue;
        anyAlive = true;
        s.life -= 0.022;
        if (s.life <= 0) {
          s.alive = false;
          continue;
        }
        // Buoyant rise + slight drift + gravity easing.
        s.vy += 0.012; // cool embers start to fall
        s.vy -= 0.03; // but heat lifts them
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.97;

        const l = s.life;
        // White-hot -> ember orange -> deep red as it cools.
        const r = 255;
        const g = Math.round(90 + 150 * l);
        const b = Math.round(40 * l * l);
        const radius = s.size * (0.6 + l);
        ctx.globalAlpha = Math.min(1, l * 0.9);
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, radius * 3);
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, radius * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      if (anyAlive) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false; // park until next movement
      }
    };

    const wake = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (!primed) {
        lastX = e.clientX;
        lastY = e.clientY;
        primed = true;
        return;
      }
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const speed = Math.hypot(dx, dy);
      lastX = e.clientX;
      lastY = e.clientY;
      if (speed < 1.5) return; // ignore micro-jitter when essentially still
      spawn(e.clientX, e.clientY, speed);
      wake();
    };

    window.addEventListener("pointermove", onMove, { passive: true });

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        running = false;
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[95] hidden sm:block"
    />
  );
}
