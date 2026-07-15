import { z } from "zod";
import {
  optionalEmailSchema,
  optionalPhoneSchema,
  optionalStringSchema,
  optionalUrlSchema,
} from "./common";

const dayHoursSchema = z.object({
  open: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM format"),
  close: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM format"),
});

const businessDaySchema = z.discriminatedUnion("closed", [
  z.object({ closed: z.literal(true) }),
  z.object({ closed: z.literal(false), hours: dayHoursSchema }),
]);

const weekDays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export const businessHoursSchema = z.object({
  monday: businessDaySchema,
  tuesday: businessDaySchema,
  wednesday: businessDaySchema,
  thursday: businessDaySchema,
  friday: businessDaySchema,
  saturday: businessDaySchema,
  sunday: businessDaySchema,
});

export const agencyProfileSchema = z.object({
  basic: z.object({
    companyName: z.string().trim().min(1, "Company name is required").max(120),
    companyDescription: optionalStringSchema(2000),
    registrationNumber: optionalStringSchema(64),
    yearFounded: z.coerce.number().int().min(1800).max(2100).optional(),
  }),
  contact: z.object({
    primaryEmail: z
      .string()
      .trim()
      .max(254)
      .refine((v) => v === "" || z.string().email().safeParse(v).success, "Invalid email"),
    secondaryEmail: optionalEmailSchema,
    primaryPhone: optionalPhoneSchema,
    secondaryPhone: optionalPhoneSchema,
    whatsApp: optionalPhoneSchema,
  }),
  address: z.object({
    country: optionalStringSchema(80),
    province: optionalStringSchema(80),
    district: optionalStringSchema(80),
    city: optionalStringSchema(80),
    street: optionalStringSchema(200),
    postalCode: optionalStringSchema(20),
  }),
  maps: z.object({
    googleMapsUrl: optionalUrlSchema,
    latitude: z.coerce.number().min(-90).max(90).optional(),
    longitude: z.coerce.number().min(-180).max(180).optional(),
  }),
  social: z.object({
    facebook: optionalUrlSchema,
    instagram: optionalUrlSchema,
    linkedin: optionalUrlSchema,
    x: optionalUrlSchema,
    tiktok: optionalUrlSchema,
    youtube: optionalUrlSchema,
  }),
  businessHours: businessHoursSchema,
});

export type AgencyProfile = z.infer<typeof agencyProfileSchema>;
export type BusinessHours = z.infer<typeof businessHoursSchema>;

export const updateAgencyProfileSchema = agencyProfileSchema.deepPartial();
export type UpdateAgencyProfileInput = z.infer<typeof updateAgencyProfileSchema>;

export const defaultBusinessDayClosed = { closed: true as const };
export const defaultBusinessDayOpen = {
  closed: false as const,
  hours: { open: "08:00", close: "18:00" },
};

export const defaultAgencyProfile: AgencyProfile = {
  basic: {
    companyName: "",
    companyDescription: undefined,
    registrationNumber: undefined,
    yearFounded: undefined,
  },
  contact: {
    primaryEmail: "",
    secondaryEmail: undefined,
    primaryPhone: undefined,
    secondaryPhone: undefined,
    whatsApp: undefined,
  },
  address: {
    country: undefined,
    province: undefined,
    district: undefined,
    city: undefined,
    street: undefined,
    postalCode: undefined,
  },
  maps: {
    googleMapsUrl: undefined,
    latitude: undefined,
    longitude: undefined,
  },
  social: {
    facebook: undefined,
    instagram: undefined,
    linkedin: undefined,
    x: undefined,
    tiktok: undefined,
    youtube: undefined,
  },
  businessHours: {
    monday: defaultBusinessDayOpen,
    tuesday: defaultBusinessDayOpen,
    wednesday: defaultBusinessDayOpen,
    thursday: defaultBusinessDayOpen,
    friday: defaultBusinessDayOpen,
    saturday: defaultBusinessDayOpen,
    sunday: defaultBusinessDayClosed,
  },
};

export { weekDays };
