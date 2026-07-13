"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyEmail, useResendVerification } from "@estatify/api-client";
import { useZodForm } from "@estatify/hooks";
import { resendVerificationSchema, type ResendVerificationInput } from "@estatify/types";
import { Button, Field } from "@estatify/ui";
import { Compass, ShieldCheck, ShieldAlert, Mail, ArrowRight, Loader2 } from "lucide-react";

type VerifyStatus = "idle" | "verifying" | "success" | "error";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const verifyMut = useVerifyEmail();
  const resendMut = useResendVerification();

  // If a token is present, start in "verifying" — avoid setState inside the effect body.
  const [verifyStatus, setVerifyStatus] = React.useState<VerifyStatus>(() =>
    token ? "verifying" : "idle",
  );
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = React.useState(false);
  const verifyStartedRef = React.useRef(false);

  const resendForm = useZodForm(resendVerificationSchema, {
    defaultValues: { email: "" },
  });

  React.useEffect(() => {
    if (!token || verifyStartedRef.current) return;
    verifyStartedRef.current = true;

    verifyMut.mutate(token, {
      onSuccess: () => {
        setVerifyStatus("success");
      },
      onError: (err: unknown) => {
        setVerifyStatus("error");
        setErrorMsg(
          err instanceof Error ? err.message : "The verification link is invalid or has expired.",
        );
      },
    });
    // Intentionally only re-run when the token changes; mutate identity is unstable.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot verify per token
  }, [token]);

  const handleResend = async (data: ResendVerificationInput) => {
    setErrorMsg(null);
    setResendSuccess(false);
    try {
      await resendMut.mutateAsync(data.email);
      setResendSuccess(true);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to resend verification email.");
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
          <h1 className="text-h1 font-bold tracking-tight text-foreground">Verify Email</h1>
          <p className="text-body-sm text-muted-foreground">
            Confirm your email address to activate all workspace operations.
          </p>
        </div>

        <div className="relative rounded-xl border border-border bg-card p-8 shadow-md backdrop-blur-md">
          {token ? (
            <div className="space-y-6 py-4 text-center">
              {verifyStatus === "verifying" && (
                <div className="space-y-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                    <Loader2 className="h-6 w-6 animate-spin text-brand-600 dark:text-brand-400" />
                  </div>
                  <h3 className="text-h4 font-bold text-foreground">Verifying email...</h3>
                  <p className="text-body-sm text-muted-foreground">
                    Please wait while we confirm your verification token.
                  </p>
                </div>
              )}

              {verifyStatus === "success" && (
                <div className="space-y-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-h4 font-bold text-foreground">Email Verified!</h3>
                    <p className="text-body-sm text-muted-foreground">
                      Your owner account is now fully active. You can now access your SaaS
                      dashboard.
                    </p>
                  </div>
                  <div className="pt-4">
                    <Link href="/dashboard">
                      <Button className="flex h-11 w-full items-center justify-center gap-2">
                        <span>Go to Dashboard</span>
                        <ArrowRight className="h-4.5 w-4.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {verifyStatus === "error" && (
                <div className="space-y-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                    <ShieldAlert className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-h4 font-bold text-foreground">Verification Failed</h3>
                    <p className="text-body-sm text-muted-foreground">{errorMsg}</p>
                  </div>
                  <div className="pt-4">
                    <Button
                      variant="outline"
                      className="h-11 w-full"
                      onClick={() => router.push("/verify-email")}
                    >
                      Resend Verification Link
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              {resendSuccess && (
                <div className="flex items-start gap-2.5 rounded-lg border border-brand-500/20 bg-brand-500/10 p-3.5 text-caption font-medium text-brand-700 dark:text-brand-400">
                  <Mail className="mt-0.5 h-4.5 w-4.5 shrink-0" />
                  <span>A new verification link has been sent to your email.</span>
                </div>
              )}

              {errorMsg && (
                <div className="flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3.5 text-caption font-medium text-destructive">
                  <ShieldAlert className="mt-0.5 h-4.5 w-4.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <p className="text-body-sm text-muted-foreground">
                Enter your email below, and we&apos;ll send you a fresh verification link.
              </p>

              <form onSubmit={resendForm.handleSubmit(handleResend)} className="space-y-4">
                <Field
                  control={resendForm.control}
                  name="email"
                  type="email"
                  label="Email Address"
                  placeholder="you@agency.com"
                  disabled={resendMut.isPending}
                />

                <Button
                  type="submit"
                  className="mt-2 flex h-11 w-full items-center justify-center"
                  disabled={resendMut.isPending}
                >
                  {resendMut.isPending ? "Sending link..." : "Send Verification Link"}
                </Button>
              </form>

              <div className="pt-2 text-center">
                <Link
                  href="/sign-in"
                  className="text-body-sm font-semibold text-brand-600 hover:underline dark:text-brand-400"
                >
                  Return to sign in
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
