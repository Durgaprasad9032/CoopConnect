import React, { useState } from 'react';
import { useBooking } from '../../contexts/BookingContext';
import { 
  BookOpenCheck, 
  Search, 
  Filter, 
  Eye, 
  Flame, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  X
} from 'lucide-react';
import { BookingStatus, Booking } from '../../types';

export const AdminBookingsPage: React.FC = () => {
  const { bookings, updateBookingStatus } = useBooking();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const statuses: ('ALL' | BookingStatus)[] = [
    'ALL',
    'REQUESTED',
    'ACCEPTED',
    'ON_THE_WAY',
    'STARTED',
    'COMPLETED',
    'CANCELLED',
    'DISPUTED'
  ];

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = b.id.toLowerCase().includes(search.toLowerCase()) ||
                          b.customerName.toLowerCase().includes(search.toLowerCase()) ||
                          (b.workerName && b.workerName.toLowerCase().includes(search.toLowerCase())) ||
                          b.serviceName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-civic flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Master Service Ledger
          </span>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mt-0.5">
            Bookings Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Complete audit trail of all household service requests, active dispatches, and completions.
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 self-start sm:self-auto border border-slate-200">
          {bookings.length} Total Ledger Records
        </span>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-civic space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search booking ID, customer name, worker, or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-[#1A283C]"
          />
        </div>

        {/* Horizontal Status Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-[#1A283C] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-civic overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Booking ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Assigned Worker</th>
                <th className="py-3.5 px-4">Service</th>
                <th className="py-3.5 px-4">Date / Slot</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span>#{b.id}</span>
                      {b.type === 'emergency' && (
                        <span title="Emergency Request">
                          <Flame className="w-3.5 h-3.5 text-orange-500" />
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-4 font-semibold text-slate-900">
                    {b.customerName}
                  </td>

                  <td className="py-4 px-4 text-slate-700">
                    {b.workerName || <span className="text-amber-600 italic">Unassigned</span>}
                  </td>

                  <td className="py-4 px-4 font-medium text-slate-800">
                    {b.serviceName}
                  </td>

                  <td className="py-4 px-4 text-slate-600">
                    <div>
                      <span className="block font-medium">{b.date}</span>
                      <span className="text-[11px] text-slate-400">{b.timeSlot}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      b.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.status === 'DISPUTED'
                        ? 'bg-red-100 text-red-800'
                        : b.status === 'CANCELLED'
                        ? 'bg-slate-200 text-slate-600'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {b.status.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-bold text-slate-900">
                    ₹{b.actualAmount || b.estimatedAmount}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      title="Inspect Booking Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                #{selectedBooking.id}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                {selectedBooking.status}
              </span>
            </div>

            <h3 className="text-xl font-serif font-bold text-slate-900 mb-4">
              {selectedBooking.serviceName}
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600 mb-6">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span>Customer</span>
                <strong className="text-slate-900">{selectedBooking.customerName} ({selectedBooking.customerPhone})</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span>Worker</span>
                <strong className="text-slate-900">{selectedBooking.workerName || 'Awaiting dispatch'}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span>Cooperative Society</span>
                <span className="text-slate-800">{selectedBooking.cooperativeName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span>Address</span>
                <span className="text-slate-800 max-w-xs text-right truncate">{selectedBooking.customerAddress}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span>OTP Verification Code</span>
                <span className="font-mono font-bold text-slate-900">{selectedBooking.otp}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span>Task Description</span>
                <p className="text-slate-700 italic max-w-xs text-right">{selectedBooking.description}</p>
              </div>
              <div className="flex justify-between py-1.5">
                <span>Direct Worker Compensation</span>
                <strong className="text-[#0D6E66] font-bold text-sm">₹{selectedBooking.actualAmount || selectedBooking.estimatedAmount}</strong>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedBooking(null)}
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
