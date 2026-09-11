import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { UserProfile, UserRole } from '../types';
import { DEMO_USERS } from '../data/mockData';

const LOCAL_STORAGE_USERS_KEY = 'coopconnect_simulated_users';

function getSimulatedUsers(): Record<string, UserProfile> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading simulated users', e);
  }
  return { ...DEMO_USERS };
}

function saveSimulatedUsers(users: Record<string, UserProfile>) {
  try {
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Error saving simulated users', e);
  }
}

/**
 * Fetch user profile from Firestore users/{uid} collection
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user document from Firestore:', error);
      throw error;
    }
  }

  // Fallback: simulated user storage
  const simulated = getSimulatedUsers();
  return simulated[uid] || null;
}

/**
 * Create a new user profile in Firestore
 */
export async function createUserProfile(profile: UserProfile): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'users', profile.uid);
      await setDoc(docRef, {
        ...profile,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return;
    } catch (error) {
      console.error('Error creating user profile in Firestore:', error);
      throw error;
    }
  }

  // Fallback
  const simulated = getSimulatedUsers();
  simulated[profile.uid] = {
    ...profile,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveSimulatedUsers(simulated);
}

/**
 * Update user role or profile information
 */
export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      return;
    } catch (error) {
      console.error('Error updating user profile in Firestore:', error);
      throw error;
    }
  }

  // Fallback
  const simulated = getSimulatedUsers();
  if (simulated[uid]) {
    simulated[uid] = {
      ...simulated[uid],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveSimulatedUsers(simulated);
  }
}

/**
 * Set or assign a role to a user
 */
export async function setUserRole(uid: string, role: UserRole): Promise<void> {
  return updateUserProfile(uid, { role });
}
