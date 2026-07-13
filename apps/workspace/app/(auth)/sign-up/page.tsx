"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@estatify/auth";
import { useRegister } from "@estatify/api-client";
import { useZodForm } from "@estatify/hooks";
import { registerSchema, type RegisterInput } from "@estatify/types";
import { Button, Field } from "@estatify/ui";
import { Compass, AlertCircle, Sparkles } from "lucide-react";
import { VisitEstatifyLink } from "../../../components/visit-estatify-link";

export default function SignUpPage() {
  const router = useRouter();
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
      router.push("/");
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
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-brand-500/5 blur-3xl" />
      <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-lime-400/5 blur-3xl" />

      <div className="z-10 w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-brand-600 to-lime-400 shadow-md">
            <Compass className="h-6 w-6 font-bold text-neutral-950" />
          </div>
          <h1 className="text-h1 font-bold tracking-tight text-foreground">
            Create your Workspace
          </h1>
          <p className="text-body-sm text-muted-foreground">
            Start free. Set up your agency, invite your team, launch your site.
          </p>
        </div>

        <div className="relative rounded-xl border border-border bg-card p-8 shadow-md backdrop-blur-md">
          {errorMsg && (
            <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3.5 text-caption font-medium text-destructive">
              <AlertCircle className="mt-0.5 h-4.5 w-4.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Field
              control={form.control}
              name="agencyName"
              type="text"
              label="Agency Name"
              placeholder="Acme Realty"
              disabled={registerMut.isPending}
            />

            <div className="space-y-1">
              <Field
                control={form.control}
                name="slug"
                type="text"
                label="Workspace URL"
                placeholder="acme"
                disabled={registerMut.isPending}
              />
              {showSlugPreview && (
                <p className="text-caption text-muted-foreground">
                  Your site will be at{" "}
                  <span className="font-medium text-foreground">{slug}.estatify.africa</span>
                </p>
              )}
            </div>

            <Field
              control={form.control}
              name="email"
              type="email"
              label="Work Email"
              placeholder="you@agency.com"
              disabled={registerMut.isPending}
            />

            <Field
              control={form.control}
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••••••"
              disabled={registerMut.isPending}
            />

            <Button
              type="submit"
              className="mt-4 flex h-11 w-full items-center justify-center gap-2"
              disabled={registerMut.isPending}
            >
              {registerMut.isPending ? (
                <span>Setting up...</span>
              ) : (
                <>
                  <Sparkles className="h-4.5 w-4.5" />
                  <span>Create Workspace</span>
                </>
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-body-sm text-muted-foreground">
          Already have an agency workspace?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-brand-600 hover:underline dark:text-brand-400"
          >
            Sign in here
          </Link>
        </p>

        <p className="text-center">
          <VisitEstatifyLink variant="home" />
        </p>
      </div>
    </div>
  );
}
