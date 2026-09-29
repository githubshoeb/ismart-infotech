import { createFileRoute } from "@tanstack/react-router";

import { ServicePageTemplate } from "@/components/ServicePageTemplate";
import { SERVICES } from "@/lib/site";

const service = SERVICES[4];

export const Route = createFileRoute("/services/data-ai")({
  head: () => ({
    meta: [
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
