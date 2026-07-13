"use client";

import * as React from "react";
import Link from "next/link";
import { useSession } from "@estatify/auth";
import { useRegister } from "@estatify/api-client";
import { useZodForm } from "@estatify/hooks";
import { registerSchema, type RegisterInput } from "@estatify/types";
import { AuthForm, Button, Field } from "@estatify/ui";

export default function SignUpPage() {
  const session = useSession();
  const registerMut = useRegister();
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const form = useZodForm(registerSchema, {
    defaultValues: {
      email: "",
      password: "",
      agencyName: "",
      slug: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setErrorMsg(null);
    try {
      const tokens = await registerMut.mutateAsync(data);
      session.setAuth(tokens);
      window.location.assign("/dashboard");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Registration failed. Subdomain or email might already be taken.";
      setErrorMsg(message);
    }
  };

  const slug = form.watch("slug");
  const showSlugPreview = slug && slug.length >= 3;

  return (
    <AuthForm
      title="Create your workspace"
      description="Start free. Set up your agency, invite your team, launch your site."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      {errorMsg ? (
        <div className="mb-5 rounded-lg border border-destructive/20 bg-destructive/10 px-3.5 py-3 text-caption font-medium text-destructive">
          {errorMsg}
        </div>
      ) : null}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Field
          control={form.control}
          name="agencyName"
          type="text"
          label="Agency name"
          placeholder="Acme Realty"
          disabled={registerMut.isPending}
        />

        <div className="space-y-1.5">
          <Field
            control={form.control}
            name="slug"
            type="text"
            label="Workspace URL"
            placeholder="acme"
            disabled={registerMut.isPending}
          />
          {showSlugPreview ? (
            <p className="text-caption text-muted-foreground">
              Your site will be at{" "}
              <span className="font-medium text-foreground">{slug}.estatify.africa</span>
            </p>
          ) : null}
        </div>

        <Field
          control={form.control}
          name="email"
          type="email"
          label="Work email"
          placeholder="you@agency.com"
          autoComplete="email"
          disabled={registerMut.isPending}
        />

        <Field
          control={form.control}
          name="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          autoComplete="new-password"
          disabled={registerMut.isPending}
        />

        <Button type="submit" size="lg" className="mt-2 w-full" disabled={registerMut.isPending}>
          {registerMut.isPending ? "Setting up…" : "Get started"}
        </Button>
      </form>
    </AuthForm>
  );
}
