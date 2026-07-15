import { headers } from "next/headers";
import type { PublishedConfiguration } from "@estatify/types";
import { defaultWebsiteComposition } from "@estatify/types";
import { PageRenderer } from "@estatify/website-renderer";

async function fetchPublishedConfig(host: string): Promise<PublishedConfiguration | null> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  try {
    const res = await fetch(`${apiBase}/public/configuration?host=${encodeURIComponent(host)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as PublishedConfiguration;
  } catch {
    return null;
  }
}

export default async function Page() {
  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost";

  const config = await fetchPublishedConfig(host);

  if (!config) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center gap-4 px-6">
        <p className="text-overline uppercase text-muted-foreground">Estatify · sites</p>
        <h1 className="text-display-md text-foreground">Site not configured</h1>
        <p className="text-body-lg text-muted-foreground">
          No published configuration found for <strong>{host}</strong>. Publish from the workspace
          branding editor.
        </p>
      </main>
    );
  }

  const composition = config.composition ?? defaultWebsiteComposition;

  return (
    <main>
      <PageRenderer
        input={{
          page: "home",
          profile: config.profile,
          brand: config.brand,
          website: config.website,
          seo: config.seo,
          composition,
        }}
      />
    </main>
  );
}
