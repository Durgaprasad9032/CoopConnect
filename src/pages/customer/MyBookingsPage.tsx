import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBooking } from '../../contexts/BookingContext';
import { 
  Clock, 
  MapPin, 
  Phone, 
  Receipt, 
  Star, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Filter,
  ArrowRight,
  ShieldAlert,
  X
} from 'lucide-react';

export const MyBookingsPage: React.FC = () => {
  const { bookings, raiseDispute } = useBooking();
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED' | 'DISPUTED'>('ALL');
  
  // Dispute Modal state
  const [disputeBookingId, setDisputeBookingId] = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState<string>('');
  const [disputeSubmitted, setDisputeSubmitted] = useState<boolean>(false);

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'ACTIVE') {
      return ['REQUESTED', 'ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'STARTED'].includes(b.status);
    }
    if (filter === 'COMPLETED') return b.status === 'COMPLETED';
    if (filter === 'DISPUTED') return b.status === 'DISPUTED';
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

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DED1] shadow-civic flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#0D6E66]">
            Household Service Ledger
          </span>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mt-0.5">
            My Bookings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track active requests, view completed job receipts, or open a civic mediation dispute.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold self-start sm:self-auto">
          {(['ALL', 'ACTIVE', 'COMPLETED', 'DISPUTED'] as const).map((tab) => (
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
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-3xl p-6 border border-[#E8DED1] shadow-civic hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 text-[#0D6E66] flex items-center justify-center font-bold text-sm">
                    {booking.serviceName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900">{booking.serviceName}</h3>
                      <span className="text-xs font-mono font-semibold text-slate-400">#{booking.id}</span>
                      {booking.type === 'emergency' && (
                        <span className="text-[10px] font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded flex items-center gap-1">
                          <Flame className="w-3 h-3 text-orange-500" /> Emergency
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {booking.date} • {booking.timeSlot}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    booking.status === 'COMPLETED'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : booking.status === 'DISPUTED'
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'bg-teal-100 text-teal-800 border border-teal-200 animate-pulse'
                  }`}>
                    {booking.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Middle Details */}
              <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 border-b border-slate-100">
                <div>
                  <span className="text-slate-400 block mb-0.5">Assigned Technician</span>
                  <strong className="text-slate-900 text-sm block">{booking.workerName || 'Awaiting Dispatch'}</strong>
                  <span className="text-slate-500 text-[11px]">{booking.cooperativeName}</span>
                </div>

                <div>
                  <span className="text-slate-400 block mb-0.5">Address</span>
                  <p className="text-slate-800 truncate">{booking.customerAddress}</p>
                  {booking.otp && (
                    <span className="text-[11px] text-teal-800 font-bold mt-1 inline-block">
                      Verification OTP: <strong className="font-mono bg-teal-50 px-1.5 py-0.5 rounded">{booking.otp}</strong>
                    </span>
                  )}
                </div>

                <div className="sm:text-right">
                  <span className="text-slate-400 block mb-0.5">Amount (0% Commission)</span>
                  <span className="text-base font-bold text-[#0D6E66]">
                    ₹{booking.actualAmount || booking.estimatedAmount}
                  </span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/customer/track?bookingId=${booking.id}`}
                    className="px-4 py-2 rounded-xl bg-[#0D6E66] hover:bg-[#0A554F] text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <span>Track Live Progress</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    to={`/customer/invoices?bookingId=${booking.id}`}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Civic Invoice</span>
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  {booking.status === 'COMPLETED' && (
                    <Link
                      to={`/customer/reviews?bookingId=${booking.id}`}
                      className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#C97716] text-xs font-bold border border-amber-200 flex items-center gap-1 transition-colors"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{booking.review ? 'View Review' : 'Rate Service'}</span>
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
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E8DED1]">
            <p className="text-sm text-slate-500 mb-4">No bookings found for &ldquo;{filter}&rdquo; filter.</p>
            <Link
              to="/customer/book"
              className="px-5 py-2.5 bg-[#0D6E66] text-white rounded-xl text-xs font-bold shadow-sm"
            >
              Book a New Service
            </Link>
          </div>
        )}
      </div>

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
