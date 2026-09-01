import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  // Each version lives at its own subpath on GitHub Pages, and only the
  // current one is ever rebuilt: v1 (the original prototype) and v2 (the
  // first complete campaign, recitation-grammar era) are frozen where
  // they stand. v3 is the v4-redesign build — see docs/V4_LOOP_REDESIGN.md
  // §7b for why site numbers and design-doc numbers differ, plus
  // .github/workflows/deploy.yml, deploy/landing.html, DEPLOY_STATE.md.
  base: process.env.PAGES_BASE || (process.env.GITHUB_PAGES ? '/MorignyGame/v3/' : '/'),
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    port: 5176,
  },
})
