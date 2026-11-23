import type { UserStats } from '../types';

/** The part of UserStats kept in the cloud. Sound/haptics are per-device; maxHearts is a constant. */
export type SyncedProgress = Pick<
  UserStats,
  'hearts' | 'lastHeartRefill' | 'streak' | 'lastStreakDate' | 'xp' | 'completedLessons' | 'updatedAt' | 'resetAt'
>;

export function syncedPart(s: SyncedProgress): SyncedProgress {
  return {
    hearts: s.hearts,
    lastHeartRefill: s.lastHeartRefill,
    streak: s.streak,
    lastStreakDate: s.lastStreakDate,
    xp: s.xp,
    completedLessons: s.completedLessons,
    updatedAt: s.updatedAt,
    resetAt: s.resetAt
  };
}

/** Validates a cloud document; null if it is missing or malformed (it is then overwritten). */
export function parseSynced(data: unknown): SyncedProgress | null {
  if (!data || typeof data !== 'object') return null;
  const d = data as Record<string, unknown>;
  const num = (k: string) => typeof d[k] === 'number' && Number.isFinite(d[k]);
  if (!['hearts', 'lastHeartRefill', 'streak', 'xp', 'updatedAt', 'resetAt'].every(num)) return null;
  if (typeof d.lastStreakDate !== 'string') return null;
  if (!Array.isArray(d.completedLessons) || !d.completedLessons.every((id) => typeof id === 'string')) return null;
  return syncedPart(d as unknown as SyncedProgress);
}

/** Whole days from one YYYY-MM-DD key to another (calendar days, so time zones don't matter). */
function daysBetween(from: string, to: string): number {
  const day = (key: string) => {
    const [y, m, d] = key.split('-').map(Number);
    return Date.UTC(y, m - 1, d) / 86_400_000;
  };
  return Math.round(day(to) - day(from));
}

/**
 * Combines two streaks that may each cover only part of the history: the result ends on the later
 * day, and the earlier run counts too if the later run reaches back to the day after it.
 */
function mergeStreak(a: SyncedProgress, b: SyncedProgress): Pick<SyncedProgress, 'streak' | 'lastStreakDate'> {
  if (!a.lastStreakDate || !b.lastStreakDate) {
    const s = a.lastStreakDate ? a : b;
    return { streak: s.streak, lastStreakDate: s.lastStreakDate };
  }
  const [later, earlier] = a.lastStreakDate >= b.lastStreakDate ? [a, b] : [b, a];
  const gap = daysBetween(earlier.lastStreakDate, later.lastStreakDate);
  const streak =
    gap === 0
      ? Math.max(a.streak, b.streak)
      : later.streak >= gap
      ? Math.max(later.streak, earlier.streak + gap)
      : later.streak;
  return { streak, lastStreakDate: later.lastStreakDate };
}

/**
 * Merges this device's progress with the cloud copy, so neither device loses finished lessons:
 * - the side with the newer reset wins outright (a reset on one device clears the others);
 * - lessons are united (the newer side's order last, so its latest lesson stays last), XP takes the max;
 * - streaks join up when one device's run continues the other's (see mergeStreak);
 * - hearts come from the side changed most recently (ties keep `local`).
 */
export function mergeProgress(local: SyncedProgress, cloud: SyncedProgress): SyncedProgress {
  if (local.resetAt !== cloud.resetAt) return local.resetAt > cloud.resetAt ? local : cloud;

  const [newer, older] = cloud.updatedAt > local.updatedAt ? [cloud, local] : [local, cloud];

  return {
    hearts: newer.hearts,
    lastHeartRefill: newer.lastHeartRefill,
    ...mergeStreak(local, cloud),
    xp: Math.max(local.xp, cloud.xp),
    completedLessons: [
      ...older.completedLessons.filter((id) => !newer.completedLessons.includes(id)),
      ...newer.completedLessons
    ],
    updatedAt: newer.updatedAt,
    resetAt: local.resetAt
  };
}
