import { useState, useEffect } from 'react';
import { TRACKS } from './data/curriculumData';
import type { UserStats, Unit } from './types';
import { LearningPath } from './components/LearningPath';
import { LessonEngine } from './components/LessonEngine';
import { PracticeScreen, PRACTICE_XP_REWARD } from './components/PracticeScreen';
import { SettingsModal } from './components/SettingsModal';
import { sound } from './utils/sound';
import {
  applyHeartRefill,
  currentStreak,
  localDateKey,
  msUntilNextHeart,
  requestPersistentStorage,
  streakAfterLesson
} from './utils/progress';

const STORAGE_KEY = 'qaiz_user_progress_v2';
const WIDE_QUERY = '(min-width: 600px)';

const createDefaultStats = (): UserStats => ({
  hearts: 5,
  maxHearts: 5,
  lastHeartRefill: Date.now(),
  streak: 0,
  lastStreakDate: '',
  xp: 0,
  completedLessons: [],
  soundEnabled: true,
  hapticsEnabled: true
});

const matches = (query: string) => typeof window !== 'undefined' && window.matchMedia(query).matches;

export function App() {
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return applyHeartRefill({ ...createDefaultStats(), ...JSON.parse(saved) });
    } catch {
      // fall through to defaults
    }
    return createDefaultStats();
  });

  const [activeUnit, setActiveUnit] = useState<Unit | null>(null);
  const [currentTab, setCurrentTab] = useState<'path' | 'practice' | 'settings'>('path');
  const [isWide, setIsWide] = useState<boolean>(() => matches(WIDE_QUERY));
  // The phone-frame mockup is for previewing on a desktop; on a phone (or installed) the app fills the screen.
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(
    () => matches(WIDE_QUERY) && !matches('(display-mode: standalone)')
  );
  // Re-render once a minute so the heart-refill countdown stays current
  const [, setClock] = useState(() => Date.now());

  useEffect(() => {
    const mq = window.matchMedia(WIDE_QUERY);
    const onChange = () => setIsWide(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Sync sound setting
  useEffect(() => {
    sound.enabled = stats.soundEnabled;
  }, [stats.soundEnabled]);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // ignore
    }
  }, [stats]);

  // Once there is progress worth keeping, ask the browser not to evict it
  const hasProgress = stats.completedLessons.length > 0;
  useEffect(() => {
    if (hasProgress) requestPersistentStorage();
  }, [hasProgress]);

  // Heart refill (1 heart per 4 hours) and the clock for the refill countdown
  useEffect(() => {
    const tick = () => {
      setClock(Date.now());
      setStats((prev) => applyHeartRefill(prev));
    };
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleDeductHeart = () => {
    setStats((prev) => ({
      ...prev,
      hearts: Math.max(0, prev.hearts - 1),
      // The refill clock starts when the first heart is lost
      lastHeartRefill: prev.hearts >= prev.maxHearts ? Date.now() : prev.lastHeartRefill
    }));
  };

  const handlePracticeReward = (kind: 'heart' | 'xp') => {
    setStats((prev) =>
      kind === 'heart'
        ? { ...prev, hearts: Math.min(prev.maxHearts, prev.hearts + 1) }
        : { ...prev, xp: prev.xp + PRACTICE_XP_REWARD }
    );
  };

  const handleSelectUnit = (unit: Unit) => {
    if (stats.hearts <= 0) {
      setCurrentTab('practice');
      return;
    }
    setActiveUnit(unit);
  };

  const handleLessonComplete = (earnedXp: number) => {
    if (!activeUnit) return;
    const unitId = activeUnit.id;

    setStats((prev) => ({
      ...prev,
      xp: prev.xp + earnedXp,
      streak: streakAfterLesson(prev),
      lastStreakDate: localDateKey(),
      completedLessons: prev.completedLessons.includes(unitId)
        ? prev.completedLessons
        : [...prev.completedLessons, unitId]
    }));

    setActiveUnit(null);
  };

  const handleOutOfHearts = () => {
    setActiveUnit(null);
    setCurrentTab('practice');
  };

  const handleResetProgress = () => {
    setStats(createDefaultStats());
    localStorage.removeItem(STORAGE_KEY);
    setCurrentTab('path');
  };

  const showOuterBar = isPhoneFrame || isWide;
  const streak = currentStreak(stats);

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: '#070A11',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isPhoneFrame ? '16px 8px' : '0',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      {/* Top Outer Controls (desktop preview only) */}
      {showOuterBar && (
        <div
          style={{
            width: '100%',
            maxWidth: isPhoneFrame ? '420px' : '800px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#94A3B8',
            fontSize: '12px',
            margin: isPhoneFrame ? '0 0 8px' : '8px 0',
            padding: '0 8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F8FAFC', fontWeight: 800 }}>
            {/* Synapse Core Mini Logo */}
            <svg width="22" height="22" viewBox="0 0 64 64">
              <polygon points="32,8 54,20 54,44 32,56 10,44 10,20" fill="none" stroke="#F59E0B" strokeWidth="4" strokeLinejoin="round" />
              <circle cx="32" cy="32" r="8" fill="#FDE047" />
              <line x1="32" y1="8" x2="32" y2="24" stroke="#FEF08A" strokeWidth="3" />
              <line x1="54" y1="44" x2="38" y2="36" stroke="#F59E0B" strokeWidth="3" />
              <line x1="10" y1="44" x2="26" y2="36" stroke="#F59E0B" strokeWidth="3" />
            </svg>
            <span style={{ letterSpacing: '0.04em' }}>Qaiz · AI Commute Learning</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => {
                setStats((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
              }}
              aria-label={stats.soundEnabled ? 'Mute sound' : 'Unmute sound'}
              style={{
                background: '#0F172A',
                border: '1px solid #1E293B',
                color: stats.soundEnabled ? '#F59E0B' : '#64748B',
                borderRadius: '8px',
                padding: '4px 8px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              {stats.soundEnabled ? '🔊' : '🔇'}
            </button>
            <button
              onClick={() => setIsPhoneFrame(!isPhoneFrame)}
              style={{
                background: '#0F172A',
                border: '1px solid #1E293B',
                color: '#F8FAFC',
                borderRadius: '8px',
                padding: '4px 10px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              {isPhoneFrame ? '📱 Pixel 8a' : '🖥️ Responsive'}
            </button>
          </div>
        </div>
      )}

      {/* Main Container / Mobile Chassis */}
      <div
        style={{
          width: '100%',
          maxWidth: isPhoneFrame ? '390px' : '640px',
          height: isPhoneFrame ? '820px' : showOuterBar ? 'calc(100dvh - 44px)' : '100dvh',
          maxHeight: isPhoneFrame ? '92vh' : '100dvh',
          background: activeUnit ? '#FFFFFF' : '#0B0F19',
          borderRadius: isPhoneFrame ? '36px' : '0',
          border: isPhoneFrame ? '8px solid #141B2D' : 'none',
          boxShadow: isPhoneFrame ? '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px -10px rgba(245, 158, 11, 0.15)' : 'none',
          // Frame mode: a status-bar strip keeps content clear of the camera punch-hole.
          paddingTop: isPhoneFrame ? '26px' : 'env(safe-area-inset-top)',
          paddingBottom: isPhoneFrame ? '0' : 'env(safe-area-inset-bottom)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {/* Pixel 8a Camera Punchhole */}
        {isPhoneFrame && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '12px',
              height: '12px',
              background: '#06080E',
              borderRadius: '50%',
              zIndex: 50,
              pointerEvents: 'none'
            }}
          />
        )}

        {/* Global Stats Header (Cyber-Bento Obsidian with custom icons) */}
        {!activeUnit && (
          <header
            style={{
              background: '#0B0F19',
              borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
              padding: '12px 14px',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              zIndex: 20
            }}
          >
            {/* Streak: Plasma Flame */}
            <div title="Day streak" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '13px', color: '#F59E0B', fontFamily: 'monospace' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5">
                <path d="M12 2c0 4-4 6-4 10a6 6 0 0 0 12 0c0-4-3-7-3-7s-1 2-2 2-2-3-3-5z" fill="rgba(245,158,11,0.25)" />
              </svg>
              <span>{streak}d</span>
            </div>

            {/* XP: Voltage Bolt */}
            <div title="Total XP" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '13px', color: '#FDE047', fontFamily: 'monospace' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FDE047" strokeWidth="2.5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="rgba(253,224,71,0.25)" />
              </svg>
              <span>{stats.xp} XP</span>
            </div>

            {/* Health: Cybernetic Heart Capsule */}
            <button
              onClick={() => {
                sound.playTick();
                setCurrentTab('practice');
              }}
              title="Hearts: practice to refill"
              style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 700,
                fontSize: '13px',
                color: '#FB7185',
                fontFamily: 'monospace',
                cursor: 'pointer'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FB7185" strokeWidth="2.5">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill="rgba(251,113,133,0.25)" />
              </svg>
              <span>{stats.hearts}/{stats.maxHearts}</span>
            </button>
          </header>
        )}

        {/* Screen Content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {activeUnit ? (
            <LessonEngine
              key={activeUnit.id}
              steps={activeUnit.steps}
              hearts={stats.hearts}
              hapticsEnabled={stats.hapticsEnabled}
              streakAfter={streakAfterLesson(stats)}
              onDeductHeart={handleDeductHeart}
              onLessonComplete={handleLessonComplete}
              onOutOfHearts={handleOutOfHearts}
              onExit={() => setActiveUnit(null)}
            />
          ) : currentTab === 'path' ? (
            <LearningPath
              tracks={TRACKS}
              stats={stats}
              onSelectUnit={handleSelectUnit}
            />
          ) : currentTab === 'practice' ? (
            <PracticeScreen
              tracks={TRACKS}
              completedLessons={stats.completedLessons}
              hearts={stats.hearts}
              maxHearts={stats.maxHearts}
              nextHeartInMs={msUntilNextHeart(stats)}
              onReward={handlePracticeReward}
              onBackToPath={() => setCurrentTab('path')}
            />
          ) : (
            <SettingsModal
              soundEnabled={stats.soundEnabled}
              hapticsEnabled={stats.hapticsEnabled}
              onToggleSound={() => setStats((p) => ({ ...p, soundEnabled: !p.soundEnabled }))}
              onToggleHaptics={() => setStats((p) => ({ ...p, hapticsEnabled: !p.hapticsEnabled }))}
              onResetProgress={handleResetProgress}
              onClose={() => setCurrentTab('path')}
            />
          )}
        </div>

        {/* Bottom Tab Bar (Cyber-Bento Obsidian) */}
        {!activeUnit && (
          <nav
            style={{
              background: '#0B0F19',
              borderTop: '1px solid rgba(245, 158, 11, 0.2)',
              display: 'flex',
              justifyContent: 'space-around',
              padding: '8px 0',
              zIndex: 30
            }}
          >
            {[
              { id: 'path', label: 'Learn', icon: '🗺️' },
              { id: 'practice', label: 'Practice', icon: '🩺' },
              { id: 'settings', label: 'Settings', icon: '⚙️' }
            ].map((tab) => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    sound.playTick();
                    setCurrentTab(tab.id as typeof currentTab);
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  style={{
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    color: isActive ? '#F59E0B' : '#64748B',
                    cursor: 'pointer',
                    padding: '4px 12px'
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{tab.icon}</span>
                  <span style={{ fontSize: '11px', fontWeight: isActive ? 800 : 500, fontFamily: 'monospace' }}>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
}

export default App;
