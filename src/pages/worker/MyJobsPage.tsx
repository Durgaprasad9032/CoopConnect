import React, { useState } from 'react';
import { useBooking } from '../../contexts/BookingContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Briefcase, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Flame, 
  AlertCircle,
  Loader2,
  Calendar,
  Navigation
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyJobsPage: React.FC = () => {
  const { workerJobs, updateBookingStatus, loadingWorkerBookings } = useBooking();
  const { user } = useAuth();
  
  const [filter, setFilter] = useState<'ACTIVE' | 'COMPLETED' | 'ALL'>('ACTIVE');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Filter only jobs assigned to current authenticated worker
  const myAssignedJobs = workerJobs.filter((b) => b.workerId === user?.uid);

  const filteredJobs = myAssignedJobs.filter((b) => {
    if (filter === 'ACTIVE') {
      return ['ACCEPTED', 'ON_THE_WAY', 'STARTED'].includes(b.status);
    }
    if (filter === 'COMPLETED') return b.status === 'COMPLETED';
    return true;
  });

  const handleAdvanceStatus = async (bookingId: string, nextStatus: any) => {
    setActionLoadingId(bookingId);
    try {
      await updateBookingStatus(bookingId, nextStatus);
    } catch (err) {
      console.error('Failed to update job status:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            ACCEPTED
          </span>
        );
      case 'ON_THE_WAY':
        return (
          <span className="bg-blue-100 text-blue-800 border border-blue-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
            ON THE WAY
          </span>
        );
      case 'STARTED':
        return (
          <span className="bg-purple-100 text-purple-800 border border-purple-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            IN PROGRESS
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            COMPLETED
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDDEC9] shadow-civic flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C97716]">
            Active Duty Assignments
          </span>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mt-0.5">
            My Jobs
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real jobs accepted by {user?.name || 'Worker'} from Cloud Firestore.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold self-start sm:self-auto">
          {(['ACTIVE', 'COMPLETED', 'ALL'] as const).map((tab) => (
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

      {/* Loading State */}
      {loadingWorkerBookings && (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#EDDEC9] shadow-civic flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#C97716] animate-spin" />
          <p className="text-sm font-semibold text-slate-700">Loading your jobs...</p>
        </div>
      )}

      {/* Jobs List */}
      {!loadingWorkerBookings && (
        <div className="space-y-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-3xl p-6 border border-[#EDDEC9] shadow-civic flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C97716] flex items-center justify-center font-bold text-sm border border-amber-100">
                        {job.serviceType.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-base text-slate-900">{job.serviceType}</h3>
                          <span className="text-xs font-mono font-bold text-[#C97716] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            {job.bookingReference}
                          </span>
                          {job.bookingType === 'Emergency' && (
                            <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200 flex items-center gap-1">
                              <Flame className="w-3 h-3 text-orange-500" /> Emergency
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Customer: <strong className="text-slate-800">{job.customerName}</strong>
                          {job.phoneNumber && (
                            <span className="ml-2 inline-flex items-center gap-1 text-slate-600">
                              <Phone className="w-3 h-3 text-slate-400" />
                              {job.phoneNumber}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div>
                      {getStatusBadge(job.status)}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 border-b border-slate-100">
                    <div>
                      <span className="text-slate-400 font-semibold block mb-0.5">Service Address</span>
                      <p className="text-slate-800 font-medium flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{job.address}</span>
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold block mb-0.5">Scheduled Slot</span>
                      <strong className="text-slate-900 text-xs flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {job.bookingType === 'Emergency'
                          ? 'Immediate Arrival'
                          : `${job.scheduledDate || 'Today'} • ${job.scheduledTime || 'Preferred'}`}
                      </strong>
                      {job.otp && (
                        <span className="text-[11px] text-teal-800 font-bold mt-1 inline-block">
                          Verify Doorstep OTP: <strong className="font-mono bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">{job.otp}</strong>
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold block mb-0.5">Task Description</span>
                      <p className="text-slate-700 italic bg-[#FAF8F4] p-2 rounded-lg border border-[#EDDEC9]">
                        &ldquo;{job.description}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 flex items-center justify-between gap-4">
                  <span className="text-[11px] text-slate-400">
                    {job.acceptedAt ? `Accepted at ${new Date(job.acceptedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Active Job'}
                  </span>

                  <div className="flex items-center gap-2">
                    {job.status === 'ACCEPTED' && (
                      <button
                        onClick={() => handleAdvanceStatus(job.id, 'ON_THE_WAY')}
                        disabled={actionLoadingId === job.id}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Start Transit</span>
                      </button>
                    )}
                    {job.status === 'ON_THE_WAY' && (
                      <button
                        onClick={() => handleAdvanceStatus(job.id, 'STARTED')}
                        disabled={actionLoadingId === job.id}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Arrived & Start Work</span>
                      </button>
                    )}
                    {job.status === 'STARTED' && (
                      <button
                        onClick={() => handleAdvanceStatus(job.id, 'COMPLETED')}
                        disabled={actionLoadingId === job.id}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Completed</span>
                      </button>
                    )}
                    {job.status === 'COMPLETED' && (
                      <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Job Finished</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#EDDEC9] shadow-civic">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="font-bold text-base text-slate-800">No Jobs in &ldquo;{filter}&rdquo;</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                You have not accepted any jobs matching this filter yet. Check the real-time request queue.
              </p>
              <Link
                to="/worker/requests"
                className="px-5 py-2.5 bg-[#C97716] hover:bg-[#A85F0C] text-white rounded-xl text-xs font-bold shadow-sm inline-flex items-center gap-2 transition-colors"
              >
                <span>View Available Job Requests</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
