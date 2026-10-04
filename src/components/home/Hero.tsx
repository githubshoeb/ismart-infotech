import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

import { CircuitBackdrop } from "@/components/CircuitBackdrop";
import { SITE } from "@/lib/site";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden pt-28 pb-20">
      <CircuitBackdrop />

      <div className="shell relative">
        <motion.p {...fade(0)} className="text-eyebrow text-primary">
          Smart Technology Partner
        </motion.p>

        <motion.h1 {...fade(0.08)} className="text-display mt-6 max-w-4xl">
          Your Trusted Partner
          <br />
          for <span className="em-italic text-primary">Digital Growth</span>
        </motion.h1>

        <motion.p {...fade(0.16)} className="em-italic mt-6 text-xl text-muted-foreground">
          {SITE.tagline}
        </motion.p>

        <motion.div {...fade(0.22)} className="mt-7">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="pulse-dot absolute inline-flex h-2 w-2 rounded-full bg-highlight" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Available for new projects
          </span>
        </motion.div>

        <motion.p {...fade(0.3)} className="mt-8 max-w-xl text-base text-muted-foreground">
          End-to-end IT solutions delivered by an experienced team — helping businesses across India
          and international markets modernize, scale, and grow with confidence.
        </motion.p>

        <motion.div {...fade(0.38)} className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Get Free Consultation <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#partners"
            className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
          >
            See our work
          </a>
        </motion.div>

        <motion.div {...fade(0.46)} className="mt-12 flex items-center gap-4">
          <div className="flex -space-x-3">
            {[0, 1, 2, 3, 4].map((i) => (
              /* PLACEHOLDER avatars — swap for real client or team images */
              <span
                key={i}
                className="h-9 w-9 rounded-full border-2 border-background bg-gradient-to-br from-primary/70 to-highlight/60"
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Trusted by teams across {SITE.countries} countries
          </p>
        </motion.div>
      </div>

      <motion.div
        {...fade(0.7)}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 sm:block"
      >
        <ArrowDown className="h-5 w-5 animate-bounce text-muted-foreground" />
      </motion.div>
    </section>
  );
}
