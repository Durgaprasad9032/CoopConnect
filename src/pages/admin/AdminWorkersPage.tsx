import React, { useState } from 'react';
import { useBooking } from '../../contexts/BookingContext';
import { 
  UserCheck, 
  Search, 
  Filter, 
  ShieldCheck, 
  AlertTriangle, 
  Star, 
  Eye, 
  X, 
  CheckCircle2, 
  Ban, 
  Clock,
  Briefcase
} from 'lucide-react';
import { UserProfile } from '../../types';

export const AdminWorkersPage: React.FC = () => {
  const { workers, verifyWorker, suspendWorker } = useBooking();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending' | 'suspended'>('all');
  const [selectedWorker, setSelectedWorker] = useState<UserProfile | null>(null);

  const filteredWorkers = workers.filter((w) => {
    const matchesSearch = w.name.toLowerCase().includes(search.toLowerCase()) ||
                          (w.profession && w.profession.toLowerCase().includes(search.toLowerCase())) ||
                          (w.cooperativeName && w.cooperativeName.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || w.verificationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-civic flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Institutional Registry
          </span>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mt-0.5">
            Worker Registry & Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Audit labor cooperative memberships, trade certifications, and part-time availability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            {workers.filter((w) => w.verificationStatus === 'verified').length} Verified
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-civic flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search worker by name, profession, or cooperative..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-[#1A283C]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none bg-white font-medium"
        >
          <option value="all">All Verification Statuses</option>
          <option value="verified">Verified Only</option>
          <option value="pending">Pending Review</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Workers Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-civic overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Worker Name</th>
                <th className="py-3.5 px-4">Profession</th>
                <th className="py-3.5 px-4">Cooperative Society</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Availability</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Jobs</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredWorkers.map((worker) => (
                <tr key={worker.uid} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={worker.photoURL || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=100'}
                        alt={worker.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <strong className="text-slate-900 block font-semibold">{worker.name}</strong>
                        <span className="text-slate-400 font-mono text-[10px]">UID: {worker.uid}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-medium text-slate-800">
                    {worker.profession}
                  </td>

                  <td className="py-4 px-4 text-slate-600 max-w-xs truncate">
                    {worker.cooperativeName}
                  </td>

                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      worker.verificationStatus === 'verified'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : worker.verificationStatus === 'suspended'
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {worker.verificationStatus || 'pending'}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span className={`text-[11px] font-semibold flex items-center gap-1 ${
                      worker.availability?.isAvailable ? 'text-emerald-700' : 'text-slate-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        worker.availability?.isAvailable ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}></span>
                      {worker.availability?.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 font-bold text-slate-800">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{worker.rating || 4.8}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-bold text-slate-800">
                    {worker.totalJobs || 0}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedWorker(worker)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        title="View Skill Passport"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {worker.verificationStatus !== 'verified' && (
                        <button
                          onClick={() => verifyWorker(worker.uid)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-bold transition-colors"
                        >
                          Verify
                        </button>
                      )}

                      {worker.verificationStatus !== 'suspended' && (
                        <button
                          onClick={() => suspendWorker(worker.uid)}
                          className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-bold transition-colors"
                        >
                          Suspend
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Worker Detail Modal */}
      {selectedWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setSelectedWorker(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <img
                src={selectedWorker.photoURL || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=150'}
                alt={selectedWorker.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-300"
              />
              <div>
                <h3 className="text-xl font-serif font-bold text-slate-900">{selectedWorker.name}</h3>
                <p className="text-xs font-bold text-[#C97716]">{selectedWorker.profession}</p>
                <p className="text-xs text-slate-500">{selectedWorker.cooperativeName}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 mb-6">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span>Verification Clearance</span>
                <span className="font-bold text-emerald-700 capitalize">{selectedWorker.verificationStatus}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span>Trade Experience</span>
                <span className="font-bold text-slate-800">{selectedWorker.experienceYears || 5} Years</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span>Completed Bookings</span>
                <span className="font-bold text-slate-800">{selectedWorker.totalJobs || 0} jobs</span>
              </div>
              <div>
                <span className="block font-bold text-slate-700 mb-1.5">Registered Competencies:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedWorker.skills?.map((s, idx) => (
                    <span key={idx} className="bg-slate-100 px-2.5 py-0.5 rounded-md text-[11px] font-medium text-slate-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              {selectedWorker.verificationStatus !== 'verified' && (
                <button
                  onClick={async () => {
                    await verifyWorker(selectedWorker.uid);
                    setSelectedWorker((prev) => (prev ? { ...prev, verificationStatus: 'verified' } : null));
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                >
                  Approve Verification
                </button>
              )}
              {selectedWorker.verificationStatus !== 'suspended' && (
                <button
                  onClick={async () => {
                    await suspendWorker(selectedWorker.uid);
                    setSelectedWorker((prev) => (prev ? { ...prev, verificationStatus: 'suspended' } : null));
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
                >
                  Suspend Account
                </button>
              )}
              <button
                onClick={() => setSelectedWorker(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
