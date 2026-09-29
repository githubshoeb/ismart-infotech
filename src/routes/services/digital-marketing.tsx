import { createFileRoute } from "@tanstack/react-router";

import { ServicePageTemplate } from "@/components/ServicePageTemplate";
import { serviceBySlug } from "@/lib/site";

const service = serviceBySlug("digital-marketing");

export const Route = createFileRoute("/services/digital-marketing")({
  head: () => ({
    meta: [
      { title: "Digital Marketing — iSmart Infotech Solutions" },
      {
        name: "description",
        content:
          "SEO, AI search visibility, Google and Meta ads, WhatsApp marketing, CRO and attribution — growth measured to outcomes.",
      },
      { property: "og:title", content: "Digital Marketing — iSmart Infotech Solutions" },
      { property: "og:description", content: service.intro },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ServicePageTemplate service={service} />,
});
