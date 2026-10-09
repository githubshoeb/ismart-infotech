import { seoLinks, seoMeta } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, Linkedin, Mail, MapPin } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";

import { Reveal } from "@/components/Reveal";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    links: seoLinks("/contact"),
    meta: [
      ...seoMeta("/contact"),
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

import { QUICKSTART_KEY } from "@/components/home/QuickStart";

const COUNTRIES = [
  "India",
  "United Arab Emirates",
  "Saudi Arabia",
  "Qatar",
  "Other Gulf/Middle East",
  "Other International",
];

const CHIPS = ["ALM / Automation", "Cloud", "Website / App Development", "Digital Marketing"];

const STEPS = [
  ["You tell us what you need", "A few lines about your goal, in your own words."],
  [
    "We reply with questions and a rough approach",
    "So we both know what a good outcome looks like.",
  ],
  [
    "A short call, then a clear plan and price",
    "Scope, timeline and cost agreed before any work begins.",
  ],
];

type Key = "name" | "email" | "country" | "message";
type FormErrors = Partial<Record<Key, string>>;

const input =
  "peer w-full rounded-xl border border-input bg-background px-4 pb-2.5 pt-6 text-sm outline-none transition-[border-color,box-shadow] focus:border-highlight focus:ring-2 focus:ring-highlight/30";
const floatLabel =
  "pointer-events-none absolute left-4 top-4 origin-left text-sm text-muted-foreground transition-all peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-highlight peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px]";

function Field({
  error,
  shakeKey,
  children,
}: {
  error?: string;
  shakeKey: number;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <div>
      <motion.div
        key={error ? shakeKey : "ok"}
        className="relative"
        animate={error && !reduce ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function buildMail(v: Record<string, string>, chips: string[]) {
  const subject = `New enquiry from ${v.name}${v.company ? ` (${v.company})` : ""}`;
  const body = [
    `Name: ${v.name}`,
    `Email: ${v.email}`,
    `Company: ${v.company || "—"}`,
    `Country/Region: ${v.country}`,
    `Interested in: ${chips.length ? chips.join(", ") : "—"}`,
    "",
    v.message,
  ].join("\n");
  const q = `subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return {
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(SITE.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    mailto: `mailto:${SITE.email}?${q}`,
  };
}

function Contact() {
  const reduce = useReducedMotion();
  const [values, setValues] = useState({
    name: "",
    email: "",
    company: "",
    country: "",
    message: "",
    website: "", // honeypot
  });
  const [chips, setChips] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [shake, setShake] = useState(0);
  const [links, setLinks] = useState<{ gmail: string; mailto: string } | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const msgRef = useRef<HTMLTextAreaElement>(null);

  const set = (k: keyof typeof values, v: string) => setValues((p) => ({ ...p, [k]: v }));
  const toggleChip = (c: string) =>
    setChips((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));

  // Quick-start email from the home page (browser only)
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(QUICKSTART_KEY);
      if (stored) {
        sessionStorage.removeItem(QUICKSTART_KEY);
        set("email", stored.slice(0, 255));
        document.getElementById("form")?.scrollIntoView({ block: "start" });
        nameRef.current?.focus({ preventScroll: true });
      }
    } catch {
      /* storage unavailable */
    }
  }, []);

  // Auto-grow textarea
  useEffect(() => {
    const el = msgRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 420)}px`;
  }, [values.message, links]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: FormErrors = {};
    if (!values.name.trim()) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = "Enter a valid email address.";
    if (!values.country) next.country = "Please choose your country or region.";
    if (!values.message.trim()) next.message = "Tell us a little about what you need.";
    setErrors(next);
    setShake((s) => s + 1);
    if (Object.keys(next).length > 0) return;
    if (values.website) return; // honeypot filled — silently drop

    const l = buildMail(values, chips);
    const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    if (mobile) window.location.href = l.mailto;
    else window.open(l.gmail, "_blank", "noopener,noreferrer");
    setLinks(l);
  };

  return (
    <div className="section-pad pt-36">
      <div className="shell">
        {/* Intro */}
        <div className="max-w-3xl">
          <Reveal>
            <p className="text-eyebrow text-primary">Get in touch</p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="relative mt-5 inline-block pr-16">
              <h1 className="text-display">
                Let's start a <span className="em-italic text-primary">conversation.</span>
              </h1>
              <motion.span
                aria-hidden
                className="absolute -top-6 right-0 rounded-2xl rounded-bl-sm border border-border bg-card px-3 py-1.5 text-sm font-medium text-primary shadow-sm"
                animate={reduce ? undefined : { y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                hi!
              </motion.span>
            </div>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-6 max-w-xl text-base text-muted-foreground">
              Tell us what you're building and we'll come back with a clear, straightforward answer.
            </p>
            <a
              href="#form"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("form")
                  ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
              }}
              className="link-underline mt-5 inline-block text-sm text-primary"
            >
              Start below ↓
            </a>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-14 md:grid-cols-[1fr_1.25fr]">
          {/* Steps */}
          <div>
            <Reveal>
              <h2 className="text-2xl">What happens next</h2>
            </Reveal>
            <ol className="mt-8 space-y-8">
              {STEPS.map(([t, d], i) => (
                <Reveal key={t} delay={0.06 * i}>
                  <li className="flex gap-5">
                    <span className="font-display text-sm text-primary">0{i + 1}</span>
                    <div>
                      <p className="font-medium">{t}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{d}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>

            <Reveal delay={0.2}>
              <div className="mt-12 border-t border-border pt-8 text-sm">
                <p className="text-eyebrow text-muted-foreground">Prefer email?</p>
                <div className="mt-5 space-y-4">
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
                  <p className="flex items-start gap-3">
                    <Linkedin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <a
                      href={SITE.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline"
                    >
                      LinkedIn
                    </a>
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Form card */}
          <Reveal delay={0.1}>
            <div id="form" className="card-soft scroll-mt-28 rounded-3xl border border-border p-6 shadow-lg sm:p-8 md:p-10">
              {links ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-5 w-5" />
                  </span>
                  <h2 className="mt-6 text-2xl">Your message is ready to send</h2>
                  <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                    We've opened a pre-filled draft to {SITE.email}. If it didn't open, use one of
                    the buttons below.
                  </p>
                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <a
                      href={links.gmail}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      Open Gmail draft
                    </a>
                    <a
                      href={links.mailto}
                      className="rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
                    >
                      Open in my email app
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLinks(null)}
                    className="link-underline mt-6 text-sm text-muted-foreground"
                  >
                    Edit my message
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field error={errors.name} shakeKey={shake}>
                      <input
                        ref={nameRef}
                        id="name"
                        placeholder=" "
                        maxLength={100}
                        value={values.name}
                        onChange={(e) => set("name", e.target.value)}
                        className={input}
                      />
                      <label htmlFor="name" className={floatLabel}>
                        Your name *
                      </label>
                    </Field>
                    <Field error={errors.email} shakeKey={shake}>
                      <input
                        id="email"
                        type="email"
                        placeholder=" "
                        maxLength={255}
                        value={values.email}
                        onChange={(e) => set("email", e.target.value)}
                        className={input}
                      />
                      <label htmlFor="email" className={floatLabel}>
                        Email address *
                      </label>
                    </Field>
                    <Field shakeKey={shake}>
                      <input
                        id="company"
                        placeholder=" "
                        maxLength={100}
                        value={values.company}
                        onChange={(e) => set("company", e.target.value)}
                        className={input}
                      />
                      <label htmlFor="company" className={floatLabel}>
                        Company (optional)
                      </label>
                    </Field>
                    <Field error={errors.country} shakeKey={shake}>
                      <select
                        id="country"
                        value={values.country}
                        onChange={(e) => set("country", e.target.value)}
                        className={input}
                      >
                        <option value="">Select…</option>
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <label
                        htmlFor="country"
                        className="pointer-events-none absolute left-4 top-2 text-[11px] text-muted-foreground peer-focus:text-highlight"
                      >
                        Country / Region *
                      </label>
                    </Field>
                  </div>

                  <div className="mt-7">
                    <p className="text-sm font-medium">What do you need?</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {CHIPS.map((c) => {
                        const on = chips.includes(c);
                        return (
                          <motion.button
                            key={c}
                            type="button"
                            whileTap={reduce ? undefined : { scale: 0.94 }}
                            onClick={() => toggleChip(c)}
                            aria-pressed={on}
                            className={`rounded-full border px-4 py-2 text-xs transition-colors ${
                              on
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border hover:border-primary"
                            }`}
                          >
                            {c}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-6">
                    <Field error={errors.message} shakeKey={shake}>
                      <textarea
                        ref={msgRef}
                        id="message"
                        rows={4}
                        placeholder=" "
                        maxLength={5000}
                        value={values.message}
                        onChange={(e) => set("message", e.target.value)}
                        className={`${input} resize-none`}
                      />
                      <label htmlFor="message" className={floatLabel}>
                        Tell us about the project *
                      </label>
                    </Field>
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
                    className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-medium text-primary-foreground shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg motion-reduce:hover:translate-y-0"
                  >
                    Get Free Consultation
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" />
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
