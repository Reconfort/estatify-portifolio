import { Rubik, Geist_Mono } from "next/font/google";

/**
 * Platform fonts — initialized ONCE here, consumed by every app's root layout.
 * Apps must not call next/font themselves.
 *
 *   import { fontVariables } from "@estatify/design-system/fonts";
 *   <html className={fontVariables}>
 *
 * `--font-rubik` / `--font-geist-mono` are wired into --font-sans / --font-mono
 * in styles/tokens.css.
 */
export const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  display: "swap",
});

export const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/** Combined CSS-variable classes to apply on <html>. */
export const fontVariables = `${rubik.variable} ${mono.variable}`;
