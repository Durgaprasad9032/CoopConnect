import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase/firebase';
import { signInWithGoogle as fbSignInWithGoogle, signOut as fbSignOut } from '../firebase/auth';
import { getUserProfile, updateUserProfile } from '../firebase/userService';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
  activeRole: UserRole | null;
  setActiveRole: (role: UserRole) => void;
  loginWithGoogle: (requestedRole: UserRole) => Promise<UserProfile>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Lock to avoid racing onAuthStateChanged during active signInWithGoogle flow
  const isSigningInRef = useRef<boolean>(false);

  // Monitor real Firebase Authentication state
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);

      if (fbUser) {
        // If loginWithGoogle is actively processing, let loginWithGoogle complete the sync
        if (isSigningInRef.current) {
          return;
        }

        try {
          const profile = await getUserProfile(fbUser.uid);
          if (profile) {
            setUser(profile);
            // Default activeRole to first role if not set or not in roles
            setActiveRole((prev) => {
              if (prev && profile.roles.includes(prev)) return prev;
              return profile.roles[0] || null;
            });
          } else {
            setUser(null);
            setActiveRole(null);
          }
        } catch (error) {
          console.error('Error loading Firestore profile onAuthStateChanged:', error);
          setUser(null);
          setActiveRole(null);
        }
      } else {
        setUser(null);
        setActiveRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (requestedRole: UserRole): Promise<UserProfile> => {
    isSigningInRef.current = true;
    setLoading(true);
    try {
      const result = await fbSignInWithGoogle(requestedRole);
      setFirebaseUser(result.firebaseUser);
      setUser(result.profile);
      setActiveRole(requestedRole);
      return result.profile;
    } finally {
      isSigningInRef.current = false;
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      // 1. Navigate to landing/home page first with replace so route changes to '/'
      // and replaces protected dashboard in history
      navigate('/', { replace: true });
      // 2. Sign out of Firebase Auth
      await fbSignOut();
      // 3. Clear session and role state
      setUser(null);
      setFirebaseUser(null);
      setActiveRole(null);
    } catch (error) {
      console.error('Error during logout:', error);
      navigate('/', { replace: true });
      setUser(null);
      setFirebaseUser(null);
      setActiveRole(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    await updateUserProfile(user.uid, updates);
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        isFirebaseConfigured,
        activeRole,
        setActiveRole,
        loginWithGoogle,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
