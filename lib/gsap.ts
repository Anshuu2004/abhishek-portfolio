"use client";

/**
 * Central GSAP registration. Every client component imports gsap from here
 * so plugins are registered exactly once and the import surface stays
 * consistent. ScrollTrigger powers all scroll choreography; SplitText
 * (free since GSAP 3.13) powers character/line reveals.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

/** Confident ease-out — the only easing family this site uses. */
export const EASE_OUT = "power3.out";

export { gsap, ScrollTrigger, SplitText, useGSAP };
