import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Vérifier que toutes les variables d'environnement sont présentes
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
if (missingVars.length > 0) {
  console.error('Variables d\'environnement Firebase manquantes:', missingVars);
  console.error('Veuillez configurer vos clés Firebase dans le fichier .env');
  console.error('Exemple de configuration dans .env.example');
}

// Initialiser Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase initialisé avec succès');
} catch (error) {
  console.error('❌ Erreur d\'initialisation Firebase:', error);
  throw new Error('Impossible d\'initialiser Firebase. Vérifiez votre configuration.');
}

// Initialiser les services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Configuration pour le développement
if (import.meta.env.DEV) {
  console.log('🔧 Mode développement détecté');
}