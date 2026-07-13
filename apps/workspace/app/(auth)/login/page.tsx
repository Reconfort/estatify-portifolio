import { redirect } from "next/navigation";

/** Legacy path — Workspace auth lives at /sign-in */
export default function LoginRedirectPage() {
  redirect("/sign-in");
}
