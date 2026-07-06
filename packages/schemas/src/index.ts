/**
 * @estatify/schemas — the single home for Zod validation schemas.
 *
 * Rules: field primitives live in fields.ts and are composed into form
 * schemas (auth.ts, enquiry.ts, …). Apps import schemas from here and pair
 * them with `useZodForm` (@estatify/hooks) + `<Field />` (@estatify/ui).
 * The same schemas are reused server-side (apps/api DTO validation), so
 * client and server never disagree about what "valid" means.
 *
 * Tags: scope:shared, type:util
 */
export * from "./fields";
export * from "./auth";
export * from "./enquiry";
