import { redirect } from "next/navigation";
import { workspaceSignInUrl } from "@/lib/workspace-urls";

/**
 * Marketing never hosts auth. Legacy /signin → Workspace /sign-in.
 */
export default function MarketingSignInRedirect() {
  redirect(workspaceSignInUrl());
}
