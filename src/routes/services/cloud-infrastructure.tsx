import { seoLinks, seoMeta } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";

import { ServicePageTemplate } from "@/components/ServicePageTemplate";
import { serviceBySlug } from "@/lib/site";

const service = serviceBySlug("cloud-infrastructure");

export const Route = createFileRoute("/services/cloud-infrastructure")({
  head: () => ({
    links: seoLinks("/services/cloud-infrastructure"),
    meta: [
      ...seoMeta("/services/cloud-infrastructure"),
      { title: "Cloud & Infrastructure — iSmart Infotech Solutions" },
      {
        name: "description",
        content:
          "AWS, Azure, GCP and OCI consulting, Kubernetes, DevOps, migrations, FinOps and SRE — infrastructure that scales without drama.",
      },
      { property: "og:title", content: "Cloud & Infrastructure — iSmart Infotech Solutions" },
      { property: "og:description", content: service.intro },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ServicePageTemplate service={service} />,
});
