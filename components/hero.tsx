"use client";

import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/lib/site";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const fadeUp = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section className="relative overflow-hidden bg-maroon py-14 text-center sm:py-20">
      {/* soft candle-light glow behind the headline */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(198,161,75,0.28),transparent)]"
      />
      <div className="relative mx-auto max-w-3xl px-4">
        <motion.p
          {...fadeUp(0)}
          className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold"
        >
          916 Hallmarked Gold Jewellery
        </motion.p>
        <motion.h1
          {...fadeUp(0.12)}
          className="gold-shimmer mt-4 font-display text-5xl font-semibold leading-tight sm:text-6xl"
        >
          {site.tagline}
        </motion.h1>
        <motion.p
          {...fadeUp(0.24)}
          className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ivory/70 sm:text-base"
        >
          Browse the {site.name} catalogue — handcrafted rings and fine
          jewellery, each piece tagged with its exact weight and size. Found
          something you love? Enquire in one tap.
        </motion.p>
      </div>
    </section>
  );
}
