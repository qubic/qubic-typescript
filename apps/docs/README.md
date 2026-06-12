# docs

The docs app is the Next.js + Fumadocs site for this monorepo.

## Run locally

From the repo root:

```bash
bun install
bun --cwd apps/docs dev
```

Then open <http://localhost:3000>.

## Useful commands

```bash
bun --cwd apps/docs dev      # local development server
bun --cwd apps/docs build    # production build
bun --cwd apps/docs lint     # next lint for the docs app
bun run docs:check           # repo-wide docs example sanity checks
```

## Structure

- `content/docs/` - MDX package pages and guides
- `app/docs/` - routed docs pages
- `lib/source.ts` - Fumadocs content source loader
- `source.config.ts` - MDX content configuration

## Notes

- Package API examples should stay aligned with the current source exports.
- Prefer valid, runnable examples over placeholder identities or stale snippets.
- Run `bun run docs:check` before pushing doc changes.
