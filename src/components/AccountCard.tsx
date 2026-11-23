import React, { useState } from 'react';
import type { CloudSyncState, CloudUser } from '../utils/cloud';

export interface AccountCardProps {
  user: CloudUser | null;
  authReady: boolean;
  syncState: CloudSyncState;
  onSignIn: () => void;
  onSignOut: () => void;
}

const card: React.CSSProperties = {
  padding: '14px',
  background: '#131825',
  borderRadius: '16px',
  border: '1px solid rgba(245, 158, 11, 0.2)'
};

const GoogleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

const StatusLine: React.FC<{ state: CloudSyncState }> = ({ state }) => {
  if (state.status === 'error') {
    return <div style={{ fontSize: '12px', color: '#DC2626', marginTop: '8px' }}>{state.message}</div>;
  }
  const text =
    state.status === 'syncing'
      ? 'Syncing…'
      : state.status === 'synced' && state.at
      ? `✓ Synced at ${new Date(state.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      : null;
  return text ? <div style={{ fontSize: '12px', color: '#16A34A', marginTop: '8px' }}>{text}</div> : null;
};

export const AccountCard: React.FC<AccountCardProps> = ({ user, authReady, syncState, onSignIn, onSignOut }) => {
  const [photoFailed, setPhotoFailed] = useState(false);

  if (!authReady) {
    return (
      <div style={card}>
        <div style={{ fontWeight: 700, fontSize: '14px', color: '#F8FAFC' }}>Google account</div>
        <div style={{ fontSize: '12px', color: '#94A3B8' }}>Checking sign-in…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={card}>
        <div style={{ fontWeight: 700, fontSize: '14px', color: '#F8FAFC' }}>Google account</div>
        <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '10px' }}>
          Sign in to keep your progress in sync across devices and post to the leaderboard.
        </div>
        <button
          onClick={onSignIn}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: '12px',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            background: '#0B0F19',
            color: '#F8FAFC',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <GoogleLogo />
          Sign in with Google
        </button>
        <StatusLine state={syncState} />
      </div>
    );
  }

  const initial = (user.name || user.email || '?').charAt(0).toUpperCase();
  return (
    <div style={card}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {user.photoURL && !photoFailed ? (
          <img
            src={user.photoURL}
            alt=""
            referrerPolicy="no-referrer"
            onError={() => setPhotoFailed(true)}
            style={{ width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0, border: '2px solid #F59E0B' }}
          />
        ) : (
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              flexShrink: 0,
              background: '#F59E0B',
              color: '#0B0F19',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {initial}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '14px', color: '#F8FAFC', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.name || 'Signed in'}
          </div>
          {user.email && (
            <div style={{ fontSize: '12px', color: '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.email}
            </div>
          )}
        </div>
        <button
          onClick={onSignOut}
          style={{
            padding: '8px 12px',
            borderRadius: '12px',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            background: '#0B0F19',
            color: '#94A3B8',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          Sign out
        </button>
      </div>
      <StatusLine state={syncState} />
    </div>
  );
};
