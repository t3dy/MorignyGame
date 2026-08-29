import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  // v2 lives at its own subpath on GitHub Pages so v1 (the frozen
  // original prototype, at /MorignyGame/v1/) is never touched by a
  // rebuild. See .github/workflows/deploy.yml + deploy/landing.html.
  base: process.env.PAGES_BASE || (process.env.GITHUB_PAGES ? '/MorignyGame/v2/' : '/'),
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    port: 5176,
  },
})
