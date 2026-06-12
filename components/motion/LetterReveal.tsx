"use client";

import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.025, delayChildren: 0.04 },
  },
};

const letter: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] },
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
