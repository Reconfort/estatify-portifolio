import { redirect } from "next/navigation";

/** Legacy route — redirects to Website Manager. */
export default function Page() {
  redirect("/website");
}
