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
  Star,
  KeyRound
} from 'lucide-react';

export const MyJobsPage: React.FC = () => {
  const { bookings, updateBookingStatus, workers } = useBooking();
  const { user } = useAuth();
  
  const [filter, setFilter] = useState<'ACTIVE' | 'COMPLETED' | 'ALL'>('ACTIVE');
  const [otpInput, setOtpInput] = useState<{ [bookingId: string]: string }>({});

  const activeWorker = workers.find((w) => w.uid === user?.uid) || workers[0];

  const workerJobs = bookings.filter((b) => b.workerId === activeWorker.uid || !b.workerId);

  const filteredJobs = workerJobs.filter((b) => {
    if (filter === 'ACTIVE') {
      return ['ACCEPTED', 'ON_THE_WAY', 'STARTED'].includes(b.status);
    }
    if (filter === 'COMPLETED') return b.status === 'COMPLETED';
    return true;
  });

  const handleStartWork = async (bookingId: string) => {
    await updateBookingStatus(bookingId, 'STARTED');
  };

  const handleCompleteWork = async (bookingId: string) => {
    await updateBookingStatus(bookingId, 'COMPLETED');
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
            Update job statuses as you travel to customer addresses and complete repairs.
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

      {/* Jobs List */}
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
                      {job.serviceName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-slate-900">{job.serviceName}</h3>
                        <span className="text-xs font-mono font-semibold text-slate-400">#{job.id}</span>
                        {job.type === 'emergency' && (
                          <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                            Emergency
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {job.date} • {job.timeSlot}
                      </p>
                    </div>
                  </div>

                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider self-start sm:self-auto ${
                    job.status === 'COMPLETED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : job.status === 'ON_THE_WAY'
                      ? 'bg-blue-100 text-blue-800 animate-pulse'
                      : job.status === 'STARTED'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {job.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 border-b border-slate-100">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Customer Contact</span>
                    <strong className="text-slate-900 text-sm block">{job.customerName}</strong>
                    <span className="text-slate-500 font-mono">{job.customerPhone}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">Address</span>
                    <p className="text-slate-800 truncate">{job.customerAddress}</p>
                    {job.otp && job.status !== 'COMPLETED' && (
                      <span className="text-[11px] text-amber-800 font-bold block mt-1">
                        Required Customer OTP: <strong className="font-mono bg-amber-50 px-1 py-0.5 rounded">{job.otp}</strong>
                      </span>
                    )}
                  </div>

                  <div className="sm:text-right">
                    <span className="text-slate-400 block mb-0.5">Net Payout (0% Platform Deductions)</span>
                    <span className="text-lg font-bold text-[#C97716]">
                      ₹{job.actualAmount || job.estimatedAmount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Worker Stage Progression */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
                <a
                  href={`tel:${job.customerPhone}`}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Customer</span>
                </a>

                <div className="flex items-center gap-2">
                  {job.status === 'ACCEPTED' && (
                    <button
                      onClick={() => updateBookingStatus(job.id, 'ON_THE_WAY')}
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs"
                    >
                      Depart: Start Transit (On The Way)
                    </button>
                  )}

                  {job.status === 'ON_THE_WAY' && (
                    <button
                      onClick={() => handleStartWork(job.id)}
                      className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Arrived: Enter OTP & Start Work</span>
                    </button>
                  )}

                  {job.status === 'STARTED' && (
                    <button
                      onClick={() => handleCompleteWork(job.id)}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Work Completed (Collect ₹{job.estimatedAmount})</span>
                    </button>
                  )}

                  {job.status === 'COMPLETED' && (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Job Completed & Funds Credited
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#EDDEC9]">
            <p className="text-xs text-slate-500">No jobs in this category.</p>
          </div>
        )}
      </div>

    </div>
  );
};
