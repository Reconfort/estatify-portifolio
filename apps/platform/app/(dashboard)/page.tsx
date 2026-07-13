import { redirect } from "next/navigation";
import { DASHBOARD_PATH } from "@estatify/auth";

/** Authenticated home is /dashboard — keep `/` as a stable entry alias. */
export default function PlatformRootPage() {
  redirect(DASHBOARD_PATH);
}
