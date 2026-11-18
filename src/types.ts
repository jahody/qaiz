export type ExerciseType =
  | 'concept_card'
  | 'binary_choice'
  | 'slider'
  | 'concept_match'
  | 'spot_the_flaw'
  | 'tradeoff_tribunal'
  | 'celebration';

export type VisualType =
  | 'doctor_test'
  | 'prior_pie'
  | 'accuracy_sim'
  | 'balance_scale'
  | 'cockpit_average'
  | 'distribution_sim'
  | 'tradeoff_sim'
  | 'survivorship_plane'
  | 'embedding_sim'
  | 'neuron_bouncer'
  | 'layer_stack'
  | 'gradient_descent_sim'
  | 'overfit_sim'
  | 'token_sim'
  | 'temperature_sim'
  | 'rag_sim'
  | 'attention_sim'
  | 'moe_sim'
  | 'react_sim';

export interface ExerciseStep {
  id: string;
  type: ExerciseType;
  title: string;
  /** Body text for concept and celebration cards. `**text**` renders bold. */
  narrative?: string;
  visualType?: VisualType;
  question?: string;
  statement?: string;
  correctAnswer?: boolean;
  /** Shown after answering (right or wrong), and as the takeaway on concept cards. Keep it neutral. */
  explanation: string;
  options?: Array<{ id: string; text: string; isCorrect?: boolean; subtext?: string }>;
  sliderConfig?: {
    min: number;
    max: number;
    step: number;
    defaultValue: number;
    unit: string;
    targetMin: number;
    targetMax: number;
    labelLow: string;
    labelHigh: string;
    /** 'log_dollars': the value is log10 of a dollar amount and is displayed as $50k / $1.2M / $1B. */
    format?: 'log_dollars';
  };
  /** A left item matches the right item with the same id. Any number of pairs works. */
  matchingPairs?: Array<{ id: string; left: string; right: string }>;
  /** XP for answering correctly; on a celebration step, the lesson-completion bonus. */
  xpValue: number;
}

export interface Unit {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  steps: ExerciseStep[];
}

export interface Track {
  id: string;
  title: string;
  metaphor: string;
  units: Unit[];
}

export interface UserStats {
  hearts: number;
  maxHearts: number;
  /** Start of the current 4-hour refill period (only meaningful while hearts < maxHearts). */
  lastHeartRefill: number;
  streak: number;
  /** Local date (YYYY-MM-DD) of the last completed lesson; '' if none yet. */
  lastStreakDate: string;
  xp: number;
  completedLessons: string[];
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}
