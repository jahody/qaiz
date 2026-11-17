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
  if (!nextAvailableUnit) nextAvailableUnit = tracks[0].units[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#F8FAFC' }}>
      {/* Scrollable Node Path */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 80px' }}>
        {tracks.map((track) => (
          <div key={track.id} style={{ marginBottom: '32px' }}>
            {/* Track Banner Card */}
            <div
              style={{
                background: `linear-gradient(135deg, ${track.color}, #1E293B)`,
                borderRadius: '20px',
                padding: '16px 18px',
                color: '#FFFFFF',
                marginBottom: '24px',
                boxShadow: '0 4px 10px -2px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9 }}>
                COMMUTE TRACK
              </div>
              <div style={{ fontSize: '17px', fontWeight: 800, margin: '2px 0' }}>{track.title}</div>
              <div style={{ fontSize: '12px', opacity: 0.85 }}>💡 {track.metaphor}</div>
            </div>

            {/* Winding Duolingo Node Path */}
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
                          background: '#22C55E',
                          color: '#FFFFFF',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 800,
                          letterSpacing: '0.04em',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                          animation: 'bounce 1s infinite alternate',
                          zIndex: 5
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
                          ? '4px solid #22C55E'
                          : isCompleted
                          ? '4px solid #F59E0B'
                          : '4px solid #CBD5E1',
                        background: isNext
                          ? '#FFFFFF'
                          : isCompleted
                          ? '#FEF3C7'
                          : '#E2E8F0',
                        fontSize: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: isLocked ? 'not-allowed' : 'pointer',
                        boxShadow: isNext
                          ? '0 8px 16px -2px rgba(34, 197, 94, 0.4), 0 4px 0 #16A34A'
                          : isCompleted
                          ? '0 4px 8px rgba(0,0,0,0.08), 0 4px 0 #D97706'
                          : '0 4px 0 #94A3B8',
                        position: 'relative'
                      }}
                    >
                      {isCompleted ? '👑' : isLocked ? '🔒' : unit.icon}
                    </button>

                    {/* Node Title & Subtitle */}
                    <div style={{ marginTop: '6px', textAlign: 'center', maxWidth: '140px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: isLocked ? '#94A3B8' : '#1E293B' }}>
                        {unit.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B', lineHeight: '1.2', marginTop: '2px' }}>
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
          background: '#FFFFFF',
          borderTop: '2px solid #E2E8F0',
          padding: '12px 16px',
          display: 'flex',
          gap: '12px',
          boxShadow: '0 -4px 10px rgba(0,0,0,0.03)'
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
            background: '#22C55E',
            color: '#FFFFFF',
            border: 'none',
            fontWeight: 800,
            fontSize: '15px',
            cursor: 'pointer',
            boxShadow: '0 4px 0 #16A34A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span>▶</span>
          <span>Play: {nextAvailableUnit?.title || 'Commute Lesson'}</span>
        </button>
      </div>
    </div>
  );
};
