"use client";

import { Button } from "@estatify/ui";
import { ShieldAlert, ArrowLeft } from "lucide-react";

const WORKSPACE_URL = (process.env.NEXT_PUBLIC_WORKSPACE_URL || "http://localhost:3000").replace(
  /\/$/,
  "",
);

export default function ForbiddenPage() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-destructive/5 blur-3xl" />

      <div className="z-10 w-full max-w-md space-y-8 text-center">
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

        <div className="rounded-xl border border-border bg-card p-6 text-body-sm text-muted-foreground shadow-sm">
          This portal is reserved for authenticated administrator and support team members. Agency
          users should continue in Workspace.
        </div>

        <div className="pt-2">
          <a href={`${WORKSPACE_URL}/dashboard`}>
            <Button variant="outline" className="inline-flex h-11 items-center gap-2 px-6">
              <ArrowLeft className="h-4.5 w-4.5" />
              <span>Go to Workspace</span>
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
