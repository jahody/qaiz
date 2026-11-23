# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Qaiz is a personalized, mobile-first PWA created specifically for **Adam Zlámal** as his dedicated learning companion for his **PhD in Artificial Intelligence, focused on autonomous AI agents automating scientific research**. 

Importantly, Adam **does not have a Master's education in Information Technologies or Computer Science**. The application is therefore explicitly structured around this profile:
- **Tailored for Adam's PhD Focus:** Every track directly complements his doctoral research on autonomous AI agents automating scientific discovery — spanning statistical uncertainty, high-dimensional embeddings, neural optimization dynamics, LLM reasoning architectures, and closed-loop agentic tool orchestration.
- **First-Principles Conceptual Intuition:** Because Adam does not come from a traditional IT/CS master's background, the curriculum does not assume prior computer science coursework or rely on code/implementation boilerplate. Instead, it builds deep, rigorous understanding through first-principles conceptual models, interactive visual simulators, system sliders, tradeoff tribunals, and flaw-detection puzzles.
- **Format:** Gamified micro-learning built for daily commute and high-retention reinforcement, backed by hearts, streaks, XP, persistent storage, and cross-device sync.

It is a React 19 + TypeScript + Vite single-page app with no server of its own: progress lives in `localStorage`, and an optional Google sign-in (Firebase) syncs it across devices and powers the shared leaderboard. `README.md` lists the curriculum and game rules; keep it in sync when lessons or rules change.

## Commands

```bash
npm install
npm run dev       # Vite dev server (also: .claude/launch.json "qaiz-dev" for the browser preview)
npm run build     # tsc -b && vite build -> dist/
npm run lint      # oxlint (not ESLint), config in .oxlintrc.json
npm run preview   # serve the built dist/ (the only way to exercise the service worker locally)
```

There is no test suite. Check changes with `npm run build` (the type check is part of it) and `npm run lint`, then play the affected lesson in the browser.

