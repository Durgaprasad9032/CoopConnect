import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useBooking } from '../../contexts/BookingContext';
import { 
  Receipt, 
  Printer, 
  Download, 
  CheckCircle2, 
  Scale, 
  ShieldCheck, 
  ArrowLeft,
  Heart
} from 'lucide-react';

export const InvoicesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { bookings } = useBooking();

  const queryBookingId = searchParams.get('bookingId');
  const [selectedBookingId, setSelectedBookingId] = useState<string>(
    queryBookingId || bookings[0]?.id || 'BK-8901'
  );

  const currentBooking = bookings.find((b) => b.id === selectedBookingId) || bookings[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Top Selector Bar */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8DED1] shadow-civic flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#0D6E66]">
            Civic Transparency Ledger
          </span>
          <h1 className="text-2xl font-serif font-bold text-slate-900 mt-0.5">
            Service Invoice & Receipt
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedBookingId}
            onChange={(e) => setSelectedBookingId(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-[#FAF7F2] outline-none"
          >
            {bookings.map((b) => (
              <option key={b.id} value={b.id}>
                #{b.id} — {b.serviceName}
              </option>
            ))}
          </select>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-[#0D6E66] hover:bg-[#0A554F] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>

      {/* Invoice Paper Document */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8DED1] shadow-civic relative overflow-hidden print:border-none print:shadow-none">
        
        {/* Decorative Civic Stamp */}
        <div className="absolute right-8 top-8 opacity-15 pointer-events-none hidden sm:block">
          <div className="w-28 h-28 rounded-full border-4 border-dashed border-[#0D6E66] flex flex-col items-center justify-center p-2 text-center text-[#0D6E66]">
            <Scale className="w-8 h-8 mb-1" />
            <span className="text-[9px] font-bold uppercase tracking-widest leading-none">CIVIC VERIFIED</span>
            <span className="text-[8px] font-mono mt-0.5">ZERO FEE LEDGER</span>
          </div>
        </div>

        {/* Invoice Header */}
        <div className="flex items-start justify-between pb-8 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#0D6E66] text-white flex items-center justify-center font-bold">
                <Scale className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-xl text-slate-900">
                Coop<span className="text-[#0D6E66]">Connect</span>
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Cooperative Labor Services Network
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
              Registrar Ref: COOP/BLR/CIVIC-LEDGER-2026
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider block">
              Official Receipt
            </span>
            <span className="text-xl font-mono font-bold text-slate-900 block mt-0.5">
              #{currentBooking?.id}
            </span>
            <span className="text-xs text-slate-500 block mt-1">
              Date: {currentBooking?.date || 'Sept 11, 2026'}
            </span>
          </div>
        </div>

        {/* Part-Time Worker & Customer Parties */}
        <div className="grid grid-cols-2 gap-6 py-6 border-b border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block mb-1.5">
              Service Provided By:
            </span>
            <strong className="text-slate-900 text-sm block">
              {currentBooking?.workerName || 'Ramesh Kumar'}
            </strong>
            <p className="text-slate-600 mt-0.5">
              {currentBooking?.cooperativeName || 'Kalyan Shramik Labour Cooperative'}
            </p>
            <span className="inline-block mt-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Verified Union Member
            </span>
          </div>

          <div className="text-right">
            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block mb-1.5">
              Billed To:
            </span>
            <strong className="text-slate-900 text-sm block">
              {currentBooking?.customerName || 'Priya Sharma'}
            </strong>
            <p className="text-slate-600 mt-0.5 max-w-xs ml-auto">
              {currentBooking?.customerAddress}
            </p>
          </div>
        </div>

        {/* Breakdown Table */}
        <div className="py-6 border-b border-slate-200">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] text-left">
                <th className="pb-2 font-bold">Service Item</th>
                <th className="pb-2 font-bold text-center">Type</th>
                <th className="pb-2 font-bold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 font-semibold text-slate-900">
                  {currentBooking?.serviceName}
                  <span className="block text-[11px] text-slate-500 font-normal">
                    {currentBooking?.description}
                  </span>
                </td>
                <td className="py-3 text-center capitalize text-slate-600">
                  {currentBooking?.type || 'Standard'}
                </td>
                <td className="py-3 text-right font-semibold text-slate-900">
                  ₹{currentBooking?.estimatedAmount || 500}
                </td>
              </tr>
              <tr className="bg-emerald-50/50">
                <td className="py-2.5 px-2 text-emerald-800 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Platform Commission & Intermediary Extraction</span>
                </td>
                <td className="py-2.5 text-center text-emerald-700 font-semibold text-[11px]">
                  0% Free
                </td>
                <td className="py-2.5 px-2 text-right font-bold text-emerald-700">
                  ₹0.00
                </td>
              </tr>
              <tr>
                <td className="py-2.5 text-slate-600 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>Cooperative Member Healthcare & Welfare Pool (Included)</span>
                </td>
                <td className="py-2.5 text-center text-slate-500 text-[11px]">
                  Democratic
                </td>
                <td className="py-2.5 text-right font-medium text-slate-600">
                  ₹25.00
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total & Civic Assurance */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="max-w-xs text-[11px] text-slate-500 leading-relaxed">
            <strong className="text-slate-800 block mb-0.5">Non-Extractive Civic Ledger:</strong>
            100% of the service compensation is disbursed directly to the cooperative member.
          </div>

          <div className="text-right self-end sm:self-auto">
            <span className="text-xs text-slate-400 block font-semibold">Total Paid</span>
            <span className="text-3xl font-serif font-bold text-[#0D6E66] block">
              ₹{currentBooking?.actualAmount || currentBooking?.estimatedAmount || 500}
            </span>
            <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block mt-1">
              PAID VIA COOPERATIVE ESCROW
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
