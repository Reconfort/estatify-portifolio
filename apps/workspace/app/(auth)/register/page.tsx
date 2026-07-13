import { redirect } from "next/navigation";

/** Legacy path — Workspace registration lives at /sign-up */
export default function RegisterRedirectPage() {
  redirect("/sign-up");
}
