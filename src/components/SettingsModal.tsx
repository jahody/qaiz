import React from 'react';
import { sound } from '../utils/sound';
import { AccountCard, type AccountCardProps } from './AccountCard';

interface SettingsModalProps {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  /** Google sign-in; null while Firebase isn't configured. */
  account: AccountCardProps | null;
  onToggleSound: () => void;
  onToggleHaptics: () => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  soundEnabled,
  hapticsEnabled,
  account,
  onToggleSound,
  onToggleHaptics,
  onResetProgress,
  onClose
}) => {
  const signedIn = !!account?.user;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0B0F19', padding: '16px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#F8FAFC' }}>Settings</h2>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#94A3B8' }}
        >
          ✕
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        {account && <AccountCard {...account} />}

        {/* Sound toggle */}
        <div style={{ padding: '14px', background: '#131825', borderRadius: '16px', border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#F8FAFC' }}>Sound Effects</div>
            <div style={{ fontSize: '12px', color: '#94A3B8' }}>Chimes on correct answers and completions</div>
          </div>
          <button
            onClick={() => {
              onToggleSound();
              sound.playTick();
            }}
            style={{
              padding: '8px 14px',
              borderRadius: '12px',
              border: 'none',
              background: soundEnabled ? '#F59E0B' : '#1E293B',
              color: soundEnabled ? '#0B0F19' : '#94A3B8',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            {soundEnabled ? 'ON 🔊' : 'OFF 🔇'}
          </button>
        </div>

        {/* Haptics toggle */}
        <div style={{ padding: '14px', background: '#131825', borderRadius: '16px', border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#F8FAFC' }}>Vibration & Haptics</div>
            <div style={{ fontSize: '12px', color: '#94A3B8' }}>Tactile pulses on mobile phone taps</div>
          </div>
          <button
            onClick={onToggleHaptics}
            style={{
              padding: '8px 14px',
              borderRadius: '12px',
              border: 'none',
              background: hapticsEnabled ? '#F59E0B' : '#1E293B',
              color: hapticsEnabled ? '#0B0F19' : '#94A3B8',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            {hapticsEnabled ? 'ON 📳' : 'OFF 📴'}
          </button>
        </div>

        {/* PWA Info */}
        <div style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.08)', borderRadius: '16px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
          <div style={{ fontWeight: 800, fontSize: '13px', color: '#FDE047', marginBottom: '4px' }}>
            📱 Install as an app
          </div>
          <div style={{ fontSize: '12px', color: '#CBD5E1', lineHeight: '1.4' }}>
            Open this web page in Chrome on your phone, tap the <strong>⋮ menu</strong>, then select <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong>. It will run full-screen offline!
          </div>
        </div>

        {/* Reset progress */}
        <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
          <button
            onClick={() => {
              const question = signedIn
                ? 'Reset all progress, streaks and XP, on this device and in your Google account?'
                : 'Reset all progress, streaks and XP on this device?';
              if (window.confirm(question)) {
                onResetProgress();
              }
            }}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '14px',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#FB7185',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Reset Progress
          </button>
        </div>
      </div>
    </div>
  );
};
