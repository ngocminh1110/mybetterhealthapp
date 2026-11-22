import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
// @ts-expect-error getReactNativePersistence exists in the React Native build of
// firebase/auth, but the default TypeScript types (made for web) do not list it.
import { getAuth, getReactNativePersistence, initializeAuth, type Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

/** Shows a clear message in the terminal if the .env file is missing or incomplete. */
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.warn(
        'Firebase config is missing. Copy .env.example to .env, add your values and restart Expo.',
    );
}

// Fast Refresh can run this file again. Reuse the app if it already exists.
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);


function createAuth(): Auth {
    if (Platform.OS === 'web') return getAuth(app);
    try {
        return initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
    } catch {
        // initializeAuth throws if Auth was already created (e.g. after Fast Refresh)
        return getAuth(app);
    }
}

export const auth = createAuth();
export const db = getFirestore(app);