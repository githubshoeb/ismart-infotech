import { seoLinks, seoMeta } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";

import { ServicePageTemplate } from "@/components/ServicePageTemplate";
import { serviceBySlug } from "@/lib/site";

const service = serviceBySlug("security");

export const Route = createFileRoute("/services/security")({
  head: () => ({
    links: seoLinks("/services/security"),
    meta: [
      ...seoMeta("/services/security"),
      { title: "Security — iSmart Infotech Solutions" },
      {
        name: "description",
        content:
          "Cybersecurity consulting, website and cloud security, AI security & governance, compliance and penetration testing — built in, not bolted on.",
      },
      { property: "og:title", content: "Security — iSmart Infotech Solutions" },
      { property: "og:description", content: service.intro },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ServicePageTemplate service={service} />,
});
