import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Hero } from "@/components/home/Hero";
import { RotatingSpecialties } from "@/components/home/RotatingSpecialties";
import { Partners } from "@/components/home/Partners";
import { LanyardBadge } from "@/components/LanyardBadge";
import { Reveal } from "@/components/Reveal";
import { SERVICES, SITE } from "@/lib/site";

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  email: SITE.email,
  url: "https://ismartinfotech.com/",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Shop No. 2, Opp. Yashwant College, Iqbal Nagar",
    addressLocality: "Parbhani",
    postalCode: "431401",
    addressCountry: "IN",
  },
  sameAs: [SITE.linkedin],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "iSmart Infotech Solutions — Your Trusted Partner for Digital Growth" },
      {
        name: "description",
        content:
          "Cloud, custom software, digital marketing, consulting & staffing, data & AI and security — delivered end to end for teams in India and internationally.",
      },
      { property: "og:title", content: "iSmart Infotech Solutions — Code · Create · Connect" },
      {
        property: "og:description",
        content:
          "End-to-end IT solutions helping businesses modernize, scale and grow with confidence.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(ORG_JSONLD) }],
  }),
  component: Index,
});

const TRUST = [
  ["Experienced Professionals", "Enterprise-grade delivery background"],
  ["Fast Delivery", "Agile sprints, weeks not quarters"],
  ["Transparent Pricing", "Clear scopes, no surprises"],
  ["Responsive Support", "Dependable turnaround, every time"],
  ["Scalable Solutions", "Built to grow with you"],
  ["Global Reach", `Delivering across ${SITE.countries} countries`],
];

function Index() {
  return (
    <>
      <Hero />
      <RotatingSpecialties />

      {/* Why teams trust us */}
      <section className="section-pad">
        <div className="shell">
          <Reveal>
            <p className="text-eyebrow text-primary">Why teams trust us</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="text-section mt-4 max-w-2xl">
              Built on <span className="em-italic">reliability</span> and results
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TRUST.map(([title, body], i) => (
              <Reveal key={title} delay={(i % 3) * 0.08}>
                <div className="card-soft h-full p-7 hover:-translate-y-1 hover:border-primary/40">
                  <h3 className="font-sans text-base font-medium">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services overview */}
      <section className="section-pad bg-surface/50">
        <div className="shell">
          <Reveal>
            <p className="text-eyebrow text-primary">What we do</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="text-section mt-4 max-w-3xl">
              Six ways we help you build, <span className="em-italic">scale, and grow.</span>
            </h2>
          </Reveal>

          <ul className="mt-14">
            {SERVICES.map((s, i) => (
              <Reveal key={s.slug} delay={Math.min(i, 4) * 0.05}>
                <li className="hairline group">
                  <Link
                    to={s.path}
                    className="grid items-baseline gap-2 py-8 sm:grid-cols-[4rem_1fr_auto]"
                  >
                    <span className="em-italic text-lg text-primary">{s.number}</span>
                    <span>
                      <span className="block text-xl transition-colors group-hover:text-primary sm:text-2xl">
                        {s.name}
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">{s.short}</span>
                    </span>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-sm text-primary sm:mt-0">
                      View service
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Applied AI teaser */}
      <section className="section-pad">
        <div className="shell grid gap-10 md:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <div>
              <p className="text-eyebrow text-primary">Applied AI</p>
              <h2 className="text-section mt-4">
                From prototype to production, <span className="em-italic">without the theatre.</span>
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="md:pt-14">
              <p className="text-muted-foreground">
                We build generative AI on your own data — retrieval pipelines grounded in real
                documents, agentic workflows scoped to tasks that genuinely benefit from them, and
                evaluation in place before anything reaches your customers. No demos that quietly
                break the week after sign-off.
              </p>
              <Link
                to="/services/data-ai"
                className="link-underline mt-6 inline-flex items-center gap-2 text-sm text-primary"
              >
                Explore Data & AI <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Partners />

      {/* Studio strip */}
      <section className="section-pad bg-surface/50">
        <div className="shell grid gap-8 md:grid-cols-2 md:items-end">
          <Reveal>
            <div>
              <p className="text-eyebrow text-muted-foreground">
                Operating with modern, high-tier technical capabilities
              </p>
              <h2 className="text-section mt-4">
                Senior hands on <span className="em-italic">every project.</span>
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <p className="text-muted-foreground">
                We take on a handful at a time so yours gets our full attention. Delivering across{" "}
                {SITE.countries} countries.
              </p>
              <Link
                to="/about"
                className="link-underline mt-5 inline-flex items-center gap-2 text-sm text-primary"
              >
                Learn more about us <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Currently booking */}
      <section className="section-pad">
        <div className="shell">
          <Reveal>
            <div className="card-soft p-10 md:p-14">
              <p className="text-eyebrow text-primary">Currently booking</p>
              <h2 className="text-section mt-4 max-w-xl">
                We take on a <span className="em-italic">handful</span> at a time.
              </h2>
              <p className="mt-6 max-w-lg text-muted-foreground">
                Limited capacity by design, so every project gets senior attention. Reach out early
                to hold a spot.
              </p>
              <p className="mt-8 text-sm text-muted-foreground">
                {/* PLACEHOLDER — confirm the real kickoff lead time */}
                Typical kickoff: {SITE.kickoffWeeks} weeks from first call
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <LanyardBadge />

      {/* Final CTA */}
      <section className="section-pad bg-surface/50">
        <div className="shell text-center">
          <Reveal>
            <h2 className="text-section">
              Have something <span className="em-italic">worth building?</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <a
              href={`mailto:${SITE.email}`}
              className="link-underline mt-6 inline-block text-lg text-primary"
            >
              {SITE.email}
            </a>
          </Reveal>
          <Reveal delay={0.14}>
            <div>
              <Link
                to="/contact"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Get in touch <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-6 text-sm text-muted-foreground">
                {/* PLACEHOLDER — confirm the real reply window */}
                Working across India &amp; internationally · Replies within {SITE.replyDays}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
