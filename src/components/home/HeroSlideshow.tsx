import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import h5 from "@/assets/hero-5.jpg.asset.json";
import h6 from "@/assets/hero-6.jpg.asset.json";
import h7 from "@/assets/hero-7.jpg.asset.json";
import h8 from "@/assets/hero-8.jpg.asset.json";
import h9 from "@/assets/hero-9.jpg.asset.json";

const SLIDES = [
  { src: h5.url, alt: "Strategist reviewing live business analytics over a city skyline" },
  { src: h6.url, alt: "Team reviewing charts and reports at a meeting table" },
  { src: h7.url, alt: "Robotic hand with a glowing atom, representing applied AI" },
  { src: h8.url, alt: "Consultant presenting a project to a client team" },
  { src: h9.url, alt: "Developer working across multiple code editors" },
];

const INTERVAL = 5000;

export function HeroSlideshow() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((n) => (n + 1) % SLIDES.length), INTERVAL);
    return () => clearInterval(t);
  }, [reduce]);

  const slide = SLIDES[i]!;
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-primary/10">
      <AnimatePresence initial={false}>
        <motion.img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: reduce ? 1 : 1.06 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.2, ease: "easeInOut" },
            scale: { duration: (INTERVAL + 1200) / 1000, ease: "linear" },
          }}
        />
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-foreground/5" />
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
        {SLIDES.map((s, n) => (
          <button
            key={s.src}
            type="button"
            aria-label={`Show image ${n + 1}`}
            onClick={() => setI(n)}
            className={`h-1.5 rounded-full bg-primary-foreground transition-all ${n === i ? "w-5 opacity-100" : "w-1.5 opacity-50"}`}
          />
        ))}
      </div>
    </div>
  );
}
