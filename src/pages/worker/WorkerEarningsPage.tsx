import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import { 
  Wallet, 
  TrendingUp, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  ArrowDownToLine, 
  ShieldCheck, 
  Coins,
  Scale
} from 'lucide-react';

export const WorkerEarningsPage: React.FC = () => {
  const { user } = useAuth();
  const { workers, bookings } = useBooking();

  const activeWorker = workers.find((w) => w.uid === user?.uid) || workers[0];
  const earnings = activeWorker.earnings || {
    today: 850,
    week: 4200,
    month: 16800,
    total: 68400,
  };

  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'total'>('week');

  const completedJobs = bookings.filter((b) => b.status === 'COMPLETED' && (b.workerId === activeWorker.uid || !b.workerId));

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDDEC9] shadow-civic flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C97716]">
            Transparent Remuneration
          </span>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mt-0.5">
            Worker Earnings & Payouts
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Direct member remuneration with zero intermediary commission deductions.
          </p>
        </div>

        {/* Zero Fee Assurance Callout */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 self-start sm:self-auto flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <strong className="block">100% Retained Earnings</strong>
            <span className="text-[11px] text-emerald-700">No registration, subscription or usage fees.</span>
          </div>
        </div>
      </div>

      {/* Top Zero-Commission Highlight Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 text-white shadow-civic flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
            Cooperative Solidarity Promise
          </span>
          <h3 className="text-2xl font-serif font-bold text-white mt-1 mb-2">
            No Fees. No Hidden Commissions. Ever.
          </h3>
          <p className="text-xs text-emerald-100 max-w-xl leading-relaxed">
            Unlike commercial gig corporations that deduct 20% to 30% of worker labor, CoopConnect provides free access to cooperative members. Every rupee paid by the household reaches the technician.
          </p>
        </div>
        <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0">
          <span className="text-[10px] uppercase font-bold text-emerald-200 block">Platform Commission</span>
          <span className="text-3xl font-serif font-extrabold text-emerald-300">0.0%</span>
        </div>
      </div>

      {/* Earnings Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#EDDEC9] shadow-civic">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Today's Earnings</span>
          <span className="text-2xl font-serif font-bold text-slate-900">₹{earnings.today}</span>
          <span className="text-[11px] text-emerald-600 font-bold block mt-1">Direct Bank Credit</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#EDDEC9] shadow-civic">
          <span className="text-xs font-semibold text-slate-500 block mb-1">This Week</span>
          <span className="text-2xl font-serif font-bold text-slate-900">₹{earnings.week}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Across 8 part-time shifts</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#EDDEC9] shadow-civic">
          <span className="text-xs font-semibold text-slate-500 block mb-1">This Month</span>
          <span className="text-2xl font-serif font-bold text-slate-900">₹{earnings.month}</span>
          <span className="text-[11px] text-slate-500 block mt-1">32 completed jobs</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#EDDEC9] shadow-civic bg-amber-50/50">
          <span className="text-xs font-semibold text-[#C97716] block mb-1">Total Lifetime Earnings</span>
          <span className="text-2xl font-serif font-bold text-[#C97716]">₹{earnings.total}</span>
          <span className="text-[11px] text-amber-800 font-semibold block mt-1">Zero platform fee deduction</span>
        </div>
      </div>

      {/* Visual Weekly Payout Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDDEC9] shadow-civic">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-serif font-bold text-lg text-slate-900">
              Weekly Shift Payouts
            </h3>
            <p className="text-xs text-slate-500">Earnings logged per part-time duty block</p>
          </div>

          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
            <button className="px-3 py-1 bg-white rounded-lg shadow-sm text-slate-900 font-bold">This Week</button>
            <button className="px-3 py-1 text-slate-500 hover:text-slate-900">Last Week</button>
          </div>
        </div>

        {/* Stylized Bar Chart */}
        <div className="space-y-3">
          {[
            { day: 'Mon (6 PM - 9 PM)', amount: 850, jobs: 2, pct: '70%' },
            { day: 'Tue (Off Duty)', amount: 0, jobs: 0, pct: '0%' },
            { day: 'Wed (6 PM - 9 PM)', amount: 700, jobs: 1, pct: '58%' },
            { day: 'Thu (6 PM - 9 PM)', amount: 950, jobs: 2, pct: '80%' },
            { day: 'Fri (6 PM - 10 PM)', amount: 1200, jobs: 3, pct: '100%' },
            { day: 'Sat (10 AM - 6 PM)', amount: 1100, jobs: 2, pct: '92%' },
            { day: 'Sun (10 AM - 2 PM)', amount: 600, jobs: 1, pct: '50%' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 text-xs">
              <span className="w-32 font-semibold text-slate-700 truncate">{item.day}</span>
              <div className="flex-1 bg-slate-100 h-6 rounded-lg overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-[#C97716] to-[#E06D53] rounded-lg transition-all duration-500 flex items-center justify-end pr-2 text-white font-bold text-[10px]"
                  style={{ width: item.amount > 0 ? item.pct : '0%' }}
                >
                  {item.amount > 0 && `₹${item.amount}`}
                </div>
              </div>
              <span className="w-20 text-right text-slate-500">{item.jobs} {item.jobs === 1 ? 'job' : 'jobs'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Jobs Payout History */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDDEC9] shadow-civic">
        <h3 className="font-serif font-bold text-lg text-slate-900 mb-4">
          Completed Jobs Ledger
        </h3>

        <div className="divide-y divide-slate-100">
          {completedJobs.map((b) => (
            <div key={b.id} className="py-3.5 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 block">{b.serviceName}</span>
                <span className="text-slate-500">{b.customerName} • {b.date}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-sm text-[#C97716] block">₹{b.actualAmount || b.estimatedAmount}</span>
                <span className="text-[10px] text-emerald-700 font-semibold">0% Platform Fee</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
