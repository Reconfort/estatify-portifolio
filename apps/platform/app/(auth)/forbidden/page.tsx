"use client";

import { AuthForm, Button } from "@estatify/ui";
import { ArrowRightIcon } from "@estatify/ui/icons";

const WORKSPACE_URL = (process.env.NEXT_PUBLIC_WORKSPACE_URL || "http://localhost:3000").replace(
  /\/$/,
  "",
);

export default function ForbiddenPage() {
  return (
    <AuthForm
      title="Access forbidden"
      description="You do not have permission to access the Estatify Platform staff portal."
      footer={
        <a href={`${WORKSPACE_URL}/dashboard`}>
          <Button variant="outline" size="lg" className="inline-flex w-full items-center gap-2">
            Go to Workspace
            <ArrowRightIcon className="size-4" />
          </Button>
        </a>
      }
    >
      <p className="rounded-lg border border-border bg-secondary/40 px-4 py-3 text-body-sm text-muted-foreground">
        This portal is reserved for authenticated administrator and support team members. Agency
        users should continue in Workspace.
      </p>
    </AuthForm>
  );
}
