import React from 'react';

interface LeaderboardScreenProps {
  userXp: number;
  league: string;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ userXp, league }) => {
  const leaderboard = [
    { rank: 1, name: 'Ada Lovelace 👩‍💻', xp: 240, avatar: '🥇' },
    { rank: 2, name: 'Alan Turing ⚙️', xp: 210, avatar: '🥈' },
    { rank: 3, name: 'You (Adam) ⚡', xp: userXp, avatar: '🥉', isUser: true },
    { rank: 4, name: 'Geoffrey H. 🧠', xp: 180, avatar: '4' },
    { rank: 5, name: 'Claude Opus 🎭', xp: 140, avatar: '5' },
    { rank: 6, name: 'Gemini Flash ⚡', xp: 120, avatar: '6' },
    { rank: 7, name: 'Andrej K. 🚀', xp: 110, avatar: '7' },
    { rank: 8, name: 'Yann L. 🌐', xp: 90, avatar: '8' }
  ].sort((a, b) => b.xp - a.xp);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#F8FAFC', padding: '16px' }}>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '32px' }}>🏆</div>
        <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A' }}>{league} League</h2>
        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
          Top 3 advance to Silver League at midnight Sunday!
        </div>
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
              <span style={{ fontWeight: 800, fontSize: '14px', color: idx < 3 ? '#D97706' : '#94A3B8', width: '20px' }}>
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
