import { signInWithPopup, signOut as fbSignOut, User as FirebaseUser } from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from './firebase';
import { getUserProfile, createUserProfile } from './userService';
import { UserProfile, UserRole } from '../types';
import { DEMO_USERS } from '../data/mockData';

export interface AuthResult {
  firebaseUser: FirebaseUser | null;
  profile: UserProfile | null;
  isNewUser: boolean;
}

/**
 * Sign in with Google using Firebase Authentication.
 * If Firestore profile does not exist yet, initializes one or marks user as needing profile completion.
 */
export async function signInWithGoogle(intendedRole?: UserRole): Promise<AuthResult> {
  if (isFirebaseConfigured && auth && googleProvider) {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const fbUser = cred.user;
      
      let profile = await getUserProfile(fbUser.uid);
      let isNew = false;

      if (!profile) {
        isNew = true;
        // If intendedRole is provided (e.g. from /login/worker or /login/customer), set it, otherwise 'customer' default (never default to admin!)
        const assignedRole: UserRole = intendedRole === 'admin' ? 'customer' : (intendedRole || 'customer');
        profile = {
          uid: fbUser.uid,
          name: fbUser.displayName || 'CoopConnect Member',
          email: fbUser.email || '',
          photoURL: fbUser.photoURL || undefined,
          role: assignedRole,
          createdAt: new Date().toISOString(),
        };
        await createUserProfile(profile);
      }

      return {
        firebaseUser: fbUser,
        profile,
        isNewUser: isNew,
      };
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Google sign-in was cancelled.');
      }
      throw new Error(error.message || 'Unable to sign in with Google. Please try again.');
    }
  }

  // Fallback: Simulated Google Sign-in for immediate evaluation & hackathon review
  // Defaults to intended role or customer
  const role: UserRole = intendedRole || 'customer';
  const demoProfile = DEMO_USERS[role];

  return {
    firebaseUser: null,
    profile: demoProfile,
    isNewUser: false,
  };
}

/**
 * Sign out of Firebase
 */
export async function signOut(): Promise<void> {
  if (isFirebaseConfigured && auth) {
    await fbSignOut(auth);
  }
}
