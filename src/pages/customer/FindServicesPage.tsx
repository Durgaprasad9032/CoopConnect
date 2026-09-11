import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_SERVICES } from '../../data/mockData';
import { useBooking } from '../../contexts/BookingContext';
import { 
  Search, 
  Filter, 
  Star, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Wrench, 
  Zap, 
  HeartHandshake, 
  Home, 
  Sparkles, 
  Car,
  Briefcase
} from 'lucide-react';

export const FindServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const { workers } = useBooking();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredServices = MOCK_SERVICES.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || s.id === selectedCategory;
    return matchesSearch && matchesCat;
  });

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
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header & Search */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DED1] shadow-civic">
        <div className="max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0D6E66]">
            Civic Trade Registry
          </span>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mt-1 mb-2">
            Find Cooperative Services
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Search verified community tradesmen operating part-time with zero platform commission deductions.
          </p>
        </div>

        {/* Search Input */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search plumbing, wiring, elder care, cleaning..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0D6E66] outline-none"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-300 text-xs outline-none bg-white font-medium"
          >
            <option value="all">All Categories</option>
            {MOCK_SERVICES.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-3xl p-6 border border-[#E8DED1] hover:border-[#0D6E66] shadow-civic hover:shadow-civic-hover transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-teal-50 border border-slate-100 flex items-center justify-center transition-colors">
                  {getServiceIcon(service.iconName)}
                </div>
                <span className="text-xs font-bold text-slate-800 bg-[#FAF7F2] px-3 py-1 rounded-lg border border-[#E8DED1]">
                  ₹{service.baseRate}/{service.rateUnit}
                </span>
              </div>
              
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-[#0D6E66] transition-colors mb-1">
                {service.name}
              </h3>
              <p className="text-xs font-semibold text-slate-500 mb-2">
                {service.tagline}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                {service.description}
              </p>
            </div>

            <div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 mb-4 flex items-center justify-between text-xs text-slate-600">
                <span>Active Societies: <strong>{service.activeCoopsCount}</strong></span>
                <span className="text-emerald-700 font-semibold">{service.availableWorkersCount} part-time workers</span>
              </div>

              <button
                onClick={() => navigate(`/customer/book?service=${service.id}`)}
                className="w-full py-2.5 rounded-xl bg-[#0D6E66] hover:bg-[#0A554F] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Book Service</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Verified Workers Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DED1] shadow-civic">
        <div className="mb-6">
          <h2 className="text-xl font-serif font-bold text-slate-900">
            Available Verified Cooperative Workers
          </h2>
          <p className="text-xs text-slate-500">
            Workers operating under autonomous part-time schedules backed by union safety guarantees
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workers.map((worker) => (
            <div key={worker.uid} className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DED1] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={worker.photoURL || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=120'}
                    alt={worker.name}
                    className="w-12 h-12 rounded-xl object-cover border border-amber-300 shadow-xs"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{worker.name}</h4>
                    <span className="text-[11px] font-semibold text-[#0D6E66] block">{worker.profession}</span>
                    <span className="text-[10px] text-slate-500 block">{worker.cooperativeName}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {worker.skills?.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600 font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 font-bold text-slate-800">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{worker.rating}</span>
                </div>
                <button
                  onClick={() => navigate(`/customer/book?service=electrical`)}
                  className="px-3 py-1 rounded-lg bg-teal-50 hover:bg-[#0D6E66] text-[#0D6E66] hover:text-white font-bold text-[11px] transition-colors"
                >
                  Request Worker
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
