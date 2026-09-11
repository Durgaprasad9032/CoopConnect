import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useBooking } from '../../contexts/BookingContext';
import { BookingStatus } from '../../types';
import { 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Navigation, 
  Flame, 
  ArrowRight, 
  ChevronRight,
  Sparkles,
  AlertTriangle,
  Play
} from 'lucide-react';

const STATUS_ORDER: BookingStatus[] = [
  'REQUESTED',
  'ASSIGNED',
  'ACCEPTED',
  'ON_THE_WAY',
  'STARTED',
  'COMPLETED'
];

export const TrackWorkerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { bookings, updateBookingStatus } = useBooking();

  const queryBookingId = searchParams.get('bookingId');
  const targetBooking = bookings.find((b) => b.id === queryBookingId) || bookings[0];

  const [currentBooking, setCurrentBooking] = useState(targetBooking);

  useEffect(() => {
    if (targetBooking) {
      setCurrentBooking(targetBooking);
    }
  }, [targetBooking, bookings]);

  if (!currentBooking) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-[#E8DED1]">
        <h3 className="text-lg font-bold text-slate-900 mb-2">No Active Booking Selected</h3>
        <p className="text-xs text-slate-500 mb-4">Please select or create a booking to track.</p>
        <Link to="/customer/book" className="px-4 py-2 bg-[#0D6E66] text-white rounded-xl text-xs font-bold">
          Book Service
        </Link>
      </div>
    );
  }

  const currentStepIndex = STATUS_ORDER.indexOf(currentBooking.status as BookingStatus);

  const handleAdvanceSimulator = async () => {
    if (currentStepIndex < STATUS_ORDER.length - 1) {
      const nextStatus = STATUS_ORDER[currentStepIndex + 1];
      await updateBookingStatus(currentBooking.id, nextStatus);
    }
  };

  const handleResetSimulator = async () => {
    await updateBookingStatus(currentBooking.id, 'ACCEPTED');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8DED1] shadow-civic flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0D6E66]">
              Live Service Tracking
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-mono font-bold text-slate-600">
              #{currentBooking.id}
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">
            {currentBooking.serviceName}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentBooking.date} • {currentBooking.timeSlot}
          </p>
        </div>

        {/* OTP Badge */}
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-center sm:text-right">
          <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider block">
            Doorstep Verification OTP
          </span>
          <span className="text-2xl font-mono font-extrabold text-[#0D6E66] tracking-widest block mt-0.5">
            {currentBooking.otp || '4829'}
          </span>
          <span className="text-[10px] text-slate-500">Provide to worker to start service</span>
        </div>
      </div>

      {/* Lifecycle Status Stepper */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DED1] shadow-civic">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif font-bold text-lg text-slate-900">
            Job Progress Lifecycle
          </h3>
          
          {/* Interactive Simulation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleAdvanceSimulator}
              disabled={currentBooking.status === 'COMPLETED'}
              className="px-3 py-1.5 rounded-lg bg-teal-100 hover:bg-teal-200 text-[#0D6E66] text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              title="Simulate advancing to next stage"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Simulate Next Stage</span>
            </button>
            <button
              onClick={handleResetSimulator}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-semibold"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Stepper horizontal line */}
        <div className="relative">
          <div className="overflow-x-auto pb-4">
            <div className="flex items-center justify-between min-w-[550px] relative">
              {/* Connecting background track */}
              <div className="absolute top-5 left-6 right-6 h-1 bg-slate-100 -z-0"></div>
              {/* Active fill line */}
              <div 
                className="absolute top-5 left-6 h-1 bg-[#0D6E66] transition-all duration-500 -z-0"
                style={{
                  width: `${(Math.max(0, currentStepIndex) / (STATUS_ORDER.length - 1)) * 90}%`
                }}
              ></div>

              {STATUS_ORDER.map((st, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={st} className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                        isCurrent
                          ? 'bg-[#0D6E66] text-white ring-4 ring-teal-100 scale-110 shadow-sm'
                          : isPassed
                          ? 'bg-teal-600 text-white'
                          : 'bg-white border-2 border-slate-200 text-slate-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[11px] font-bold mt-2 uppercase tracking-wider text-center ${
                        isCurrent
                          ? 'text-[#0D6E66]'
                          : isPassed
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {st.replace(/_/g, ' ')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Current Stage Status Notice */}
        <div className="mt-6 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DED1] flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#C97716] shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 leading-relaxed">
            <strong className="block text-slate-900 font-bold mb-0.5">
              Current Stage: {currentBooking.status.replace(/_/g, ' ')}
            </strong>
            {currentBooking.status === 'REQUESTED' && 'CoopConnect matching engine is contacting nearby verified cooperative technicians on part-time standby.'}
            {currentBooking.status === 'ASSIGNED' && 'Technician assigned and scheduled according to cooperative fair distribution standards.'}
            {currentBooking.status === 'ACCEPTED' && `${currentBooking.workerName} has confirmed and accepted your job request.`}
            {currentBooking.status === 'ON_THE_WAY' && `${currentBooking.workerName} is en route to your address. Estimated arrival: 12 mins.`}
            {currentBooking.status === 'STARTED' && `Work underway. Please verify final repairs before OTP sign-off.`}
            {currentBooking.status === 'COMPLETED' && `Job completed with 0% platform deductions. Worker received full compensation directly.`}
          </div>
        </div>
      </div>

      {/* Map Simulation & Worker Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visual Map Simulation */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8DED1] shadow-civic flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-serif font-bold text-slate-900 text-base">
                Civic Route Preview
              </h4>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <Navigation className="w-3 h-3 text-emerald-600" />
                Live Transit
              </span>
            </div>

            {/* Stylized Simulated Map Container */}
            <div className="h-56 w-full rounded-2xl bg-slate-100 border border-[#E8DED1] relative overflow-hidden flex items-center justify-center p-4">
              {/* Map grid lines */}
              <div 
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }}
              />

              {/* Transit Path Line SVG */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 350 200">
                <path
                  d="M 50 150 Q 120 40 280 80"
                  fill="transparent"
                  stroke="#0D6E66"
                  strokeWidth="4"
                  strokeDasharray="6 6"
                  className="animate-pulse"
                />
              </svg>

              {/* Worker Pin */}
              <div className="absolute left-10 bottom-8 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#C97716] text-white flex items-center justify-center shadow-lg animate-bounce">
                  <Navigation className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded shadow mt-1 text-slate-800">
                  {currentBooking.workerName || 'Worker'}
                </span>
              </div>

              {/* Destination Pin */}
              <div className="absolute right-14 top-10 flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-[#D05A3F] text-white flex items-center justify-center shadow-lg">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded shadow mt-1 text-slate-800">
                  Your Address
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Distance: <strong>2.4 km</strong></span>
            <span>ETA: <strong>~12 mins</strong></span>
            <span>Zone: <strong>Indiranagar Sector</strong></span>
          </div>
        </div>

        {/* Worker Contact Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8DED1] shadow-civic flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
              Assigned Cooperative Technician
            </span>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={currentBooking.workerPhoto || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=150'}
                alt={currentBooking.workerName || 'Worker'}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-300 shadow-sm"
              />
              <div>
                <h4 className="font-bold text-lg text-slate-900 leading-tight">
                  {currentBooking.workerName || 'Ramesh Kumar'}
                </h4>
                <p className="text-xs font-semibold text-[#0D6E66]">
                  {currentBooking.serviceName}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {currentBooking.cooperativeName || 'Kalyan Shramik Labour Cooperative'}
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 mb-6">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span>Verification</span>
                <strong className="text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Police & Trade Verified
                </strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span>Direct Contact</span>
                <strong className="text-slate-900 font-mono">{currentBooking.workerPhone || '+91 98450 12345'}</strong>
              </div>
              <div className="flex justify-between py-1.5">
                <span>Estimated Charge</span>
                <strong className="text-[#0D6E66] font-bold text-sm">₹{currentBooking.estimatedAmount}</strong>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <a
              href={`tel:${currentBooking.workerPhone || '9845012345'}`}
              className="flex-1 py-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#0D6E66] font-bold text-xs flex items-center justify-center gap-2 border border-teal-200 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Call Technician</span>
            </a>
            <Link
              to={`/customer/invoices?bookingId=${currentBooking.id}`}
              className="px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
            >
              View Invoice
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};
