import React, { useState } from 'react';
import { useBooking } from '../../contexts/BookingContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Inbox, 
  MapPin, 
  Clock, 
  Phone,
  CheckCircle2, 
  X, 
  Flame, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Calendar,
  UserCheck
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export const JobRequestsPage: React.FC = () => {
  const { 
    requestedBookings, 
    loadingWorkerBookings, 
    workerBookingsError, 
    acceptJob, 
    rejectJob 
  } = useBooking();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filter only REQUESTED bookings
  const pendingRequests = requestedBookings.filter((b) => b.status === 'REQUESTED');

  const handleAccept = async (bookingId: string, reference: string) => {
    if (acceptingId || rejectingId) return;

    if (!user?.uid || !user.roles?.includes('worker')) {
      setNotification({
        type: 'error',
        message: 'Only authenticated workers can accept cooperative jobs.',
      });
      return;
    }

    setAcceptingId(bookingId);
    setNotification(null);

    try {
      await acceptJob(bookingId);
      setNotification({
        type: 'success',
        message: `Job #${reference} accepted successfully! You have been assigned in Cloud Firestore.`,
      });
    } catch (err: any) {
      console.error('Failed to accept job:', err);
      setNotification({
        type: 'error',
        message: err?.message || 'Failed to accept job. It may have been assigned to another worker.',
      });
    } finally {
      setAcceptingId(null);
    }
  };

  const handleReject = async (bookingId: string, reference: string) => {
    if (acceptingId || rejectingId) return;

    if (!user?.uid || !user.roles?.includes('worker')) {
      setNotification({
        type: 'error',
        message: 'Only authenticated workers can reject cooperative jobs.',
      });
      return;
    }

    setRejectingId(bookingId);
    setNotification(null);

    try {
      await rejectJob(bookingId);
      setNotification({
        type: 'success',
        message: `Job #${reference} was declined and returned to queue.`,
      });
    } catch (err: any) {
      console.error('Failed to reject job:', err);
      setNotification({
        type: 'error',
        message: err?.message || 'Failed to decline job.',
      });
    } finally {
      setRejectingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDDEC9] shadow-civic flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-[#C97716] text-xs font-semibold mb-2 border border-amber-200">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Worker Guild • Real-Time Dispatch</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mt-0.5">
            Job Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real incoming service requests from Cloud Firestore for {user?.name || 'Worker'}.
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 self-start sm:self-auto">
          {pendingRequests.length} Available Requests
        </span>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between gap-3 animate-fadeIn ${
            notification.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : 'bg-red-50 border border-red-200 text-red-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          {notification.type === 'success' && (
            <Link
              to="/worker/jobs"
              className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 transition-colors shrink-0"
            >
              View In My Jobs
            </Link>
          )}
        </div>
      )}

      {/* Loading State */}
      {loadingWorkerBookings && (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#EDDEC9] shadow-civic flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#C97716] animate-spin" />
          <p className="text-sm font-semibold text-slate-700">
            Checking real-time job queue in Firestore...
          </p>
        </div>
      )}

      {/* Error State */}
      {workerBookingsError && !loadingWorkerBookings && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{workerBookingsError}</span>
        </div>
      )}

      {/* Requests List */}
      {!loadingWorkerBookings && (
        <div className="space-y-4">
          {pendingRequests.length > 0 ? (
            pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-civic hover:shadow-civic-hover transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#C97716] flex items-center justify-center font-bold text-sm shrink-0">
                        <Inbox className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-slate-900">
                            New {req.serviceType} Request
                          </span>
                          <span className="text-xs font-mono font-bold text-[#C97716] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            {req.bookingReference}
                          </span>
                          {req.bookingType === 'Emergency' && (
                            <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200 flex items-center gap-1">
                              <Flame className="w-3 h-3 text-orange-500" /> Emergency Dispatch
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs text-slate-500 mt-0.5 font-medium">
                          Customer: <strong className="text-slate-800">{req.customerName}</strong>
                          {req.phoneNumber && (
                            <span className="ml-2 inline-flex items-center gap-1 text-slate-600">
                              <Phone className="w-3 h-3 text-slate-400" />
                              {req.phoneNumber}
                            </span>
                          )}
                        </h4>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Status
                      </span>
                      <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs border border-amber-300">
                        {req.status}
                      </span>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 border-b border-slate-100">
                    <div>
                      <span className="text-slate-400 font-semibold block mb-0.5">Service Address</span>
                      <p className="text-slate-800 font-medium flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{req.address}</span>
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold block mb-0.5">Preferred Timing</span>
                      <strong className="text-slate-900 text-xs flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {req.bookingType === 'Emergency'
                          ? 'Immediate Arrival (<45 mins)'
                          : `${req.scheduledDate || 'Today'} • ${req.scheduledTime || 'Preferred Slot'}`}
                      </strong>
                      <span className="text-[11px] text-slate-400 block mt-1">
                        Requested: {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold block mb-0.5">Problem Description</span>
                      <p className="text-slate-700 italic bg-[#FAF8F4] p-2.5 rounded-xl border border-[#EDDEC9] leading-relaxed">
                        &ldquo;{req.description}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-500 flex items-center gap-1.5 self-start sm:self-auto">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Fair Algorithmic Queue (0% Platform Fee)</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => handleReject(req.id, req.bookingReference)}
                      disabled={rejectingId === req.id || acceptingId === req.id}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors disabled:opacity-50"
                    >
                      {rejectingId === req.id ? 'Declining...' : 'Reject'}
                    </button>
                    <button
                      onClick={() => handleAccept(req.id, req.bookingReference)}
                      disabled={acceptingId === req.id || rejectingId === req.id}
                      className="px-6 py-2.5 rounded-xl bg-[#C97716] hover:bg-[#A85F0C] text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
                    >
                      {acceptingId === req.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Accepting Job...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Accept Job</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#EDDEC9] shadow-civic">
              <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="font-bold text-base text-slate-800">No new job requests right now.</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4 leading-relaxed">
                You are on part-time cooperative standby. As households in your area submit requests, they will arrive here in real time.
              </p>
              <Link
                to="/worker/jobs"
                className="px-5 py-2 rounded-xl bg-amber-50 text-[#C97716] border border-amber-200 text-xs font-bold hover:bg-amber-100 inline-block transition-colors"
              >
                Check My Active Jobs
              </Link>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
