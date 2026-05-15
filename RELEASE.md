# Release guide

All packages share a single version number. A changeset touching any one package bumps the entire suite together.

## Prerequisites (one-time)

```bash
# 1. npm account + @qubic.org org
npm login
npm org create qubic.org   # or create at npmjs.com/org/create

# 2. Export a GitHub token so changeset can link PRs in changelogs
export GITHUB_TOKEN=ghp_...
```

## Release flow

### 1. Make changes on a feature branch, then open a PR to `main`

### 2. Add a changeset while your PR is open

```bash
bun run changeset
# choose: patch | minor | major
# describe what changed — this becomes the CHANGELOG entry
```

Commit the generated `.changeset/*.md` file into your PR.

### 3. Merge to `main`

### 4. Version bump

```bash
git checkout main && git pull
bun run version
# resolves all pending changesets → edits package.json versions + writes CHANGELOGs
git add -A && git commit -m "chore: release vX.Y.Z"
git tag vX.Y.Z
git push origin main --tags
```

### 5. Build and publish

```bash
bun run build      # compiles all packages to dist/
bun run release    # = bun run build && changeset publish
```

`changeset publish` runs `npm publish --access public` for every non-private package in dependency order. Already-published versions are skipped automatically.

---

## Version semantics

| Change type | Bump |
|---|---|
| Bug fix, internal refactor | `patch` |
| New export, new hook, backward-compatible addition | `minor` |
| Breaking API change, removed export, renamed type | `major` |

All 11 packages always release at the same version (enforced by `fixed` in `.changeset/config.json`). You never need to reason about which subset to bump.

## Apps

`apps/registry-api` and `apps/registry-web` are `"private": true` — they are never published to npm. Deploy them independently.

## Hotfix flow

```bash
git checkout -b hotfix/description main
# fix the bug
bun run changeset   # patch bump
git commit -am "fix: ..."
# open PR → merge → follow steps 4–5 above
```
