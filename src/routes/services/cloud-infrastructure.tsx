import { createFileRoute } from "@tanstack/react-router";

import { ServicePageTemplate } from "@/components/ServicePageTemplate";
import { SERVICES } from "@/lib/site";

const service = SERVICES[0];

export const Route = createFileRoute("/services/cloud-infrastructure")({
  head: () => ({
    meta: [
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
