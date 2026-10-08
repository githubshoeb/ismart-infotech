import { seoLinks, seoMeta } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";

import { ServicePageTemplate } from "@/components/ServicePageTemplate";
import { serviceBySlug } from "@/lib/site";

const service = serviceBySlug("data-ai");

export const Route = createFileRoute("/services/data-ai")({
  head: () => ({
    links: seoLinks("/services/data-ai"),
    meta: [
      ...seoMeta("/services/data-ai"),
      { title: "Data & AI — iSmart Infotech Solutions" },
      {
        name: "description",
        content:
          "Generative AI, RAG chatbots, AI agents, MLOps, BI dashboards and document intelligence — from prototype to production, without the theatre.",
      },
      { property: "og:title", content: "Data & AI — iSmart Infotech Solutions" },
      { property: "og:description", content: service.intro },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ServicePageTemplate service={service} />,
});
