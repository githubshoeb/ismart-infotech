import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

import h5 from "@/assets/hero-5.jpg";
import h6 from "@/assets/hero-6.jpg";
import h7 from "@/assets/hero-7.jpg";
import h8 from "@/assets/hero-8.jpg";
import h9 from "@/assets/hero-9.jpg";

const SLIDES = [h5, h6, h7, h8, h9];
const THEME_MS = 5500;
const PHOTO_MS = 4500;
const FADE = 1.4;

/**
 * Hero background that alternates one visual at a time:
 * theme (chip/circuit) → photo 1 → … → photo N → theme. The theme layer is
 * unmounted while photos show, so its animations stop. Reduced motion stays on the theme.
 */
export function HeroSlideshow({ theme }: { theme: ReactNode }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0); // 0 = theme, 1..N = photos

  useEffect(() => {
    if (reduce) {
      setStep(0);
      return;
    }
    const t = setTimeout(
      () => setStep((n) => (n + 1) % (SLIDES.length + 1)),
      step === 0 ? THEME_MS : PHOTO_MS,
    );
    return () => clearTimeout(t);
  }, [step, reduce]);

  const fade = { duration: FADE, ease: "easeInOut" } as const;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <AnimatePresence initial={false}>
        {step > 0 && (
          <motion.img
            key={SLIDES[step - 1]}
            src={SLIDES[step - 1]}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1.06 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: fade,
              scale: { duration: (PHOTO_MS + FADE * 1000) / 1000, ease: "linear" },
            }}
          />
        )}
      </AnimatePresence>
      {/* Readability overlay — active over both theme and photo steps */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/55" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      {/* Theme layer drawn as before (above the tint); unmounted during photo steps */}
      <AnimatePresence initial={false}>
        {step === 0 && (
          <motion.div
            key="theme"
            className="absolute inset-0 bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fade}
          >
            {theme}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
