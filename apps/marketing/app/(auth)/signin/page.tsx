import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Sign in — Estatify",
  description: "Sign in to manage your templates, dashboard, and profile.",
};

export default function SignInPage() {
  return <AuthForm mode="signin" />;
}
