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
    <span className={className}>
      {/* Real text for the accessibility tree; the letters are decorative. */}
      <span className="sr-only">{children}</span>
      <motion.span
        initial="hidden"
        animate="visible"
        variants={container}
        aria-hidden
      >
      {children.split("").map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          variants={letter}
          className="inline-block"
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
      </motion.span>
    </span>
  );
}
