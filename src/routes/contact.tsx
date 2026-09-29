import { createFileRoute } from "@tanstack/react-router";
import { Check, Mail, MapPin } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Reveal } from "@/components/Reveal";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — iSmart Infotech Solutions" },
      {
        name: "description",
        content:
          "Tell us what you need — cloud, software, AI, marketing or staffing. Free consultation for teams in India and internationally.",
      },
      { property: "og:title", content: "Contact iSmart Infotech Solutions" },
      {
        property: "og:description",
        content: "Let's build something worth running. Get a free consultation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

const COUNTRIES = [
  "India",
  "United Arab Emirates",
  "Saudi Arabia",
  "Qatar",
  "Other Gulf/Middle East",
  "Other International",
];

const CHIPS = ["ALM / Automation", "Cloud", "Website / App Development", "Digital Marketing"];

const field =
  "mt-2 w-full rounded-lg border border-input bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-primary";

function Contact() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    company: "",
    country: "",
    message: "",
    website: "", // honeypot
  });
  const [chips, setChips] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof values, v: string) => setValues((p) => ({ ...p, [k]: v }));

  const toggleChip = (c: string) =>
    setChips((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!values.name.trim()) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = "Enter a valid email address.";
    if (!values.country) next.country = "Please choose your country or region.";
    if (!values.message.trim()) next.message = "Tell us a little about what you need.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    if (values.website) return; // honeypot filled — silently drop

    // NOTE: static site, no backend. Plug a real endpoint in here
    // (Formspree, or a future serverless function) and POST { ...values, chips }.
    setSent(true);
  };

  return (
    <div className="section-pad pt-36">
      <div className="shell grid gap-16 md:grid-cols-[1fr_1.15fr]">
        <div>
          <Reveal>
            <p className="text-eyebrow text-primary">Contact</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="text-section mt-5">
              Let's build something <span className="em-italic text-primary">worth running.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-10 space-y-6 text-sm">
              <p className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a href={`mailto:${SITE.email}`} className="link-underline">
                  {SITE.email}
                </a>
              </p>
              <p className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  {SITE.address}
                  <span className="mt-1 block text-xs">India — HQ</span>
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                {/* PLACEHOLDER — confirm the real reply window */}
                Working across India &amp; internationally · Replies within {SITE.replyDays}
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          {sent ? (
            <div className="card-soft flex h-full flex-col justify-center p-10 text-center">
              <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Check className="h-5 w-5" />
              </span>
              <h2 className="mt-6 text-2xl">Thanks — message received.</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                We'll get back to you within {SITE.replyDays}.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="card-soft p-8 md:p-10">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="text-sm font-medium">
                    Name *
                  </label>
                  <input
                    id="name"
                    value={values.name}
                    onChange={(e) => set("name", e.target.value)}
                    className={field}
                  />
                  {errors.name && <p className="mt-1.5 text-xs text-destructive">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={values.email}
                    onChange={(e) => set("email", e.target.value)}
                    className={field}
                  />
                  {errors.email && <p className="mt-1.5 text-xs text-destructive">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="company" className="text-sm font-medium">
                    Company
                  </label>
                  <input
                    id="company"
                    value={values.company}
                    onChange={(e) => set("company", e.target.value)}
                    className={field}
                  />
                </div>
                <div>
                  <label htmlFor="country" className="text-sm font-medium">
                    Country/Region *
                  </label>
                  <select
                    id="country"
                    value={values.country}
                    onChange={(e) => set("country", e.target.value)}
                    className={field}
                  >
                    <option value="">Select…</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <p className="mt-1.5 text-xs text-destructive">{errors.country}</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="message" className="text-sm font-medium">
                  What do you need? *
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {CHIPS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleChip(c)}
                      aria-pressed={chips.includes(c)}
                      className={`rounded-full border px-4 py-1.5 text-xs transition-colors ${
                        chips.includes(c)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <textarea
                  id="message"
                  rows={5}
                  value={values.message}
                  onChange={(e) => set("message", e.target.value)}
                  className={field}
                />
                {errors.message && (
                  <p className="mt-1.5 text-xs text-destructive">{errors.message}</p>
                )}
              </div>

              {/* Honeypot — hidden from people, tempting to bots */}
              <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.website}
                  onChange={(e) => set("website", e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="mt-8 w-full rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Get Free Consultation
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </div>
  );
}
