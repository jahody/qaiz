import type { Track } from '../types';

export interface PracticeQuestion {
  id: string;
  q: string;
  options: string[];
  correct: number;
  exp: string;
}

/** Used until the learner has completed lessons with enough quiz steps to draw from. */
const STARTER_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'starter-bayes',
    q: "Why does Bayes' Rule matter when you judge an AI prediction?",
    options: [
      'It makes you ask how common the event was before the evidence came in',
      'It makes models run twice as fast on your phone',
      'It replaces neural networks completely'
    ],
    correct: 0,
    exp: 'Bayesian thinking starts from the prior (the base rate), which protects you from the base-rate fallacy.'
  },
  {
    id: 'starter-recall',
    q: 'In medical screening, what is the main danger of high precision bought at the cost of low recall?',
    options: [
      'Sick patients slip through undetected',
      'Too many false-alarm letters go out',
      'The model uses too much electricity'
    ],
    correct: 0,
    exp: 'Low recall means real cases are missed. Screening usually favors recall and confirms positives with follow-up tests.'
  },
  {
    id: 'starter-moe',
    q: 'In a Mixture-of-Experts model, what does the router do?',
    options: [
      'Sends each token to a few expert sub-networks',
      "Connects your phone to Wi-Fi",
      'Translates the prompt into Python'
    ],
    correct: 0,
    exp: "Only the chosen experts run for that token, so most of the model's parameters sit idle for it."
  }
];

/** Quiz steps from completed units, turned into multiple-choice practice questions. */
export function buildPracticePool(tracks: Track[], completedLessons: string[]): PracticeQuestion[] {
  const pool: PracticeQuestion[] = [];
  for (const track of tracks) {
    for (const unit of track.units) {
      if (!completedLessons.includes(unit.id)) continue;
      for (const step of unit.steps) {
        if (step.type === 'binary_choice' && step.statement && typeof step.correctAnswer === 'boolean') {
          pool.push({
            id: step.id,
            q: `True or false? ${step.statement}`,
            options: ['True', 'False'],
            correct: step.correctAnswer ? 0 : 1,
            exp: step.explanation
          });
        } else if ((step.type === 'spot_the_flaw' || step.type === 'tradeoff_tribunal') && step.options && step.question) {
          const correct = step.options.findIndex((o) => o.isCorrect);
          if (correct < 0) continue;
          pool.push({
            id: step.id,
            q: step.question,
            options: step.options.map((o) => o.text),
            correct,
            exp: step.explanation
          });
        }
      }
    }
  }
  return pool;
}

export function pickPracticeQuestions(tracks: Track[], completedLessons: string[], count = 3): PracticeQuestion[] {
  const pool = buildPracticePool(tracks, completedLessons);
  const source = pool.length >= count ? pool : [...pool, ...STARTER_QUESTIONS];
  const shuffled = [...source];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}
