import React from 'react';
import type { Track, UserStats, Unit } from '../types';
import { sound } from '../utils/sound';
import { openUnitIds, suggestedUnit } from '../utils/progress';
import { darken, withAlpha } from '../utils/color';

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
  const completed = stats.completedLessons;
  // Every track's first unfinished lesson is open; the CTA launches the suggested one.
  const openIds = openUnitIds(tracks, completed);
  const suggestion = suggestedUnit(tracks, completed);
  const allDone = !suggestion;
  const launchUnit = suggestion?.unit ?? tracks[0].units[0];
  const launchColor = (suggestion?.track ?? tracks[0]).color;
  const outOfHearts = stats.hearts <= 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0B0F19' }}>
      {/* Scrollable Node Path */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 80px' }}>
        {tracks.map((track) => {
          const c = track.color;
          const cleared = track.units.filter((u) => completed.includes(u.id)).length;
          return (
            <div key={track.id} style={{ marginBottom: '32px' }}>
              {/* Track Banner Card (obsidian, tinted with the track's color) */}
              <div
                style={{
                  background: `linear-gradient(135deg, ${withAlpha(c, 0.18)}, rgba(15, 23, 42, 0.9))`,
                  borderRadius: '20px',
                  padding: '16px 18px',
                  border: `1px solid ${withAlpha(c, 0.3)}`,
                  borderLeft: `4px solid ${c}`,
                  color: '#FFFFFF',
                  marginBottom: '24px',
                  boxShadow: `0 4px 20px -2px ${withAlpha(c, 0.12)}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px' }}>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#F8FAFC' }}>{track.title}</div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: c, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                    {cleared}/{track.units.length}
                  </div>
                </div>
              </div>

              {/* Winding Node Path */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '38px' }}>
                {track.units.map((unit, index) => {
                  const offsets = [0, -32, 32, 0];
                  const xOffset = offsets[index % offsets.length];
                  const isCompleted = completed.includes(unit.id);
                  const isOpen = openIds.has(unit.id);
                  const isSuggested = unit.id === suggestion?.unit.id;
                  const isLocked = !isCompleted && !isOpen;

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
                      {/* Floating START Banner on the suggested unit */}
                      {isSuggested && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '-28px',
                            background: c,
                            color: '#0B0F19',
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 900,
                            letterSpacing: '0.04em',
                            boxShadow: `0 0 12px ${withAlpha(c, 0.5)}`,
                            animation: 'bounce 1s infinite alternate',
                            zIndex: 5,
                            fontFamily: 'monospace'
                          }}
                        >
                          NEXT
                        </div>
                      )}

                      {/* Circular Node Button */}
                      <button
                        disabled={isLocked}
                        aria-label={`${unit.title}${isCompleted ? ' (completed)' : isLocked ? ' (locked)' : ''}`}
                        onClick={() => {
                          sound.playTick();
                          onSelectUnit(unit);
                        }}
                        style={{
                          width: '74px',
                          height: '74px',
                          borderRadius: '50%',
                          border: isLocked ? `2px solid ${withAlpha(c, 0.3)}` : `3px solid ${c}`,
                          background: isOpen ? darken(c, 0.88) : isCompleted ? darken(c, 0.75) : '#0F172A',
                          fontSize: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: isLocked ? 'not-allowed' : 'pointer',
                          boxShadow: isOpen
                            ? `0 0 20px ${withAlpha(c, 0.4)}, 0 4px 0 ${darken(c, 0.45)}`
                            : isCompleted
                            ? `0 0 10px ${withAlpha(c, 0.2)}, 0 4px 0 ${darken(c, 0.55)}`
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
          );
        })}
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
            sound.playTick();
            onSelectUnit(launchUnit);
          }}
          style={{
            flex: 1,
            padding: '14px',
            borderRadius: '16px',
            background: `linear-gradient(135deg, ${launchColor}, ${darken(launchColor, 0.15)})`,
            color: '#070A11',
            border: 'none',
            fontWeight: 900,
            fontSize: '15px',
            cursor: 'pointer',
            boxShadow: `0 0 18px ${withAlpha(launchColor, 0.35)}, 0 4px 0 ${darken(launchColor, 0.55)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontFamily: 'monospace'
          }}
        >
          <span>{outOfHearts ? '💔' : allDone ? '↻' : '▶'}</span>
          <span>{outOfHearts ? 'Out of hearts: practice' : launchUnit.title}</span>
        </button>
      </div>
    </div>
  );
};
