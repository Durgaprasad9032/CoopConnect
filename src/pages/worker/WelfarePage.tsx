import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import { 
  HeartHandshake, 
  ShieldCheck, 
  Heart, 
  Users, 
  CheckCircle2, 
  Clock, 
  Coins, 
  Info,
  Building2
} from 'lucide-react';

export const WelfarePage: React.FC = () => {
  const { user } = useAuth();
  const { workers } = useBooking();

  const activeWorker = workers.find((w) => w.uid === user?.uid) || workers[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDDEC9] shadow-civic">
        <span className="text-xs font-bold uppercase tracking-wider text-[#C97716]">
          Social Security & Mutual Aid
        </span>
        <h1 className="text-3xl font-serif font-bold text-slate-900 mt-0.5 mb-2">
          Cooperative Welfare Fund
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
          Cooperative members pool collective resources for accident cover, tool micro-grants, emergency healthcare, and family mutual aid.
        </p>

        {/* Backend Note Alert */}
        <div className="mt-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#C97716] shrink-0 mt-0.5" />
          <p>
            <strong>Civic Ledger Notice:</strong> Welfare fund contributions are democratically decided by the cooperative society assembly and do not represent mandatory corporate deductions.
          </p>
        </div>
      </div>

      {/* Welfare KPI Pool Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Personal Reserve */}
        <div className="bg-white rounded-3xl p-6 border border-[#EDDEC9] shadow-civic">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Personal Welfare Credit</span>
            <Coins className="w-4 h-4 text-[#C97716]" />
          </div>
          <span className="text-3xl font-serif font-bold text-slate-900">
            ₹{activeWorker.welfareBalance || 12400}
          </span>
          <span className="text-[11px] text-emerald-700 font-bold block mt-1">
            Available for Emergency Claim
          </span>
        </div>

        {/* Society Pool Total */}
        <div className="bg-white rounded-3xl p-6 border border-[#EDDEC9] shadow-civic">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Cooperative Society Pool</span>
            <Building2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-3xl font-serif font-bold text-slate-900">
            ₹4,85,000
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">
            Kalyan Shramik Society Reserve
          </span>
        </div>

        {/* Insurance Cover */}
        <div className="bg-white rounded-3xl p-6 border border-[#EDDEC9] shadow-civic bg-teal-50/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-teal-800">Accident & Health Cover</span>
            <ShieldCheck className="w-4 h-4 text-[#0D6E66]" />
          </div>
          <span className="text-3xl font-serif font-bold text-[#0D6E66]">
            ₹5,00,000
          </span>
          <span className="text-[11px] text-teal-700 font-bold block mt-1">
            Group Policy #GIC-COOP-491
          </span>
        </div>
      </div>

      {/* Active Benefits Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDDEC9] shadow-civic">
        <h3 className="font-serif font-bold text-lg text-slate-900 mb-4">
          Active Member Welfare Protections
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#EDDEC9]">
            <div className="flex items-center gap-2 font-bold text-xs text-slate-900 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>On-Duty Accidental Insurance</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Full hospitalization coverage during travel to customer addresses and on-site repair operations.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#EDDEC9]">
            <div className="flex items-center gap-2 font-bold text-xs text-slate-900 mb-1">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Family Healthcare Support</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Subsidized diagnostics and prescription support via cooperative network clinics in Bengaluru.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#EDDEC9]">
            <div className="flex items-center gap-2 font-bold text-xs text-slate-900 mb-1">
              <Coins className="w-4 h-4 text-[#C97716]" />
              <span>Tool Upgrade Micro-Grant</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Zero-interest equipment financing to acquire modern safety testers, insulated hand tools, and power drills.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#EDDEC9]">
            <div className="flex items-center gap-2 font-bold text-xs text-slate-900 mb-1">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Children Educational Scholarship</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Annual scholastic support for cooperative members' children pursuing vocational or secondary school.
            </p>
          </div>
        </div>
      </div>

      {/* Contribution History */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDDEC9] shadow-civic">
        <h3 className="font-serif font-bold text-lg text-slate-900 mb-4">
          Welfare Pool Ledger Entries
        </h3>

        <div className="divide-y divide-slate-100 text-xs">
          {[
            { id: 'WF-301', date: 'Sept 5, 2026', type: 'Household Patronage Match', amount: '+₹50.00', status: 'Credited' },
            { id: 'WF-298', date: 'Aug 28, 2026', type: 'Annual Tool Micro-Grant Allocation', amount: '+₹2,500.00', status: 'Approved' },
            { id: 'WF-282', date: 'Aug 15, 2026', type: 'Cooperative Society Dividend Surplus', amount: '+₹1,800.00', status: 'Credited' },
            { id: 'WF-274', date: 'July 30, 2026', type: 'Group Insurance Premium Subsidy', amount: 'Covered', status: 'Active' },
          ].map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between">
              <div>
                <strong className="text-slate-900 block">{item.type}</strong>
                <span className="text-slate-500">{item.date} • Ref #{item.id}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-emerald-700 block">{item.amount}</span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
