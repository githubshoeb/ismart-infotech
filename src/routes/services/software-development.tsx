import { seoLinks, seoMeta } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";

import { ServicePageTemplate } from "@/components/ServicePageTemplate";
import { serviceBySlug } from "@/lib/site";

const service = serviceBySlug("software-development");

export const Route = createFileRoute("/services/software-development")({
  head: () => ({
    links: seoLinks("/services/software-development"),
    meta: [
      ...seoMeta("/services/software-development"),
      { title: "Software Development — iSmart Infotech Solutions" },
      {
        name: "description",
        content:
          "Custom software, websites, e-commerce, mobile apps, SaaS products, APIs and legacy modernization built around how your business works.",
      },
      { property: "og:title", content: "Software Development — iSmart Infotech Solutions" },
      { property: "og:description", content: service.intro },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ServicePageTemplate service={service} />,
});
