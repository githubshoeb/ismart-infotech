import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import wordmark from "@/assets/ismart-logo-wordmark.png";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — iSmart Infotech Solutions" },
      {
        name: "description",
        content:
          "Who we are: an experienced IT team helping startups, SMEs and enterprises modernize through cloud, software, AI automation and digital growth.",
      },
      { property: "og:title", content: "About iSmart Infotech Solutions" },
      {
        property: "og:description",
        content:
          "Mission, values and how we work — senior delivery, transparent pricing, long-term support.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const VALUES = [
  ["Experienced Team", "Real enterprise-delivery backgrounds, not learning on the client's dime"],
  [
    "Quality First",
    "We'd rather do fewer things well than take on more than we can deliver properly",
  ],
  ["Client Satisfaction", "Relationships built on straightforward communication and follow-through"],
  [
    "Forward-Looking",
    "Current tools and AI-first thinking, without chasing every trend for its own sake",
  ],
];

const STEPS = [
  ["Discover", "Understand goals, constraints, and what success looks like"],
  ["Plan", "Clear scope, timeline, and pricing before work begins"],
  ["Build", "Short, visible sprints, no black-box waiting"],
  ["Review & Refine", "Regular check-ins to adjust course early"],
  ["Launch & Support", "We stay involved after go-live"],
];

const WHY = [
  ["One-Stop IT Partner", "Cloud, software, AI, marketing, and staffing under one roof"],
  ["Modern Technology Expertise", "Built on AWS/Azure/GCP, modern stacks, AI-first thinking"],
  ["Transparent Pricing", "Clear scopes, fixed budgets, predictable invoices"],
  ["Quick Turnaround", "Lean, senior teams, no quality trade-offs"],
  ["Long-Term Support", "Partnerships that extend beyond launch day"],
  ["Global-Ready Delivery", "Structured to serve clients across time zones and regions"],
];

const INDUSTRIES = [
  "Retail",
  "Manufacturing",
  "Education",
  "Logistics",
  "Startups",
  "Healthcare & Life Sciences",
  "BFSI",
  "Real Estate & PropTech",
  "Hospitality & Travel",
];

function About() {
  return (
    <div>
      <section className="section-pad pt-36">
        <div className="shell max-w-3xl">
          <Reveal>
            <p className="text-eyebrow text-primary">Who we are</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="text-display mt-6">
              A team built for <span className="em-italic text-primary">the long run.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-8 text-base text-muted-foreground">
              iSmart Infotech Solutions helps startups, SMEs and enterprises across India and
              international markets modernize operations through cloud technology, custom software,
              AI automation and digital growth strategies. We deliver reliable, scalable and
              cost-effective solutions built on real enterprise-delivery experience.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <img
              src={wordmark}
              alt={SITE.name}
              loading="lazy"
              width={320}
              height={140}
              className="mt-12 h-20 w-auto object-contain object-left dark:brightness-0 dark:invert"
            />
          </Reveal>
        </div>
      </section>

      <section className="hairline bg-surface/50 py-20">
        <div className="shell grid gap-10 md:grid-cols-2">
          <Reveal>
            <div>
              <p className="text-eyebrow text-muted-foreground">Mission</p>
              <p className="em-italic mt-4 text-2xl">
                Empower businesses with smart, scalable technology that delivers measurable
                outcomes.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <p className="text-eyebrow text-muted-foreground">Vision</p>
              <p className="em-italic mt-4 text-2xl">
                Be the most trusted technology partner for ambitious organizations worldwide.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-pad">
        <div className="shell">
          <Reveal>
            <h2 className="text-section max-w-xl">
              What we <span className="em-italic">stand for</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {VALUES.map(([t, b], i) => (
              <Reveal key={t} delay={(i % 2) * 0.08}>
                <div className="card-soft h-full p-7">
                  <h3 className="font-sans text-base font-medium">{t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-surface/50 pt-0">
        <div className="shell pt-20">
          <Reveal>
            <h2 className="text-section">
              How we <span className="em-italic">work</span>
            </h2>
          </Reveal>
          <ol className="mt-12">
            {STEPS.map(([t, b], i) => (
              <Reveal key={t} delay={Math.min(i, 4) * 0.06}>
                <li className="hairline grid gap-2 py-7 sm:grid-cols-[4rem_1fr]">
                  <span className="em-italic text-lg text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block text-xl">{t}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{b}</span>
                  </span>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-pad">
        <div className="shell">
          <Reveal>
            <h2 className="text-section">
              Why <span className="em-italic">choose us</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY.map(([t, b], i) => (
              <Reveal key={t} delay={(i % 3) * 0.07}>
                <div className="card-soft h-full p-7 hover:-translate-y-1">
                  <h3 className="font-sans text-base font-medium">{t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-surface/50 pt-0">
        <div className="shell pt-20">
          <Reveal>
            <h2 className="text-section">
              Industries <span className="em-italic">we serve</span>
            </h2>
          </Reveal>
          <div className="mt-10 flex flex-wrap gap-3">
            {INDUSTRIES.map((n, i) => (
              <Reveal key={n} delay={Math.min(i, 8) * 0.04} y={10}>
                <span className="inline-block rounded-full border border-border bg-card px-5 py-2.5 text-sm">
                  {n}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad text-center">
        <div className="shell">
          <Reveal>
            <h2 className="text-section">
              Ready to <span className="em-italic">talk?</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Get in touch <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
