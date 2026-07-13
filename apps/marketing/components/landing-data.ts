/**
 * Centralized landing-page content. Keeping copy/data here (not inline in JSX)
 * keeps sections presentational and makes the page easy to edit or localize.
 * All copy is original to Estatify.
 */

export const brandLogo = "/assets/logo-gp.svg";

export const nav = {
  links: [
    { label: "About", href: "/#problem" },
    { label: "Templates", href: "/templates" },
    { label: "Pricing", href: "/#pricing" },
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

export const logosMarquee = {
  label: "How it works",
  separatorIcon: brandLogo,
} as const;

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
    features: [
      "Custom domain",
      "Unlimited listings",
      "Lead pipeline + automations",
      "Team of 10 agents",
      "Analytics",
    ],
    cta: "Start trial",
    featured: true,
  },
  {
    name: "Scale",
    price: "Custom",
    cadence: "",
    blurb: "For multi-branch and franchises.",
    features: [
      "Everything in Growth",
      "Unlimited agents",
      "Priority support",
      "White-label billing",
      "API access",
    ],
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

/* ------------------------------------------------------------------------ */
/* Spaciaz-inspired landing (structure-only homage; every word is ours).     */
/* ------------------------------------------------------------------------ */

export const heroV2 = {
  badge: {
    text: "New: Agency sites launched!",
    cta: "Start free →",
    href: "#pricing",
  },
  title: {
    before: "Launch your agency website fast within",
    highlight: "Few hours",
  },
  subtitle:
    "Get a standout real estate site without hiring a design agency — brand, listings, and leads in one place.",
  cta: { label: "Browse all templates", href: "/templates" },
  secondaryCta: { label: "See the problem", href: "#problem" },
  seenIn: {
    label: "Frequently seen in:",
    /** Rotates in pages of 5 every 5s in the hero. */
    pageSize: 5,
    intervalMs: 5000,
    brands: [
      { name: "Acacia", icon: "grid" },
      { name: "Lagos Living", icon: "wordmark" },
      { name: "Nile", icon: "chat" },
      { name: "Sahel", icon: "leaf" },
      { name: "Savanna", icon: "bars" },
      { name: "Kilimanjaro", icon: "grid" },
      { name: "Atlas Homes", icon: "wordmark" },
      { name: "Baobab", icon: "chat" },
      { name: "Zambezi", icon: "leaf" },
      { name: "Casablanca", icon: "bars" },
      { name: "Ivory Coast", icon: "grid" },
      { name: "Cape Realty", icon: "wordmark" },
      { name: "Serengeti", icon: "chat" },
      { name: "Accra Estates", icon: "leaf" },
      { name: "Mombasa", icon: "bars" },
    ],
  },
} as const;

export const problem = {
  eyebrow: "The problem",
  title: {
    lead: "Building a new website",
    muted: "can be challenging",
  },
  cards: [
    {
      key: "time",
      icon: "hourglass",
      title: "Your time and budget are stretched thin",
      body: "Weeks and thousands wasted in designing, rewriting copy, revisions and development.",
      tone: "violet",
    },
    {
      key: "convert",
      icon: "frown",
      title: "Your website does not convert well",
      body: "You have a great business idea, but you have no clue how to go about marketing it the right way.",
      tone: "orange",
    },
    {
      key: "execution",
      icon: "wand",
      title: "Execution matters more than ever",
      body: "Design is no longer nice to have — you need excellence and that takes time and money.",
      tone: "teal",
    },
  ],
} as const;

export const solution = {
  eyebrow: "The solution",
  title: {
    lead: "It's easier than",
    muted: "what you think",
  },
  cards: [
    {
      key: "design",
      title: "Premium Websites with high-end appeal",
      description:
        "Look premium and feel like a professional agency without the hassle of hiring a designer",
      className: "lg:col-span-2",
      skeleton: "design" as const,
    },
    {
      key: "invest",
      title: "Invest in a Website that Makes Sense",
      description:
        "Save money for design and development by using a website that is already built and ready to use",
      className: "lg:col-span-1",
      skeleton: "invest" as const,
    },
    {
      key: "support",
      title: "Fast Support for Smooth Experience",
      description: "Dedicated email support that cares about your success",
      className: "lg:col-span-1",
      skeleton: "support" as const,
    },
    {
      key: "launch",
      title: "Easy Launch, No Coding Required",
      description: "Organized, high-quality and responsive build that you can launch in minutes",
      className: "lg:col-span-2",
      skeleton: "launch" as const,
    },
  ],
} as const;

export const processSection = {
  eyebrow: "The process",
  title: {
    lead: "It's simple and fast:",
    muted: "Customize, launch, grow",
  },
  steps: [
    {
      key: "purchase",
      title: "Purchase a template",
      body: "Browse our selection of high-quality templates, designed for different types of businesses.",
    },
    {
      key: "customize",
      title: "Make it yours",
      body: "Easily customize all the colors, text styles, and content—or even layout—to match your brand.",
    },
    {
      key: "launch",
      title: "Launch and deliver",
      body: "Connect your domain, hit the publish button and watch your website converting first visitors.",
    },
  ],
  templates: [
    "/assets/showcase/coastal-villas.jpg",
    "/assets/showcase/city-heights.jpg",
    "/assets/showcase/garden-estate.jpg",
    "/assets/bento/modern-home.jpg",
    "/assets/bento/listings-home.jpg",
    "/assets/Concrete_Building_Daytime.jpg",
  ],
  colors: [
    { key: "violet", label: "Violet", swatch: "#8B5CF6" },
    { key: "blue", label: "Blue", swatch: "#3B82F6" },
    { key: "green", label: "Green", swatch: "#22C55E" },
    { key: "red", label: "Red", swatch: "#EF4444" },
  ],
  publish: {
    domain: "youragency.estatify.rw",
    author: "Reconfort",
    when: "1d ago",
  },
} as const;

export const howItWorks = {
  marquee: "How it works",
  title: "From template to live site in four steps",
  description: "No agencies to hire, no code to write. If you can pick a design, you can launch.",
  image: "/assets/showcase/city-heights.jpg",
  imageAlt: "Modern residential tower — the kind of portfolio Estatify templates showcase",
  footer: {
    text: "Everything you need to launch a professional agency site.",
    label: "View all templates",
    href: "/templates",
  },
  steps: [
    {
      n: "01",
      title: "Browse the gallery",
      body: "Explore templates built specifically for real estate — each one a complete, working site you can preview live.",
    },
    {
      n: "02",
      title: "Subscribe to claim it",
      body: "Pick a plan and the template becomes your site. Cancel anytime, no lock-in.",
    },
    {
      n: "03",
      title: "Make it yours",
      body: "Add your logo, colors, agents, and listings from your dashboard. Everything updates live.",
    },
    {
      n: "04",
      title: "Publish and sell",
      body: "Launch on your own domain. Leads, analytics, and updates all run from the same dashboard.",
    },
  ],
} as const;

/** Coverflow carousel under the hero — template / product stills. */
export const templateCarousel = {
  ariaLabel: "Template previews",
  intervalMs: 4000,
  items: [
    {
      id: "coastal",
      label: "Coastal",
      image: "/assets/showcase/coastal-villas.jpg",
      alt: "Coastal villas template preview",
    },
    {
      id: "metro",
      label: "Metro",
      image: "/assets/showcase/city-heights.jpg",
      alt: "City heights template preview",
    },
    {
      id: "terra",
      label: "Terra",
      image: "/assets/showcase/garden-estate.jpg",
      alt: "Garden estate template preview",
    },
    {
      id: "modern",
      label: "Modern Home",
      image: "/assets/bento/modern-home.jpg",
      alt: "Modern home listing preview",
    },
    {
      id: "listings",
      label: "Listings",
      image: "/assets/bento/listings-home.jpg",
      alt: "Listings home preview",
    },
    {
      id: "agents",
      label: "Agents",
      image: "/assets/bento/listings-agent.jpg",
      alt: "Agent listings preview",
    },
    {
      id: "analytics",
      label: "Analytics",
      image: "/assets/bento/analytics-team.jpg",
      alt: "Analytics dashboard preview",
    },
    {
      id: "agent-1",
      label: "Directory",
      image: "/assets/bento/agent-1.jpg",
      alt: "Agent directory preview",
    },
    {
      id: "agent-2",
      label: "Profiles",
      image: "/assets/bento/agent-2.jpg",
      alt: "Agent profile preview",
    },
    {
      id: "concrete",
      label: "Urban",
      image: "/assets/Concrete_Building_Daytime.jpg",
      alt: "Urban building preview",
    },
  ],
} as const;

export const templatesV2 = {
  marquee: "The template gallery",
  title: "Templates that make agencies look established",
  description: "Preview any template as a live site — then claim it as your own.",
  ctaLabel: "Preview template",
  items: [
    {
      name: "Coastal",
      tagline: "For villa & beachfront specialists",
      category: "Luxury sales",
      image: "/assets/showcase/coastal-villas.jpg",
      href: "#",
    },
    {
      name: "Metro",
      tagline: "For city rentals & apartments",
      category: "Urban rentals",
      image: "/assets/showcase/city-heights.jpg",
      href: "#",
    },
    {
      name: "Terra",
      tagline: "For residential estates & land",
      category: "Residential",
      image: "/assets/showcase/garden-estate.jpg",
      href: "#",
    },
  ],
} as const;

export const about = {
  marquee: "Who we are",
  title: "The operating system for ambitious real estate agencies",
  items: [
    {
      label: "Our vision",
      body: "Every agency — from a solo agent in Kigali to a multi-branch franchise in Lagos — deserves software that looks and works world-class.",
    },
    {
      label: "Our mission",
      body: "Remove the technical barrier between agencies and their clients: one platform for sites, listings, leads, and growth.",
    },
  ],
  stats: [
    { label: "Agencies onboard", value: 240, suffix: "+", eyebrow: "trusted network" },
    { label: "Listings published", value: 12000, suffix: "+", eyebrow: "market reach" },
    { label: "Leads delivered", value: 85000, suffix: "+", eyebrow: "real results" },
  ],
} as const;

export const servicesV2 = {
  marquee: "What we offer",
  title: "Everything an agency needs to win online",
  closing: "One subscription. Every tool your agency needs.",
  ctaLabel: "View all features",
  items: [
    { title: "Branded Websites", image: "/assets/bento/modern-home.jpg", href: "#" },
    { title: "Listing Management", image: "/assets/bento/listings-home.jpg", href: "#" },
    { title: "Lead Pipeline", image: "/assets/bento/listings-agent.jpg", href: "#" },
    { title: "Agent Tools", image: "/assets/bento/agent-1.jpg", href: "#" },
    { title: "Analytics & Insights", image: "/assets/bento/analytics-team.jpg", href: "#" },
  ],
} as const;

export const showcaseV2 = {
  marquee: "Featured on Estatify",
  title: "Real sites. Real listings. Real agencies.",
  rating: { score: "4.9", note: "Rated by agencies across 12 markets" },
  avatars: ["/assets/bento/agent-1.jpg", "/assets/bento/agent-2.jpg", "/assets/bento/agent-3.jpg"],
} as const;

export const commitment = {
  marquee: "Our commitment",
  title: "What makes Estatify different",
  description:
    "It's not just software — it's the difference between an agency that has a website and an agency that wins with one.",
  values: [
    {
      title: "Performance first",
      body: "Mobile-first, fast on low bandwidth, and optimized for the markets you actually sell in.",
    },
    {
      title: "Built with agencies",
      body: "Our roadmap comes from working agents — not boardroom guesses.",
    },
    {
      title: "Your brand, not ours",
      body: "White-label to the last pixel. Your clients see your agency, never our logo.",
    },
  ],
  image: "/assets/bento/analytics-team.jpg",
} as const;

export const enquiry = {
  marquee: "Quick enquiry",
  title: "Talk to a specialist about your agency's next step",
  note: "We reply within one business day. Required fields are marked *",
  topics: [
    "Launching a new agency site",
    "Migrating an existing site",
    "Multi-branch / franchise setup",
    "Partnership & resellers",
  ],
  cta: "Request a callback",
} as const;
