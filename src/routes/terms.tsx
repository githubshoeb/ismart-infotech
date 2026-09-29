import { createFileRoute } from "@tanstack/react-router";

import { SITE } from "@/lib/site";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms — iSmart Infotech Solutions" },
      {
        name: "description",
        content: "Terms governing the use of the iSmart Infotech Solutions website and services.",
      },
      { property: "og:title", content: "Terms — iSmart Infotech Solutions" },
      {
        property: "og:description",
        content: "Terms governing the use of the iSmart Infotech Solutions website and services.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <div className="section-pad pt-36">
      <div className="shell max-w-2xl">
        <p className="text-eyebrow text-primary">Legal</p>
        <h1 className="text-section mt-5">Terms</h1>
        <p className="mt-4 text-sm text-muted-foreground">Last updated: [DATE]</p>

        <div className="mt-10 space-y-8 text-sm text-muted-foreground">
          {[
            "Use of this website",
            "Services and engagements",
            "Intellectual property",
            "Confidentiality",
            "Limitation of liability",
            "Governing law",
            "Changes to these terms",
          ].map((h) => (
            <section key={h}>
              <h2 className="font-sans text-base font-medium text-foreground">{h}</h2>
              <p className="mt-2">[LEGAL TEXT — REPLACE BEFORE LAUNCH]</p>
            </section>
          ))}
          <p>
            Questions about these terms can be sent to{" "}
            <a href={`mailto:${SITE.email}`} className="text-primary">
              {SITE.email}
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
