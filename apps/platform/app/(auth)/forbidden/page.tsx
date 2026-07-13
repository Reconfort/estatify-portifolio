"use client";

import Link from "next/link";
import { Button } from "@estatify/ui";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-destructive/5 blur-3xl"></div>

      <div className="w-full max-w-md space-y-8 z-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <div className="space-y-3">
          <h1 className="text-display-sm font-bold tracking-tight text-foreground">
            Access Forbidden
          </h1>
          <p className="text-body-md text-muted-foreground">
            You do not have permission to access the internal Estatify Platform staff portal.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm text-body-sm text-muted-foreground">
          This portal is reserved strictly for authenticated administrator and support team members.
          If you are looking for your workspace dashboard, please log in at your tenant's workspace
          domain.
        </div>

        <div className="pt-2">
          <Link href="/login">
            <Button variant="outline" className="inline-flex items-center gap-2 h-11 px-6">
              <ArrowLeft className="h-4.5 w-4.5" />
              <span>Back to Login</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
