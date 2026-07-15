import type { SiteProperty } from "@estatify/website-sections";

export const mockProperties: SiteProperty[] = [
  {
    id: "1",
    title: "Modern Villa with Pool",
    location: "Kigali, Rwanda",
    price: "$450,000",
    imageUrl:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
    featured: true,
  },
  {
    id: "2",
    title: "Downtown Luxury Apartment",
    location: "Nairobi, Kenya",
    price: "$280,000",
    imageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    featured: true,
  },
  {
    id: "3",
    title: "Lakeview Family Home",
    location: "Kampala, Uganda",
    price: "$320,000",
    imageUrl:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
    featured: true,
  },
  {
    id: "4",
    title: "Garden Estate",
    location: "Kigali, Rwanda",
    price: "$510,000",
    imageUrl:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    featured: false,
  },
  {
    id: "5",
    title: "Penthouse Suite",
    location: "Dar es Salaam, Tanzania",
    price: "$390,000",
    imageUrl:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    featured: true,
  },
  {
    id: "6",
    title: "Suburban Townhouse",
    location: "Kigali, Rwanda",
    price: "$195,000",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    featured: false,
  },
];

export function resolveProperties(source: string, limit: number): SiteProperty[] {
  let list = [...mockProperties];
  if (source === "featured") list = list.filter((p) => p.featured);
  if (source === "luxury")
    list = list.filter((p) => p.price.includes("450") || p.price.includes("510"));
  return list.slice(0, limit);
}
