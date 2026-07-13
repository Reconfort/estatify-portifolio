"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useResetPassword } from "@estatify/api-client";
import { useZodForm } from "@estatify/hooks";
import { resetPasswordSchema, type ResetPasswordInput } from "@estatify/types";
import { AuthForm, Button, Field } from "@estatify/ui";
import { CheckIcon } from "@estatify/ui/icons";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const resetMut = useResetPassword();
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const form = useZodForm(resetPasswordSchema, {
    defaultValues: {
      token,
      password: "",
    },
  });

  React.useEffect(() => {
    if (token) form.setValue("token", token);
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

  if (!token) {
    return (
      <AuthForm
        title="Missing token"
        description="No password reset token was found. Request a new link from the forgot password page."
        footer={
          <Link
            href="/forgot-password"
            className="font-semibold text-foreground underline-offset-4 hover:underline"
          >
            Request reset link
          </Link>
        }
      >
        <div />
      </AuthForm>
    );
  }

  if (success) {
    return (
      <AuthForm
        title="Password updated"
        description="Your password has been updated. Other sessions have been signed out."
        footer={
          <Link href="/sign-in">
            <Button size="lg" className="w-full">
              Sign in
            </Button>
          </Link>
        }
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-lime-500/15 text-lime-700">
          <CheckIcon className="size-6" strokeWidth={2.5} />
        </div>
      </AuthForm>
    );
  }

  return (
    <AuthForm
      title="Set new password"
      description="Choose a strong password for your account."
      footer={
        <Link
          href="/sign-in"
          className="font-semibold text-foreground underline-offset-4 hover:underline"
        >
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {errorMsg ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3.5 py-3 text-caption font-medium text-destructive">
            {errorMsg}
          </div>
        ) : null}

        <input type="hidden" {...form.register("token")} />

        <Field
          control={form.control}
          name="password"
          type="password"
          label="New password"
          placeholder="••••••••"
          autoComplete="new-password"
          disabled={resetMut.isPending}
          hint="Between 12 and 128 characters."
        />

        <Button type="submit" size="lg" className="w-full" disabled={resetMut.isPending}>
          {resetMut.isPending ? "Updating…" : "Update password"}
        </Button>
      </form>
    </AuthForm>
  );
}
