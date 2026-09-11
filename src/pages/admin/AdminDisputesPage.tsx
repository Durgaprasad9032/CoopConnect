import React, { useState } from 'react';
import { useBooking } from '../../contexts/BookingContext';
import { 
  AlertOctagon, 
  CheckCircle2, 
  Eye, 
  X, 
  Scale, 
  ShieldCheck, 
  MessageSquare,
  Search
} from 'lucide-react';
import { Dispute } from '../../types';

export const AdminDisputesPage: React.FC = () => {
  const { disputes, resolveDispute } = useBooking();
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [resolutionNote, setResolutionNote] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'Open' | 'Resolved'>('all');

  const filteredDisputes = disputes.filter((d) => {
    if (filter === 'all') return true;
    return d.status === filter;
  });

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDispute || !resolutionNote) return;
    await resolveDispute(selectedDispute.id, resolutionNote);
    setSelectedDispute((prev) => (prev ? { ...prev, status: 'Resolved', resolutionNote } : null));
    setResolutionNote('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-civic flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-red-600">
            Civic Mediation Desk
          </span>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mt-0.5">
            Dispute Resolution Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Democratic, neutral resolution of service discrepancies between households and cooperative workers.
          </p>
        </div>

        <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold self-start sm:self-auto">
          {(['all', 'Open', 'Resolved'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
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

      {/* Disputes Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-civic overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Dispute ID</th>
                <th className="py-3.5 px-4">Booking Ref</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Worker</th>
                <th className="py-3.5 px-4">Grievance Reason</th>
                <th className="py-3.5 px-4">Filed Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDisputes.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-slate-900">
                    #{d.id}
                  </td>

                  <td className="py-4 px-4 font-mono text-slate-600">
                    #{d.bookingId}
                  </td>

                  <td className="py-4 px-4 font-semibold text-slate-900">
                    {d.customerName}
                  </td>

                  <td className="py-4 px-4 font-medium text-slate-800">
                    {d.workerName}
                  </td>

                  <td className="py-4 px-4 text-slate-600 max-w-xs truncate">
                    {d.reason}
                  </td>

                  <td className="py-4 px-4 text-slate-500">
                    {d.date}
                  </td>

                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      d.status === 'Open'
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : d.status === 'Under Review'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {d.status}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setSelectedDispute(d)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                    >
                      {d.status === 'Resolved' ? 'View Record' : 'Mediate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mediation Resolution Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setSelectedDispute(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                Dispute #{selectedDispute.id}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                selectedDispute.status === 'Open' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {selectedDispute.status}
              </span>
            </div>

            <h3 className="text-xl font-serif font-bold text-slate-900 mb-4">
              Civic Mediation Desk Case File
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex justify-between">
                <span>Booking ID</span>
                <strong className="text-slate-900 font-mono">#{selectedDispute.bookingId}</strong>
              </div>
              <div className="flex justify-between">
                <span>Complainant (Customer)</span>
                <strong className="text-slate-900">{selectedDispute.customerName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Technician (Worker)</span>
                <strong className="text-slate-900">{selectedDispute.workerName}</strong>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">Stated Reason:</span>
                <p className="text-slate-800 italic bg-white p-2.5 rounded-xl border border-slate-200">
                  &ldquo;{selectedDispute.reason}&rdquo;
                </p>
              </div>

              {selectedDispute.resolutionNote && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="font-bold text-emerald-800 block mb-1">Official Resolution Note:</span>
                  <p className="text-emerald-900 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 font-medium">
                    {selectedDispute.resolutionNote}
                  </p>
                </div>
              )}
            </div>

            {selectedDispute.status !== 'Resolved' ? (
              <form onSubmit={handleResolve} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Registrar Mediation Decision / Resolution Note
                  </label>
                  <textarea
                    rows={3}
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    placeholder="e.g. Cooperative peer reviewed hardware receipt; customer provided ₹100 credit via society pool; work reinspected."
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#1A283C] outline-none resize-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedDispute(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Resolve & Close Dispute</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  onClick={() => setSelectedDispute(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
