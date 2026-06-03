"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type MouseEvent, type ReactNode } from "react";

const MAX_OFFSET = 6;
const STRENGTH = 0.25;

export function MagneticButton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.2 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.2 });

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = (e.clientX - (rect.left + rect.width / 2)) * STRENGTH;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * STRENGTH;
    x.set(Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, dx)));
    y.set(Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, dy)));
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
