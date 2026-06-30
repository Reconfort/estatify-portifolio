/**
 * Centralized landing-page content. Keeping copy/data here (not inline in JSX)
 * keeps sections presentational and makes the page easy to edit or localize.
 * All copy is original to Estatify.
 */

export const nav = {
  links: [
    { label: "Features", href: "#features" },
    { label: "Showcase", href: "#showcase" },
    { label: "Pricing", href: "#pricing" },
    { label: "Docs", href: "#" },
  ],
} as const;

export const hero = {
  badge: "Built for African real estate",
  title: "Launch your agency's branded property platform",
  highlight: "in hours",
  subtitle:
    "Estatify gives every agency its own website, dashboard, and lead engine — fully branded, mobile-first, and ready to convert. No developers required.",
  primaryCta: "Start free",
  secondaryCta: "Book a demo",
  note: "14-day trial · No card required",
} as const;

export const logos = [
  "Acacia Realty",
  "Sahel Homes",
  "Kilimanjaro Estates",
  "Lagos Living",
  "Nile Properties",
  "Savanna Group",
  "Atlas Residences",
  "Baobab Realty",
] as const;

export const features = [
  {
    key: "sites",
    title: "Branded websites",
    description:
      "A polished, fast property site under your own domain your logo, your colors, day one.",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    key: "listings",
    title: "Listing management",
    description: "Add, organize, and publish properties with rich media in minutes.",
    span: "md:col-span-1",
  },
  {
    key: "leads",
    title: "Lead engine",
    description: "Capture, track, and convert every enquiry with a built-in pipeline.",
    span: "md:col-span-1",
  },
  {
    key: "agents",
    title: "Agent profiles",
    description: "Showcase your team with directories, stats, and contact routing.",
    span: "md:col-span-1",
  },
  {
    key: "analytics",
    title: "Analytics that matter",
    description:
      "Track views, leads, conversion, and revenue across your whole portfolio in real time.",
    span: "md:col-span-2",
  },
] as const;

export const steps = [
  {
    n: "01",
    title: "Brand it",
    body: "Pick your colors, logo, and domain. Your site themes itself.",
    link: "Your brand kit",
  },
  {
    n: "02",
    title: "List it",
    body: "Import or add properties with photos, maps, and amenities.",
    link: "Add listings",
  },
  {
    n: "03",
    title: "Grow it",
    body: "Share your site and watch leads land in your pipeline.",
    link: "Track leads",
  },
] as const;

export const services = [
  {
    icon: "sites",
    title: "Branded Websites",
    description: "Launch a polished, fast property site on your own domain — your brand, day one.",
  },
  {
    icon: "listings",
    title: "Listing Management",
    description: "Add, organize, and publish properties with rich media in minutes.",
  },
  {
    icon: "leads",
    title: "Lead Management",
    description: "Capture every enquiry and move it through a built-in pipeline to close.",
  },
  {
    icon: "agents",
    title: "Agent Tools",
    description: "Give your team profiles, smart routing, and the tools to perform.",
  },
  {
    icon: "analytics",
    title: "Analytics & Insights",
    description: "Track views, leads, conversion, and revenue across your whole portfolio.",
  },
  {
    icon: "whitelabel",
    title: "White-label & Domains",
    description: "Custom domains, themes, and billing — fully yours and multi-branch ready.",
  },
] as const;

export const showcase = [
  {
    name: "Coastal Villas",
    location: "Mombasa, KE",
    price: "$420,000",
    tag: "For sale",
    image: "/assets/showcase/coastal-villas.jpg",
  },
  {
    name: "City Heights",
    location: "Accra, GH",
    price: "$1,850 / mo",
    tag: "For rent",
    image: "/assets/showcase/city-heights.jpg",
  },
  {
    name: "Garden Estate",
    location: "Kigali, RW",
    price: "$295,000",
    tag: "For sale",
    image: "/assets/showcase/garden-estate.jpg",
  },
] as const;

export const pricing = [
  {
    name: "Starter",
    price: "$0",
    cadence: "/mo",
    blurb: "For solo agents getting online.",
    features: ["1 branded site", "Up to 25 listings", "Lead inbox", "Estatify subdomain"],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Growth",
    price: "$49",
    cadence: "/mo",
    blurb: "For agencies scaling their pipeline.",
    features: ["Custom domain", "Unlimited listings", "Lead pipeline + automations", "Team of 10 agents", "Analytics"],
    cta: "Start trial",
    featured: true,
  },
  {
    name: "Scale",
    price: "Custom",
    cadence: "",
    blurb: "For multi-branch and franchises.",
    features: ["Everything in Growth", "Unlimited agents", "Priority support", "White-label billing", "API access"],
    cta: "Talk to sales",
    featured: false,
  },
] as const;

export const testimonials = [
  {
    title: "Up and running fast",
    quote: "We replaced three tools and launched our site in two days.",
    name: "Amara O.",
    role: "Lagos Living",
    avatar: "/assets/bento/agent-1.jpg",
  },
  {
    title: "Leads in one place",
    quote: "Leads finally live in one place. Our follow-up rate doubled.",
    name: "David K.",
    role: "Nile Properties",
    avatar: "/assets/bento/agent-2.jpg",
  },
  {
    title: "Looks agency-built",
    quote: "It looks like we hired an agency. We didn't.",
    name: "Fatima S.",
    role: "Sahel Homes",
    avatar: "/assets/bento/agent-3.jpg",
  },
  {
    title: "Live in a weekend",
    quote: "Setup was genuinely a weekend. The team loves it.",
    name: "Joseph M.",
    role: "Savanna Group",
    avatar: "/assets/bento/agent-4.jpg",
  },
] as const;
