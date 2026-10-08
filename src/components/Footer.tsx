import { Link } from "@tanstack/react-router";
import { Linkedin, Mail } from "lucide-react";

import fullLogo from "@/assets/ismart-logo-full.webp";
import { SERVICES, SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="hairline bg-surface/60">
      <div className="shell grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1.2fr_1.2fr]">
        <div>
          <img
            src={fullLogo}
            alt={SITE.name}
            loading="lazy"
            width={220}
            height={88}
            className="h-14 w-auto object-contain object-left dark:brightness-0 dark:invert"
          />
          <p className="mt-5 max-w-xs text-sm text-muted-foreground">
            Helping startups, SMEs and enterprises across India and international markets modernize
            through cloud, custom software, AI automation and digital growth strategies.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="LinkedIn"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-primary hover:text-primary"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${SITE.email}`}
              aria-label="Email"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-primary hover:text-primary"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-eyebrow font-sans text-muted-foreground">Quick links</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link to="/" className="text-foreground/75 hover:text-primary">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-foreground/75 hover:text-primary">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-foreground/75 hover:text-primary">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-eyebrow font-sans text-muted-foreground">Services</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link to={s.path} className="text-foreground/75 hover:text-primary">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-eyebrow font-sans text-muted-foreground">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>
              <a href={`mailto:${SITE.email}`} className="text-foreground/80 hover:text-primary">
                {SITE.email}
              </a>
            </li>
            <li>{SITE.address}</li>
          </ul>
        </div>
      </div>

      <div className="shell">
        <p className="hairline py-6 text-center text-xs tracking-[0.2em] text-muted-foreground uppercase">
          Cloud · Software · AI · Marketing · Consulting · Staffing
        </p>
      </div>

      <div className="shell hairline flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted-foreground sm:flex-row">
        <p>© 2026 {SITE.name}. All rights reserved.</p>
        <div className="flex gap-6">
          <Link to="/privacy" className="hover:text-primary">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-primary">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
