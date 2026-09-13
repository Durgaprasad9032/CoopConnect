import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile, UserRole } from '../types';
import { User as FirebaseUser } from 'firebase/auth';

/**
 * Format Firestore timestamp, string, or date into ISO string.
 */
function formatTimestamp(val: any): string {
  if (!val) return new Date().toISOString();
  if (typeof val === 'string') return val;
  if (val instanceof Timestamp || typeof val.toDate === 'function') {
    try {
      return val.toDate().toISOString();
    } catch {
      return new Date().toISOString();
    }
  }
  if (val.seconds) {
    return new Date(val.seconds * 1000).toISOString();
  }
  return new Date().toISOString();
}

/**
 * Fetch user profile from Firestore users/{uid} collection.
 * Roles are stored strictly in Firestore as an array of strings: roles: ["customer"] | ["worker"] | ["admin"]
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!db) {
    throw new Error('Firebase Firestore is not initialized. Please ensure Firebase configuration is provided.');
  }

  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      // Normalize roles array: roles: ["customer"] | ["worker"] | ["admin"]
      let roles: UserRole[] = [];
      if (Array.isArray(data.roles)) {
        roles = data.roles as UserRole[];
      } else if (data.role && typeof data.role === 'string') {
        roles = [data.role as UserRole];
      }

      const profile: UserProfile = {
        uid: data.uid || uid,
        name: data.name || 'Coop Member',
        email: data.email || '',
        photoURL: data.photoURL || undefined,
        roles,
        role: roles[0] || undefined,
        phone: data.phone,
        address: data.address,
        createdAt: formatTimestamp(data.createdAt),
        updatedAt: data.updatedAt ? formatTimestamp(data.updatedAt) : undefined,
        cooperativeId: data.cooperativeId,
        cooperativeName: data.cooperativeName,
        profession: data.profession,
        skills: data.skills,
        experienceYears: data.experienceYears,
        certificates: data.certificates,
        verificationStatus: data.verificationStatus,
        availability: data.availability,
        rating: data.rating,
        totalJobs: data.totalJobs,
        currentWorkload: data.currentWorkload,
        earnings: data.earnings,
        welfareBalance: data.welfareBalance,
      };

      return profile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user document from Firestore:', error);
    throw error;
  }
}

/**
 * Handle new user creation or profile synchronization during Google sign-in.
 * CRITICAL SECURITY RULE: Users can NEVER self-assign "worker" or "admin" roles.
 * A new user can only register as "customer".
 */
export async function syncUserProfileOnSignIn(
  fbUser: FirebaseUser,
  requestedRole: UserRole
): Promise<UserProfile> {
  if (!db) {
    throw new Error('Firestore is not initialized.');
  }

  const docRef = doc(db, 'users', fbUser.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // User already exists in Firestore: return existing profile with their authorized roles
    const existing = await getUserProfile(fbUser.uid);
    if (!existing) {
      throw new Error('Failed to retrieve user profile.');
    }
    return existing;
  }

  // Document does not exist: New user signing in for the first time
  if (requestedRole === 'customer') {
    // New registration as Customer is authorized
    const newCustomerDoc = {
      uid: fbUser.uid,
      name: fbUser.displayName || 'Coop Member',
      email: fbUser.email || '',
      photoURL: fbUser.photoURL || null,
      roles: ['customer'],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(docRef, newCustomerDoc);

    return {
      uid: fbUser.uid,
      name: newCustomerDoc.name,
      email: newCustomerDoc.email,
      photoURL: fbUser.photoURL || undefined,
      roles: ['customer'],
      role: 'customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  // If new user requested 'worker' or 'admin':
  // Users cannot self-assign these roles.
  if (requestedRole === 'worker') {
    throw new Error(
      'Access Denied: You are not registered as a cooperative worker. Worker accounts must be verified and authorized by cooperative administration.'
    );
  }

  if (requestedRole === 'admin') {
    throw new Error(
      'Access Denied: You do not have administrator permissions. Admin access must be explicitly granted in Cloud Firestore.'
    );
  }

  // Fallback default
  throw new Error('Unauthorized role request.');
}

/**
 * Update user profile information in Firestore.
 * Strips role fields to ensure client cannot elevate privileges.
 */
export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
  if (!db) throw new Error('Firestore is not initialized.');

  // Security check: NEVER allow updating roles or uid from client profile updates
  const safeUpdates = { ...updates };
  delete (safeUpdates as any).roles;
  delete (safeUpdates as any).role;
  delete (safeUpdates as any).uid;

  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, {
    ...safeUpdates,
    updatedAt: serverTimestamp(),
  });
}
