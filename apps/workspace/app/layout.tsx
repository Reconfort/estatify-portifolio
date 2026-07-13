import type { Metadata } from "next";
import { headers } from "next/headers";
import { Rubik, Geist_Mono } from "next/font/google";
import type { AuthUser } from "@estatify/types";
import { Providers } from "./providers";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const fontVariables = `${rubik.variable} ${mono.variable}`;

export const metadata: Metadata = {
  title: "Estatify — Workspace",
  description: "Customer SaaS: properties, leads, agents, branding, analytics, billing.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const headersList = await headers();
  const authorization = headersList.get("authorization");
  const userJson = headersList.get("x-user");

  let initialUser: AuthUser | null = null;
  let initialAccessToken: string | null = null;

  if (userJson) {
    try {
      initialUser = JSON.parse(userJson) as AuthUser;
    } catch (e) {
      console.error("Failed to parse initial user from header", e);
    }
  }

  if (authorization?.startsWith("Bearer ")) {
    initialAccessToken = authorization.substring(7);
  }

  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers initialUser={initialUser} initialAccessToken={initialAccessToken}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
