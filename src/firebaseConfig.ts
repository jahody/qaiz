/**
 * Firebase web app config, from the Firebase console (Project settings → Your apps → Web app).
 * These values are public by design: access to data is limited by the Firestore rules in
 * `firestore.rules`. While apiKey is empty, Google sign-in and sync stay hidden.
 */
export const firebaseConfig = {
  apiKey: 'AIzaSyAJ1ubaGJ-fBhXM3ezcMAi7DS19wY71YS8',
  authDomain: 'qaiz-4d1d9.firebaseapp.com',
  projectId: 'qaiz-4d1d9',
  appId: '1:821653094359:web:0a4518179cac1912c05592'
};

export const cloudEnabled = firebaseConfig.apiKey !== '';
