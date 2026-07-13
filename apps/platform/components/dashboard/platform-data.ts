import {
  Building2,
  CalendarPlus,
  CircleDollarSign,
  Globe,
  LifeBuoy,
  Users,
  UserPlus,
  Zap,
} from "lucide-react";

/**
 * Platform admin dashboard mock data — Estatify internal operations.
 * Single source for every widget; swap for API data without touching UI.
 */

/* ------------------------------ Platform status ---------------------------- */

export const platformStatus = {
  state: "Healthy" as "Healthy" | "Degraded" | "Critical",
  uptime: "99.98%",
  incidents: 0,
  deploymentsToday: 4,
  ticketsAwaiting: 3,
} as const;

/* ---------------------------------- KPIs ---------------------------------- */

export const sparkLabels = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"] as const;

export const platformKpis = [
  {
    key: "agencies",
    label: "Total Agencies",
    value: "348",
    trend: +4.2,
    comparison: "vs last 30 days",
    icon: Building2,
    spark: [280, 292, 301, 310, 318, 327, 339, 348],
  },
  {
    key: "new-agencies",
    label: "New Agencies (30d)",
    value: "21",
    trend: +16.7,
    comparison: "vs previous 30 days",
    icon: CalendarPlus,
    spark: [2, 3, 2, 4, 3, 2, 3, 2],
  },
  {
    key: "websites",
    label: "Active Websites",
    value: "312",
    trend: +5.4,
    comparison: "vs last 30 days",
    icon: Globe,
    spark: [252, 260, 268, 275, 284, 296, 305, 312],
  },
  {
    key: "mrr",
    label: "MRR",
    value: "$41.2k",
    trend: +7.8,
    comparison: "vs last month",
    icon: CircleDollarSign,
    spark: [29, 31, 32, 34, 35, 37, 39, 41.2],
  },
  {
    key: "subscriptions",
    label: "Active Subscriptions",
    value: "296",
    trend: +3.5,
    comparison: "vs last 30 days",
    icon: Zap,
    spark: [251, 258, 262, 270, 277, 284, 290, 296],
  },
  {
    key: "users",
    label: "Platform Users",
    value: "1,847",
    trend: +6.1,
    comparison: "vs last 30 days",
    icon: Users,
    spark: [1420, 1490, 1552, 1610, 1665, 1731, 1790, 1847],
  },
  {
    key: "leads-today",
    label: "Leads Generated Today",
    value: "486",
    trend: +11.3,
    comparison: "vs yesterday",
    icon: UserPlus,
    spark: [310, 342, 365, 390, 372, 405, 437, 486],
  },
  {
    key: "tickets",
    label: "Pending Tickets",
    value: "3",
    trend: -25.0,
    comparison: "vs last week",
    icon: LifeBuoy,
    spark: [9, 8, 7, 6, 7, 5, 4, 3],
  },
] as const;

/* ------------------------------ Growth overview ---------------------------- */

export type GrowthRange = "7d" | "30d" | "90d" | "12m";

export const growthRanges: readonly { key: GrowthRange; label: string }[] = [
  { key: "7d", label: "7 Days" },
  { key: "30d", label: "30 Days" },
  { key: "90d", label: "90 Days" },
  { key: "12m", label: "12 Months" },
];

/** MRR growth (USD thousands) per range. */
export const growthSeries: Record<GrowthRange, readonly { label: string; value: number }[]> = {
  "7d": [
    { label: "Mon", value: 39.6 },
    { label: "Tue", value: 39.9 },
    { label: "Wed", value: 40.1 },
    { label: "Thu", value: 40.2 },
    { label: "Fri", value: 40.6 },
    { label: "Sat", value: 40.9 },
    { label: "Sun", value: 41.2 },
  ],
  "30d": [
    { label: "W1", value: 38.1 },
    { label: "W2", value: 39.0 },
    { label: "W3", value: 40.2 },
    { label: "W4", value: 41.2 },
  ],
  "90d": [
    { label: "Apr", value: 33.4 },
    { label: "May", value: 35.6 },
    { label: "Jun", value: 38.3 },
    { label: "Jul", value: 41.2 },
  ],
  "12m": [
    { label: "Aug", value: 18.2 },
    { label: "Sep", value: 20.1 },
    { label: "Oct", value: 22.6 },
    { label: "Nov", value: 24.0 },
    { label: "Dec", value: 26.8 },
    { label: "Jan", value: 28.4 },
    { label: "Feb", value: 30.9 },
    { label: "Mar", value: 32.2 },
    { label: "Apr", value: 33.4 },
    { label: "May", value: 35.6 },
    { label: "Jun", value: 38.3 },
    { label: "Jul", value: 41.2 },
  ],
};

