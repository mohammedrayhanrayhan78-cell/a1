# A1: Daily design club

One small design challenge every day. Pull a brief, beat the clock to midnight, stamp the day.

Retro + neo-brutalist single-page site: thick ink borders, hard offset shadows, flat color, Bowlby One and Patrick Hand type.

## What works

- Live countdown to local midnight
- "I'm done!" stamps today (saved in `localStorage`, with a confirmation toast)
- "Give me another" swaps today's challenge once per day
- Challenge wall filter (All, Shapes, Type, Color)
- Weekly streak grid and Follow toggles
- Keyboard focus rings, 44px touch targets, `prefers-reduced-motion` support

No backend, no API keys. State never leaves the browser.

## Develop

```sh
npm install
npm run dev      # local dev server
npm test         # unit tests for the club logic
npm run build    # typecheck + production build into dist/
```

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which tests, builds and publishes `dist/` to GitHub Pages.
Asset paths are relative (`base: './'`), so the site works from any sub-path.

## Process notes

The visual direction was designed first, then implemented with Lovable. Lovable generated its project on a server-oriented framework (TanStack Start), which GitHub Pages can't host, so its page, styles and logic were ported onto plain Vite + React for a static build.
