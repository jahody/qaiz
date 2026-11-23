import type { Track, Unit, UserStats } from '../types';

export const HEART_REFILL_MS = 4 * 60 * 60 * 1000;

/** Local calendar date as YYYY-MM-DD (streaks follow the user's day, not UTC). */
export function localDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function yesterdayKey(now: Date = new Date()): string {
  const d = new Date(now);
  d.setDate(d.getDate() - 1);
  return localDateKey(d);
}

/** Streak as it stands today: it lapses to 0 once a full day passes without a lesson. */
export function currentStreak(stats: UserStats, now: Date = new Date()): number {
  if (stats.lastStreakDate === localDateKey(now) || stats.lastStreakDate === yesterdayKey(now)) {
    return stats.streak;
  }
  return 0;
}

/** Streak after completing a lesson now. */
export function streakAfterLesson(stats: UserStats, now: Date = new Date()): number {
  const today = localDateKey(now);
  if (stats.lastStreakDate === today) return Math.max(1, stats.streak);
  if (stats.lastStreakDate === yesterdayKey(now)) return stats.streak + 1;
  return 1;
}

/** Adds the hearts earned by elapsed 4-hour periods. Returns the same object if nothing changes. */
export function applyHeartRefill(stats: UserStats, now: number = Date.now()): UserStats {
  if (stats.hearts >= stats.maxHearts) return stats;
  const periods = Math.floor((now - stats.lastHeartRefill) / HEART_REFILL_MS);
  if (periods <= 0) return stats;
  const hearts = Math.min(stats.maxHearts, stats.hearts + periods);
  return {
    ...stats,
    hearts,
    lastHeartRefill: hearts >= stats.maxHearts ? now : stats.lastHeartRefill + periods * HEART_REFILL_MS
  };
}

/** Milliseconds until the next free heart, or null when hearts are full. */
export function msUntilNextHeart(stats: UserStats, now: number = Date.now()): number | null {
  if (stats.hearts >= stats.maxHearts) return null;
  return Math.max(0, stats.lastHeartRefill + HEART_REFILL_MS - now);
}

/**
 * Asks the browser to keep this origin's storage (and so the saved progress) when the device runs low
 * on space. Chrome decides silently (installed and frequently used apps usually qualify); Firefox may
 * ask the user once. Safe to call repeatedly.
 */
export function requestPersistentStorage(): void {
  if (typeof navigator === 'undefined' || !navigator.storage?.persist) return;
  navigator.storage
    .persisted()
    .then((already) => (already ? true : navigator.storage.persist()))
    .catch(() => {});
}

/**
 * Units a learner can start: the first uncompleted unit of every track. Tracks can be taken in any
 * order, lessons within a track one after another.
 */
export function openUnitIds(tracks: Track[], completed: string[]): Set<string> {
  const open = new Set<string>();
  for (const track of tracks) {
    const next = track.units.find((u) => !completed.includes(u.id));
    if (next) open.add(next.id);
  }
  return open;
}

/**
 * The lesson the path suggests next: the next one in the track of the most recently completed lesson
 * (`completed` is in completion order), else the first unfinished one in curriculum order.
 * null once every lesson is done.
 */
export function suggestedUnit(tracks: Track[], completed: string[]): { unit: Unit; track: Track } | null {
  const lastId = completed[completed.length - 1];
  const lastTrack = tracks.find((t) => t.units.some((u) => u.id === lastId));
  for (const track of lastTrack ? [lastTrack, ...tracks] : tracks) {
    const unit = track.units.find((u) => !completed.includes(u.id));
    if (unit) return { unit, track };
  }
  return null;
}

export function formatDuration(ms: number): string {
  const totalMinutes = Math.ceil(ms / 60000);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
