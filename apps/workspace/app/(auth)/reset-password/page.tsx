"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useResetPassword } from "@estatify/api-client";
import { useZodForm } from "@estatify/hooks";
import { resetPasswordSchema, type ResetPasswordInput } from "@estatify/types";
import { Button, Field } from "@estatify/ui";
import { Compass, KeyRound, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const resetMut = useResetPassword();
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const form = useZodForm(resetPasswordSchema, {
    defaultValues: {
      token: token,
      password: "",
    },
  });

  // Re-sync token if searchParams update
  React.useEffect(() => {
    if (token) {
      form.setValue("token", token);
    }
  }, [token, form]);

  const onSubmit = async (data: ResetPasswordInput) => {
    setErrorMsg(null);
    if (!token) {
      setErrorMsg("Missing reset token. Please request a new password reset link.");
      return;
    }
    try {
      await resetMut.mutateAsync(data);
      setSuccess(true);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Failed to reset password. The link may have expired or is invalid.",
      );
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-brand-500/5 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-lime-400/5 blur-3xl"></div>

      <div className="w-full max-w-md space-y-8 z-10">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-brand-600 to-lime-400 shadow-md">
            <Compass className="h-6 w-6 text-neutral-950 font-bold" />
          </div>
          <h1 className="text-h1 font-bold tracking-tight text-foreground">Set New Password</h1>
          <p className="text-body-sm text-muted-foreground">
            Choose a strong, secure new password for your account.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 shadow-md relative backdrop-blur-md">
          {!token && (
            <div className="space-y-4 text-center py-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="text-h4 font-bold text-foreground">Missing Token</h3>
              <p className="text-body-sm text-muted-foreground">
                No password reset token was detected in the URL. Please click the link in your email
                or request a new one.
              </p>
              <div className="pt-2">
                <Link href="/forgot-password">
                  <Button variant="outline" className="w-full h-11">
                    Request Reset Link
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {token && success && (
            <div className="space-y-5 text-center py-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-h4 font-bold text-foreground">Password updated</h3>
                <p className="text-body-sm text-muted-foreground">
                  Your password has been successfully updated. All other active sessions have been
                  logged out.
                </p>
              </div>
              <div className="pt-4">
                <Link href="/sign-in">
                  <Button className="w-full h-11">Sign In</Button>
                </Link>
              </div>
            </div>
          )}

          {token && !success && (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {errorMsg && (
                <div className="flex items-start gap-2.5 rounded-lg bg-destructive/10 border border-destructive/20 p-3.5 text-caption font-medium text-destructive">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Hidden token field for form validation */}
              <input type="hidden" {...form.register("token")} />

              <Field
                control={form.control}
                name="password"
                type="password"
                label="New Password"
                placeholder="••••••••••••"
                disabled={resetMut.isPending}
                hint="Password must be between 12 and 128 characters."
              />

              <Button
                type="submit"
                className="w-full h-11 flex items-center justify-center gap-2 mt-2"
                disabled={resetMut.isPending}
              >
                {resetMut.isPending ? (
                  <span>Resetting...</span>
                ) : (
                  <>
                    <KeyRound className="h-4.5 w-4.5" />
                    <span>Update Password</span>
                  </>
                )}
              </Button>

              <div className="text-center pt-2">
                <Link
                  href="/sign-in"
                  className="inline-flex items-center gap-2 text-body-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
