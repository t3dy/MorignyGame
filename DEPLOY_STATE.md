# MORIGNY — Deploy State

*Required by the workspace house rule: a project with more than one
hosting path maintains this file. Read it before touching deploy
config.*

## Canonical URLs

| Path | What it is | Rebuilt? |
|---|---|---|
| `https://t3dy.github.io/MorignyGame/` | landing page — links all builds | every deploy, from `deploy/landing.html` |
| `https://t3dy.github.io/MorignyGame/v3/` | **current** — the v4 reading-forward redesign | **yes — the only build this job makes** |
| `https://t3dy.github.io/MorignyGame/v2/` | archived — the full campaign, recitation-grammar era | never again; frozen where it stands |
| `https://t3dy.github.io/MorignyGame/v1/` | archived — the original prototype | never again; frozen |

## How it works

- **Host:** GitHub Pages, `gh-pages` branch, built by
  `.github/workflows/deploy.yml` on push to `main` (or manual
  `workflow_dispatch`). Tests must pass before the build job runs.
- **The freeze pattern:** the workflow clones the existing `gh-pages`
  branch, wipes and rebuilds **only the current version's directory**,
  regenerates `index.html` from `deploy/landing.html`, and force-pushes.
  Every other directory is carried forward untouched. This is why old
  versions stay playable forever at their own links.
- **Base path:** `vite.config.js` reads `PAGES_BASE`, else
  `/MorignyGame/v3/` when `GITHUB_PAGES=true`, else `/` for local dev.

## Shipping the NEXT version (do all three, or it breaks)

1. `vite.config.js` — bump the `GITHUB_PAGES` base to `/MorignyGame/v4/`.
2. `.github/workflows/deploy.yml` — change the two `pages-out/v3` paths
   in the assemble step to `v4`. The old version needs no "freeze" step;
   not rebuilding it *is* the freeze.
3. `deploy/landing.html` — add the new card as `current`, demote the
   previous one to `secondary`/`archived`.

## Gotchas

- **v1's assets are at the gh-pages root.** `v1/index.html` has absolute
  `/MorignyGame/assets/…` paths baked in from the very first deploy, so
  the root `assets/` directory must never be deleted. The workflow never
  touches it; don't add a step that does.
- **The workflow force-pushes `gh-pages`.** Never hand-edit that branch —
  anything committed there directly is lost on the next deploy. The
  landing page is regenerated from tracked source every time for exactly
  this reason.
- **Site version ≠ design-doc version.** Site v2 contains internal design
  version v3d; site v3 is internal v4. See
  `docs/V4_LOOP_REDESIGN.md` §7b. The landing page speaks site numbers only.
- **`localStorage` is shared across versions on the same origin** (all
  builds are on `t3dy.github.io`). The chronicle key is
  `morigny-chronicle` and witnesses are `morigny-witnesses`; a v3 save
  and a v2 save occupy the same keys. All loaders default missing fields
  additively, so a cross-version save loads rather than crashing, but a
  tester wanting a clean run should clear site data.

## Not yet deployed anywhere

The editable playthrough-log page (`docs/V4_LOOP_REDESIGN.md` §7) needs
a hosted store — serverless function plus a small database — which does
not exist yet. The beat log it will consume is already produced and
persisted client-side (`src/engine/beatlog.js`). When that store lands,
this file gains a second host and a secrets note.
