import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

import aeFlag from "circle-flags/flags/ae.svg?url";
import deFlag from "circle-flags/flags/de.svg?url";
import inFlag from "circle-flags/flags/in.svg?url";
import qaFlag from "circle-flags/flags/qa.svg?url";
import saFlag from "circle-flags/flags/sa.svg?url";
import usFlag from "circle-flags/flags/us.svg?url";

import { CircuitBackdrop } from "@/components/CircuitBackdrop";
import { LightfallBackground } from "@/components/LightfallBackground";
import { ScrambleText } from "@/components/ScrambleText";
import { SITE } from "@/lib/site";
import { HeroSlideshow } from "@/components/home/HeroSlideshow";

const COUNTRIES: { code: string; name: string }[] = [
  { code: "ae", name: "United Arab Emirates" },
  { code: "sa", name: "Saudi Arabia" },
  { code: "qa", name: "Qatar" },
  { code: "in", name: "India" },
  { code: "us", name: "United States" },
  { code: "de", name: "Germany" },
];

const FLAG_URLS: Record<string, string> = {
  ae: aeFlag,
  sa: saFlag,
  qa: qaFlag,
  in: inFlag,
  us: usFlag,
  de: deFlag,
};

const flagUrl = (code: string) => FLAG_URLS[code];

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-background pt-28 pb-20">
      <LightfallBackground />
      <CircuitBackdrop />

      <div className="shell relative grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <div>
        <motion.div {...fade(0)} className="mb-5">
          <ScrambleText
            text="iSmart Infotech Solutions"
            className="font-display text-2xl text-foreground sm:text-3xl"
          />
        </motion.div>

        <motion.p {...fade(0.04)} className="text-eyebrow text-primary">
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
            {COUNTRIES.map(({ code, name }) => (
              <img
                key={code}
                src={flagUrl(code)}
                alt={name}
                title={name}
                loading="lazy"
                className="h-9 w-9 rounded-full border-2 border-border bg-background object-cover"
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Operate across {SITE.countries} nations
          </p>
        </motion.div>
      </div>

        <motion.div {...fade(0.3)}>
          <HeroSlideshow />
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
