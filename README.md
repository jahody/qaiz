# Qaiz

Bite-sized, zero-code AI lessons for your commute. Qaiz is a gamified PWA in the spirit of language-learning apps: short interactive lessons, hearts, XP, daily streaks and leagues. It teaches how modern AI works by intuition and play, not by code or formulas.

Everything runs in the browser. There is no backend or account; progress is saved in `localStorage`, and the app works offline once installed.

## Curriculum

| Track | Lessons |
| --- | --- |
| 1. Thinking in Odds | The Bayesian Mindset · Distributions & Spread · Risk & Confidence |
| 2. Fueling the Machine | Garbage In, Garbage Out · Turning Worlds to Numbers (embeddings) |
| 3. The Neural Engine | The Bouncer (single neuron) · The Assembly Line (layers, gradient descent) · Memorize vs. Understand (overfitting) |
| 4. Frontier Architectures | Next-Token Prediction · The Attention Revolution · Mixture of Experts |
| 5. Agents & Grounding | The ReAct Loop · Hallucinations & RAG |

Lessons mix concept cards with interactive simulators, true/false calls, sliders, spot-the-flaw puzzles, trade-off choices and matching pairs. Missed questions come back at the end of the lesson for a second try at half XP.

## Game rules

- **Hearts:** 5 at most. A wrong answer costs one; one comes back every 4 hours, or win one in a Practice drill (2 of 3 right). At 0 hearts, lessons wait until you refill.
- **XP:** earned for each correct answer, plus a completion bonus per lesson.
- **Streak:** complete a lesson on consecutive days; miss a day and it resets.
- **Leagues:** Bronze, Silver (150 XP), Gold (350 XP) and Diamond (700 XP), against a table of AI-pioneer bots.

## Development

```bash
npm install
npm run dev       # dev server with hot reload
npm run build     # type-check and build to dist/
npm run lint      # oxlint
npm run preview   # serve the production build (service worker included)
```

React 19, TypeScript and Vite. Every push to `main` builds the app and deploys it to GitHub Pages (`.github/workflows/deploy.yml`).

Lesson content lives in `src/data/curriculumData.ts`, the step renderer in `src/components/LessonEngine.tsx`, and the interactive illustrations in `src/components/VisualWidgets.tsx`. See `CLAUDE.md` for the architecture and content conventions.

## Installing on a phone

Open the deployed page in Chrome on Android, tap the ⋮ menu and choose **Install app** (or **Add to Home screen**). It then runs full-screen and offline.
