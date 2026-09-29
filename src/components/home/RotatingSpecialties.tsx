import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { ROTATING_SPECIALTIES } from "@/lib/site";

export function RotatingSpecialties() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % ROTATING_SPECIALTIES.length), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="hairline bg-surface/50 py-10">
      <div className="shell flex flex-wrap items-baseline gap-x-3 gap-y-1 text-2xl sm:text-3xl">
        <span className="text-muted-foreground">We work in</span>
        <span className="relative inline-block min-h-[1.4em]">
          <AnimatePresence mode="wait">
            <motion.span
              key={ROTATING_SPECIALTIES[i]}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="em-italic inline-block text-primary"
            >
              {ROTATING_SPECIALTIES[i]}
            </motion.span>
          </AnimatePresence>
        </span>
      </div>
    </section>
  );
}
