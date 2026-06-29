import type { Metadata } from "next";
import { fontVariables } from "@estatify/design-system/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Estatify",
  description:
    "Launch branded property websites, manage listings, and grow your real estate business across Africa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // Add `dark` here (or toggle at runtime) to enable dark mode.
      className={`${fontVariables} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
