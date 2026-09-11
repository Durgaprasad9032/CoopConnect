import React, { useState } from 'react';
import { useBooking } from '../../contexts/BookingContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Inbox, 
  MapPin, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  X, 
  Flame, 
  ArrowRight,
  ShieldCheck,
  Coins
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const JobRequestsPage: React.FC = () => {
  const { bookings, updateBookingStatus } = useBooking();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [notification, setNotification] = useState<string | null>(null);

  // All pending requests in the system
  const pendingRequests = bookings.filter((b) => b.status === 'REQUESTED');

  const handleAccept = async (bookingId: string, amount: number) => {
    await updateBookingStatus(bookingId, 'ACCEPTED');
    setNotification(`Job #${bookingId} accepted! ₹${amount} compensation locked with 0% fees.`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleReject = async (bookingId: string) => {
    await updateBookingStatus(bookingId, 'CANCELLED');
    setNotification(`Job #${bookingId} declined and returned to fair matching queue.`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDDEC9] shadow-civic flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C97716]">
            Incoming Job Opportunities
          </span>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mt-0.5">
            Service Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Incoming work matched according to your active part-time shift availability.
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-amber-50 text-[#C97716] border border-amber-200 self-start sm:self-auto">
          {pendingRequests.length} Pending Requests
        </span>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Requests List */}
      <div className="space-y-4">
        {pendingRequests.length > 0 ? (
          pendingRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-civic hover:shadow-civic-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#C97716] flex items-center justify-center font-bold text-sm">
                      <Inbox className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#C97716] uppercase tracking-wider">
                          {req.serviceName}
                        </span>
                        <span className="text-xs font-mono font-semibold text-slate-400">#{req.id}</span>
                        {req.type === 'emergency' && (
                          <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200 flex items-center gap-1">
                            <Flame className="w-3 h-3 text-orange-500" /> Emergency Dispatch
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-lg text-slate-900 mt-0.5">
                        {req.customerName}
                      </h3>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Estimated Earnings (0% Deductions)
                    </span>
                    <span className="text-2xl font-serif font-bold text-[#C97716] block">
                      ₹{req.estimatedAmount}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 border-b border-slate-100">
                  <div>
                    <span className="text-slate-400 font-semibold block mb-0.5">Location & Distance</span>
                    <p className="text-slate-800 font-medium flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{req.customerAddress}</span>
                    </p>
                    <span className="text-[11px] text-emerald-700 font-bold block mt-1">
                      Distance: ~2.4 km (Within Ward)
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold block mb-0.5">Scheduled Timing</span>
                    <strong className="text-slate-900 text-xs flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {req.date} at {req.timeSlot}
                    </strong>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      Matches your declared evening availability
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold block mb-0.5">Task Description</span>
                    <p className="text-slate-700 italic bg-[#FAF8F4] p-2 rounded-lg border border-[#EDDEC9]">
                      &ldquo;{req.description}&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-between gap-4">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified by Cooperative Fair Balancing Protocol</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleReject(req.id)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleAccept(req.id, req.estimatedAmount)}
                    className="px-6 py-2.5 rounded-xl bg-[#C97716] hover:bg-[#A85F0C] text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Accept Job (₹{req.estimatedAmount})</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#EDDEC9]">
            <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-bold text-base text-slate-800">No Pending Requests Right Now</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              You are on part-time standby. As households in your ward submit requests matching your skills, they will appear here.
            </p>
            <button
              onClick={() => navigate('/worker/availability')}
              className="px-4 py-2 rounded-xl bg-amber-50 text-[#C97716] border border-amber-200 text-xs font-bold"
            >
              Review Availability Matrix
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
