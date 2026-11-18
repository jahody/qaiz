import React from 'react';
import { leagueFor, nextLeague } from '../utils/progress';

interface LeaderboardScreenProps {
  userXp: number;
}

// Fixed-XP rival bots; the app has no online multiplayer.
const RIVALS = [
  { name: 'Fei-Fei L. 🖼️', xp: 560 },
  { name: 'Demis H. ♟️', xp: 410 },
  { name: 'Ada Lovelace 👩‍💻', xp: 240 },
  { name: 'Alan Turing ⚙️', xp: 210 },
  { name: 'Geoffrey H. 🧠', xp: 180 },
  { name: 'Claude Opus 🎭', xp: 140 },
  { name: 'Gemini Flash ⚡', xp: 120 },
  { name: 'Andrej K. 🚀', xp: 110 },
  { name: 'Yann L. 🌐', xp: 90 }
];

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ userXp }) => {
  const league = leagueFor(userXp);
  const next = nextLeague(userXp);
  const leaderboard = [...RIVALS.map((r) => ({ ...r, isUser: false })), { name: 'You ⚡', xp: userXp, isUser: true }].sort(
    (a, b) => b.xp - a.xp || Number(b.isUser) - Number(a.isUser)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#F8FAFC', padding: '16px' }}>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '32px' }}>🏆</div>
        <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A' }}>{league} League</h2>
        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
          {next
            ? `${next.minXp - userXp} XP to go until ${next.name} League`
            : 'Top league reached. Keep your streak alive!'}
        </div>
        <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>Race the AI-pioneer bots</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {leaderboard.map((item, idx) => (
          <div
            key={item.name}
            style={{
              padding: '12px 16px',
              borderRadius: '16px',
              background: item.isUser ? '#EFF6FF' : '#FFFFFF',
              border: item.isUser ? '2px solid #3B82F6' : '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: item.isUser ? '0 2px 8px rgba(59, 130, 246, 0.15)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontWeight: 800, fontSize: '14px', color: idx < 3 ? '#D97706' : '#94A3B8', width: '24px' }}>
                #{idx + 1}
              </span>
              <span style={{ fontWeight: item.isUser ? 800 : 600, fontSize: '14px', color: item.isUser ? '#1D4ED8' : '#1E293B' }}>
                {item.name}
              </span>
            </div>
            <div style={{ fontWeight: 800, fontSize: '14px', color: '#D97706' }}>
              {item.xp} XP
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
