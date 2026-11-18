import React from 'react';
import type { Track, UserStats, Unit } from '../types';
import { sound } from '../utils/sound';

interface LearningPathProps {
  tracks: Track[];
  stats: UserStats;
  onSelectUnit: (unit: Unit) => void;
}

export const LearningPath: React.FC<LearningPathProps> = ({
  tracks,
  stats,
  onSelectUnit
}) => {
  // Find next available unit
  let nextAvailableUnit: Unit | null = null;
  for (const track of tracks) {
    for (const unit of track.units) {
      if (!stats.completedLessons.includes(unit.id)) {
        nextAvailableUnit = unit;
        break;
      }
    }
    if (nextAvailableUnit) break;
  }
  const allDone = !nextAvailableUnit;
  if (!nextAvailableUnit) nextAvailableUnit = tracks[0].units[0];
  const outOfHearts = stats.hearts <= 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0B0F19' }}>
      {/* Scrollable Node Path */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 80px' }}>
        {tracks.map((track) => (
          <div key={track.id} style={{ marginBottom: '32px' }}>
            {/* Track Banner Card (Cyber-Bento Obsidian with Amber Accents) */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(15, 23, 42, 0.9))',
                borderRadius: '20px',
                padding: '16px 18px',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                color: '#FFFFFF',
                marginBottom: '24px',
                boxShadow: '0 4px 20px -2px rgba(245, 158, 11, 0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#F59E0B', fontFamily: 'monospace' }}>
                <span>COMMUTE SECTOR</span>
                <span style={{ color: '#FDE047' }}>
                  {track.units.filter((u) => stats.completedLessons.includes(u.id)).length}/{track.units.length} CLEARED
                </span>
              </div>
              <div style={{ fontSize: '17px', fontWeight: 800, margin: '2px 0', color: '#F8FAFC' }}>{track.title}</div>
              <div style={{ fontSize: '12px', color: '#94A3B8' }}>💡 {track.metaphor}</div>
            </div>

            {/* Winding Node Path */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px' }}>
              {track.units.map((unit, index) => {
                const offsets = [0, -32, 32, 0];
                const xOffset = offsets[index % offsets.length];
                const isCompleted = stats.completedLessons.includes(unit.id);
                const isNext = unit.id === nextAvailableUnit?.id;
                const isLocked = !isCompleted && !isNext;

                return (
                  <div
                    key={unit.id}
                    style={{
                      transform: `translateX(${xOffset}px)`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative'
                    }}
                  >
                    {/* Floating START Banner on next available unit */}
                    {isNext && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '-28px',
                          background: '#F59E0B',
                          color: '#0B0F19',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 900,
                          letterSpacing: '0.04em',
                          boxShadow: '0 0 12px rgba(245, 158, 11, 0.5)',
                          animation: 'bounce 1s infinite alternate',
                          zIndex: 5,
                          fontFamily: 'monospace'
                        }}
                      >
                        COMMUTE · 5 MIN
                      </div>
                    )}

                    {/* Circular Node Button */}
                    <button
                      disabled={isLocked}
                      onClick={() => {
                        sound.playTick();
                        onSelectUnit(unit);
                      }}
                      style={{
                        width: '74px',
                        height: '74px',
                        borderRadius: '50%',
                        border: isNext
                          ? '3px solid #F59E0B'
                          : isCompleted
                          ? '3px solid #FDE047'
                          : '2px solid #334155',
                        background: isNext
                          ? '#1E1B18'
                          : isCompleted
                          ? '#292010'
                          : '#0F172A',
                        fontSize: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: isLocked ? 'not-allowed' : 'pointer',
                        boxShadow: isNext
                          ? '0 0 20px rgba(245, 158, 11, 0.4), 0 4px 0 #B45309'
                          : isCompleted
                          ? '0 0 10px rgba(253, 224, 71, 0.2), 0 4px 0 #854D0E'
                          : '0 4px 0 #1E293B',
                        position: 'relative'
                      }}
                    >
                      {isCompleted ? '👑' : isLocked ? '🔒' : unit.icon}
                    </button>

                    {/* Node Title & Subtitle */}
                    <div style={{ marginTop: '6px', textAlign: 'center', maxWidth: '140px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: isLocked ? '#64748B' : '#F8FAFC' }}>
                        {unit.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', lineHeight: '1.2', marginTop: '2px' }}>
                        {unit.subtitle}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Bottom Action Bar */}
      <div
        style={{
          position: 'sticky',
          bottom: 0,
          background: '#0B0F19',
          borderTop: '1px solid rgba(245, 158, 11, 0.2)',
          padding: '12px 16px',
          display: 'flex',
          gap: '12px',
          boxShadow: '0 -4px 15px rgba(0,0,0,0.5)'
        }}
      >
        <button
          onClick={() => {
            if (nextAvailableUnit) {
              sound.playTick();
              onSelectUnit(nextAvailableUnit);
            }
          }}
          style={{
            flex: 1,
            padding: '14px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            color: '#070A11',
            border: 'none',
            fontWeight: 900,
            fontSize: '15px',
            cursor: 'pointer',
            boxShadow: '0 0 18px rgba(245, 158, 11, 0.35), 0 4px 0 #92400E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontFamily: 'monospace'
          }}
        >
          <span>{outOfHearts ? '💔' : '▶'}</span>
          <span>
            {outOfHearts
              ? 'OUT OF HEARTS: PRACTICE'
              : `${allDone ? 'REPLAY' : 'LAUNCH'}: ${nextAvailableUnit?.title || 'COMMUTE LESSON'}`}
          </span>
        </button>
      </div>
    </div>
  );
};
