import { Suspense } from "react";
import { DotBackground } from "@estatify/ui";
import { CheckoutPage } from "@/components/checkout/checkout-page";

/** Hosted checkout shell — payment integration lands in a later milestone. */
export default function Page() {
  return (
    <>
      <DotBackground />
      <Suspense
        fallback={
          <div className="relative z-10 flex min-h-dvh items-center justify-center">
            <p className="text-body-sm text-muted-foreground">Loading checkout…</p>
          </div>
        }
      >
        <CheckoutPage />
      </Suspense>
    </>
  );
}
