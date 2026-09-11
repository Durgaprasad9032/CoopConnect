import React from 'react';
import { MOCK_SERVICES } from '../../data/mockData';
import { Wrench, Zap, HeartHandshake, Home, Sparkles, Car, ShieldCheck } from 'lucide-react';

export const AdminServicesPage: React.FC = () => {
  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wrench': return <Wrench className="w-5 h-5 text-[#0D6E66]" />;
      case 'Zap': return <Zap className="w-5 h-5 text-amber-600" />;
      case 'HeartHandshake': return <HeartHandshake className="w-5 h-5 text-rose-600" />;
      case 'Home': return <Home className="w-5 h-5 text-indigo-600" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-teal-600" />;
      case 'Car': return <Car className="w-5 h-5 text-slate-700" />;
      default: return <Wrench className="w-5 h-5 text-[#0D6E66]" />;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-civic flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Civic Tariff Ledger
          </span>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mt-0.5">
            Services Catalogue & Base Rates
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Standardized floor rates determined in consensus with labor cooperative assemblies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_SERVICES.map((s) => (
          <div key={s.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-civic flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {getServiceIcon(s.iconName)}
                </div>
                <span className="text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                  Floor: ₹{s.baseRate}/{s.rateUnit}
                </span>
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-1">{s.name}</h3>
              <p className="text-xs text-slate-500 mb-2">{s.tagline}</p>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">{s.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Participating Societies:</span>
                <strong className="text-slate-900">{s.activeCoopsCount}</strong>
              </div>
              <div className="flex justify-between">
                <span>Registered Technicians:</span>
                <strong className="text-emerald-700">{s.availableWorkersCount}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
