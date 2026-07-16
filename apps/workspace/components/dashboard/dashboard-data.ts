import {
  Building2,
  CalendarClock,
  Globe,
  ImagePlus,
  MessageSquare,
  Target,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";

/**
 * Dashboard mock data — Estatify Workspace MVP.
 * Single source for every widget; swap for API data without touching UI.
 */

/* ---------------------------------- KPIs ---------------------------------- */

/** Tooltip labels for KPI sparklines (last 8 weeks). */
export const sparkLabels = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"] as const;

export const kpis = [
  {
    key: "properties",
    label: "Total Properties",
    value: "128",
    trend: +6.4,
    comparison: "vs last 30 days",
    icon: Building2,
    spark: [42, 48, 45, 52, 58, 56, 64, 70],
  },
  {
    key: "leads",
    label: "New Leads",
    value: "342",
    trend: +12.8,
    comparison: "vs last 30 days",
    icon: Users,
    spark: [18, 26, 22, 30, 34, 28, 40, 46],
  },
  {
    key: "viewings",
    label: "Scheduled Viewings",
    value: "57",
    trend: +3.1,
    comparison: "vs last 30 days",
    icon: CalendarClock,
    spark: [8, 12, 10, 9, 14, 13, 15, 16],
  },
  {
    key: "conversion",
    label: "Conversion Rate",
    value: "4.8%",
    trend: -0.6,
    comparison: "vs last 30 days",
    icon: Target,
    spark: [6.1, 5.8, 5.2, 5.6, 5.1, 4.9, 5.0, 4.8],
  },
] as const;

/* ----------------------------- Recent properties -------------------------- */

export type PropertyStatus = "published" | "draft" | "under-offer" | "sold";

export const propertyStatusMeta: Record<
  PropertyStatus,
  { label: string; tone: "success" | "neutral" | "warning" | "info" }
> = {
  published: { label: "Published", tone: "success" },
  draft: { label: "Draft", tone: "neutral" },
  "under-offer": { label: "Under offer", tone: "warning" },
  sold: { label: "Sold", tone: "info" },
};

export const recentProperties = [
  {
    id: "PRP-1042",
    name: "Kigali Heights Apartment",
    location: "Kacyiru, Kigali",
    status: "published" as PropertyStatus,
    price: "$185,000",
    agent: "Amina Okonkwo",
    views: 1284,
    updated: "2h ago",
  },
  {
    id: "PRP-1041",
    name: "Nyarutarama Garden Villa",
    location: "Nyarutarama, Kigali",
    status: "under-offer" as PropertyStatus,
    price: "$420,000",
    agent: "Daniel Mwangi",
    views: 963,
    updated: "5h ago",
  },
  {
    id: "PRP-1039",
    name: "Rebero Lake-View Plot",
    location: "Rebero, Kigali",
    status: "published" as PropertyStatus,
    price: "$95,000",
    agent: "Grace Uwase",
    views: 541,
    updated: "1d ago",
  },
  {
    id: "PRP-1036",
    name: "Kimihurura Townhouse",
    location: "Kimihurura, Kigali",
    status: "draft" as PropertyStatus,
    price: "$260,000",
    agent: "Amina Okonkwo",
    views: 0,
    updated: "2d ago",
  },
  {
    id: "PRP-1031",
    name: "Gacuriro Family Home",
    location: "Gacuriro, Kigali",
    status: "sold" as PropertyStatus,
    price: "$310,000",
    agent: "Daniel Mwangi",
    views: 2210,
    updated: "4d ago",
  },
] as const;

/* -------------------------------- Pipeline -------------------------------- */

export const leadPipeline = [
  { stage: "New", count: 124, tone: "var(--chart-3)" },
  { stage: "Contacted", count: 86, tone: "var(--chart-2)" },
  { stage: "Viewing scheduled", count: 41, tone: "var(--chart-1)" },
  { stage: "Negotiating", count: 18, tone: "var(--chart-4)" },
  { stage: "Closed", count: 9, tone: "var(--chart-5)" },
] as const;

/* ---------------------------- Inquiries by month --------------------------- */

export const inquiryMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** Stacked series — order matters (bottom → top). */
export const inquirySeries = [
  {
    name: "Website",
    color: "var(--chart-1)",
    values: [14, 22, 18, 12, 26, 9, 28, 24, 11, 27, 12, 22],
  },
  {
    name: "WhatsApp",
    color: "var(--chart-4)",
    values: [8, 16, 12, 9, 18, 6, 20, 17, 8, 21, 9, 15],
  },
  {
    name: "Social",
    color: "var(--chart-3)",
    values: [5, 14, 10, 6, 13, 4, 16, 14, 6, 17, 5, 12],
  },
] as const;

export const inquiryTotals = {
  website: "2.4k",
  whatsapp: "1.6k",
  social: "1.1k",
} as const;

/* ------------------------------- Lead sources ------------------------------ */

export const leadSources = [
  { name: "Website", value: 38, color: "var(--chart-1)" },
  { name: "WhatsApp", value: 26, color: "var(--chart-2)" },
  { name: "Facebook", value: 14, color: "var(--chart-3)" },
  { name: "Instagram", value: 10, color: "var(--chart-4)" },
  { name: "Referral", value: 8, color: "var(--chart-5)" },
  { name: "Walk-in", value: 4, color: "var(--border)" },
] as const;

export const leadSourcesTotal = "1,254";

/* ------------------------------ Appointments ------------------------------- */

export const appointments = [
  {
    time: "09:30",
    day: "Today",
    title: "Viewing — Kigali Heights Apartment",
    with: "Eric N. · Amina Okonkwo",
    type: "viewing" as const,
  },
  {
    time: "13:00",
    day: "Today",
    title: "Call — Financing options",
    with: "Sandrine M. · Daniel Mwangi",
    type: "call" as const,
  },
  {
    time: "10:00",
    day: "Tomorrow",
    title: "Viewing — Nyarutarama Garden Villa",
    with: "Jean-Paul K. · Daniel Mwangi",
    type: "viewing" as const,
  },
  {
    time: "15:30",
    day: "Wed",
    title: "Contract signing — Gacuriro Family Home",
    with: "Uwimana family · Grace Uwase",
    type: "signing" as const,
  },
] as const;

/* -------------------------------- Messages -------------------------------- */

export const recentMessages = [
  {
    from: "Eric Niyonzima",
    initials: "EN",
    preview: "Is the Kacyiru apartment still available this weekend?",
    time: "12m",
    channel: "WhatsApp",
    unread: true,
  },
  {
    from: "Sandrine Mukamana",
    initials: "SM",
    preview: "Thanks for the visit — can you send the floor plan?",
    time: "1h",
    channel: "Website",
    unread: true,
  },
  {
    from: "Jean-Paul Kagame",
    initials: "JK",
    preview: "We'd like to make an offer on the villa.",
    time: "3h",
    channel: "Email",
    unread: false,
  },
  {
    from: "Olivia Ingabire",
    initials: "OI",
    preview: "What are the payment terms for the Rebero plot?",
    time: "6h",
    channel: "Instagram",
    unread: false,
  },
] as const;

/* ------------------------------- Quick actions ----------------------------- */

export const quickActions = [
  {
    label: "Add Property",
    description: "Create a new listing",
    href: "/properties",
    icon: Building2,
  },
  {
    label: "Invite Agent",
    description: "Grow your team",
    href: "/agents",
    icon: UserPlus,
  },
  {
    label: "Upload Photos",
    description: "Enrich your listings",
    href: "/properties",
    icon: ImagePlus,
  },
  {
    label: "Publish Website",
    description: "Push changes live",
    href: "/website",
    icon: Globe,
  },
  {
    label: "View Leads",
    description: "Work the pipeline",
    href: "/leads",
    icon: Users,
  },
  {
    label: "Analytics",
    description: "Traffic & performance",
    href: "/analytics",
    icon: TrendingUp,
  },
] as const;

/* --------------------------------- Misc ----------------------------------- */

export const messageChannelIcon = MessageSquare;
