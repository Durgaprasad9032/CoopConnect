import React from 'react';
import { MOCK_COOPERATIVES } from '../../data/mockData';
import { Building2, ShieldCheck, Star, Users, Coins, MapPin } from 'lucide-react';

export const AdminCooperativesPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-civic flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Institutional Registry
          </span>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mt-0.5">
            Registered Labor Cooperatives
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Autonomous multi-state and district worker cooperative societies affiliated with CoopConnect.
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
          {MOCK_COOPERATIVES.length} Registered Societies
        </span>
      </div>

      {/* Cooperatives Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_COOPERATIVES.map((coop) => (
          <div key={coop.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-civic flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 font-bold text-xs text-slate-800 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{coop.rating}</span>
                </div>
              </div>

              <h3 className="font-serif font-bold text-lg text-slate-900 leading-snug mb-1">
                {coop.name}
              </h3>
              <span className="text-xs font-mono text-slate-500 block mb-3">
                Reg: {coop.registrationNumber}
              </span>

              <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span>Location</span>
                  <strong className="text-slate-800">{coop.district}, {coop.state}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Founded</span>
                  <strong className="text-slate-800">{coop.foundedYear}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Total Members</span>
                  <strong className="text-slate-800">{coop.totalMembers} artisans</strong>
                </div>
                <div className="flex justify-between">
                  <span>Active On Platform</span>
                  <strong className="text-emerald-700">{coop.activeWorkers} workers</strong>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100">
                  <span>Society Welfare Fund</span>
                  <strong className="text-[#C97716] font-bold">₹{coop.welfareFundTotal.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1.5">
                Certified Trades
              </span>
              <div className="flex flex-wrap gap-1">
                {coop.servicesOffered.map((svc, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                    {svc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
