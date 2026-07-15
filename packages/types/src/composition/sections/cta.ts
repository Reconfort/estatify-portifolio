import { z } from "zod";
import { optionalStringSchema } from "../../configuration/common";

export const ctaSectionConfigSchema = z.object({
  title: z.string().trim().min(1).max(120),
  subtitle: optionalStringSchema(240),
  buttonText: z.string().trim().min(1).max(80),
  buttonHref: z.string().trim().min(1).max(2048),
});

export type CtaSectionConfig = z.infer<typeof ctaSectionConfigSchema>;

export const defaultCtaSectionConfig: CtaSectionConfig = {
  title: "Ready to find your next home?",
  subtitle: "Speak with our agents today",
  buttonText: "Contact us",
  buttonHref: "/contact",
};
