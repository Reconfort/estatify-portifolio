"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "@estatify/auth";
import { useLogin } from "@estatify/api-client";
import { useZodForm } from "@estatify/hooks";
import { loginSchema, type LoginInput } from "@estatify/types";
import { Button, Field } from "@estatify/ui";
import { Compass, AlertCircle, ShieldAlert } from "lucide-react";

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
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-brand-500/5 blur-3xl" />
      <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-lime-400/5 blur-3xl" />

      <div className="z-10 w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-neutral-700 to-neutral-500 shadow-md">
            <Compass className="h-6 w-6 text-neutral-100" />
          </div>
          <h1 className="text-h1 font-bold tracking-tight text-foreground">Platform Sign In</h1>
          <p className="text-body-sm text-muted-foreground">
            Estatify staff only. Agency owners sign in on Workspace.
          </p>
        </div>

        <div className="relative rounded-xl border border-border bg-card p-8 shadow-md backdrop-blur-md">
          {errorMsg && (
            <div className="mb-6 flex flex-col gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3.5 text-caption font-medium text-destructive">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="mt-0.5 h-4.5 w-4.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
              {errorMsg.toLowerCase().includes("workspace") && (
                <a
                  href={`${WORKSPACE_URL}/sign-in`}
                  className="pl-7 font-semibold underline-offset-2 hover:underline"
                >
                  Go to Workspace sign-in
                </a>
              )}
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <input type="hidden" {...form.register("portal")} value="platform" />
            <Field
              control={form.control}
              name="email"
              type="email"
              label="Staff Email"
              placeholder="you@estatify.com"
              disabled={loginMut.isPending}
            />

            <Field
              control={form.control}
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••••••"
              disabled={loginMut.isPending}
            />

            <Button
              type="submit"
              className="mt-2 flex h-11 w-full items-center justify-center gap-2"
              disabled={loginMut.isPending}
            >
              {loginMut.isPending ? "Signing in..." : "Sign In to Platform"}
            </Button>
          </form>

          <p className="mt-6 flex items-center justify-center gap-2 text-center text-caption text-muted-foreground">
            <ShieldAlert className="h-3.5 w-3.5" />
            Restricted to Estatify employees
          </p>
        </div>
      </div>
    </div>
  );
}
