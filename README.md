# Qaiz

Bite-sized, zero-code AI lessons for your commute. Qaiz is a gamified PWA in the spirit of language-learning apps: short interactive lessons, hearts, XP and daily streaks. It teaches how modern AI works by intuition and play, not by code or formulas.

Everything runs in the browser and the app works offline once installed.

## Curriculum

| Track | Lessons |
| --- | --- |
| 1. Probability & Statistics | Bayes' Rule · Averages & Outliers · Precision & Recall |
| 2. Data & Embeddings | Biased Data · Embeddings |
| 3. Neural Networks | The Artificial Neuron · Layers & Gradient Descent · Overfitting |
| 4. Large Language Models | Next-Token Prediction · Attention & Transformers · Mixture of Experts |
| 5. Agents & RAG | Agents & Tool Use · Hallucinations & RAG |

Each track has its own color on the learning path. Tracks can be taken in any order; the lessons inside a track unlock one after another.

Lessons mix concept cards with interactive simulators, true/false calls, sliders, spot-the-flaw puzzles, trade-off choices and matching pairs. Missed questions come back at the end of the lesson for a second try at half XP.

## Game rules

- **Hearts:** 5 at most. A wrong answer costs one; one comes back every 4 hours, or win one in a Practice drill (2 of 3 right). At 0 hearts, lessons wait until you refill.
- **XP:** earned for each correct answer, plus a completion bonus per lesson.
- **Streak:** complete a lesson on consecutive days; miss a day and it resets.

Progress is stored in the browser on each device. After your first completed lesson the app asks the browser to keep that data even when the device runs low on space. Optionally, sign in with Google (Settings) to keep lessons, XP, streak and hearts in sync across devices; sound and vibration settings stay per device.

## Google sign-in setup

Sign-in uses Firebase Authentication and stores one small Firestore document per user, in the Firebase project `qaiz-4d1d9` (free Spark plan, Firestore in `eur3`). Its web config is in `src/firebaseConfig.ts`; with an empty `apiKey` the sign-in card is hidden and the app works offline-only. After editing `firestore.rules`, deploy it with `npx firebase-tools deploy --only firestore:rules` (uses `firebase.json` and `.firebaserc`; run `npx firebase-tools login` once first).

To set up a new project from scratch:

1. In the [Firebase console](https://console.firebase.google.com), add a project (Google Analytics is not needed).
2. Project settings → General → Your apps → add a **Web** app (no Firebase Hosting). Copy `apiKey`, `authDomain`, `projectId` and `appId` into `src/firebaseConfig.ts`. These values are public by design; the Firestore rules are what protect the data.
3. Build → Authentication → Get started → Sign-in method → enable **Google**.
4. Authentication → Settings → Authorized domains → add `jahody.github.io` (`localhost` is listed by default).
5. Build → Firestore Database → Create database (production mode, any location). On its Rules tab, paste `firestore.rules` and publish.

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
