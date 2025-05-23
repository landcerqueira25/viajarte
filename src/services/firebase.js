import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// COLE AQUI AS SUAS CREDENCIAIS DO FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyCKOZSmC2aYgiAJaFHRCEf3p12nMpOjpwM",
  authDomain: "viajarte-30655.firebaseapp.com",
  projectId: "viajarte-30655",
  storageBucket: "viajarte-30655.firebasestorage.app",
  messagingSenderId: "341273011252",
  appId: "1:341273011252:web:b0c72e331ab3b4b0855661",
  measurementId: "G-3Z42718V90"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;