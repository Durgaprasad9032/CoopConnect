import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import { 
  Briefcase, 
  Clock, 
  Wallet, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  Power, 
  ShieldCheck, 
  Inbox,
  Flame
} from 'lucide-react';

export const WorkerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    requestedBookings, 
    workerJobs, 
    updateWorkerAvailability 
  } = useBooking();
  const navigate = useNavigate();

  const isAvailable = user?.availability?.isAvailable ?? true;

  // Real pending job requests from Firestore
  const pendingRequests = requestedBookings.filter((b) => b.status === 'REQUESTED');
  
  // Real ongoing jobs assigned to this worker in Firestore
  const ongoingJobs = workerJobs.filter((b) => 
    ['ACCEPTED', 'ON_THE_WAY', 'STARTED'].includes(b.status) && b.workerId === user?.uid
  );

  // Real completed jobs for this worker
  const completedJobs = workerJobs.filter((b) => b.status === 'COMPLETED' && b.workerId === user?.uid);

  const handleToggleAvailability = async () => {
    if (user?.uid) {
      await updateWorkerAvailability(user.uid, !isAvailable);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner: Part-Time Worker Welcome & Status */}
      <div className="bg-gradient-to-r from-[#C97716] to-[#8C4F07] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-civic">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-amber-100 text-xs font-semibold mb-3 border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>{user?.cooperativeName || 'Labour Cooperative Guild'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-2">
              Namaste, {user?.name || 'Worker'}!
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 leading-relaxed font-normal">
              &ldquo;Work when you are available. CoopConnect supports flexible cooperative part-time work.&rdquo;
            </p>
          </div>

          {/* Quick Availability Controls */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex flex-col sm:items-end gap-2">
            <span className="text-[11px] text-amber-200 uppercase font-bold tracking-wider">
              Part-Time Availability
            </span>
            <button
              onClick={handleToggleAvailability}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
                isAvailable
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  : 'bg-slate-700 hover:bg-slate-800 text-slate-200'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{isAvailable ? 'Available for Jobs' : 'Marked Off-Duty'}</span>
            </button>
            <span className="text-[10px] text-amber-100">
              Status: <strong className="capitalize">{isAvailable ? 'Active Standby' : 'Off-Duty'}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Zero Fee Guarantee Notice */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-900">
        <div className="flex items-center gap-2.5 font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>ZERO REGISTRATION & ZERO PLATFORM COMMISSIONS</span>
        </div>
        <div className="flex items-center gap-4 text-emerald-800">
          <span>• 100% Direct Payout for Cooperative Workers</span>
          <span>• No Monthly Subscriptions</span>
        </div>
      </div>

      {/* Real Stats Cards (No dummy fake earnings or ratings) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Pending Requests */}
        <div className="bg-white rounded-2xl p-5 border border-[#EDDEC9] shadow-civic">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Open Job Requests</span>
            <Inbox className="w-4 h-4 text-[#C97716]" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-slate-900">
            {pendingRequests.length}
          </h3>
          <span className="text-[11px] text-amber-700 font-medium mt-1 block">
            Awaiting worker acceptance
          </span>
        </div>

        {/* Assigned Active Jobs */}
        <div className="bg-white rounded-2xl p-5 border border-[#EDDEC9] shadow-civic">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Active Assignments</span>
            <Briefcase className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-slate-900">
            {ongoingJobs.length}
          </h3>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Accepted in progress
          </span>
        </div>

        {/* Completed Jobs */}
        <div className="bg-white rounded-2xl p-5 border border-[#EDDEC9] shadow-civic">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Completed Jobs</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-slate-900">
            {completedJobs.length}
          </h3>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Total verified jobs
          </span>
        </div>

        {/* Peer Rating */}
        <div className="bg-white rounded-2xl p-5 border border-[#EDDEC9] shadow-civic">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Peer Trust Rating</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-slate-900">
            {user?.rating ? user.rating : 'No data yet'}
          </h3>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {user?.rating ? 'Top Cooperative Artisan' : 'New verified member'}
          </span>
        </div>
      </div>

      {/* Pending Job Requests Alert (if any real ones exist) */}
      {pendingRequests.length > 0 ? (
        <div className="bg-white rounded-3xl p-6 border-2 border-amber-300 shadow-civic">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
              <h3 className="font-serif font-bold text-lg text-slate-900">
                Pending Service Requests
              </h3>
            </div>
            <Link
              to="/worker/requests"
              className="text-xs font-bold text-[#C97716] hover:underline flex items-center gap-1"
            >
              <span>View All Requests ({pendingRequests.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.slice(0, 2).map((req) => (
              <div key={req.id} className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#EDDEC9] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#C97716] uppercase tracking-wider">
                      {req.serviceType}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-800 bg-white px-2 py-0.5 rounded border border-amber-200">
                      {req.bookingReference}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 mb-1">{req.customerName}</h4>
                  <p className="text-xs text-slate-600 flex items-start gap-1 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{req.address}</span>
                  </p>
                  <p className="text-xs text-slate-500 italic line-clamp-2">
                    &ldquo;{req.description}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EDDEC9] flex items-center justify-between mt-3">
                  <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                    {req.bookingType === 'Emergency' ? (
                      <span className="text-orange-600 font-bold flex items-center gap-1">
                        <Flame className="w-3 h-3" /> Emergency
                      </span>
                    ) : (
                      <span>{req.scheduledDate || 'Scheduled'}</span>
                    )}
                  </span>
                  <Link
                    to="/worker/requests"
                    className="px-3.5 py-1.5 rounded-lg bg-[#C97716] hover:bg-[#A85F0C] text-white font-bold text-xs transition-colors"
                  >
                    View & Accept
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 border border-[#EDDEC9] shadow-civic flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#C97716] flex items-center justify-center shrink-0">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">No pending job requests</h3>
              <p className="text-xs text-slate-500">You are currently on standby for household requests in your district.</p>
            </div>
          </div>
          <Link
            to="/worker/jobs"
            className="px-5 py-2.5 rounded-xl bg-[#C97716] hover:bg-[#A85F0C] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto shrink-0"
          >
            <span>Check My Jobs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Ongoing Active Jobs Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDDEC9] shadow-civic">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-serif font-bold text-lg text-slate-900">
              Assigned Active Jobs
            </h3>
            <p className="text-xs text-slate-500">Jobs you have accepted and are currently executing</p>
          </div>
          <Link
            to="/worker/jobs"
            className="text-xs font-bold text-[#C97716] hover:underline flex items-center gap-1"
          >
            <span>Manage All Jobs ({ongoingJobs.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {ongoingJobs.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {ongoingJobs.map((job) => (
              <div key={job.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#C97716] flex items-center justify-center font-bold text-xs shrink-0">
                    {job.serviceType.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm text-slate-900">{job.serviceType}</h4>
                      <span className="text-[11px] font-mono font-bold text-[#C97716] bg-amber-50 px-2 py-0.5 rounded">
                        {job.bookingReference}
                      </span>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        {job.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Customer: <strong>{job.customerName}</strong> • {job.address}
                    </p>
                  </div>
                </div>

                <Link
                  to="/worker/jobs"
                  className="px-4 py-2 rounded-xl bg-[#C97716] hover:bg-[#A85F0C] text-white text-xs font-bold transition-colors shadow-sm self-start sm:self-auto shrink-0"
                >
                  Manage Status
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-6">
            You currently have no active jobs in progress. Check incoming job requests above to accept new tasks!
          </p>
        )}
      </div>

    </div>
  );
};
