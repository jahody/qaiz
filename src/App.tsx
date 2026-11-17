import { useState, useEffect } from 'react';
import { TRACKS } from './data/curriculumData';
import type { UserStats, Unit } from './types';
import { LearningPath } from './components/LearningPath';
import { LessonEngine } from './components/LessonEngine';
import { PracticeScreen } from './components/PracticeScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { SettingsModal } from './components/SettingsModal';
import { sound } from './utils/sound';

const STORAGE_KEY = 'qaiz_user_progress_v1';

const DEFAULT_STATS: UserStats = {
  hearts: 5,
  maxHearts: 5,
  lastHeartRefill: Date.now(),
  streak: 1,
  lastStreakDate: new Date().toISOString().split('T')[0],
  xp: 60,
  league: 'Bronze',
  completedLessons: [],
  soundEnabled: true,
  hapticsEnabled: true
};

export function App() {
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...DEFAULT_STATS, ...JSON.parse(saved) };
    } catch {
      // fallback
    }
    return DEFAULT_STATS;
  });

  const [activeUnit, setActiveUnit] = useState<Unit | null>(null);
  const [currentTab, setCurrentTab] = useState<'path' | 'practice' | 'leaderboard' | 'settings'>('path');
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);

  // Sync sound setting
  useEffect(() => {
    sound.enabled = stats.soundEnabled;
  }, [stats.soundEnabled]);

  // Save to localStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // ignore
    }
  }, [stats]);

  // Check heart automatic refill (1 heart every 4 hours = 14,400,000 ms)
  useEffect(() => {
    const checkRefill = () => {
      const now = Date.now();
      const elapsed = now - stats.lastHeartRefill;
      const hoursPassed = Math.floor(elapsed / (4 * 60 * 60 * 1000));
      if (hoursPassed > 0 && stats.hearts < stats.maxHearts) {
        setStats((prev) => ({
          ...prev,
          hearts: Math.min(prev.maxHearts, prev.hearts + hoursPassed),
          lastHeartRefill: now
        }));
      }
    };
    checkRefill();
    const interval = setInterval(checkRefill, 60000);
    return () => clearInterval(interval);
  }, [stats.hearts, stats.maxHearts, stats.lastHeartRefill]);

  const handleDeductHeart = () => {
    setStats((prev) => ({
      ...prev,
      hearts: Math.max(0, prev.hearts - 1)
    }));
  };

  const handleRefillHeart = () => {
    setStats((prev) => ({
      ...prev,
      hearts: Math.min(prev.maxHearts, prev.hearts + 1)
    }));
  };

  const handleLessonComplete = (earnedXp: number) => {
    if (!activeUnit) return;
    const today = new Date().toISOString().split('T')[0];
    const isNewDay = stats.lastStreakDate !== today;

    setStats((prev) => ({
      ...prev,
      xp: prev.xp + earnedXp,
      streak: isNewDay ? prev.streak + 1 : prev.streak,
      lastStreakDate: today,
      completedLessons: prev.completedLessons.includes(activeUnit.id)
        ? prev.completedLessons
        : [...prev.completedLessons, activeUnit.id]
    }));

    setActiveUnit(null);
  };

  const handleResetProgress = () => {
    setStats(DEFAULT_STATS);
    localStorage.removeItem(STORAGE_KEY);
    setCurrentTab('path');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0F172A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isPhoneFrame ? '16px 8px' : '0',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      {/* Top Outer Controls */}
      <div
        style={{
          width: '100%',
          maxWidth: isPhoneFrame ? '420px' : '800px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#94A3B8',
          fontSize: '12px',
          marginBottom: '8px',
          padding: '0 8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#F8FAFC', fontWeight: 800 }}>
          <span style={{ fontSize: '18px' }}>⚡</span>
          <span>Qaiz · AI Commute Learning</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => {
              setStats((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
            }}
            style={{
              background: '#1E293B',
              border: '1px solid #334155',
              color: '#F8FAFC',
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
              background: '#1E293B',
              border: '1px solid #334155',
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

      {/* Main Container / Mobile Chassis */}
      <div
        style={{
          width: isPhoneFrame ? '100%' : '100%',
          maxWidth: isPhoneFrame ? '390px' : '640px',
          height: isPhoneFrame ? '820px' : '100vh',
          maxHeight: isPhoneFrame ? '92vh' : '100vh',
          background: '#FFFFFF',
          borderRadius: isPhoneFrame ? '36px' : '0',
          border: isPhoneFrame ? '8px solid #1E293B' : 'none',
          boxShadow: isPhoneFrame ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : 'none',
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
              top: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '12px',
              height: '12px',
              background: '#0F172A',
              borderRadius: '50%',
              zIndex: 50,
              pointerEvents: 'none'
            }}
          />
        )}

        {/* Global Stats Header (Hidden inside active lesson) */}
        {!activeUnit && (
          <header
            style={{
              background: '#FFFFFF',
              borderBottom: '2px solid #E2E8F0',
              padding: '12px 14px',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              zIndex: 20
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 800, fontSize: '14px', color: '#EA580C' }}>
              <span>🔥</span>
              <span>{stats.streak}d</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 800, fontSize: '14px', color: '#D97706' }}>
              <span>⚡</span>
              <span>{stats.xp}</span>
            </div>
            <button
              onClick={() => {
                sound.playTick();
                setCurrentTab('practice');
              }}
              style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontWeight: 800,
                fontSize: '14px',
                color: '#EF4444',
                cursor: 'pointer'
              }}
            >
              <span>❤️</span>
              <span>{stats.hearts}/{stats.maxHearts}</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 800, fontSize: '14px', color: '#3B82F6' }}>
              <span>🏆</span>
              <span>{stats.league}</span>
            </div>
          </header>
        )}

        {/* Screen Content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {activeUnit ? (
            <LessonEngine
              steps={activeUnit.steps}
              hearts={stats.hearts}
              onDeductHeart={handleDeductHeart}
              onLessonComplete={handleLessonComplete}
              onExit={() => setActiveUnit(null)}
            />
          ) : currentTab === 'path' ? (
            <LearningPath
              tracks={TRACKS}
              stats={stats}
              onSelectUnit={(unit) => setActiveUnit(unit)}
            />
          ) : currentTab === 'practice' ? (
            <PracticeScreen
              hearts={stats.hearts}
              maxHearts={stats.maxHearts}
              onRefillHeart={handleRefillHeart}
              onBackToPath={() => setCurrentTab('path')}
            />
          ) : currentTab === 'leaderboard' ? (
            <LeaderboardScreen userXp={stats.xp} league={stats.league} />
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

        {/* Bottom Tab Bar (Only when not in lesson) */}
        {!activeUnit && (
          <nav
            style={{
              background: '#FFFFFF',
              borderTop: '2px solid #E2E8F0',
              display: 'flex',
              justifyContent: 'space-around',
              padding: '8px 0',
              zIndex: 30
            }}
          >
            {[
              { id: 'path', label: 'Learn', icon: '🗺️' },
              { id: 'practice', label: 'Practice', icon: '🩺' },
              { id: 'leaderboard', label: 'League', icon: '🏆' },
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
                  style={{
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    color: isActive ? '#2563EB' : '#94A3B8',
                    cursor: 'pointer',
                    padding: '4px 12px'
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{tab.icon}</span>
                  <span style={{ fontSize: '11px', fontWeight: isActive ? 800 : 600 }}>{tab.label}</span>
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
