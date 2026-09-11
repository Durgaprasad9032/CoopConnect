import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Scale, 
  Sparkles, 
  MapPin, 
  Clock, 
  Users, 
  ShieldCheck, 
  Zap, 
  Info,
  Layers,
  Cpu
} from 'lucide-react';
import { FairMatchingCard } from '../../components/common/FairMatchingCard';

export const AdminAnalyticsPage: React.FC = () => {
  const [selectedWard, setSelectedWard] = useState<string>('all');
  const [aiForecastActive, setAiForecastActive] = useState<boolean>(true);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-civic flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1A283C]">
              Institutional Intelligence
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
              <Cpu className="w-3 h-3" /> Python AI Service Interface Ready
            </span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">
            Demand Analytics & Algorithmic Fairness
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Auditing service demand heatmaps, anti-monopoly job distribution, and cooperative capacity forecasting.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setAiForecastActive(!aiForecastActive)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border ${
              aiForecastActive
                ? 'bg-blue-50 text-blue-800 border-blue-300'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{aiForecastActive ? 'AI Forecasting: Active' : 'AI Forecasting: Standby'}</span>
          </button>
        </div>
      </div>

      {/* AI Demand Forecasting Notice */}
      <div className="bg-gradient-to-r from-[#1A283C] to-slate-800 rounded-3xl p-6 text-white shadow-civic">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Cpu className="w-4 h-4" />
              <span>Predictive Ward Capacity Engine</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-white mb-1">
              Democratized Machine Learning Integration
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Designed with clean REST/gRPC endpoints to ingest forecasts from Python ML services (XGBoost / Prophet models) without extracting surplus value from workers.
            </p>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 text-center shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Forecast Model</span>
            <span className="text-xs font-mono font-bold text-emerald-400">coop_demand_v2.pkl</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Latency: ~18ms</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Most Requested Services */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-civic">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900">
                Service Demand Breakdown
              </h3>
              <p className="text-xs text-slate-500">Share of monthly household requests</p>
            </div>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>

          <div className="space-y-3.5 text-xs">
            {[
              { name: 'Electrical Work', count: 184, pct: 36, color: 'bg-amber-500' },
              { name: 'Plumbing Services', count: 142, pct: 28, color: 'bg-teal-600' },
              { name: 'Elderly Care & Caregiving', count: 86, pct: 17, color: 'bg-rose-500' },
              { name: 'Domestic Help & Cooking', count: 52, pct: 10, color: 'bg-blue-600' },
              { name: 'Deep Cleaning & Sanitization', count: 46, pct: 9, color: 'bg-emerald-600' },
            ].map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>{s.name}</span>
                  <span className="text-slate-900 font-bold">{s.count} requests ({s.pct}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service Demand by Ward / Area */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-civic">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900">
                Demand by Municipal Ward
              </h3>
              <p className="text-xs text-slate-500">Geographic concentration vs. cooperative worker supply</p>
            </div>
            <MapPin className="w-5 h-5 text-slate-400" />
          </div>

          <div className="space-y-3 text-xs">
            {[
              { ward: 'Indiranagar (Ward 112)', demand: 'High Demand (72 jobs/wk)', supply: 'Adequate (32 workers)', status: 'Balanced' },
              { ward: 'Koramangala (Ward 151)', demand: 'Surging (94 jobs/wk)', supply: 'Capacity Tight (24 workers)', status: 'Need More Workers' },
              { ward: 'Malleshwaram (Ward 65)', demand: 'Moderate (48 jobs/wk)', supply: 'Healthy (28 workers)', status: 'Balanced' },
              { ward: 'Whitefield (Ward 84)', demand: 'Rapid Growth (65 jobs/wk)', supply: 'Expanding (19 workers)', status: 'Recruiting' },
            ].map((w, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 block font-semibold">{w.ward}</strong>
                  <span className="text-slate-500 text-[11px]">{w.demand} • {w.supply}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  w.status === 'Balanced' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {w.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Fair Job Distribution Visualizer (Section 20 requirement) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-civic">
        <div className="flex items-center gap-2 mb-2">
          <Scale className="w-5 h-5 text-[#C97716]" />
          <h3 className="font-serif font-bold text-xl text-slate-900">
            Fair Job Distribution Verification
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 max-w-3xl">
          &ldquo;We consider worker availability and workload so that job opportunities are not concentrated among only a few workers.&rdquo;
        </p>

        {/* Workload Gini & Anti-Monopoly Index */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
            <span className="text-emerald-800 font-bold uppercase text-[10px] block mb-1">
              Workload Gini Coefficient
            </span>
            <span className="text-2xl font-serif font-bold text-emerald-900 block">0.14</span>
            <span className="text-emerald-700 mt-0.5 block font-medium">
              Near-perfect egalitarian distribution (Industry avg: 0.68)
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DED1] text-xs">
            <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1">
              Top 10% Worker Job Share
            </span>
            <span className="text-2xl font-serif font-bold text-slate-900 block">16.2%</span>
            <span className="text-slate-600 mt-0.5 block font-medium">
              Anti-monopoly cap prevents star worker dominance
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DED1] text-xs">
            <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1">
              Part-Time Honor Rate
            </span>
            <span className="text-2xl font-serif font-bold text-slate-900 block">100%</span>
            <span className="text-slate-600 mt-0.5 block font-medium">
              Zero jobs dispatched outside declared shift matrix
            </span>
          </div>
        </div>

        {/* Embedded Interactive Fair Matching Module */}
        <FairMatchingCard />
      </div>

    </div>
  );
};
