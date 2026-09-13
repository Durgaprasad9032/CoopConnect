import {
  collection,
  doc,
  setDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
  getDocs,
  serverTimestamp,
  Timestamp,
  Unsubscribe,
  runTransaction,
} from 'firebase/firestore';
import { db } from './firebase';
import { FirestoreBooking, BookingStatus } from '../types';

/**
 * Format Firestore timestamp, string, or date into ISO string.
 */
export function formatTimestamp(val: any): string {
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

export interface CreateCustomerBookingInput {
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerPhotoURL?: string | null;
  serviceType: string;
  description: string;
  address: string;
  phoneNumber?: string;
  bookingType: 'Emergency' | 'Scheduled';
  scheduledDate?: string | null;
  scheduledTime?: string | null;
}

/**
 * Create a new customer booking in Firestore `bookings` collection.
 * Uses auto-generated Firestore document ID and serverTimestamp().
 */
export async function createCustomerBooking(
  input: CreateCustomerBookingInput
): Promise<FirestoreBooking> {
  if (!db) {
    throw new Error('Firestore is not initialized. Please check Firebase configuration.');
  }

  if (!input.customerId) {
    throw new Error('Customer ID is required to create a booking.');
  }

  // 1. Let Firestore generate a unique document reference in `bookings`
  const bookingsCol = collection(db, 'bookings');
  const newDocRef = doc(bookingsCol);
  const bookingId = newDocRef.id;

  // 2. Friendly booking reference derived from Firestore document ID
  const bookingReference = `BK-${bookingId.slice(0, 6).toUpperCase()}`;

  // 3. Generate a 4-digit verification OTP for doorstep service
  const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

  const bookingData = {
    customerId: input.customerId,
    customerName: input.customerName || 'Cooperative Member',
    customerEmail: input.customerEmail || '',
    customerPhotoURL: input.customerPhotoURL || null,
    serviceType: input.serviceType,
    description: input.description.trim(),
    address: input.address.trim(),
    phoneNumber: input.phoneNumber?.trim() || '',
    bookingType: input.bookingType,
    scheduledDate: input.bookingType === 'Emergency' ? null : (input.scheduledDate || null),
    scheduledTime: input.bookingType === 'Emergency' ? null : (input.scheduledTime || null),
    status: 'REQUESTED' as const,
    workerId: null,
    workerName: null,
    bookingReference,
    otp,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(newDocRef, bookingData);

  return {
    id: bookingId,
    bookingReference,
    customerId: bookingData.customerId,
    customerName: bookingData.customerName,
    customerEmail: bookingData.customerEmail,
    customerPhotoURL: bookingData.customerPhotoURL,
    serviceType: bookingData.serviceType,
    description: bookingData.description,
    address: bookingData.address,
    phoneNumber: bookingData.phoneNumber,
    bookingType: bookingData.bookingType,
    scheduledDate: bookingData.scheduledDate,
    scheduledTime: bookingData.scheduledTime,
    status: 'REQUESTED',
    workerId: null,
    workerName: null,
    otp,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Transform raw Firestore booking document data into typed FirestoreBooking.
 */
function mapDocToBooking(docId: string, data: any): FirestoreBooking {
  const bookingReference = data.bookingReference || `BK-${docId.slice(0, 6).toUpperCase()}`;
  const serviceType = data.serviceType || data.serviceName || 'General Service';
  const address = data.address || data.customerAddress || '';
  const phoneNumber = data.phoneNumber || data.customerPhone || '';
  const bookingType = data.bookingType || data.type || 'Scheduled';

  return {
    id: docId,
    bookingReference,
    customerId: data.customerId || '',
    customerName: data.customerName || 'Cooperative Member',
    customerEmail: data.customerEmail || '',
    customerPhotoURL: data.customerPhotoURL || null,
    serviceType,
    description: data.description || '',
    address,
    phoneNumber,
    bookingType,
    scheduledDate: data.scheduledDate || null,
    scheduledTime: data.scheduledTime || null,
    status: data.status || 'REQUESTED',
    workerId: data.workerId || null,
    workerName: data.workerName || null,
    acceptedAt: data.acceptedAt ? formatTimestamp(data.acceptedAt) : undefined,
    rejectedBy: data.rejectedBy || undefined,
    rejectedAt: data.rejectedAt ? formatTimestamp(data.rejectedAt) : undefined,
    otp: data.otp || undefined,
    createdAt: formatTimestamp(data.createdAt),
    updatedAt: data.updatedAt ? formatTimestamp(data.updatedAt) : undefined,
  };
}

/**
 * Subscribe in real time to the bookings of a specific customer.
 * Sorts client-side by createdAt descending to avoid requiring composite indexes.
 */
export function subscribeCustomerBookings(
  customerId: string,
  onSuccess: (bookings: FirestoreBooking[]) => void,
  onError: (error: Error) => void
): Unsubscribe {
  if (!db) {
    onError(new Error('Firestore is not initialized.'));
    return () => {};
  }

  const bookingsCol = collection(db, 'bookings');
  const q = query(bookingsCol, where('customerId', '==', customerId));

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const results: FirestoreBooking[] = [];
      querySnapshot.forEach((d) => {
        results.push(mapDocToBooking(d.id, d.data()));
      });

      // Sort client-side: newest first
      results.sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return timeB - timeA;
      });

      onSuccess(results);
    },
    (err) => {
      console.error('Error in subscribeCustomerBookings:', err);
      onError(err);
    }
  );

  return unsubscribe;
}

