import React from 'react';
import { sound } from '../utils/sound';

interface SettingsModalProps {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  onToggleSound: () => void;
  onToggleHaptics: () => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  soundEnabled,
  hapticsEnabled,
  onToggleSound,
  onToggleHaptics,
  onResetProgress,
  onClose
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#F8FAFC', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A' }}>⚙️ App Preferences</h2>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748B' }}
        >
          ✕
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        {/* Sound toggle */}
        <div style={{ padding: '14px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#1E293B' }}>Sound Effects</div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>Chimes on correct answers and completions</div>
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
              background: soundEnabled ? '#22C55E' : '#E2E8F0',
              color: soundEnabled ? '#FFFFFF' : '#475569',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            {soundEnabled ? 'ON 🔊' : 'OFF 🔇'}
          </button>
        </div>

        {/* Haptics toggle */}
        <div style={{ padding: '14px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#1E293B' }}>Vibration & Haptics</div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>Tactile pulses on mobile phone taps</div>
          </div>
          <button
            onClick={onToggleHaptics}
            style={{
              padding: '8px 14px',
              borderRadius: '12px',
              border: 'none',
              background: hapticsEnabled ? '#22C55E' : '#E2E8F0',
              color: hapticsEnabled ? '#FFFFFF' : '#475569',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            {hapticsEnabled ? 'ON 📳' : 'OFF 📴'}
          </button>
        </div>

        {/* PWA Info */}
        <div style={{ padding: '16px', background: '#EFF6FF', borderRadius: '16px', border: '1px solid #BFDBFE' }}>
          <div style={{ fontWeight: 800, fontSize: '13px', color: '#1E40AF', marginBottom: '4px' }}>
            📱 Install as App on Pixel 8a
          </div>
          <div style={{ fontSize: '12px', color: '#3B82F6', lineHeight: '1.4' }}>
            Open this web page in Chrome on your phone, tap the <strong>⋮ menu</strong>, then select <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong>. It will run full-screen offline!
          </div>
        </div>

        {/* Reset progress */}
        <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
          <button
            onClick={() => {
              if (window.confirm('Reset all progress, streaks, and XP back to start?')) {
                onResetProgress();
              }
            }}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '14px',
              background: '#FEE2E2',
              color: '#DC2626',
              border: '1px solid #FECACA',
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
