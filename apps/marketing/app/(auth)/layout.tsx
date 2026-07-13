/** Marketing auth routes only redirect to Workspace — no chrome, no forms. */
export default function AuthRedirectLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