/* --------------------------------- Revenue --------------------------------- */

export const revenue = {
  rows: [
    { label: "Monthly revenue", value: "$43.8k", trend: +7.2 },
    { label: "Annual run rate (ARR)", value: "$494k", trend: +9.1 },
    { label: "Avg revenue / tenant", value: "$118", trend: +2.4 },
    { label: "Trial conversion", value: "38.5%", trend: +1.8 },
    { label: "Churn rate", value: "1.9%", trend: -0.4, invert: true },
  ],
} as const;

/* ------------------------------ Tenant health ------------------------------ */

export type TenantFlag = "growth" | "inactive" | "expired" | null;

export const tenantRows = [
  {
    agency: "Acacia Realty",
    slug: "acacia-realty",
    plan: "Enterprise",
    status: { label: "Active", tone: "success" as const },
    properties: 214,
    leads: 1284,
    website: { label: "Live", tone: "success" as const },
    lastActivity: "5m ago",
    flag: "growth" as TenantFlag,
  },
  {
    agency: "Lagos Living Realty",
    slug: "lagos-living",
    plan: "Professional",
    status: { label: "Active", tone: "success" as const },
    properties: 96,
    leads: 642,
    website: { label: "Live", tone: "success" as const },
    lastActivity: "22m ago",
    flag: "growth" as TenantFlag,
  },
  {
    agency: "Sahel Homes",
    slug: "sahel-homes",
    plan: "Professional",
    status: { label: "Active", tone: "success" as const },
    properties: 71,
    leads: 388,
    website: { label: "Live", tone: "success" as const },
    lastActivity: "1h ago",
    flag: null as TenantFlag,
  },
  {
    agency: "Eldoret Realty",
    slug: "eldoret-realty",
    plan: "Starter",
    status: { label: "Trial", tone: "info" as const },
    properties: 12,
    leads: 35,
    website: { label: "Unpublished", tone: "neutral" as const },
    lastActivity: "2d ago",
    flag: null as TenantFlag,
  },
  {
    agency: "Atlas Residences",
    slug: "atlas-residences",
    plan: "Professional",
    status: { label: "Past due", tone: "warning" as const },
    properties: 54,
    leads: 203,
    website: { label: "Live", tone: "success" as const },
    lastActivity: "3d ago",
    flag: "expired" as TenantFlag,
  },
  {
    agency: "Baobab Realty",
    slug: "baobab-realty",
    plan: "Starter",
    status: { label: "Inactive", tone: "neutral" as const },
    properties: 8,
    leads: 4,
    website: { label: "Offline", tone: "destructive" as const },
    lastActivity: "3w ago",
    flag: "inactive" as TenantFlag,
  },
] as const;

/* ----------------------------- Platform health ----------------------------- */

export type ServiceState = "healthy" | "warning" | "critical";

export const services = [
  { name: "API", state: "healthy" as ServiceState, latency: "84ms", lastIncident: "34d ago" },
  { name: "Database", state: "healthy" as ServiceState, latency: "3.2ms", lastIncident: "61d ago" },
  { name: "Storage", state: "healthy" as ServiceState, latency: "19ms", lastIncident: "12d ago" },
  { name: "Queue", state: "warning" as ServiceState, latency: "412ms", lastIncident: "2h ago" },
  { name: "Email", state: "healthy" as ServiceState, latency: "220ms", lastIncident: "9d ago" },
  {
    name: "Background Jobs",
    state: "healthy" as ServiceState,
    latency: "1.4s",
    lastIncident: "5d ago",
  },
  {
    name: "Website Runtime",
    state: "healthy" as ServiceState,
    latency: "96ms",
    lastIncident: "18d ago",
  },
  { name: "CDN", state: "healthy" as ServiceState, latency: "28ms", lastIncident: "47d ago" },
] as const;

