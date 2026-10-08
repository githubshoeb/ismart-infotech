import { seoLinks, seoMeta } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";

import { SITE } from "@/lib/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    links: seoLinks("/privacy"),
    meta: [
      ...seoMeta("/privacy"),
      { title: "Privacy Policy — iSmart Infotech Solutions" },
      {
        name: "description",
        content: "How iSmart Infotech Solutions handles information collected through this website.",
      },
      { property: "og:title", content: "Privacy Policy — iSmart Infotech Solutions" },
      {
        property: "og:description",
        content: "How iSmart Infotech Solutions handles information collected through this website.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <div className="section-pad pt-36">
      <div className="shell max-w-2xl">
        <p className="text-eyebrow text-primary">Legal</p>
        <h1 className="text-section mt-5">Privacy Policy</h1>
        <p className="mt-4 text-sm text-muted-foreground">Last updated: [DATE]</p>

        <div className="mt-10 space-y-8 text-sm text-muted-foreground">
          {[
            "Information we collect",
            "How we use information",
            "Cookies and analytics",
            "Sharing and third parties",
            "Data retention",
            "Your rights",
            "Contact",
          ].map((h) => (
            <section key={h}>
              <h2 className="font-sans text-base font-medium text-foreground">{h}</h2>
              <p className="mt-2">[LEGAL TEXT — REPLACE BEFORE LAUNCH]</p>
            </section>
          ))}
          <p>
            Questions about this policy can be sent to{" "}
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
