import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import { 
  Clock, 
  MapPin, 
  Receipt, 
  Star, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  ArrowRight, 
  ShieldAlert, 
  X,
  Plus,
  Loader2,
  AlertCircle,
  Calendar,
  UserCheck
} from 'lucide-react';

export const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    customerBookings, 
    loadingCustomerBookings, 
    customerBookingsError, 
    raiseDispute 
  } = useBooking();

  const [filter, setFilter] = useState<'ALL' | 'REQUESTED' | 'ACTIVE' | 'COMPLETED'>('ALL');
  
  // Dispute Modal state
  const [disputeBookingId, setDisputeBookingId] = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState<string>('');
  const [disputeSubmitted, setDisputeSubmitted] = useState<boolean>(false);

  const filteredBookings = customerBookings.filter((b) => {
    if (filter === 'REQUESTED') return b.status === 'REQUESTED';
    if (filter === 'ACTIVE') {
      return ['ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'STARTED'].includes(b.status);
    }
    if (filter === 'COMPLETED') return b.status === 'COMPLETED';
    return true;
  });

  const handleOpenDisputeModal = (bookingId: string) => {
    setDisputeBookingId(bookingId);
    setDisputeReason('');
    setDisputeSubmitted(false);
  };

  const handleSubmitDispute = async () => {
    if (!disputeBookingId || !disputeReason) return;
    await raiseDispute(disputeBookingId, disputeReason);
    setDisputeSubmitted(true);
    setTimeout(() => {
      setDisputeBookingId(null);
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'REQUESTED':
        return (
          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            REQUESTED
          </span>
        );
      case 'ACCEPTED':
      case 'ASSIGNED':
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {status}
          </span>
        );
      case 'ON_THE_WAY':
      case 'STARTED':
        return (
          <span className="bg-blue-100 text-blue-800 border border-blue-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
            {status.replace(/_/g, ' ')}
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            COMPLETED
          </span>
        );
      case 'DISPUTED':
        return (
          <span className="bg-red-100 text-red-800 border border-red-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            DISPUTED
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DED1] shadow-civic flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#0D6E66]">
            Cloud Firestore Real-Time Ledger
          </span>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mt-0.5">
            My Bookings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real service requests authenticated for {user?.name || 'Customer'}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Pills */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold self-start sm:self-auto">
            {(['ALL', 'REQUESTED', 'ACTIVE', 'COMPLETED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filter === tab
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <Link
            to="/customer/book"
            className="px-4 py-2 bg-[#0D6E66] hover:bg-[#0A554F] text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Book a Service</span>
          </Link>
        </div>
      </div>

      {/* Loading State */}
      {loadingCustomerBookings && (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E8DED1] shadow-civic flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#0D6E66] animate-spin" />
          <p className="text-sm font-semibold text-slate-700">
            Loading your bookings...
          </p>
        </div>
      )}

      {/* Error State */}
      {customerBookingsError && !loadingCustomerBookings && (
        <div className="p-5 rounded-3xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <strong className="block font-bold">Unable to load bookings. Please try again.</strong>
              <span className="text-[11px] text-red-700">{customerBookingsError}</span>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-3.5 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Bookings List */}
      {!loadingCustomerBookings && (
        <div className="space-y-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-3xl p-6 border border-[#E8DED1] shadow-civic hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                {/* Card Top */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 text-[#0D6E66] flex items-center justify-center font-bold text-sm">
                      {booking.serviceType.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-slate-900">
                          {booking.serviceType}
                        </h3>
                        <span className="text-xs font-mono font-bold text-[#0D6E66] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {booking.bookingReference}
                        </span>
                        {booking.bookingType === 'Emergency' && (
                          <span className="text-[10px] font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded flex items-center gap-1">
                            <Flame className="w-3 h-3 text-orange-500" /> Emergency
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {booking.bookingType === 'Emergency'
                            ? 'Emergency Dispatch (<45 mins)'
                            : `${booking.scheduledDate || 'Today'} • ${booking.scheduledTime || 'Preferred Window'}`}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {getStatusBadge(booking.status)}
                  </div>
                </div>

                {/* Middle Details */}
                <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 border-b border-slate-100">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Assigned Worker</span>
                    <strong className={`text-sm block ${
                      booking.workerId ? 'text-slate-900' : 'text-amber-800 font-medium'
                    }`}>
                      {booking.workerId && booking.workerName
                        ? booking.workerName
                        : 'Waiting for worker assignment'}
                    </strong>
                    <span className="text-slate-500 text-[11px]">
                      {booking.workerId ? 'Cooperative Member' : 'Pending algorithmic match'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">Address</span>
                    <p className="text-slate-800 truncate">{booking.address}</p>
                    {booking.otp && (
                      <span className="text-[11px] text-teal-800 font-bold mt-1 inline-block">
                        Verification OTP: <strong className="font-mono bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">{booking.otp}</strong>
                      </span>
                    )}
                  </div>

                  <div className="sm:text-right">
                    <span className="text-slate-400 block mb-0.5">Problem Description</span>
                    <p className="text-slate-700 line-clamp-2 italic">
                      &ldquo;{booking.description}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/customer/track?bookingId=${booking.id}`}
                      className="px-4 py-2 rounded-xl bg-[#0D6E66] hover:bg-[#0A554F] text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <span>Track Booking</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      to={`/customer/invoices?bookingId=${booking.id}`}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Invoice</span>
                    </Link>
                  </div>

                  <div className="flex items-center gap-2">
                    {booking.status === 'COMPLETED' && (
                      <Link
                        to={`/customer/reviews?bookingId=${booking.id}`}
                        className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#C97716] text-xs font-bold border border-amber-200 flex items-center gap-1 transition-colors"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span>Rate Service</span>
                      </Link>
                    )}

                    {booking.status !== 'DISPUTED' ? (
                      <button
                        onClick={() => handleOpenDisputeModal(booking.id)}
                        className="px-3 py-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 text-xs font-medium transition-colors"
                      >
                        Report Issue
                      </button>
                    ) : (
                      <span className="text-xs text-red-600 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Dispute Under Civic Review
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#E8DED1] shadow-civic">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#0D6E66] flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-900 mb-1">
                No active bookings
              </h3>
              <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto">
                You do not have any bookings matching &ldquo;{filter}&rdquo;. Book a certified cooperative worker now!
              </p>
              <Link
                to="/customer/book"
                className="px-6 py-2.5 bg-[#0D6E66] hover:bg-[#0A554F] text-white rounded-xl text-xs font-bold shadow-sm inline-flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Book a Service</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Dispute Modal */}
      {disputeBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E8DED1] shadow-2xl relative">
            <button
              onClick={() => setDisputeBookingId(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-900">
                  Open Civic Dispute
                </h3>
                <span className="text-xs text-slate-500 font-mono">Booking #{disputeBookingId}</span>
              </div>
            </div>

            {disputeSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="font-bold">Dispute Submitted to Cooperative Admin</p>
                <p className="mt-1 text-[11px]">The registrar will review logs and mediate resolution.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  CoopConnect disputes are handled transparently by the cooperative governance desk rather than punitive black-box bots.
                </p>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Describe Discrepancy or Grievance
                  </label>
                  <textarea
                    rows={4}
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    placeholder="Provide specific details regarding incomplete work, timing issues, or material billing..."
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-red-500 outline-none resize-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setDisputeBookingId(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitDispute}
                    disabled={!disputeReason}
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold disabled:opacity-50"
                  >
                    Submit Dispute
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
