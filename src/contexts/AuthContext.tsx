import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase/firebase';
import { signInWithGoogle as fbSignInWithGoogle, signOut as fbSignOut } from '../firebase/auth';
import { getUserProfile, updateUserProfile, createUserProfile } from '../firebase/userService';
import { UserProfile, UserRole } from '../types';
import { DEMO_USERS } from '../data/mockData';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
  loginWithGoogle: (intendedRole?: UserRole) => Promise<UserProfile>;
  logout: () => Promise<void>;
  switchDemoRole: (role: UserRole) => Promise<void>;
  completeProfile: (role: UserRole, details: Partial<UserProfile>) => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_SESSION_KEY = 'coopconnect_active_session_uid';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize session
  useEffect(() => {
    let unsubscribe = () => {};

    if (isFirebaseConfigured && auth) {
      unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        setFirebaseUser(fbUser);
        if (fbUser) {
          try {
            const profile = await getUserProfile(fbUser.uid);
            setUser(profile);
          } catch (e) {
            console.error('Error fetching profile for auth state change:', e);
            setUser(null);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });
    } else {
      // In offline / preview mode: check if a demo user was previously chosen or default to customer
      const storedUid = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
      if (storedUid) {
        getUserProfile(storedUid).then((profile) => {
          if (profile) {
            setUser(profile);
          } else {
            // Default demo customer
            setUser(DEMO_USERS.customer);
          }
          setLoading(false);
        });
      } else {
        // Default to demo customer for immediate out-of-the-box readiness
        setUser(DEMO_USERS.customer);
        setLoading(false);
      }
    }

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (intendedRole?: UserRole): Promise<UserProfile> => {
    setLoading(true);
    try {
      const result = await fbSignInWithGoogle(intendedRole);
      if (result.firebaseUser) {
        setFirebaseUser(result.firebaseUser);
      }
      if (result.profile) {
        setUser(result.profile);
        localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, result.profile.uid);
        return result.profile;
      }
      throw new Error('Authentication did not return a valid user profile.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await fbSignOut();
      setUser(null);
      setFirebaseUser(null);
      localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
    } finally {
      setLoading(false);
    }
  };

  const switchDemoRole = async (role: UserRole) => {
    setLoading(true);
    try {
      const demoUser = DEMO_USERS[role];
      if (demoUser) {
        // Ensure it's saved in storage
        await createUserProfile(demoUser);
        setUser(demoUser);
        localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, demoUser.uid);
      }
    } finally {
      setLoading(false);
    }
  };

  const completeProfile = async (role: UserRole, details: Partial<UserProfile>) => {
    if (!user) throw new Error('No authenticated user session to complete.');
    const updated: Partial<UserProfile> = {
      ...details,
      role,
      updatedAt: new Date().toISOString(),
    };
    await updateUserProfile(user.uid, updated);
    setUser((prev) => (prev ? { ...prev, ...updated } : null));
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
        loginWithGoogle,
        logout,
        switchDemoRole,
        completeProfile,
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
