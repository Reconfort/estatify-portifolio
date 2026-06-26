/**
 * @estatify/design-system — public API.
 *
 * Tokens, theme engine, and the white-label theming runtime. CSS tokens are
 * exported separately at `@estatify/design-system/styles/tokens.css` and must be
 * imported in each app AFTER `@import "tailwindcss";`.
 *
 * shadcn/ui primitives live in @estatify/ui (which consumes these tokens) so the
 * design-system package stays framework-light and import-safe everywhere.
 */
export * from "./theme";
