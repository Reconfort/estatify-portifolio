import type { Metadata } from "next";
import { fontVariables } from "@estatify/design-system/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Estatify — Workspace",
  description: "Customer SaaS: properties, leads, agents, branding, analytics, billing.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
