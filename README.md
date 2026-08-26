# Trevor Warthman — Personal Website

React and TypeScript portfolio built with Vite for free static hosting on GitHub Pages.

## Local development

```sh
npm install
npm run dev
```

## Verification

```sh
npm run typecheck
npm run build
```

The publication-safe July 2026 résumé is served from `public/resume/` and linked from the accessible HTML career section.

## Deployment

Pushes to `master` run `.github/workflows/deploy-pages.yml`. GitHub Actions installs dependencies, builds `dist/`, uploads it as a Pages artifact, and deploys it to `https://trevor-warthman.github.io/`. Generated build output is not committed.
