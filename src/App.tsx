import { useState, useEffect } from 'react';
import { TRACKS } from './data/curriculumData';
import type { UserStats, Unit } from './types';
import { LearningPath } from './components/LearningPath';
import { LessonEngine } from './components/LessonEngine';
import { PracticeScreen } from './components/PracticeScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { SettingsModal } from './components/SettingsModal';
import { sound } from './utils/sound';

const STORAGE_KEY = 'qaiz_user_progress_v2';

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

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // ignore
    }
  }, [stats]);

  // Automatic heart refill check (1 heart every 4 hours)
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
        background: '#070A11',
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

      {/* Main Container / Mobile Chassis */}
      <div
        style={{
          width: isPhoneFrame ? '100%' : '100%',
          maxWidth: isPhoneFrame ? '390px' : '640px',
          height: isPhoneFrame ? '820px' : '100vh',
          maxHeight: isPhoneFrame ? '92vh' : '100vh',
          background: '#0B0F19',
          borderRadius: isPhoneFrame ? '36px' : '0',
          border: isPhoneFrame ? '8px solid #141B2D' : 'none',
          boxShadow: isPhoneFrame ? '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px -10px rgba(245, 158, 11, 0.15)' : 'none',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '13px', color: '#F59E0B', fontFamily: 'monospace' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5">
                <path d="M12 2c0 4-4 6-4 10a6 6 0 0 0 12 0c0-4-3-7-3-7s-1 2-2 2-2-3-3-5z" fill="rgba(245,158,11,0.25)" />
              </svg>
              <span>{stats.streak}d</span>
            </div>

            {/* XP: Voltage Bolt */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '13px', color: '#FDE047', fontFamily: 'monospace' }}>
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

            {/* League */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 700, fontSize: '12px', color: '#38BDF8', fontFamily: 'monospace' }}>
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
