import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore/lite';
import { firebaseConfig } from '../firebaseConfig';
import { parseSynced, type SyncedProgress } from './sync';

/** Google sign-in plus one Firestore document per user (`users/{uid}`) holding their SyncedProgress. */

export interface CloudUser {
  uid: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface CloudSyncState {
  status: 'idle' | 'syncing' | 'synced' | 'error';
  /** Time of the last successful sync. */
  at?: number;
  message?: string;
}

// The Firebase SDK is loaded on first use, in its own chunk, so the app shell stays small.
// Firestore Lite (plain HTTPS, no realtime listeners or offline cache) is all a sync on demand needs.
let services: Promise<{
  auth: Auth;
  db: Firestore;
  authLib: typeof import('firebase/auth');
  dbLib: typeof import('firebase/firestore/lite');
}> | null = null;

function load() {
  services ??= Promise.all([
    import('firebase/app'),
    import('firebase/auth'),
    import('firebase/firestore/lite')
  ]).then(([{ initializeApp }, authLib, dbLib]) => {
    const app = initializeApp(firebaseConfig);
    return { auth: authLib.getAuth(app), db: dbLib.getFirestore(app), authLib, dbLib };
  });
  return services;
}

/** Calls back with the signed-in user (or null) now and on every change. Returns an unsubscribe function. */
export async function watchUser(onChange: (user: CloudUser | null) => void): Promise<() => void> {
  const { auth, authLib } = await load();
  return authLib.onAuthStateChanged(auth, (u) =>
    onChange(u ? { uid: u.uid, name: u.displayName, email: u.email, photoURL: u.photoURL } : null)
  );
}

/** Opens Google's account picker. Resolves quietly if the user closes it. */
export async function signInWithGoogle(): Promise<void> {
  const { auth, authLib } = await load();
  const provider = new authLib.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    await authLib.signInWithPopup(auth, provider);
  } catch (e) {
    const code = (e as { code?: string }).code;
    if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return;
    throw e;
  }
}

export async function signOutOfGoogle(): Promise<void> {
  const { auth, authLib } = await load();
  await authLib.signOut(auth);
}

/**
 * Reads the user's cloud copy, lets `merge` combine it with this device's progress (cloud is null
 * when there is no valid copy yet), writes the result back and returns it. Runs as a transaction,
 * so two devices syncing at the same moment can't overwrite each other.
 */
export async function syncProgress(
  uid: string,
  merge: (cloud: SyncedProgress | null) => SyncedProgress
): Promise<SyncedProgress> {
  const { db, dbLib } = await load();
  const ref = dbLib.doc(db, 'users', uid);
  return dbLib.runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const merged = merge(snap.exists() ? parseSynced(snap.data()) : null);
    tx.set(ref, merged);
    return merged;
  });
}

/** Human-readable message for a Firebase error. */
export function describeCloudError(e: unknown): string {
  const code = (e as { code?: string }).code ?? '';
  if (code === 'auth/popup-blocked') return 'The browser blocked the sign-in window. Allow pop-ups for this site and try again.';
  if (code === 'auth/unauthorized-domain') return 'This site is not on the Firebase project’s list of authorized domains.';
  if (code === 'auth/network-request-failed' || code === 'unavailable') return 'No connection. It will retry when you are back online.';
  if (code === 'permission-denied') return 'The cloud database refused access. Check the Firestore rules.';
  return 'Something went wrong. Try again in a moment.';
}
