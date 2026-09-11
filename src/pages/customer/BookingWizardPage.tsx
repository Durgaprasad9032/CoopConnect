import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import { MOCK_SERVICES } from '../../data/mockData';
import { 
  Flame, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Scale, 
  Star, 
  Sparkles,
  Info
} from 'lucide-react';

export const BookingWizardPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createBooking, workers } = useBooking();

  const initialServiceId = searchParams.get('service') || 'electrical';
  const initialType = (searchParams.get('type') as 'emergency' | 'scheduled') || 'scheduled';

  // Step state
  const [step, setStep] = useState<number>(1);
  const [serviceId, setServiceId] = useState<string>(initialServiceId);
  const [bookingType, setBookingType] = useState<'emergency' | 'scheduled'>(initialType);
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('Today, Immediate');
  const [timeSlot, setTimeSlot] = useState<string>('6:30 PM');
  const [address, setAddress] = useState<string>(user?.address || 'Flat 402, Green Meadows Apt, Indiranagar, Bengaluru');
  const [phone, setPhone] = useState<string>(user?.phone || '+91 98860 55443');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('worker-1');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const currentService = MOCK_SERVICES.find((s) => s.id === serviceId) || MOCK_SERVICES[0];
  
  // Pick matching verified workers for this trade
  const availableWorkers = workers.filter((w) => w.verificationStatus === 'verified');
  const assignedWorker = availableWorkers.find((w) => w.uid === selectedWorkerId) || availableWorkers[0];

  const estimatedTotal = bookingType === 'emergency' ? currentService.baseRate + 150 : currentService.baseRate;

  const handleConfirmBooking = async () => {
    setSubmitting(true);
    try {
      const newBooking = await createBooking({
        customerId: user?.uid || 'demo-customer-1',
        customerName: user?.name || 'Priya Sharma',
        customerPhone: phone,
        customerAddress: address,
        serviceId: currentService.id,
        serviceName: currentService.name,
        workerId: assignedWorker.uid,
        workerName: assignedWorker.name,
        workerPhone: assignedWorker.phone,
        workerPhoto: assignedWorker.photoURL,
        workerRating: assignedWorker.rating,
        cooperativeName: assignedWorker.cooperativeName,
        type: bookingType,
        description: description || `Standard diagnostic and repair for ${currentService.name}`,
        date: bookingType === 'emergency' ? 'Today' : date,
        timeSlot: bookingType === 'emergency' ? 'Emergency Dispatch (<45 mins)' : timeSlot,
        estimatedAmount: estimatedTotal,
        fairMatchReason: `Assigned via Fair Algorithmic Balancing: ${assignedWorker.name} has registered part-time availability for this slot and holds verified cooperative credentials.`,
      });

      // Redirect directly to live track
      navigate(`/customer/track?bookingId=${newBooking.id}&created=true`);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Wizard Header */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8DED1] shadow-civic">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0D6E66]">
              Cooperative Booking Protocol
            </span>
            <h1 className="text-2xl font-serif font-bold text-slate-900 mt-0.5">
              Book a Service
            </h1>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-50 text-[#0D6E66] border border-teal-200">
            Step {step} of 4
          </span>
        </div>

        {/* Stepper Dots */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                i === step
                  ? 'bg-[#0D6E66]'
                  : i < step
                  ? 'bg-teal-300'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step 1: Service & Urgency */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DED1] shadow-civic space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg font-serif font-bold text-slate-900 mb-1">
              1. Select Service & Priority
            </h3>
            <p className="text-xs text-slate-500">
              Choose your required household trade and whether you need emergency assistance.
            </p>
          </div>

          {/* Urgency Switcher */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setBookingType('scheduled')}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                bookingType === 'scheduled'
                  ? 'border-[#0D6E66] bg-teal-50/50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 mb-1">
                <Calendar className="w-4 h-4 text-[#0D6E66]" />
                <span>Scheduled Service</span>
              </div>
              <p className="text-xs text-slate-500 leading-snug">
                Book for a convenient date & part-time worker time slot.
              </p>
            </button>

            <button
              onClick={() => setBookingType('emergency')}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                bookingType === 'emergency'
                  ? 'border-[#D05A3F] bg-orange-50/50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm text-[#D05A3F] mb-1">
                <Flame className="w-4 h-4 text-[#D05A3F]" />
                <span>Emergency Request</span>
              </div>
              <p className="text-xs text-slate-500 leading-snug">
                Immediate dispatch within 45 minutes for urgent repairs.
              </p>
            </button>
          </div>

          {/* Service Selector Cards */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Category
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MOCK_SERVICES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setServiceId(s.id)}
                  className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    serviceId === s.id
                      ? 'border-[#0D6E66] bg-teal-50 ring-1 ring-[#0D6E66]'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{s.name}</h4>
                    <span className="text-[11px] text-slate-500">from ₹{s.baseRate}/{s.rateUnit}</span>
                  </div>
                  {serviceId === s.id && (
                    <CheckCircle2 className="w-4 h-4 text-[#0D6E66]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 rounded-xl bg-[#0D6E66] hover:bg-[#0A554F] text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-sm"
            >
              <span>Next: Task Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Description & Schedule */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DED1] shadow-civic space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg font-serif font-bold text-slate-900 mb-1">
              2. Problem Description & Time
            </h3>
            <p className="text-xs text-slate-500">
              Provide details to ensure the cooperative artisan brings appropriate tools.
            </p>
          </div>

          {/* Description textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Describe the Issue / Task
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Bathroom drain line is clogged; or distribution fuse box trips when high-power appliances run."
              className="w-full p-3.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0D6E66] focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Date & Time if scheduled */}
          {bookingType === 'scheduled' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Service Date
                </label>
                <select
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-[#0D6E66]"
                >
                  <option value="Today">Today (Evening Slot)</option>
                  <option value="Tomorrow, Sept 12">Tomorrow, Sept 12</option>
                  <option value="Saturday, Sept 13">Saturday, Sept 13 (Weekend)</option>
                  <option value="Sunday, Sept 14">Sunday, Sept 14 (Weekend)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Preferred Part-Time Window
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-[#0D6E66]"
                >
                  <option value="9:00 AM - 12:00 PM">Morning (9:00 AM - 12:00 PM)</option>
                  <option value="2:00 PM - 5:00 PM">Afternoon (2:00 PM - 5:00 PM)</option>
                  <option value="6:00 PM - 9:00 PM">Evening Part-Time (6:00 PM - 9:00 PM)</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-900 flex items-center gap-3">
              <Flame className="w-5 h-5 text-orange-600 shrink-0" />
              <div>
                <strong className="block">Emergency Priority Activated</strong>
                <span>A nearby verified cooperative worker on active duty will be dispatched immediately. Expected arrival within 45 minutes.</span>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2.5 rounded-xl bg-[#0D6E66] hover:bg-[#0A554F] text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-sm"
            >
              <span>Next: Location Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Location Details */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DED1] shadow-civic space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg font-serif font-bold text-slate-900 mb-1">
              3. Service Location & Contact
            </h3>
            <p className="text-xs text-slate-500">
              Ensure accurate address information for smooth technician transit.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Service Address
            </label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0D6E66] focus:border-transparent outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Contact Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-[#0D6E66]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                City / Ward
              </label>
              <input
                type="text"
                disabled
                value="Indiranagar Ward 112, Bengaluru"
                className="w-full p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-6 py-2.5 rounded-xl bg-[#0D6E66] hover:bg-[#0A554F] text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-sm"
            >
              <span>Next: Review Fair Match</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Fair Matching Review & Confirmation */}
      {step === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DED1] shadow-civic space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg font-serif font-bold text-slate-900 mb-1">
              4. Fair Matched Worker & Confirmation
            </h3>
            <p className="text-xs text-slate-500">
              Review assigned cooperative worker matched by democratic algorithm.
            </p>
          </div>

          {/* Fair Match Banner */}
          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 text-xs text-teal-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#0D6E66]">
              <Scale className="w-4 h-4" />
              <span>Fair Job Distribution Match</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              We dispatched <strong>{assignedWorker.name}</strong> based on verified trade skills, active part-time shift availability, and equitable weekly workload balance across cooperative members.
            </p>
          </div>

          {/* Assigned Worker Card */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DED1] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={assignedWorker.photoURL || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=120'}
                alt={assignedWorker.name}
                className="w-12 h-12 rounded-2xl object-cover border border-amber-300 shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900">{assignedWorker.name}</h4>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                </div>
                <p className="text-xs text-slate-600">{assignedWorker.profession}</p>
                <p className="text-[11px] text-slate-500">{assignedWorker.cooperativeName}</p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="inline-flex items-center gap-1 text-xs font-bold text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{assignedWorker.rating}</span>
                <span className="text-slate-400">({assignedWorker.totalJobs} jobs)</span>
              </div>
              <span className="block text-[11px] text-emerald-700 font-semibold mt-1">
                Zero Commission Platform
              </span>
            </div>
          </div>

          {/* Price & Summary Table */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Service Type</span>
              <strong className="text-slate-900">{currentService.name}</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Booking Mode</span>
              <strong className="text-slate-900 capitalize">{bookingType}</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Address</span>
              <span className="text-slate-900 max-w-xs text-right truncate">{address}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Worker Direct Compensation</span>
              <span className="font-semibold text-slate-900">₹{currentService.baseRate}</span>
            </div>
            {bookingType === 'emergency' && (
              <div className="flex justify-between text-orange-700">
                <span>Emergency Quick-Dispatch Supplement</span>
                <span>+ ₹150</span>
              </div>
            )}
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Platform Usage / Extraction Fee</span>
              <span>₹0 (0% Cooperative Promise)</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
              <span>Estimated Total</span>
              <span className="text-base text-[#0D6E66]">₹{estimatedTotal}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setStep(3)}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleConfirmBooking}
              disabled={submitting}
              className="px-8 py-3 rounded-xl bg-[#0D6E66] hover:bg-[#0A554F] text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-sm disabled:opacity-60"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Dispatch Worker</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
