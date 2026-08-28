# Trevor Warthman — Personal Website

React and TypeScript portfolio built with Vite for free static hosting on GitHub Pages.

The homepage is an interactive site graph. Internal pages retain a compact version of the same graph, with the current route highlighted. A conventional navigation fallback and a narrow-screen list use the same route data.

## Routes

- `/` — graph-first homepage
- `/portfolio` — experience, selected professional work, and résumé
- `/projects` — personal software projects
- `/projects/:slug` — reusable project detail pages
- `/personal` — personal directory
- `/about` — personal introduction
- `/kitchen` — recipe section

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

`public/404.html` preserves direct clean-route requests through GitHub Pages and restores the requested path before React renders.