export const avgResponseTime = "118ms";

/* -------------------------------- Support ---------------------------------- */

export const support = {
  open: 14,
  critical: 1,
  avgResponse: "38m",
  resolvedToday: 9,
  csat: "94%",
  conversations: [
    {
      from: "Acacia Realty",
      initials: "AR",
      preview: "Custom domain SSL renewal shows pending for 2 days.",
      time: "18m",
      critical: true,
    },
    {
      from: "Sahel Homes",
      initials: "SH",
      preview: "How do we export all leads to CSV?",
      time: "1h",
      critical: false,
    },
    {
      from: "Nile Properties",
      initials: "NP",
      preview: "Template customization resets after publish.",
      time: "3h",
      critical: false,
    },
  ],
} as const;

/* ------------------------------ Website overview --------------------------- */

export const websiteOverview = [
  { label: "Published websites", value: "312" },
  { label: "Custom domains", value: "148" },
  { label: "Subdomains", value: "164" },
  { label: "SSL active", value: "308" },
  { label: "SEO issues", value: "17", warn: true },
  { label: "Broken websites", value: "2", warn: true },
] as const;

/* --------------------------------- Billing --------------------------------- */

export const billing = [
  { label: "Pending payments", value: "6", warn: false },
  { label: "Failed payments", value: "3", warn: true },
  { label: "Renewals next 7 days", value: "24", warn: false },
  { label: "Invoices this month", value: "291", warn: false },
  { label: "Refund requests", value: "1", warn: true },
] as const;

/* ----------------------------- Customer success ---------------------------- */

export const customerSuccess = {
  fastestGrowing: [
    { name: "Acacia Realty", metric: "+38 properties this month" },
    { name: "Lagos Living Realty", metric: "+212 leads this month" },
    { name: "Kilimanjaro Estates", metric: "3 sites published" },
  ],
  attention: [
    { name: "Baobab Realty", metric: "No logins for 21 days" },
    { name: "Atlas Residences", metric: "Subscription past due" },
    { name: "Savanna Group", metric: "Trial expires in 2 days" },
  ],
} as const;

/* -------------------------------- Templates -------------------------------- */

export const templates = [
  { name: "Coastal Villas", installs: 84, share: 27 },
  { name: "City Heights", installs: 61, share: 20 },
  { name: "Garden Estate", installs: 47, share: 15 },
  { name: "Skyline Modern", installs: 39, share: 13 },
] as const;

/* -------------------------------- Activity --------------------------------- */

export const activity = [
  { time: "09:42", text: "Deployment #482 completed", type: "deploy" as const },
  { time: "09:16", text: "Acacia Realty upgraded to Enterprise", type: "billing" as const },
  { time: "08:51", text: "lagosliving.com domain connected", type: "domain" as const },
  { time: "08:20", text: "New agency created — Mombasa Bay Homes", type: "tenant" as const },
  { time: "07:58", text: "Sahel Homes published website v2", type: "website" as const },
  { time: "07:31", text: "Support ticket #1204 escalated", type: "support" as const },
] as const;

/* ------------------------------ Actionable alerts -------------------------- */

export const alerts = [
  {
    severity: "warning" as const,
    title: "Queue latency elevated",
    detail: "412ms avg over the last 30 minutes.",
  },
  {
    severity: "warning" as const,
    title: "3 failed payments",
    detail: "Atlas Residences + 2 more need dunning review.",
  },
  {
    severity: "info" as const,
    title: "SSL expiring in 7 days",
    detail: "2 custom domains need renewal.",
  },
  {
    severity: "success" as const,
    title: "Deployment #482 live",
    detail: "Website runtime updated with zero downtime.",
  },
] as const;
