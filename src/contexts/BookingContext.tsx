import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Booking, BookingStatus, Dispute, FirestoreBooking, UserProfile } from '../types';
import { MOCK_BOOKINGS, MOCK_DISPUTES, MOCK_WORKERS } from '../data/mockData';
import { useAuth } from './AuthContext';
import {
  createCustomerBooking as fbCreateCustomerBooking,
  subscribeCustomerBookings,
  subscribeRequestedBookings,
  subscribeWorkerJobs,
  acceptWorkerJob as fbAcceptWorkerJob,
  rejectWorkerJob as fbRejectWorkerJob,
  updateWorkerJobStatus as fbUpdateWorkerJobStatus,
  CreateCustomerBookingInput,
} from '../firebase/bookingService';

interface BookingContextType {
  bookings: Booking[];
  customerBookings: FirestoreBooking[];
  requestedBookings: FirestoreBooking[];
  workerJobs: FirestoreBooking[];
  loadingCustomerBookings: boolean;
  loadingWorkerBookings: boolean;
  customerBookingsError: string | null;
  workerBookingsError: string | null;
  createCustomerBooking: (input: CreateCustomerBookingInput) => Promise<FirestoreBooking>;
  acceptJob: (bookingId: string) => Promise<void>;
  rejectJob: (bookingId: string) => Promise<void>;
  disputes: Dispute[];
  workers: UserProfile[];
  createBooking: (newBookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>) => Promise<Booking>;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => Promise<void>;
  addReview: (bookingId: string, rating: number, comment: string) => Promise<void>;
  raiseDispute: (bookingId: string, reason: string) => Promise<void>;
  resolveDispute: (disputeId: string, resolutionNote: string) => Promise<void>;
  updateWorkerAvailability: (workerId: string, isAvailable: boolean, schedule?: any) => Promise<void>;
  verifyWorker: (workerId: string) => Promise<void>;
  suspendWorker: (workerId: string) => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const BOOKINGS_STORAGE_KEY = 'coopconnect_active_bookings';
const DISPUTES_STORAGE_KEY = 'coopconnect_active_disputes';
const WORKERS_STORAGE_KEY = 'coopconnect_active_workers';

function firestoreBookingToBooking(fb: FirestoreBooking): Booking {
  return {
    id: fb.id,
    bookingReference: fb.bookingReference,
    customerId: fb.customerId,
    customerName: fb.customerName,
    customerEmail: fb.customerEmail,
    customerPhotoURL: fb.customerPhotoURL,
    customerPhone: fb.phoneNumber || '',
    customerAddress: fb.address || '',
    serviceId: fb.serviceType.toLowerCase().replace(/\s+/g, '-'),
    serviceName: fb.serviceType,
    serviceType: fb.serviceType,
    workerId: fb.workerId || undefined,
    workerName: fb.workerName || undefined,
    type: (fb.bookingType.toLowerCase() === 'emergency' ? 'emergency' : 'scheduled'),
    bookingType: fb.bookingType,
    description: fb.description,
    address: fb.address,
    phoneNumber: fb.phoneNumber,
    date: fb.bookingType === 'Emergency' ? 'Today (Emergency)' : (fb.scheduledDate || 'Scheduled'),
    timeSlot: fb.bookingType === 'Emergency' ? 'Immediate Dispatch (<45 mins)' : (fb.scheduledTime || 'Preferred Window'),
    scheduledDate: fb.scheduledDate,
    scheduledTime: fb.scheduledTime,
    status: fb.status,
    estimatedAmount: 350,
    createdAt: fb.createdAt,
    updatedAt: fb.updatedAt,
    otp: fb.otp,
  };
}

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, activeRole } = useAuth();

  // Firestore customer bookings state
  const [customerBookings, setCustomerBookings] = useState<FirestoreBooking[]>([]);
  const [loadingCustomerBookings, setLoadingCustomerBookings] = useState<boolean>(true);
  const [customerBookingsError, setCustomerBookingsError] = useState<string | null>(null);

  // Firestore worker bookings state
  const [requestedBookings, setRequestedBookings] = useState<FirestoreBooking[]>([]);
  const [workerJobs, setWorkerJobs] = useState<FirestoreBooking[]>([]);
  const [loadingWorkerBookings, setLoadingWorkerBookings] = useState<boolean>(true);
  const [workerBookingsError, setWorkerBookingsError] = useState<string | null>(null);

  // Storage / mock state for admin/demo fallback
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const stored = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return MOCK_BOOKINGS;
  });

  const [disputes, setDisputes] = useState<Dispute[]>(() => {
    try {
      const stored = localStorage.getItem(DISPUTES_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return MOCK_DISPUTES;
  });

  const [workers, setWorkers] = useState<UserProfile[]>(() => {
    try {
      const stored = localStorage.getItem(WORKERS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return MOCK_WORKERS;
  });

  // 1. Real-time Firestore sync for authenticated customer bookings
  useEffect(() => {
    if (!user?.uid || activeRole !== 'customer') {
      setCustomerBookings([]);
      setLoadingCustomerBookings(false);
      setCustomerBookingsError(null);
      return;
    }

    setLoadingCustomerBookings(true);
    setCustomerBookingsError(null);

    const unsubscribe = subscribeCustomerBookings(
      user.uid,
      (realBookings) => {
        setCustomerBookings(realBookings);
        setLoadingCustomerBookings(false);
        setCustomerBookingsError(null);
      },
      (error) => {
        console.error('Customer Firestore listener error:', error);
        setCustomerBookingsError('Unable to load bookings. Please try again.');
        setLoadingCustomerBookings(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid, activeRole]);

  // 2. Real-time Firestore sync for authenticated worker:
  // Listens to all REQUESTED bookings + all jobs assigned to this worker
  useEffect(() => {
    if (!user?.uid || activeRole !== 'worker') {
      setRequestedBookings([]);
      setWorkerJobs([]);
      setLoadingWorkerBookings(false);
      setWorkerBookingsError(null);
      return;
    }

    setLoadingWorkerBookings(true);
    setWorkerBookingsError(null);

    // Listener A: Incoming REQUESTED service requests
    const unsubRequested = subscribeRequestedBookings(
      (reqBookings) => {
        setRequestedBookings(reqBookings);
        setLoadingWorkerBookings(false);
      },
      (error) => {
        console.error('Worker requested bookings listener error:', error);
        setWorkerBookingsError('Unable to load job requests.');
        setLoadingWorkerBookings(false);
      }
    );

    // Listener B: Jobs assigned to this worker (ACCEPTED, STARTED, COMPLETED, etc.)
    const unsubJobs = subscribeWorkerJobs(
      user.uid,
      (myJobs) => {
        setWorkerJobs(myJobs);
      },
      (error) => {
        console.error('Worker jobs listener error:', error);
      }
    );

    return () => {
      unsubRequested();
      unsubJobs();
    };
  }, [user?.uid, activeRole]);

  useEffect(() => {
    try {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    } catch (e) {}
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem(DISPUTES_STORAGE_KEY, JSON.stringify(disputes));
    } catch (e) {}
  }, [disputes]);

  useEffect(() => {
    try {
      localStorage.setItem(WORKERS_STORAGE_KEY, JSON.stringify(workers));
    } catch (e) {}
  }, [workers]);

  const createCustomerBooking = async (
    input: CreateCustomerBookingInput
  ): Promise<FirestoreBooking> => {
    return await fbCreateCustomerBooking(input);
  };

  /**
   * Worker accepts a REQUESTED booking.
   * Uses Firestore transaction to guarantee no race conditions.
   */
  const acceptJob = async (bookingId: string): Promise<void> => {
    if (!user?.uid) {
      throw new Error('You must be signed in as an authorized worker to accept a job.');
    }
    if (!user.roles?.includes('worker')) {
      throw new Error('Access denied: You do not have the worker role.');
    }

    await fbAcceptWorkerJob(bookingId, user.uid, user.name || 'Assigned Worker');
  };

  /**
   * Worker rejects a REQUESTED booking.
   */
  const rejectJob = async (bookingId: string): Promise<void> => {
    if (!user?.uid) {
      throw new Error('You must be signed in as an authorized worker to reject a job.');
    }
    if (!user.roles?.includes('worker')) {
      throw new Error('Access denied: You do not have the worker role.');
    }

    await fbRejectWorkerJob(bookingId, user.uid);
  };

  const createBooking = async (
    newBookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>
  ): Promise<Booking> => {
    if (user?.uid && activeRole === 'customer') {
      const bType =
        newBookingData.type === 'emergency' || newBookingData.bookingType === 'Emergency'
          ? 'Emergency'
          : 'Scheduled';

      const fbResult = await fbCreateCustomerBooking({
        customerId: user.uid,
        customerName: user.name,
        customerEmail: user.email,
        customerPhotoURL: user.photoURL,
        serviceType: newBookingData.serviceName || newBookingData.serviceType || 'General Service',
        description: newBookingData.description,
        address: newBookingData.customerAddress || newBookingData.address || user.address || '',
        phoneNumber: newBookingData.customerPhone || newBookingData.phoneNumber || user.phone || '',
        bookingType: bType,
        scheduledDate: newBookingData.date || newBookingData.scheduledDate,
        scheduledTime: newBookingData.timeSlot || newBookingData.scheduledTime,
      });

      return firestoreBookingToBooking(fbResult);
    }

    // Fallback for non-authenticated demo testing
    const newId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      ...newBookingData,
      id: newId,
      status: 'REQUESTED',
      createdAt: new Date().toISOString(),
      otp,
    };

    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const updateBookingStatus = async (bookingId: string, status: BookingStatus): Promise<void> => {
    if (user?.uid && activeRole === 'worker') {
      if (status === 'ACCEPTED') {
        await acceptJob(bookingId);
        return;
      }
      if (status === 'REJECTED' || status === 'CANCELLED') {
        await rejectJob(bookingId);
        return;
      }
      // Ongoing status updates (e.g. ON_THE_WAY, STARTED, COMPLETED)
      await fbUpdateWorkerJobStatus(bookingId, status);
      return;
    }

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
  };

  const addReview = async (bookingId: string, rating: number, comment: string): Promise<void> => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              review: {
                rating,
                comment,
                createdAt: new Date().toISOString(),
              },
            }
          : b
      )
    );
  };

  const raiseDispute = async (bookingId: string, reason: string): Promise<void> => {
    const bookingList = user?.uid && activeRole === 'customer'
      ? customerBookings.map(firestoreBookingToBooking)
      : user?.uid && activeRole === 'worker'
      ? [...requestedBookings, ...workerJobs].map(firestoreBookingToBooking)
      : bookings;

    const booking = bookingList.find((b) => b.id === bookingId);
    if (!booking) return;

    const newDispute: Dispute = {
      id: `DSP-${Math.floor(100 + Math.random() * 900)}`,
      bookingId: booking.id,
      customerId: booking.customerId,
      customerName: booking.customerName,
      workerId: booking.workerId || 'unassigned',
      workerName: booking.workerName || 'Waiting for worker assignment',
      serviceName: booking.serviceName || booking.serviceType || 'Service',
      reason,
      date: new Date().toISOString().split('T')[0],
      status: 'Open',
    };

    setDisputes((prev) => [newDispute, ...prev]);
    await updateBookingStatus(bookingId, 'DISPUTED');
  };

  const resolveDispute = async (disputeId: string, resolutionNote: string): Promise<void> => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, status: 'Resolved', resolutionNote } : d))
    );
  };

  const updateWorkerAvailability = async (workerId: string, isAvailable: boolean, schedule?: any): Promise<void> => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.uid === workerId && w.availability) {
          return {
            ...w,
            availability: {
              ...w.availability,
              isAvailable,
              ...(schedule ? { weeklySchedule: schedule } : {}),
            },
          };
        }
        return w;
      })
    );
  };

  const verifyWorker = async (workerId: string): Promise<void> => {
    setWorkers((prev) =>
      prev.map((w) => (w.uid === workerId ? { ...w, verificationStatus: 'verified' } : w))
    );
  };

  const suspendWorker = async (workerId: string): Promise<void> => {
    setWorkers((prev) =>
      prev.map((w) => (w.uid === workerId ? { ...w, verificationStatus: 'suspended' } : w))
    );
  };

  // Select active bookings list according to current authenticated role
  const activeBookings =
    user?.uid && activeRole === 'customer'
      ? customerBookings.map(firestoreBookingToBooking)
      : user?.uid && activeRole === 'worker'
      ? [...requestedBookings, ...workerJobs].map(firestoreBookingToBooking)
      : bookings;

  return (
    <BookingContext.Provider
      value={{
        bookings: activeBookings,
        customerBookings,
        requestedBookings,
        workerJobs,
        loadingCustomerBookings,
        loadingWorkerBookings,
        customerBookingsError,
        workerBookingsError,
        createCustomerBooking,
        acceptJob,
        rejectJob,
        disputes,
        workers,
        createBooking,
        updateBookingStatus,
        addReview,
        raiseDispute,
        resolveDispute,
        updateWorkerAvailability,
        verifyWorker,
        suspendWorker,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