/**
 * Subscribe in real time to all incoming "REQUESTED" bookings for worker discovery.
 */
export function subscribeRequestedBookings(
  onSuccess: (bookings: FirestoreBooking[]) => void,
  onError: (error: Error) => void
): Unsubscribe {
  if (!db) {
    onError(new Error('Firestore is not initialized.'));
    return () => {};
  }

  const bookingsCol = collection(db, 'bookings');
  const q = query(bookingsCol, where('status', '==', 'REQUESTED'));

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const results: FirestoreBooking[] = [];
      querySnapshot.forEach((d) => {
        results.push(mapDocToBooking(d.id, d.data()));
      });

      // Sort client-side: newest first
      results.sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return timeB - timeA;
      });

      onSuccess(results);
    },
    (err) => {
      console.error('Error in subscribeRequestedBookings:', err);
      onError(err);
    }
  );

  return unsubscribe;
}

/**
 * Subscribe in real time to all jobs assigned to a specific worker.
 */
export function subscribeWorkerJobs(
  workerUid: string,
  onSuccess: (bookings: FirestoreBooking[]) => void,
  onError: (error: Error) => void
): Unsubscribe {
  if (!db) {
    onError(new Error('Firestore is not initialized.'));
    return () => {};
  }

  const bookingsCol = collection(db, 'bookings');
  const q = query(bookingsCol, where('workerId', '==', workerUid));

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const results: FirestoreBooking[] = [];
      querySnapshot.forEach((d) => {
        results.push(mapDocToBooking(d.id, d.data()));
      });

      // Sort client-side: newest first
      results.sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return timeB - timeA;
      });

      onSuccess(results);
    },
    (err) => {
      console.error('Error in subscribeWorkerJobs:', err);
      onError(err);
    }
  );

  return unsubscribe;
}

/**
 * Accept a REQUESTED booking using a Firestore transaction.
 * Ensures two workers cannot accept the same job concurrently.
 */
export async function acceptWorkerJob(
  bookingId: string,
  workerUid: string,
  workerName: string
): Promise<void> {
  if (!db) {
    throw new Error('Firestore is not initialized.');
  }

  const bookingRef = doc(db, 'bookings', bookingId);

  await runTransaction(db, async (transaction) => {
    const bookingDoc = await transaction.get(bookingRef);
    if (!bookingDoc.exists()) {
      throw new Error('Booking request not found.');
    }

    const data = bookingDoc.data();
    if (data.status !== 'REQUESTED') {
      throw new Error('This job has already been assigned to another worker.');
    }

    transaction.update(bookingRef, {
      status: 'ACCEPTED',
      workerId: workerUid,
      workerName: workerName || 'Assigned Worker',
      acceptedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
}

/**
 * Reject a REQUESTED booking using a Firestore transaction.
 * Does not allow rejecting an already ACCEPTED booking.
 */
export async function rejectWorkerJob(
  bookingId: string,
  workerUid: string
): Promise<void> {
  if (!db) {
    throw new Error('Firestore is not initialized.');
  }

  const bookingRef = doc(db, 'bookings', bookingId);

  await runTransaction(db, async (transaction) => {
    const bookingDoc = await transaction.get(bookingRef);
    if (!bookingDoc.exists()) {
      throw new Error('Booking request not found.');
    }

    const data = bookingDoc.data();
    if (data.status === 'ACCEPTED') {
      throw new Error('Cannot reject a job that has already been accepted.');
    }

    transaction.update(bookingRef, {
      status: 'REJECTED',
      workerId: null,
      rejectedBy: workerUid,
      rejectedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
}

/**
 * Update worker job status in Firestore (e.g. ON_THE_WAY, STARTED, COMPLETED).
 */
export async function updateWorkerJobStatus(
  bookingId: string,
  status: BookingStatus
): Promise<void> {
  if (!db) {
    throw new Error('Firestore is not initialized.');
  }

  const bookingRef = doc(db, 'bookings', bookingId);
  await updateDoc(bookingRef, {
    status,
    updatedAt: serverTimestamp(),
  });
}

/**
 * One-time fetch of customer bookings.
 */
export async function getCustomerBookings(customerId: string): Promise<FirestoreBooking[]> {
  if (!db) {
    throw new Error('Firestore is not initialized.');
  }

  const bookingsCol = collection(db, 'bookings');
  const q = query(bookingsCol, where('customerId', '==', customerId));
  const snap = await getDocs(q);

  const results: FirestoreBooking[] = [];
  snap.forEach((d) => {
    results.push(mapDocToBooking(d.id, d.data()));
  });

  results.sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return timeB - timeA;
  });

  return results;
}
