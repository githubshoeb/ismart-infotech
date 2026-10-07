import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import h5 from "@/assets/hero-5.jpg.asset.json";
import h6 from "@/assets/hero-6.jpg.asset.json";
import h7 from "@/assets/hero-7.jpg.asset.json";
import h8 from "@/assets/hero-8.jpg.asset.json";
import h9 from "@/assets/hero-9.jpg.asset.json";

const SLIDES = [h5.url, h6.url, h7.url, h8.url, h9.url];
const INTERVAL = 6000;

/** Full-bleed rotating photo layer — sits at the bottom of the hero background stack. */
export function HeroSlideshow() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((n) => (n + 1) % SLIDES.length), INTERVAL);
    return () => clearInterval(t);
  }, [reduce]);

  const src = SLIDES[i]!;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.img
          key={src}
          src={src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: reduce ? 1 : 1.06 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.4, ease: "easeInOut" },
            scale: { duration: (INTERVAL + 1400) / 1000, ease: "linear" },
          }}
        />
      </AnimatePresence>
      {/* Readability overlay so hero text keeps its contrast in both themes */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/55" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
    </div>
  );
}
