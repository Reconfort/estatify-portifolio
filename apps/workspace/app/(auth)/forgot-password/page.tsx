"use client";

import * as React from "react";
import Link from "next/link";
import { useForgotPassword } from "@estatify/api-client";
import { useZodForm } from "@estatify/hooks";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@estatify/types";
import { AuthForm, Button, Field } from "@estatify/ui";
import { ArrowRightIcon, CheckIcon } from "@estatify/ui/icons";

export default function ForgotPasswordPage() {
  const forgotMut = useForgotPassword();
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const form = useZodForm(forgotPasswordSchema, {
    defaultValues: { email: "" },
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

  if (success) {
    return (
      <AuthForm
        title="Check your inbox"
        description={
          <>
            If an account exists for{" "}
            <span className="font-semibold text-foreground">{form.getValues("email")}</span>, a
            reset link is on its way.
          </>
        }
        footer={
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 font-semibold text-foreground underline-offset-4 hover:underline"
          >
            Return to sign in
            <ArrowRightIcon className="size-4" />
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
      title="Forgot password"
      description="Enter your email and we will send you a secure reset link."
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

        <Field
          control={form.control}
          name="email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          autoComplete="email"
          disabled={forgotMut.isPending}
        />

        <Button type="submit" size="lg" className="w-full" disabled={forgotMut.isPending}>
          {forgotMut.isPending ? "Sending…" : "Send reset link"}
        </Button>
      </form>
    </AuthForm>
  );
}
