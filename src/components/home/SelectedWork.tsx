import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { Reveal } from "@/components/Reveal";

/* PLACEHOLDER CONTENT — replace with real case studies before launch. */
const CASES = [
  {
    name: "[PROJECT NAME]",
    industry: "[INDUSTRY]",
    result: "[ONE-LINE RESULT]",
    stats: [
      ["[METRIC]", "Cost saved"],
      ["[METRIC]", "Faster release"],
      ["[METRIC]", "Uptime"],
    ],
  },
  {
    name: "[PROJECT NAME]",
    industry: "[INDUSTRY]",
    result: "[ONE-LINE RESULT]",
    stats: [
      ["[METRIC]", "Leads / month"],
      ["[METRIC]", "Cost per lead"],
      ["[METRIC]", "Conversion lift"],
    ],
  },
  {
    name: "[PROJECT NAME]",
    industry: "[INDUSTRY]",
    result: "[ONE-LINE RESULT]",
    stats: [
      ["[METRIC]", "Docs processed"],
      ["[METRIC]", "Accuracy"],
      ["[METRIC]", "Hours saved"],
    ],
  },
];

function FlipCard({ item }: { item: (typeof CASES)[number] }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setFlipped((v) => !v)}
      className="group relative h-64 w-full text-left [perspective:1400px]"
      aria-label={`${item.name} — tap to see results`}
    >
      <div
        className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d]"
        style={{ transform: flipped ? "rotateY(180deg)" : "none" }}
      >
        <div className="card-soft absolute inset-0 flex flex-col justify-between p-7 [backface-visibility:hidden]">
          <span className="text-eyebrow text-muted-foreground">{item.industry}</span>
          <div>
            <h3 className="text-2xl">{item.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.result}</p>
          </div>
          <span className="text-xs text-primary">Tap for results →</span>
        </div>

        <div className="card-soft absolute inset-0 flex flex-col justify-center gap-5 bg-surface p-7 [transform:rotateY(180deg)] [backface-visibility:hidden]">
          {item.stats.map(([value, label]) => (
            <div key={label} className="flex items-baseline justify-between border-b border-border pb-2">
              <span className="em-italic text-xl text-primary">{value}</span>
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </button>
  );
}

export function SelectedWork() {
  const [index, setIndex] = useState(0);
  const move = (d: number) => setIndex((v) => (v + d + CASES.length) % CASES.length);

  return (
    <section id="selected-work" className="section-pad scroll-mt-24">
      <div className="shell">
        <Reveal>
          <p className="text-eyebrow text-primary">Selected work</p>
        </Reveal>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <Reveal delay={0.06}>
            <h2 className="text-section">
              Recent things we're <span className="em-italic">proud of.</span>
            </h2>
          </Reveal>
          <div className="hidden gap-2 md:flex">
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Previous project"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:border-primary hover:text-primary"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Next project"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:border-primary hover:text-primary"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile: swipeable row. Desktop: grid with arrow nav highlighting the active card. */}
        <div className="mt-12 -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:hidden">
          {CASES.map((c, i) => (
            <div key={i} className="w-[80%] shrink-0 snap-center">
              <FlipCard item={c} />
            </div>
          ))}
        </div>

        <div className="mt-12 hidden gap-6 md:grid md:grid-cols-3">
          {CASES.map((c, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className={i === index ? "" : "opacity-70 transition-opacity hover:opacity-100"}>
                <FlipCard item={c} />
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-6 flex justify-center gap-2 md:justify-start">
          {CASES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show project ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-primary" : "w-1.5 bg-border"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
