"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Field } from "@estatify/ui";
import { ArrowRightIcon, CheckIcon } from "@estatify/ui/icons";
import { useZodForm } from "@estatify/hooks";
import {
  signInSchema,
  signUpSchema,
  type SignInInput,
  type SignUpInput,
} from "@estatify/schemas";

const ease = [0.23, 1, 0.32, 1] as const;

export type AuthMode = "signin" | "signup";

const COPY = {
  signin: {
    title: "Welcome back",
    subtitle: "Sign in to manage your templates, dashboard, and profile.",
    submit: "Sign in",
    switchPrompt: "New to Estatify?",
    switchLabel: "Create an account",
    switchHref: "/signup",
  },
  signup: {
    title: "Create your account",
    subtitle: "Claim templates, preview your dashboard, and manage your profile — all from one place.",
    submit: "Create account",
    switchPrompt: "Already have an account?",
    switchLabel: "Sign in",
    switchHref: "/signin",
  },
} as const;

function SubmitButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="group mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-body-sm font-semibold text-primary-foreground transition-[background-color,transform] duration-150 ease-out hover:bg-primary-hover active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {label}
      <ArrowRightIcon
        className="h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5"
        aria-hidden
      />
    </button>
  );
}

function SuccessNotice() {
  return (
    <div
      role="status"
      className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-8 text-center"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <CheckIcon className="h-5 w-5" aria-hidden />
      </span>
      <p className="text-h5 font-semibold text-foreground">You&apos;re on the early-access list</p>
      <p className="text-body-sm text-muted-foreground">
        Accounts are rolling out to agencies now. We&apos;ll email you the moment your dashboard
        is ready.
      </p>
    </div>
  );
}

function SignInFields({ onSubmitted }: { onSubmitted: () => void }) {
  const form = useZodForm(signInSchema, {
    defaultValues: { email: "", password: "" },
  });

  // TODO(auth): call the auth service (apps/api) here once it exists.
  const onSubmit = (_values: SignInInput) => onSubmitted();

  return (
    <form className="mt-10 flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <Field
        control={form.control}
        name="email"
        type="email"
        label="Email"
        placeholder="you@agency.com"
        autoComplete="email"
      />
      <Field
        control={form.control}
        name="password"
        type="password"
        label="Password"
        placeholder="Your password"
        autoComplete="current-password"
      />
      <SubmitButton label={COPY.signin.submit} />
    </form>
  );
}

function SignUpFields({ onSubmitted }: { onSubmitted: () => void }) {
  const form = useZodForm(signUpSchema, {
    defaultValues: { name: "", email: "", password: "" },
  });

  // TODO(auth): call the auth service (apps/api) here once it exists.
  const onSubmit = (_values: SignUpInput) => onSubmitted();

  return (
    <form className="mt-10 flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <Field
        control={form.control}
        name="name"
        type="text"
        label="Full name"
        placeholder="Amara Okafor"
        autoComplete="name"
      />
      <Field
        control={form.control}
        name="email"
        type="email"
        label="Email"
        placeholder="you@agency.com"
        autoComplete="email"
      />
      <Field
        control={form.control}
        name="password"
        type="password"
        label="Password"
        placeholder="At least 8 characters"
        hint="8+ characters. Use something you don't reuse elsewhere."
        autoComplete="new-password"
      />
      <SubmitButton label={COPY.signup.submit} />
      <p className="text-center text-caption text-muted-foreground">
        By continuing you agree to Estatify&apos;s Terms of Service and Privacy Policy.
      </p>
    </form>
  );
}

/**
 * AuthForm — shared sign-in / sign-up screen. Validation is centralized:
 * Zod schemas from @estatify/schemas via useZodForm; every control renders
 * through the platform-wide <Field /> component.
 */
export function AuthForm({ mode }: { mode: AuthMode }) {
  const [submitted, setSubmitted] = React.useState(false);
  const copy = COPY[mode];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
      className="w-full max-w-sm"
    >
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-h2 font-semibold text-foreground">{copy.title}</h1>
        <p className="text-body-sm text-muted-foreground">{copy.subtitle}</p>
      </div>

      {submitted ? (
        <SuccessNotice />
      ) : mode === "signin" ? (
        <SignInFields onSubmitted={() => setSubmitted(true)} />
      ) : (
        <SignUpFields onSubmitted={() => setSubmitted(true)} />
      )}

      <p className="mt-8 text-center text-body-sm text-muted-foreground">
        {copy.switchPrompt}{" "}
        <Link
          href={copy.switchHref}
          className="font-semibold text-primary underline-offset-4 transition-colors hover:text-primary-hover hover:underline"
        >
          {copy.switchLabel}
        </Link>
      </p>
    </motion.div>
  );
}
