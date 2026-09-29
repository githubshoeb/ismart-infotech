import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";

import { Reveal } from "./Reveal";
import type { Service } from "@/lib/site";

function splitEmphasis(text: string) {
  const words = text.split(" ");
  const cut = Math.max(1, Math.ceil(words.length * 0.6));
  return [words.slice(0, cut).join(" "), words.slice(cut).join(" ")];
}

export function ServicePageTemplate({ service }: { service: Service }) {
  const [head, tail] = splitEmphasis(service.intro);

  return (
    <div>
      <section className="section-pad pt-36">
        <div className="shell max-w-3xl">
          <Reveal>
            <p className="text-eyebrow text-primary">{service.name}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="text-section mt-5">
              {head} <span className="em-italic text-primary">{tail}</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-7 text-base text-muted-foreground">{service.blurb}</p>
          </Reveal>
        </div>
      </section>

      {service.featured && (
        <section className="pb-4">
          <div className="shell grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {service.featured.map((f, i) => (
              <Reveal key={f} delay={i * 0.06}>
                <div className="card-soft h-full p-6 hover:-translate-y-1">
                  <span className="text-eyebrow text-highlight">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-3 font-medium">{f}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="section-pad pt-10">
        <div className="shell">
          <Reveal>
            <h2 className="text-eyebrow font-sans text-muted-foreground">What's included</h2>
          </Reveal>

          {service.groups ? (
            <div className="mt-8 grid gap-12 md:grid-cols-2">
              {service.groups.map((g) => (
                <div key={g.label}>
                  <h3 className="em-italic text-2xl">{g.label}</h3>
                  <ul className="mt-5 space-y-3">
                    {g.items.map((item, i) => (
                      <Reveal key={item} delay={i * 0.03} y={10}>
                        <li className="flex items-start gap-3 text-sm">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span className="text-foreground/80">{item}</span>
                        </li>
                      </Reveal>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <ul className="mt-8 grid gap-x-10 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {service.offerings.map((item, i) => (
                <Reveal key={item} delay={Math.min(i, 8) * 0.03} y={10}>
                  <li className="flex items-start gap-3 border-b border-border py-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-foreground/80">{item}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="section-pad bg-surface/60 pt-0 pb-0">
        <div className="shell py-20 text-center">
          <Reveal>
            <h2 className="text-section">
              Talk to us about <span className="em-italic text-primary">{service.name}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
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
