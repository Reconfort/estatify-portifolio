import type { AuthTestimonial } from "./auth-testimonial-panel";

/**
 * Default auth panel copy. Images are the shared real-estate set from
 * `@estatify/assets` (packages/assets/auth), exposed by every app via the
 * `public/assets/auth` symlink — see packages/assets/README.md.
 */
export const defaultAuthTestimonials = [
  {
    quote:
      "Estatify let us launch a branded agency site in a day — listings, leads, and our own domain without hiring a developer.",
    name: "Amina Okonkwo",
    role: "Founder",
    company: "Lagos Living Realty",
    image: "/assets/auth/panel-1.jpg",
    imageAlt: "Modern concrete residential building in daylight",
    rating: 5,
  },
  {
    quote:
      "Our team finally has one place for inventory and enquiries. Clients notice the polish — it feels like a premium brand.",
    name: "Daniel Mwangi",
    role: "Managing Partner",
    company: "Sahel Homes",
    image: "/assets/auth/panel-2.jpg",
    imageAlt: "High-rise city apartment tower against a clear sky",
    rating: 5,
  },
  {
    quote:
      "From template to live site was painless. We stopped juggling builders and spreadsheets — Estatify just works.",
    name: "The Acacia Team",
    role: "Brokerage",
    company: "Acacia Realty",
    image: "/assets/auth/panel-3.jpg",
    imageAlt: "Contemporary home exterior with landscaped garden",
    rating: 5,
  },
] as const satisfies readonly AuthTestimonial[];
