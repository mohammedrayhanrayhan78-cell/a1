# Project rules (read before changing anything)

This is a static single-page site deployed to GitHub Pages from `main` via GitHub Actions.

## Stack rules
- Static Vite + React + TypeScript + Tailwind only. No SSR or server frameworks (TanStack Start, Next server mode, Remix, Nitro). GitHub Pages serves files only.
- `vite.config.ts` keeps `base: './'` so the site works under `/<repo>/`.
- Single page with `#anchor` links. If routes are ever needed, use hash routing: Pages returns 404 for deep links.
- Fonts are self-hosted with `@fontsource/*`. Do not add Google Fonts links.
- No backend, no API keys, no secrets in the repo. State lives in `localStorage`, always wrapped in try/catch.
- Keep dependencies minimal. Do not add UI kits for one component.

## Deploy rules
- Pages Source must be **GitHub Actions** (Settings, Pages). Never "Deploy from a branch": that publishes raw source and a blank page.
- Deploy only by pushing to `main`. The workflow runs tests, builds, deploys, then `scripts/verify-live.mjs` checks the live URL.
- A green build or a successful commit is not a successful deploy. The `verify` job must pass.
- Never amend, rebase or force-push commits already on `main`.

## Quality rules
- Run `npm test` and `npm run build` before pushing.
- Interactive controls must be real `<button>`/`<a>`, with visible focus, 44px minimum targets, and `prefers-reduced-motion` respected.
- Do not claim a contrast ratio or accessibility pass without measuring it.
- Sample data (people, streaks) must be labeled as sample, never presented as real users.

## Environment traps (Claude Code sandbox)
- `gh` GraphQL and account-level REST paths are blocked; use `gh api repos/<owner>/<repo>/...`.
- The Pages API is blocked and `github.io` is unreachable from the shell, so rely on the CI `verify` job for live checks.
- Read CI failures with `gh api repos/<o>/<r>/check-runs/<job_id>/annotations`; raw logs are blocked.
- After `git fetch origin main` the `origin/main` ref may not exist; use `FETCH_HEAD`.
- A push warning "expected 'acknowledgments', received 'packfile'" is harmless if the branch updated.
