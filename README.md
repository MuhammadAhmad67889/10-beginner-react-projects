# 10 Beginner React Projects

**Try it live:** https://muhammadahmad67889.github.io/10-beginner-react-projects/

The same ten small apps from my [vanilla JavaScript repo](https://github.com/MuhammadAhmad67889/10-beginner-javascript-projects), rebuilt in React — with GSAP animations and a little Three.js on top.

## The projects

| # | Project | What it does |
|---|---------|--------------|
| 01 | Counter | Increase, decrease, reset. The number pops with GSAP on every change. |
| 02 | Todo List | Add, delete, tick off tasks. Saved in localStorage, with All / Active / Done filters. |
| 03 | Calculator | Buttons and your keyboard. No `eval` — it keeps two numbers and one operator, like a real pocket calculator. |
| 04 | Stopwatch | Start, stop, reset, laps. Time is computed from the clock, so pausing never drifts it. |
| 05 | Quote Generator | Short quotes about code. New quote fades in, copy button included. |
| 06 | Color Flipper | Random hex colour on every flip, plus a 3D cube in the same colour. |
| 07 | Tip Calculator | Bill, tip %, people — tip, total and per-person update as you type. |
| 08 | Password Generator | Length slider, character-set toggles, `crypto.getRandomValues` (never `Math.random`), copy button. |
| 09 | Rock Paper Scissors | You against the computer, score kept, result pops in with GSAP. |
| 10 | Quiz App | Five JavaScript questions, one at a time, score at the end with a rotating 3D trophy. |

## Run it locally

```bash
npm install
npm run dev
```

Then open the address Vite prints (usually http://localhost:5173).

To check the production build:

```bash
npm run build
npm run preview
```

To check the types only, without building:

```bash
npm run typecheck
```

## What each library is used for

- **React + TypeScript** — the components and state, written in TypeScript (`.tsx` / `.ts`) with strict type checking. Plain types, no clever generics: a `Todo` is `{ id, text, done }`, a project is `{ id, title, subtitle, accent, Component }`. No router: pages switch with a single `useState` in `App.tsx`, which also means it works on GitHub Pages with no extra setup.
- **Vite** — the build tool and dev server.
- **GSAP + ScrollTrigger** — every project page fades and slides in on mount, buttons give a small press pop, and the landing page cards reveal as you scroll. `src/lib/animations.ts` holds the helpers.
- **Three.js** — plain Three.js inside `useEffect`, no wrapper library: a colour-matching cube in the Color Flipper, and a gold star in a ring on the quiz results screen. Each scene cleans up after itself (animation frame cancelled, geometry and materials disposed, canvas removed) and renders nothing if the browser has no WebGL.

All three animation systems respect `prefers-reduced-motion`: when it is on, the animations are skipped and a single still frame is shown instead.

## How it is put together

```
src/
  App.tsx                 # page state, landing page, project switcher
  index.css               # classic theme (same look as the JS version)
  lib/
    animations.ts         # GSAP helpers + ScrollTrigger card reveals
    threeSetup.ts         # shared Three.js setup and cleanup
  components/
    ColorCube.tsx         # colour-matching cube
    Trophy3D.tsx          # quiz results trophy
  projects/
    Counter.tsx  TodoList.tsx  Calculator.tsx  Stopwatch.tsx
    QuoteGenerator.tsx  ColorFlipper.tsx  TipCalculator.tsx
    PasswordGenerator.tsx  RockPaperScissors.tsx  QuizApp.tsx
```

## Deploying

Pushing to `main` deploys automatically to GitHub Pages through `.github/workflows/pages.yml`. The site lives at `https://muhammadahmad67889.github.io/10-beginner-react-projects/` (the `base` in `vite.config.js` is set for that path).
