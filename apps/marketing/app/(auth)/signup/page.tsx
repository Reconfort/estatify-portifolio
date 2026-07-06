import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Create your account — Estatify",
  description:
    "Create your Estatify account to claim templates, preview your dashboard, and manage your profile.",
};

export default function SignUpPage() {
  return <AuthForm mode="signup" />;
}
