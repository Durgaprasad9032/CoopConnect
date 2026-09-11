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
  Award,
  ShieldCheck,
  TrendingUp,
  Inbox
} from 'lucide-react';

export const WorkerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { bookings, workers, updateWorkerAvailability, updateBookingStatus } = useBooking();
  const navigate = useNavigate();

  const activeWorker = workers.find((w) => w.uid === user?.uid) || workers[0];
  const isAvailable = activeWorker?.availability?.isAvailable ?? true;

  // Pending job requests
  const pendingRequests = bookings.filter((b) => b.status === 'REQUESTED');
  
  // Ongoing jobs
  const ongoingJobs = bookings.filter((b) => 
    ['ACCEPTED', 'ON_THE_WAY', 'STARTED'].includes(b.status) && (b.workerId === activeWorker.uid || !b.workerId)
  );

  // Completed jobs
  const completedJobs = bookings.filter((b) => b.status === 'COMPLETED' && b.workerId === activeWorker.uid);

  const earnings = activeWorker.earnings || {
    today: 850,
    week: 4200,
    month: 16800,
    total: 68400
  };

  const handleToggleAvailability = async () => {
    await updateWorkerAvailability(activeWorker.uid, !isAvailable);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner: Part-Time Worker Welcome & Status */}
      <div className="bg-gradient-to-r from-[#C97716] to-[#8C4F07] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-civic">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-amber-100 text-xs font-semibold mb-3 border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>{activeWorker.cooperativeName || 'Kalyan Shramik Labour Cooperative'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-2">
              Namaste, {activeWorker.name}!
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 leading-relaxed font-normal">
              &ldquo;Work when you are available. CoopConnect supports flexible part-time work.&rdquo;
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
              Preference: <strong className="capitalize">{activeWorker.availability?.preference || 'Evening Shifts'}</strong>
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
          <span>• 100% Free for Cooperative Workers</span>
          <span>• No Monthly Subscriptions</span>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Today Earnings */}
        <div className="bg-white rounded-2xl p-5 border border-[#EDDEC9] shadow-civic">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Today's Earnings</span>
            <Wallet className="w-4 h-4 text-[#C97716]" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-slate-900">
            ₹{earnings.today}
          </h3>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +₹350 vs yesterday
          </span>
        </div>

        {/* Total Earnings */}
        <div className="bg-white rounded-2xl p-5 border border-[#EDDEC9] shadow-civic">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Total Earnings</span>
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-slate-900">
            ₹{earnings.total}
          </h3>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Across {activeWorker.totalJobs || 78} jobs
          </span>
        </div>

        {/* Peer Rating */}
        <div className="bg-white rounded-2xl p-5 border border-[#EDDEC9] shadow-civic">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Peer Trust Rating</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-slate-900">
            {activeWorker.rating || 4.88}
          </h3>
          <span className="text-[11px] text-amber-700 font-semibold mt-1 block">
            Top 5% Cooperative Artisan
          </span>
        </div>

        {/* Part-Time Hours */}
        <div className="bg-white rounded-2xl p-5 border border-[#EDDEC9] shadow-civic">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Part-Time Hours</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-slate-900">
            18 hrs
          </h3>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Scheduled this week
          </span>
        </div>
      </div>

      {/* Pending Job Requests Alert (if any) */}
      {pendingRequests.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border-2 border-amber-300 shadow-civic">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
              <h3 className="font-serif font-bold text-lg text-slate-900">
                Pending Service Request
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
                      {req.serviceName}
                    </span>
                    <span className="text-xs font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                      Est. ₹{req.estimatedAmount}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 mb-1">{req.customerName}</h4>
                  <p className="text-xs text-slate-600 flex items-center gap-1 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{req.customerAddress}</span>
                  </p>
                  <p className="text-xs text-slate-500 italic bg-white p-2 rounded-lg border border-slate-100">
                    &ldquo;{req.description}&rdquo;
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-200/60 flex items-center gap-2">
                  <button
                    onClick={async () => {
                      await updateBookingStatus(req.id, 'ACCEPTED');
                    }}
                    className="flex-1 py-2 rounded-xl bg-[#C97716] hover:bg-[#A85F0C] text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    Accept Request (₹{req.estimatedAmount})
                  </button>
                  <button
                    onClick={async () => {
                      await updateBookingStatus(req.id, 'CANCELLED');
                    }}
                    className="px-3 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ongoing / Active Jobs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDDEC9] shadow-civic">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-serif font-bold text-slate-900">
              Active / Scheduled Jobs
            </h3>
            <p className="text-xs text-slate-500">Service visits assigned to your current schedule</p>
          </div>
          <Link
            to="/worker/jobs"
            className="text-xs font-bold text-[#C97716] hover:underline"
          >
            Manage All Jobs
          </Link>
        </div>

        {ongoingJobs.length > 0 ? (
          <div className="space-y-4">
            {ongoingJobs.map((job) => (
              <div key={job.id} className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F4] border border-[#EDDEC9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{job.serviceName}</span>
                    <span className="text-xs font-mono text-slate-400">#{job.id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {job.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Customer: <strong>{job.customerName}</strong> • {job.customerPhone}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.customerAddress}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {job.status === 'ACCEPTED' && (
                    <button
                      onClick={() => updateBookingStatus(job.id, 'ON_THE_WAY')}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs"
                    >
                      Start Transit (On The Way)
                    </button>
                  )}
                  {job.status === 'ON_THE_WAY' && (
                    <button
                      onClick={() => updateBookingStatus(job.id, 'STARTED')}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs"
                    >
                      Enter OTP & Start Work
                    </button>
                  )}
                  {job.status === 'STARTED' && (
                    <button
                      onClick={() => updateBookingStatus(job.id, 'COMPLETED')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                    >
                      Mark Completed (₹{job.estimatedAmount})
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-6">
            No active jobs in progress. Check incoming job requests or adjust your part-time availability.
          </p>
        )}
      </div>

    </div>
  );
};
