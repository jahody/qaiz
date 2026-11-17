export type ExerciseType =
  | 'concept_card'
  | 'binary_choice'
  | 'slider'
  | 'concept_match'
  | 'spot_the_flaw'
  | 'tradeoff_tribunal'
  | 'step_through'
  | 'celebration';

export type VisualType =
  | 'doctor_test'
  | 'prior_pie'
  | 'accuracy_sim'
  | 'balance_scale'
  | 'spam_slider'
  | 'airport_scanner'
  | 'distribution_sim'
  | 'tradeoff_sim'
  | 'embedding_sim'
  | 'neuron_bouncer'
  | 'attention_sim'
  | 'moe_sim'
  | 'react_sim'
  | 'arena_sim'
  | 'celebration_trophy';

export interface ExerciseStep {
  id: string;
  type: ExerciseType;
  title: string;
  narrative?: string;
  visualType?: VisualType;
  question?: string;
  statement?: string;
  correctAnswer?: boolean | string | number;
  explanation: string;
  options?: Array<{ id: string; text: string; isCorrect?: boolean; subtext?: string }>;
  sliderConfig?: {
    min: number;
    max: number;
    step: number;
    defaultValue: number;
    unit: string;
    targetMin?: number;
    targetMax?: number;
    labelLow: string;
    labelHigh: string;
  };
  matchingPairs?: Array<{ id: string; left: string; right: string }>;
  xpValue: number;
}

export interface Unit {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  totalSteps: number;
  status: 'locked' | 'active' | 'completed';
  icon: string;
  steps: ExerciseStep[];
}

export interface Track {
  id: string;
  title: string;
  metaphor: string;
  color: string;
  units: Unit[];
}

export interface UserStats {
  hearts: number;
  maxHearts: number;
  lastHeartRefill: number; // timestamp
  streak: number;
  lastStreakDate: string; // YYYY-MM-DD
  xp: number;
  league: string;
  completedLessons: string[];
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}
