"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "@estatify/auth";
import { useLogin } from "@estatify/api-client";
import { useZodForm } from "@estatify/hooks";
import { loginSchema, type LoginInput } from "@estatify/types";
import { AuthForm, Button, Field } from "@estatify/ui";
import { cn } from "@estatify/utils";

const PLATFORM_URL = (process.env.NEXT_PUBLIC_PLATFORM_URL || "http://localhost:3100").replace(
  /\/$/,
  "",
);

export default function SignInPage() {
  const searchParams = useSearchParams();
  const session = useSession();
  const loginMut = useLogin();
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [remember, setRemember] = React.useState(true);

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const form = useZodForm(loginSchema, {
    defaultValues: {
      email: "",
      password: "",
      portal: "workspace",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setErrorMsg(null);
    try {
      const tokens = await loginMut.mutateAsync({ ...data, portal: "workspace" });
      session.setAuth(tokens);
      void remember;
      window.location.assign(callbackUrl.startsWith("/") ? callbackUrl : "/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid email or password.";
      setErrorMsg(message);
    }
  };

  return (
    <AuthForm
      title="Welcome back"
      description="Welcome back! Please enter your details."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-foreground underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </>
      }
    >
      {errorMsg ? (
        <div className="mb-5 rounded-lg border border-destructive/20 bg-destructive/10 px-3.5 py-3 text-caption font-medium text-destructive">
          <p>{errorMsg}</p>
          {errorMsg.toLowerCase().includes("platform") ? (
            <a
              href={`${PLATFORM_URL}/login`}
              className="mt-1 inline-block font-semibold underline-offset-2 hover:underline"
            >
              Go to Platform sign-in
            </a>
          ) : null}
        </div>
      ) : null}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <input type="hidden" {...form.register("portal")} value="workspace" />

        <Field
          control={form.control}
          name="email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          autoComplete="email"
          disabled={loginMut.isPending}
        />

        <Field
          control={form.control}
          name="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          autoComplete="current-password"
          disabled={loginMut.isPending}
        />

        <div className="flex items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2.5 text-body-sm text-foreground">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className={cn(
                "size-4 rounded border-border text-foreground accent-foreground",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              )}
            />
            Remember for 30 days
          </label>
          <Link
            href="/forgot-password"
            className="text-body-sm font-semibold text-foreground underline-offset-4 hover:underline"
          >
            Forgot password
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loginMut.isPending}>
          {loginMut.isPending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthForm>
  );
}
