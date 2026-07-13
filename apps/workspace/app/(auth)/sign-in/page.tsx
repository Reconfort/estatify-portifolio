"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@estatify/auth";
import { useLogin } from "@estatify/api-client";
import { useZodForm } from "@estatify/hooks";
import { loginSchema, type LoginInput } from "@estatify/types";
import { Button, Field } from "@estatify/ui";
import { Compass, AlertCircle, KeyRound } from "lucide-react";
import { VisitEstatifyLink } from "../../../components/visit-estatify-link";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session = useSession();
  const loginMut = useLogin();
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const form = useZodForm(loginSchema, {
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setErrorMsg(null);
    try {
      const tokens = await loginMut.mutateAsync(data);
      session.setAuth(tokens);
      router.push(callbackUrl);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid email or password.";
      setErrorMsg(message);
    }
  };

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-brand-500/5 blur-3xl" />
      <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-lime-400/5 blur-3xl" />

      <div className="z-10 w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-brand-600 to-lime-400 shadow-md">
            <Compass className="h-6 w-6 font-bold text-neutral-950" />
          </div>
          <h1 className="text-h1 font-bold tracking-tight text-foreground">Sign in to Workspace</h1>
          <p className="text-body-sm text-muted-foreground">
            Welcome back! Manage your real estate listings and team.
          </p>
        </div>

        <div className="relative rounded-xl border border-border bg-card p-8 shadow-md backdrop-blur-md">
          {errorMsg && (
            <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3.5 text-caption font-medium text-destructive">
              <AlertCircle className="mt-0.5 h-4.5 w-4.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <Field
              control={form.control}
              name="email"
              type="email"
              label="Email Address"
              placeholder="you@agency.com"
              disabled={loginMut.isPending}
            />

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-label text-foreground">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-caption font-semibold text-brand-600 hover:underline dark:text-brand-400"
                >
                  Forgot password?
                </Link>
              </div>
              <Field
                control={form.control}
                name="password"
                type="password"
                label=""
                placeholder="••••••••••••"
                disabled={loginMut.isPending}
              />
            </div>

            <Button
              type="submit"
              className="mt-2 flex h-11 w-full items-center justify-center gap-2"
              disabled={loginMut.isPending}
            >
              {loginMut.isPending ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <KeyRound className="h-4.5 w-4.5" />
                  <span>Sign In</span>
                </>
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-body-sm text-muted-foreground">
          Don&apos;t have an agency workspace yet?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-brand-600 hover:underline dark:text-brand-400"
          >
            Create an account
          </Link>
        </p>

        <p className="text-center">
          <VisitEstatifyLink variant="home" />
        </p>
      </div>
    </div>
  );
}
