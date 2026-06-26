export default function Page() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center gap-4 px-6">
      <p className="text-overline uppercase text-muted-foreground">Estatify · platform</p>
      <h1 className="text-display-md text-foreground">Platform</h1>
      <p className="text-body-lg text-muted-foreground">Internal operating system for Estatify staff.</p>
      <div className="mt-4 flex gap-3">
        <button className="rounded-md bg-primary px-4 py-2 text-body-sm font-medium text-primary-foreground hover:bg-primary-hover">
          Primary action
        </button>
        <button className="rounded-md bg-accent px-4 py-2 text-body-sm font-medium text-accent-foreground">
          Accent
        </button>
      </div>
    </main>
  );
}
