export const SITE = {
  name: "iSmart Infotech Solutions",
  email: "contact@ismartinfotech.com",
  address: "Shop No. 2, Opp. Yashwant College, Iqbal Nagar, Parbhani – 431401",
  tagline: "Code · Create · Connect",
  /* PLACEHOLDER — replace with the real founding year */
  workingSince: "2019",
  /* PLACEHOLDER — replace with the real kickoff lead time */
  kickoffWeeks: "2",
  /* PLACEHOLDER — replace with the real reply window */
  replyDays: "2 business days",
  countries: "8+",
  /* PLACEHOLDER — replace with real profile URLs */
  linkedin: "https://www.linkedin.com/",
  instagram: "https://www.instagram.com/",
} as const;

export type Service = {
  slug: string;
  path: string;
  number: string;
  name: string;
  short: string;
  intro: string;
  blurb: string;
  offerings: string[];
  groups?: { label: string; items: string[] }[];
  featured?: string[];
};

export const SERVICES: Service[] = [
  {
    slug: "cloud-infrastructure",
    path: "/services/cloud-infrastructure",
    number: "01",
    name: "Cloud & Infrastructure",
    short: "Scalable infrastructure across every major platform",
    intro: "Infrastructure that scales without drama, on the platform that suits you.",
    blurb:
      "We design, migrate and run cloud platforms that stay predictable as you grow — right-sized from day one, automated end to end, and documented so your team is never locked out of its own stack.",
    offerings: [
      "AWS Cloud Consulting",
      "Google Cloud Platform (GCP)",
      "Microsoft Azure",
      "Oracle Cloud Infrastructure (OCI)",
      "DigitalOcean",
      "OpenShift",
      "Kubernetes & Orchestration",
      "DevOps Services",
      "Infrastructure as Code (IaC)",
      "Salesforce",
      "Cloud Migration",
      "Server & Data Migration",
      "Multi-Cloud Strategy",
      "Cloud Cost Optimization / FinOps",
      "Backup & Disaster Recovery",
      "Site Reliability Engineering (SRE)",
    ],
  },
  {
    slug: "software-development",
    path: "/services/software-development",
    number: "02",
    name: "Software Development",
    short: "Products built around how you actually work",
    intro: "Fast, considered products, built around how your business actually operates.",
    blurb:
      "We start from the workflow, not the feature list. Short sprints, visible progress, and a codebase your team can keep building on long after launch.",
    offerings: [
      "Custom Software",
      "Website Development",
      "E-commerce",
      "Mobile Apps",
      "UI/UX Design",
      "ERP / CRM",
      "SaaS Product Development",
      "API Development & Integration",
      "Progressive Web Apps (PWA)",
      "Legacy Modernization",
      "QA & Test Automation",
    ],
  },
  {
    slug: "digital-marketing",
    path: "/services/digital-marketing",
    number: "03",
    name: "Digital Marketing",
    short: "Growth, measured to outcomes not vanity metrics",
    intro: "Growth activity measured to outcomes — not just impressions.",
    blurb:
      "Channels are chosen for where your buyers actually are, and every campaign is wired to attribution before it goes live, so spend can be defended with numbers.",
    offerings: [
      "SEO Services",
      "AI Search Visibility / GEO",
      "Google Ads / PPC",
      "Meta Ads",
      "Instagram Ads",
      "WhatsApp Marketing",
      "Social Media Marketing",
      "Lead Generation",
      "Marketing Automation",
      "Conversion Rate Optimization (CRO)",
      "Branding Solutions",
      "Content Marketing",
      "Marketing Analytics & Attribution",
    ],
  },
  {
    slug: "it-consulting-staffing",
    path: "/services/it-consulting-staffing",
    number: "04",
    name: "IT Consulting & Staffing Solutions",
    short: "Strategy and talent, on demand",
    intro: "Strategic guidance and the people to execute it, both available on demand.",
    blurb:
      "Senior advice when the direction is unclear, and vetted engineers when the plan is agreed and you simply need capacity. Both, without a long procurement cycle.",
    offerings: [],
    groups: [
      {
        label: "Consulting",
        items: [
          "IT Strategy Consulting",
          "Digital Transformation",
          "Process Automation",
          "Startup Consulting",
          "Managed IT Support",
          "Tech Audits",
          "AI Readiness Strategy",
          "Vendor & Tool Rationalization",
          "vCIO / Fractional CTO",
        ],
      },
      {
        label: "Staffing",
        items: [
          "IT Staff Augmentation",
          "Dedicated Development Teams",
          "Contract-to-Hire Staffing",
          "Niche Tech Talent Sourcing",
          "Remote/Offshore Team Setup",
        ],
      },
    ],
  },
  {
    slug: "data-ai",
    path: "/services/data-ai",
    number: "05",
    name: "Data & AI",
    short: "From dashboards to autonomous agents",
    intro:
      "From prototype to production, without the theatre — retrieval pipelines on your real data, with guardrails and evaluation built in.",
    blurb:
      "We treat AI work like engineering: grounded on your own documents and systems, evaluated against real cases, and shipped behind the same review and monitoring as everything else we run.",
    featured: ["Generative AI Solutions", "RAG Chatbots", "AI Agents / Agentic Workflows", "MLOps"],
    offerings: [
      "BI Dashboards",
      "Power BI Reports",
      "Data Analytics",
      "Generative AI Solutions",
      "RAG Chatbots",
      "AI Agents / Agentic Workflows",
      "AI Automation",
      "Chatbot Integration",
      "LLM Fine-Tuning & Private Hosting",
      "AI Workflow Automation",
      "Prompt Engineering & Evaluation",
      "Document Intelligence / IDP",
      "Computer Vision",
      "ML Solutions",
      "MLOps",
    ],
  },
  {
    slug: "security",
    path: "/services/security",
    number: "06",
    name: "Security",
    short: "Protection built in, not bolted on",
    intro: "Protection built into how we deliver, not bolted on afterward.",
    blurb:
      "Security reviews sit inside the delivery process rather than at the end of it, so issues are cheap to fix and compliance evidence accumulates as you build.",
    offerings: [
      "Cybersecurity Consulting",
      "Website Security",
      "Cloud Security",
      "AI Security & Governance",
      "Compliance Consulting",
      "Penetration Testing",
    ],
  },
];

export const ROTATING_SPECIALTIES = SERVICES.map((s) => s.name);

export function serviceBySlug(slug: string): Service {
  const found = SERVICES.find((s) => s.slug === slug);
  if (!found) throw new Error(`Unknown service: ${slug}`);
  return found;
}
