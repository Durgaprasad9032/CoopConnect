import { signInWithPopup, signOut as fbSignOut, User as FirebaseUser } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { syncUserProfileOnSignIn, getUserProfile } from './userService';
import { UserProfile, UserRole } from '../types';

export interface AuthResult {
  firebaseUser: FirebaseUser;
  profile: UserProfile;
}

/**
 * Sign in with Google using Firebase Authentication.
 * Validates against Firestore collection users/{uid} to check that the requested role
 * exists inside the user's `roles` array.
 */
export async function signInWithGoogle(requestedRole: UserRole): Promise<AuthResult> {
  if (!auth || !googleProvider) {
    throw new Error(
      'Firebase Authentication is not initialized. Please ensure your Firebase credentials are configured in .env.'
    );
  }

  try {
    const cred = await signInWithPopup(auth, googleProvider);
    const fbUser = cred.user;

    // Sync or fetch profile from Firestore
    const profile = await syncUserProfileOnSignIn(fbUser, requestedRole);

    // Verify role authorization
    if (!profile.roles || !profile.roles.includes(requestedRole)) {
      throw new Error(
        `Access Denied: Your account (${fbUser.email}) does not have permission for the ${requestedRole.toUpperCase()} role.`
      );
    }

    return {
      firebaseUser: fbUser,
      profile: {
        ...profile,
        role: requestedRole, // Set active requested role for session
      },
    };
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Google sign-in was cancelled.');
    }
    if (error.code === 'auth/cancelled-popup-request') {
      throw new Error('Authentication request was cancelled.');
    }
    throw new Error(error.message || 'Unable to sign in with Google. Please try again.');
  }
}

/**
 * Sign out of Firebase Authentication
 */
export async function signOut(): Promise<void> {
  if (auth) {
    await fbSignOut(auth);
  }
}
