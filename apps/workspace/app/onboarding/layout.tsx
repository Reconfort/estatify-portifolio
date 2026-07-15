import { DotBackground } from "@estatify/ui";

/** Minimal shell for post-signup onboarding — no dashboard chrome. */
export default function OnboardingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative min-h-dvh">
      <DotBackground />
      <div className="relative z-10 flex min-h-dvh flex-col">{children}</div>
    </div>
  );
}
