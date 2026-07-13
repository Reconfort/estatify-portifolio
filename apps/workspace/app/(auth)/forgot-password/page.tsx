"use client";

import * as React from "react";
import Link from "next/link";
import { useForgotPassword } from "@estatify/api-client";
import { useZodForm } from "@estatify/hooks";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@estatify/types";
import { Button, Field } from "@estatify/ui";
import { Compass, MailCheck, AlertCircle, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const forgotMut = useForgotPassword();
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const form = useZodForm(forgotPasswordSchema, {
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setErrorMsg(null);
    try {
      await forgotMut.mutateAsync(data);
      setSuccess(true);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
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
          <h1 className="text-h1 font-bold tracking-tight text-foreground">Reset Password</h1>
          <p className="text-body-sm text-muted-foreground">
            We will email you a secure link to reset your account password.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 shadow-md relative backdrop-blur-md">
          {success ? (
            <div className="space-y-5 text-center py-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
                <MailCheck className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-h4 font-bold text-foreground">Check your inbox</h3>
                <p className="text-body-sm text-muted-foreground">
                  If an account exists for{" "}
                  <span className="text-foreground font-semibold">{form.getValues("email")}</span>,
                  a reset link is on its way.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/sign-in"
                  className="inline-flex items-center gap-2 text-body-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Return to sign in
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {errorMsg && (
                <div className="flex items-start gap-2.5 rounded-lg bg-destructive/10 border border-destructive/20 p-3.5 text-caption font-medium text-destructive">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <Field
                control={form.control}
                name="email"
                type="email"
                label="Email Address"
                placeholder="you@agency.com"
                disabled={forgotMut.isPending}
              />

              <Button
                type="submit"
                className="w-full h-11 flex items-center justify-center mt-2"
                disabled={forgotMut.isPending}
              >
                {forgotMut.isPending ? "Sending link..." : "Send Reset Link"}
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
