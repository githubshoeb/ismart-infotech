import { createFileRoute } from "@tanstack/react-router";

import { ServicePageTemplate } from "@/components/ServicePageTemplate";
import { serviceBySlug } from "@/lib/site";

const service = serviceBySlug("it-consulting-staffing");

export const Route = createFileRoute("/services/it-consulting-staffing")({
  head: () => ({
    meta: [
      { title: "IT Consulting & Staffing Solutions — iSmart Infotech Solutions" },
      {
        name: "description",
        content:
          "IT strategy, digital transformation, vCIO advisory, staff augmentation, dedicated teams and offshore setup — strategy and talent on demand.",
      },
      {
        property: "og:title",
        content: "IT Consulting & Staffing — iSmart Infotech Solutions",
      },
      { property: "og:description", content: service.intro },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ServicePageTemplate service={service} />,
});
