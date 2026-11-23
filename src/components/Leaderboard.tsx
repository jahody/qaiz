import React, { useState } from 'react';
import type { LeaderboardEntry } from '../utils/cloud';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUid: string | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  signedIn: boolean;
}

const MEDALS = ['🥇', '🥈', '🥉'];

export const Leaderboard: React.FC<LeaderboardProps> = ({
  entries,
  currentUid,
  loading,
  error,
  onRefresh,
  signedIn
}) => {
  const [photoErrors, setPhotoErrors] = useState<Set<string>>(() => new Set());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0B0F19', padding: '16px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#F8FAFC' }}>Leaderboard</h2>
        <button
          onClick={onRefresh}
          disabled={loading}
          style={{
            background: '#131825',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            color: '#F59E0B',
            borderRadius: '10px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: loading ? 'default' : 'pointer',
            fontFamily: 'monospace',
            opacity: loading ? 0.5 : 1
          }}
        >
          {loading ? '⟳ Loading…' : '⟳ Refresh'}
        </button>
      </div>

      {!signedIn && (
        <div
          style={{
            padding: '14px',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '14px',
            marginBottom: '14px',
            fontSize: '13px',
            color: '#FDE047',
            fontWeight: 600,
            lineHeight: '1.4'
          }}
        >
          🔒 Sign in with Google in Settings to see the leaderboard and post your score.
        </div>
      )}

      {error && (
        <div
          style={{
            padding: '10px 14px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '12px',
            marginBottom: '14px',
            fontSize: '12px',
            color: '#FB7185',
            fontWeight: 600
          }}
        >
          {error}
        </div>
      )}

      {entries.length === 0 && !loading && signedIn && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '40px' }}>🏜️</div>
          <div style={{ fontSize: '14px', color: '#94A3B8', fontWeight: 600 }}>No scores yet. Complete a lesson to get on the board!</div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {entries.map((entry, i) => {
          const isMe = entry.uid === currentUid;
          const rank = i + 1;
          const medal = MEDALS[i] ?? null;
          const initial = (entry.name || '?').charAt(0).toUpperCase();

          return (
            <div
              key={entry.uid}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '16px',
                background: isMe
                  ? 'rgba(245, 158, 11, 0.12)'
                  : '#131825',
                border: isMe
                  ? '1px solid rgba(245, 158, 11, 0.35)'
                  : '1px solid rgba(245, 158, 11, 0.08)',
                transition: 'background 0.2s'
              }}
            >
              {/* Rank */}
              <div style={{ width: '28px', textAlign: 'center', fontSize: medal ? '20px' : '14px', fontWeight: 900, color: '#F59E0B', fontFamily: 'monospace', flexShrink: 0 }}>
                {medal ?? rank}
              </div>

              {/* Avatar */}
              {entry.photoURL && !photoErrors.has(entry.uid) ? (
                <img
                  src={entry.photoURL}
                  alt=""
                  referrerPolicy="no-referrer"
                  onError={() => setPhotoErrors((s) => new Set(s).add(entry.uid))}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0, border: isMe ? '2px solid #F59E0B' : '2px solid #1E293B' }}
                />
              ) : (
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    flexShrink: 0,
                    background: isMe ? '#F59E0B' : '#1E293B',
                    color: isMe ? '#0B0F19' : '#94A3B8',
                    fontWeight: 800,
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {initial}
                </div>
              )}

              {/* Name & stats */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 800,
                  color: isMe ? '#FDE047' : '#F8FAFC',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {entry.name}{isMe ? ' (you)' : ''}
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace', marginTop: '2px' }}>
                  {entry.lessonsCompleted} lessons · {entry.streak}d streak
                </div>
              </div>

              {/* XP */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '16px', fontWeight: 900, color: '#FDE047', fontFamily: 'monospace' }}>
                  {entry.xp.toLocaleString()}
                </div>
                <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700 }}>XP</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
