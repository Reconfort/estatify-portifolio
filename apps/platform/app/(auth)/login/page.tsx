"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "@estatify/auth";
import { useLogin } from "@estatify/api-client";
import { useZodForm } from "@estatify/hooks";
import { loginSchema, type LoginInput } from "@estatify/types";
import { AuthForm, Button, Field } from "@estatify/ui";

const WORKSPACE_URL = (process.env.NEXT_PUBLIC_WORKSPACE_URL || "http://localhost:3000").replace(
  /\/$/,
  "",
);

export default function PlatformLoginPage() {
  const searchParams = useSearchParams();
  const session = useSession();
  const loginMut = useLogin();
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const form = useZodForm(loginSchema, {
    defaultValues: {
      email: "",
      password: "",
      portal: "platform",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setErrorMsg(null);
    try {
      const tokens = await loginMut.mutateAsync({ ...data, portal: "platform" });
      session.setAuth(tokens);
      window.location.assign(callbackUrl.startsWith("/") ? callbackUrl : "/dashboard");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Invalid credentials.");
    }
  };

  return (
    <AuthForm
      title="Welcome back"
      description="Staff sign-in for the Estatify platform. Agency owners use Workspace."
      footer={
        <>
          Agency owner?{" "}
          <a
            href={`${WORKSPACE_URL}/sign-in`}
            className="font-semibold text-foreground underline-offset-4 hover:underline"
          >
            Sign in to Workspace
          </a>
        </>
      }
    >
      {errorMsg ? (
        <div className="mb-5 rounded-lg border border-destructive/20 bg-destructive/10 px-3.5 py-3 text-caption font-medium text-destructive">
          <p>{errorMsg}</p>
          {errorMsg.toLowerCase().includes("workspace") ? (
            <a
              href={`${WORKSPACE_URL}/sign-in`}
              className="mt-1 inline-block font-semibold underline-offset-2 hover:underline"
            >
              Go to Workspace sign-in
            </a>
          ) : null}
        </div>
      ) : null}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <input type="hidden" {...form.register("portal")} value="platform" />

        <Field
          control={form.control}
          name="email"
          type="email"
          label="Staff email"
          placeholder="you@estatify.com"
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

        <Button type="submit" size="lg" className="w-full" disabled={loginMut.isPending}>
          {loginMut.isPending ? "Signing in…" : "Sign in"}
        </Button>

        <p className="text-center text-caption text-muted-foreground">
          Restricted to Estatify employees
        </p>
      </form>
    </AuthForm>
  );
}