Toolchain: TypeScript ~7.0, Vite 8, oxlint. `tsconfig.app.json` sets `verbatimModuleSyntax` (type-only imports need `import type`), `erasableSyntaxOnly` (no enums, namespaces or constructor parameter properties) and `noUnusedLocals`/`noUnusedParameters`, so unused code fails the build. oxlint's `react/only-export-components` warns when a `.tsx` file exports non-component functions; put helpers in `src/utils/*.ts`.

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`, which builds on Node 24 and deploys `dist/` to GitHub Pages (repo `jahody/qaiz`; Pages source is "GitHub Actions", and the `github-pages` environment allows `main`). The old `gh-pages` branch is no longer served. `vite.config.ts` sets `base: './'`, and `index.html`, the manifest and the service worker all use relative paths, so the app works under the `/qaiz/` Pages subpath. Keep new asset references relative.

`public/sw.js` is registered from `src/main.tsx` in production builds only; in dev, `main.tsx` unregisters any leftover worker. Page navigations are network-first (a new deploy shows on the next load); other assets are cache-first with a background refresh. Bump `CACHE_NAME` when caching behavior changes.

## Architecture

**State and navigation.** `src/App.tsx` owns all state. `UserStats` (`src/types.ts`) is persisted under the `localStorage` key `qaiz_user_progress_v2` and merged over the defaults on load, so a new field picks up its default without a key bump. Once a lesson has been completed, App calls `requestPersistentStorage()` so the browser doesn't evict that data under storage pressure. The site shares the `jahody.github.io` origin (and its storage) with the user's other GitHub Pages projects, so keep the key name unique. There is no router: `activeUnit` (a lesson in progress) takes precedence, otherwise `currentTab` picks Learn / Practice / Settings.

**Google sign-in and sync.** Firebase Auth (Google provider, `signInWithPopup`; redirect sign-in breaks when third-party storage is blocked, because the app and `authDomain` are on different domains) plus Firestore Lite. `src/firebaseConfig.ts` holds the public web config; while its `apiKey` is empty the account card in Settings is hidden and Firebase is never loaded. `src/utils/cloud.ts` imports the SDK lazily (separate chunks, ~86 KB gzipped) and syncs in a transaction on `users/{uid}`; `firestore.rules` limits each user to their own document and the synced fields. What syncs is `SyncedProgress` (`src/utils/sync.ts`): everything in `UserStats` except sound, haptics and `maxHearts`. App syncs on sign-in, 2 s after any progress change, when the app returns to the foreground and when it comes back online. `mergeProgress` unites lessons, keeps the max XP, joins streaks when one device's run continues the other's, and takes hearts from the side with the newer `updatedAt`; handlers that change progress must stamp `updatedAt` (the time-based heart refill doesn't, since every device computes it the same way). A reset while signed in sets `resetAt`, and the newer `resetAt` wins a merge outright, so the reset reaches the cloud and other devices; a reset while signed out keeps `resetAt` and only clears this device. Sign-out keeps local progress. Setup steps are in `README.md`.

**Game rules** live in `src/utils/progress.ts`, as pure functions App calls:
- Hearts: 5 max, a wrong answer costs one, one comes back every 4 hours (`applyHeartRefill`; the clock starts when the first heart is lost). At 0 hearts lessons are blocked: the path and the lesson both send the learner to Practice.
- Streak: local calendar days (`localDateKey`, not UTC). `streakAfterLesson` adds one for a lesson on the day after the last one and resets to 1 after a gap; `currentStreak` shows 0 once a day is missed.
- XP: a lesson pays the `xpValue` of each correctly answered step plus the celebration step's bonus. A missed question is queued once more before the celebration ("second chance") and pays half XP if answered then. One perfect pass through the current curriculum earns 670 XP.
- Practice (`src/utils/practice.ts`): 3 questions drawn from the binary / spot-the-flaw / trade-off steps of completed units (padded with starter questions). 2 of 3 right wins a heart, or +5 XP when hearts are full.

**Curriculum is data.** `src/data/curriculumData.ts` exports `TRACKS: Track[]` → `Unit[]` → `ExerciseStep[]`, with each unit's steps in a `UNIT_..._STEPS` constant and the XP convention in a comment at the top. Every unit ends with a `celebration` step; the last unit of a track celebrates the whole track. Unit ids are stored in `completedLessons`, so never rename them; they don't follow display numbering (track 4 is `track-5` with units `unit-4-1`, `unit-5-1`, `unit-5-2`; track 5 is `track-6`). Each track has a `color` (hex accent for its banner, nodes and the launch button, readable on the dark path). Tracks can be taken in any order: `openUnitIds` (`progress.ts`) opens the first uncompleted unit of every track, and lessons within a track stay sequential. The bottom launch button and the bouncing banner go to `suggestedUnit`: the next lesson in the track of the most recently completed one (`completedLessons` is in completion order), else the first unfinished one. Since any track can be finished last, track celebrations must not claim the whole curriculum is done.

**`LessonEngine.tsx` renders steps** by switching on `step.type`:
- `concept_card`: `narrative` plus `explanation` shown as a 💡 takeaway.
- `binary_choice`: `statement` + boolean `correctAnswer`.
- `slider`: `sliderConfig`; correct inside `targetMin`..`targetMax`. The value resets to `defaultValue` on every step. `format: 'log_dollars'` treats the value as log10 of dollars.
- `concept_match`: `matchingPairs`, any count. The right column is a seeded derangement; a match means the left and right buttons share a pair `id`.
- `spot_the_flaw` / `tradeoff_tribunal`: `options` with `isCorrect`. The correct option is highlighted after any answer.
- `celebration`: confetti, total XP earned and the streak after this lesson.

`explanation` is shown after right and wrong answers alike, so write it neutrally and state the answer. `narrative` supports `**bold**`.

**Visuals.** `step.visualType` picks an illustration through `StepVisual` in `VisualWidgets.tsx`. Slider-driven visuals (`accuracy_sim`, `distribution_sim`, `neuron_bouncer`, `gradient_descent_sim`, `overfit_sim`) get the slider value on slider steps and their own resting value elsewhere; `tradeoff_sim`, `temperature_sim` and `attention_sim` keep their own interactive state. Adding a visual takes two edits: extend `VisualType` in `types.ts` and add a `case` to `StepVisual`. Where a visual computes something (Bayes counts, mean/median, softmax, gradient steps), the step text and slider targets must agree with its maths.

To sanity-check content after edits, import the data in the running dev server's page (`await import('/src/data/curriculumData.ts')`) and assert: unique unit and step ids, exactly one `isCorrect` option, slider defaults and targets inside `min`..`max` with the default not already correct, and a celebration at the end of each unit.

**Sound and haptics.** `src/utils/sound.ts` exports a singleton `sound` that synthesizes every effect with the Web Audio API (no audio files); App syncs `sound.enabled` from `stats.soundEnabled`. Vibration in lessons respects `hapticsEnabled`.

## Content accuracy

The curriculum makes factual claims (named studies, model sizes, dates). When editing it, keep numbers checkable and the worked maths consistent with the visuals. Current anchors: Daniels' 1950 cockpit study (4,063 pilots, 10 measurements, middle-30% band); Wald's WWII bomber analysis; the 2018 Reuters report on Amazon's recruiting model; the word2vec analogy (2013); the Transformer (2017) and causal attention in chat models; Mixtral 8x7B (2 of 8 experts, ~13B of ~47B active); DeepSeek-V3 (671B total, ~37B active); Qwen3-235B-A22B; ReAct (2022); the 2023 sanctions over ChatGPT-invented case citations (Mata v. Avianca, $5,000). Illustrative numbers (attention weights, precision/recall scores, the overfitting curves, the token split) are labeled as such in the UI.

## Styling

Styles are inline `style={{...}}` objects; there are no CSS modules or utility classes. `src/index.css` holds a reset, button press feedback, thin amber scrollbars and one keyframe. The brand ("Synapse Core" logo, "Solar Amber Cyber-Bento") uses a unified dark obsidian palette across all screens:
- Backgrounds: `#0B0F19` with card containers in `#131825` and subtle amber borders (`rgba(245, 158, 11, 0.2)`).
- Accents: solar amber `#F59E0B` and voltage yellow `#FDE047` for progress, selections, and rewards; flame orange `#EA580C` for streaks; coral rose `#FB7185` for health.
- Text: `#F8FAFC` headings, `#CBD5E1` body, and monospace font for stats and counts.

All screens — Learning Path, LessonEngine, Practice, Leaderboard, and Settings — share this dark cybernetic aesthetic.

On screens 600px and wider the app opens in a "Pixel 8a" phone-frame preview with a top bar (toggle to responsive); on phones and when installed it fills the screen and hides that bar. The logo SVG is inlined in `App.tsx` and duplicated as `public/icon.svg` / `favicon.svg`.
