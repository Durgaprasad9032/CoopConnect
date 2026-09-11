import React from 'react';
import { Link } from 'react-router-dom';
import { useBooking } from '../../contexts/BookingContext';
import { 
  Users, 
  UserCheck, 
  BookOpenCheck, 
  CheckCircle2, 
  Wallet, 
  AlertOctagon, 
  Coins, 
  Building2, 
  ArrowRight, 
  TrendingUp, 
  Scale, 
  ShieldCheck,
  Flame
} from 'lucide-react';
import { MOCK_COOPERATIVES } from '../../data/mockData';

export const AdminOverviewPage: React.FC = () => {
  const { workers, bookings, disputes } = useBooking();

  const totalWorkers = workers.length;
  const verifiedWorkers = workers.filter((w) => w.verificationStatus === 'verified').length;
  const activeBookings = bookings.filter((b) => ['REQUESTED', 'ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'STARTED'].includes(b.status)).length;
  const completedJobs = bookings.filter((b) => b.status === 'COMPLETED').length;
  const openDisputes = disputes.filter((d) => d.status === 'Open').length;
  
  const totalVolume = bookings
    .filter((b) => b.status === 'COMPLETED')
    .reduce((sum, b) => sum + (b.actualAmount || b.estimatedAmount || 0), 0);

  const welfareContributionsTotal = 485000 + 320000 + 215000; // Across the 3 member cooperatives

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Executive Welcome Banner */}
      <div className="bg-[#1A283C] text-white rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-civic relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3 border border-slate-700">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>Civic Governance & Cooperative Registry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-2">
            Governance Overview Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Supervising labor cooperatives, verifying worker trade credentials, auditing zero-fee integrity, and mediating civic consumer disputes.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid (as requested in Section 15) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Workers */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-civic">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Workers</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-3xl font-serif font-bold text-slate-900 block">{totalWorkers}</span>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            {verifiedWorkers} Verified Credentials
          </span>
        </div>

        {/* Total Customers */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-civic">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-500 uppercase">Registered Customers</span>
            <Building2 className="w-4 h-4 text-teal-600" />
          </div>
          <span className="text-3xl font-serif font-bold text-slate-900 block">1,420</span>
          <span className="text-[11px] text-slate-500 mt-1 block">Across 18 Municipal Wards</span>
        </div>

        {/* Active Bookings */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-civic">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-500 uppercase">Active Bookings</span>
            <BookOpenCheck className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-3xl font-serif font-bold text-slate-900 block">{activeBookings}</span>
          <span className="text-[11px] text-amber-700 font-semibold mt-1 block">
            Dispatched via Fair Balancing
          </span>
        </div>

        {/* Completed Jobs */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-civic">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-500 uppercase">Completed Jobs</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-3xl font-serif font-bold text-slate-900 block">{completedJobs + 168}</span>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            99.2% Peer Satisfaction
          </span>
        </div>

        {/* Total Volume */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-civic">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Service Volume</span>
            <Wallet className="w-4 h-4 text-[#0D6E66]" />
          </div>
          <span className="text-3xl font-serif font-bold text-slate-900 block">₹{totalVolume + 84200}</span>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            100% Direct to Cooperative Members
          </span>
        </div>

        {/* Pending Disputes */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-civic">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-500 uppercase">Pending Disputes</span>
            <AlertOctagon className="w-4 h-4 text-red-600" />
          </div>
          <span className="text-3xl font-serif font-bold text-slate-900 block">{openDisputes}</span>
          <span className="text-[11px] text-red-600 font-semibold mt-1 block">
            Action Required by Desk
          </span>
        </div>

        {/* Welfare Pool */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-civic">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-500 uppercase">Welfare Pool Total</span>
            <Coins className="w-4 h-4 text-[#C97716]" />
          </div>
          <span className="text-3xl font-serif font-bold text-slate-900 block">₹{(welfareContributionsTotal / 100000).toFixed(2)}L</span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Accident & Health Safety Net
          </span>
        </div>

        {/* Active Cooperatives */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-civic">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-500 uppercase">Affiliated Societies</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-3xl font-serif font-bold text-slate-900 block">{MOCK_COOPERATIVES.length}</span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Autonomous Labor Guilds
          </span>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Pending Disputes Desk Alert */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-civic flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-red-600" />
                <span>Civic Dispute Desk</span>
              </h3>
              <Link to="/admin/disputes" className="text-xs font-bold text-blue-600 hover:underline">
                View All
              </Link>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Mediate resident-worker discrepancies with neutral, recorded resolution notes.
            </p>

            <div className="space-y-2">
              {disputes.slice(0, 2).map((d) => (
                <div key={d.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <strong className="text-slate-900">{d.customerName} vs. {d.workerName}</strong>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      d.status === 'Open' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {d.status}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] line-clamp-1">{d.reason}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <Link
              to="/admin/disputes"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2"
            >
              <span>Manage Open Disputes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Worker Verification Desk */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-civic flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                <span>Worker KYC & Skill Passport Verification</span>
              </h3>
              <Link to="/admin/workers" className="text-xs font-bold text-blue-600 hover:underline">
                View Registry
              </Link>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Validate trade certificates, police background clearances, and union membership standing.
            </p>

            <div className="space-y-2">
              {workers.slice(0, 2).map((w) => (
                <div key={w.uid} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={w.photoURL || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=100'}
                      alt={w.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <strong className="text-slate-900 block">{w.name}</strong>
                      <span className="text-[11px] text-slate-500">{w.profession}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    w.verificationStatus === 'verified'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {w.verificationStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <Link
              to="/admin/workers"
              className="w-full py-2.5 rounded-xl bg-[#1A283C] hover:bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-2"
            >
              <span>Review Worker Credentials</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};
