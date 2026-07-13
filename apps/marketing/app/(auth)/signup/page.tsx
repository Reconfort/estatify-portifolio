import { redirect } from "next/navigation";
import { workspaceSignUpUrl } from "@/lib/workspace-urls";

/**
 * Marketing never hosts auth. Legacy /signup → Workspace /sign-up.
 */
export default function MarketingSignUpRedirect() {
  redirect(workspaceSignUpUrl());
}
