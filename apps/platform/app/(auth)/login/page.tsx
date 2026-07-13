"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@estatify/auth";
import { useLogin } from "@estatify/api-client";
import { useZodForm } from "@estatify/hooks";
import { loginSchema, type LoginInput } from "@estatify/types";
import { Button, Field } from "@estatify/ui";
import { Compass, AlertCircle, ShieldAlert } from "lucide-react";

export default function PlatformLoginPage() {
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

      if (!tokens.user.isPlatformStaff) {
        setErrorMsg("Access Denied: This portal is strictly for Estatify platform staff members.");
        return;
      }

      session.setAuth(tokens);
      router.push(callbackUrl);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Invalid credentials.");
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      {/* Platform premium design features a dark steel/gray theme with brand secondary */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-brand-500/5 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-lime-400/5 blur-3xl"></div>

      <div className="w-full max-w-md space-y-8 z-10">
        {/* Title */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-brand-700 to-lime-500 shadow-md">
            <Compass className="h-6 w-6 text-neutral-950 font-bold" />
          </div>
          <h1 className="text-h1 font-bold tracking-tight text-foreground flex items-center gap-2">
            Estatify Staff Portal
          </h1>
          <p className="text-body-sm text-muted-foreground">
            Platform operating system for support, billing, and system operations.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-xl border border-border bg-card p-8 shadow-md relative backdrop-blur-md">
          {errorMsg && (
            <div className="mb-6 flex items-start gap-2.5 rounded-lg bg-destructive/10 border border-destructive/20 p-3.5 text-caption font-medium text-destructive">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <Field
              control={form.control}
              name="email"
              type="email"
              label="Staff Email"
              placeholder="name@estatify.com"
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
              className="w-full h-11 flex items-center justify-center gap-2 mt-2"
              disabled={loginMut.isPending}
            >
              {loginMut.isPending ? "Authenticating..." : "Staff Authentication"}
            </Button>
          </form>
        </div>

        {/* Safe notice warning */}
        <div className="flex items-center gap-2 text-caption text-muted-foreground justify-center">
          <ShieldAlert className="h-4 w-4" />
          <span>Internal authorized use only. Actions are logged.</span>
        </div>
      </div>
    </div>
  );
}
