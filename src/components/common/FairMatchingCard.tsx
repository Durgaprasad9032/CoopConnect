import React, { useState } from 'react';
import { Scale, CheckCircle2, Shield, Clock, Award, Users, ChevronRight } from 'lucide-react';

export const FairMatchingCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'factors' | 'comparison'>('overview');

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DED1] shadow-civic relative overflow-hidden">
      {/* Decorative background watermark */}
      <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-[#FAF7F2] rounded-full flex items-center justify-center opacity-70 pointer-events-none">
        <Scale className="w-24 h-24 text-[#E8DED1]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200">
              <Scale className="w-3.5 h-3.5 text-emerald-600" />
              Democratic Algorithmic Governance
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#1A2332]">
              Fair Job Matching System
            </h3>
          </div>

          {/* Mini Tab Switcher */}
          <div className="inline-flex p-1 rounded-xl bg-[#FAF7F2] border border-[#E8DED1] text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'overview'
                  ? 'bg-white text-[#1A2332] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Principle
            </button>
            <button
              onClick={() => setActiveTab('factors')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'factors'
                  ? 'bg-white text-[#1A2332] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7 Matching Factors
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'comparison'
                  ? 'bg-white text-[#1A2332] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              vs. Private Apps
            </button>
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-6 font-medium">
              &ldquo;We consider worker availability and workload so that job opportunities are <strong className="text-[#D05A3F]">not concentrated among only a few workers</strong>.&rdquo;
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DED1]">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-2">
                  <Users className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 mb-1">Equitable Workload</h4>
                <p className="text-xs text-slate-600">
                  Workers who haven't received jobs today are prioritized over workers already at capacity.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DED1]">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-2">
                  <Clock className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 mb-1">Part-Time Respect</h4>
                <p className="text-xs text-slate-600">
                  Workers are dispatched strictly during their self-declared flexible shift hours.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DED1]">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold mb-2">
                  <Shield className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 mb-1">Coop Quality Assurance</h4>
                <p className="text-xs text-slate-600">
                  Backed by cooperative trade certification and collective peer guarantee.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Factors */}
        {activeTab === 'factors' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {[
              { label: 'Skill & Certificate Match', desc: 'Verified trade skills fit the repair', icon: Award },
              { label: 'Workload Balancing', desc: 'Distributes shifts across members', icon: Scale },
              { label: 'Self-Declared Shift', desc: 'Active part-time availability', icon: Clock },
              { label: 'Location & Distance', desc: 'Reasonable ward transit distance', icon: CheckCircle2 },
              { label: 'Previous Job Allocation', desc: 'Prevents star-worker monopolies', icon: Users },
              { label: 'Peer Review & Rating', desc: 'High quality standards maintained', icon: Award },
              { label: 'Cooperative Standing', desc: 'Active union verification', icon: Shield },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DED1] flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-1.5 font-bold text-slate-900">
                    <Icon className="w-4 h-4 text-[#D05A3F]" />
                    <span>{f.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">{f.desc}</p>
                </div>
              );
            })}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#0D6E66] to-[#0A4333] text-white flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-teal-200">Result</span>
              <span className="font-bold text-xs mt-1">Dignified, Predictable Earnings</span>
            </div>
          </div>
        )}

        {/* Tab 3: Comparison */}
        {activeTab === 'comparison' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#E8DED1] text-slate-500">
                  <th className="py-2 font-medium">Feature</th>
                  <th className="py-2 font-medium text-red-600">Traditional Gig Platforms</th>
                  <th className="py-2 font-medium text-emerald-700">CoopConnect Fair Matching</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DED1]">
                <tr>
                  <td className="py-2.5 font-semibold text-slate-800">Worker Commission</td>
                  <td className="py-2.5 text-red-600">18% - 30% deducted per job</td>
                  <td className="py-2.5 text-emerald-700 font-bold">0% — Zero Registration or Platform Fees</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-semibold text-slate-800">Dispatch Logic</td>
                  <td className="py-2.5 text-slate-600">Monopolized by hyper-rated full-timers</td>
                  <td className="py-2.5 text-emerald-700 font-medium">Workload-balanced part-time distribution</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-semibold text-slate-800">Working Hours</td>
                  <td className="py-2.5 text-slate-600">Algorithmic penalties for logging off</td>
                  <td className="py-2.5 text-emerald-700 font-medium">100% self-selected flexible part-time matrix</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-semibold text-slate-800">Worker Support</td>
                  <td className="py-2.5 text-slate-600">Arbitrary automated deactivations</td>
                  <td className="py-2.5 text-emerald-700 font-medium">Civic dispute desk with peer cooperative voice</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
