import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Créer ou mettre à jour le profil utilisateur dans Firestore
  const createUserProfile = async (user: FirebaseUser) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Créer le profil utilisateur
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          bio: '',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await setDoc(userRef, userData);
        console.log('✅ Profil utilisateur créé:', user.email);
      } else {
        console.log('✅ Profil utilisateur existant:', user.email);
      }
    } catch (error) {
      console.error('Erreur lors de la création du profil utilisateur:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Connexion réussie:', email);
      return result;
    } catch (error: any) {
      console.error('❌ Erreur de connexion:', error);
      
      // Messages d'erreur personnalisés
      switch (error.code) {
        case 'auth/user-not-found':
          throw new Error('Aucun compte trouvé avec cet email');
        case 'auth/wrong-password':
          throw new Error('Mot de passe incorrect');
        case 'auth/invalid-email':
          throw new Error('Format d\'email invalide');
        case 'auth/user-disabled':
          throw new Error('Ce compte a été désactivé');
        case 'auth/too-many-requests':
          throw new Error('Trop de tentatives. Réessayez plus tard');
        default:
          throw new Error('Erreur de connexion. Vérifiez vos identifiants');
      }
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ Inscription réussie:', email);
      
      // Créer le profil utilisateur
      await createUserProfile(result.user);
      
      return result;
    } catch (error: any) {
      console.error('❌ Erreur d\'inscription:', error);
      
      // Messages d'erreur personnalisés
      switch (error.code) {
        case 'auth/email-already-in-use':
          throw new Error('Un compte existe déjà avec cet email');
        case 'auth/invalid-email':
          throw new Error('Format d\'email invalide');
        case 'auth/operation-not-allowed':
          throw new Error('L\'inscription par email est désactivée');
        case 'auth/weak-password':
          throw new Error('Le mot de passe doit contenir au moins 6 caractères');
        default:
          throw new Error('Erreur lors de l\'inscription');
      }
    }
  };

  const loginWithGoogle = async () => {
    try {
      // Essayer d'abord avec popup, puis fallback vers redirect
      let result;
      try {
        result = await signInWithPopup(auth, googleProvider);
      } catch (popupError: any) {
        if (popupError.code === 'auth/popup-blocked') {
          // Fallback vers redirect si popup bloquée
          await signInWithRedirect(auth, googleProvider);
          return; // La redirection va recharger la page
        }
        throw popupError;
      }
      
      provider.addScope('email');
      provider.addScope('profile');
      
      const result = await signInWithPopup(auth, provider);
      console.log('✅ Connexion Google réussie:', result.user.email);
      
      return result;
    } catch (error: any) {
      console.error('❌ Erreur de connexion Google:', error);
      
      // Messages d'erreur personnalisés
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          throw new Error('Connexion annulée par l\'utilisateur');
        case 'auth/popup-blocked':
          throw new Error('Popup bloquée. Autorisez les popups pour ce site');
        case 'auth/cancelled-popup-request':
          throw new Error('Demande de connexion annulée');
        case 'auth/account-exists-with-different-credential':
          throw new Error('Un compte existe déjà avec cet email');
        default:
          throw new Error('Erreur de connexion avec Google');
      }
    }
  };

  // Gérer le retour de redirection Google
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const user = result.user;
          console.log('✅ Connexion Google par redirection réussie:', user.email);
          
          // Créer le profil utilisateur si nécessaire
          try {
            await createUserProfile(user);
          } catch (profileError) {
            console.error('Erreur création profil:', profileError);
          }
        }
      } catch (error: any) {
        console.error('❌ Erreur redirection Google:', error);
        toast.error('Erreur lors de la connexion Google');
      }
    };

    handleRedirectResult();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      console.log('✅ Déconnexion réussie');
    } catch (error) {
      console.error('❌ Erreur de déconnexion:', error);
      throw new Error('Erreur lors de la déconnexion');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      if (user) {
        console.log('👤 Utilisateur connecté:', user.email);
        setCurrentUser({
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || undefined,
          photoURL: user.photoURL || undefined,
        });
      } else {
        console.log('👤 Utilisateur déconnecté');
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    register,
    loginWithGoogle,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};