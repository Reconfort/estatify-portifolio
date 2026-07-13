# @estatify/assets

Single source of truth for static assets shared across every Estatify app.

## Layout

```
packages/assets/
├── brand/
│   └── logo-gp.svg        # Estatify brand mark
└── auth/
    ├── panel-1.jpg        # Auth split-layout real-estate imagery
    ├── panel-2.jpg
    └── panel-3.jpg
```

## How apps consume it

Next.js serves a single `public/` folder per app, so each app links the shared
directories into its own `public/assets`:

```
apps/<app>/public/assets/logo-gp.svg  →  ../../../../packages/assets/brand/logo-gp.svg
apps/<app>/public/assets/auth         →  ../../../../packages/assets/auth
```

The symlinks are committed to git, and Next.js (dev, build, and start) follows
them transparently. Shared UI components reference the stable public URLs:

- `/assets/logo-gp.svg` — used by `AuthBrand` (`@estatify/ui`)
- `/assets/auth/panel-{1,2,3}.jpg` — used by `defaultAuthTestimonials` (`@estatify/ui`)

## Adding a shared asset

1. Drop the file in the right subfolder here (create a new one if needed —
   e.g. `illustrations/`).
2. If it's a new subfolder, symlink it from each app:
   `cd apps/<app>/public/assets && ln -s ../../../../packages/assets/<folder> <folder>`
3. Reference it as `/assets/<folder>/<file>` from any app.

App-specific media (marketing showcase/bento photos, etc.) stays in that app's
own `public/assets` — only put files here when more than one app needs them.

> **Windows note:** cloning with symlinks requires `git config core.symlinks true`
> and Developer Mode (or an elevated shell).
