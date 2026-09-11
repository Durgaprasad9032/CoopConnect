import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Booking, BookingStatus, Dispute, UserProfile } from '../types';
import { MOCK_BOOKINGS, MOCK_DISPUTES, MOCK_WORKERS } from '../data/mockData';

interface BookingContextType {
  bookings: Booking[];
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

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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

  const createBooking = async (newBookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>): Promise<Booking> => {
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
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const newDispute: Dispute = {
      id: `DSP-${Math.floor(100 + Math.random() * 900)}`,
      bookingId: booking.id,
      customerId: booking.customerId,
      customerName: booking.customerName,
      workerId: booking.workerId || 'unassigned',
      workerName: booking.workerName || 'Assigned Worker',
      serviceName: booking.serviceName,
      reason,
      date: new Date().toISOString().split('T')[0],
      status: 'Open',
    };

    setDisputes((prev) => [newDispute, ...prev]);
    updateBookingStatus(bookingId, 'DISPUTED');
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

  return (
    <BookingContext.Provider
      value={{
        bookings,
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
