"use client";

import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.025, delayChildren: 0.04 },
  },
};

const letter: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.2, 0.8, 0.2, 1] },
  },
};

export function LetterReveal({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="visible"
      variants={container}
      aria-label={children}
    >
      {children.split("").map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          variants={letter}
          className="inline-block"
          aria-hidden
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
