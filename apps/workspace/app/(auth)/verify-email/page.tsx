"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@estatify/auth";
import { useVerifyEmail, useResendVerification } from "@estatify/api-client";
import { useZodForm } from "@estatify/hooks";
import { resendVerificationSchema, type ResendVerificationInput } from "@estatify/types";
import { AuthForm, Button, Field } from "@estatify/ui";
import { LoaderIcon } from "@estatify/ui/icons";

type VerifyStatus = "idle" | "verifying" | "success" | "error";

export default function VerifyEmailPage() {
  const router = useRouter();
  const session = useSession();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const verifyMut = useVerifyEmail();
  const resendMut = useResendVerification();

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
      onSuccess: async () => {
        setVerifyStatus("success");
        await session.reload();
        router.replace("/onboarding");
      },
      onError: (err: unknown) => {
        setVerifyStatus("error");
        setErrorMsg(
          err instanceof Error ? err.message : "The verification link is invalid or has expired.",
        );
      },
    });
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

  if (token && verifyStatus === "verifying") {
    return (
      <AuthForm title="Verifying email" description="Please wait while we confirm your link.">
        <LoaderIcon className="size-8 animate-spin text-muted-foreground" />
      </AuthForm>
    );
  }

  if (token && verifyStatus === "success") {
    return (
      <AuthForm title="Email verified" description="Redirecting to workspace setup…">
        <LoaderIcon className="size-8 animate-spin text-muted-foreground" />
      </AuthForm>
    );
  }

  if (token && verifyStatus === "error") {
    return (
      <AuthForm
        title="Verification failed"
        description={errorMsg ?? "This link is invalid or has expired."}
        footer={
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => router.push("/verify-email")}
          >
            Resend verification link
          </Button>
        }
      >
        <div />
      </AuthForm>
    );
  }

  return (
    <AuthForm
      title="Verify email"
      description="Enter your email and we’ll send a fresh verification link."
      footer={
        <Link
          href="/sign-in"
          className="font-semibold text-foreground underline-offset-4 hover:underline"
        >
          Return to sign in
        </Link>
      }
    >
      {resendSuccess ? (
        <div className="mb-5 rounded-lg border border-lime-500/25 bg-lime-500/10 px-3.5 py-3 text-caption font-medium text-lime-800">
          A new verification link has been sent to your email.
        </div>
      ) : null}

      {errorMsg ? (
        <div className="mb-5 rounded-lg border border-destructive/20 bg-destructive/10 px-3.5 py-3 text-caption font-medium text-destructive">
          {errorMsg}
        </div>
      ) : null}

      <form onSubmit={resendForm.handleSubmit(handleResend)} className="space-y-5">
        <Field
          control={resendForm.control}
          name="email"
          type="email"
          label="Email"
          placeholder="you@agency.com"
          autoComplete="email"
          disabled={resendMut.isPending}
        />

        <Button type="submit" size="lg" className="w-full" disabled={resendMut.isPending}>
          {resendMut.isPending ? "Sending…" : "Send verification link"}
        </Button>
      </form>
    </AuthForm>
  );
}
