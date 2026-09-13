import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import { FirestoreBooking } from '../../types';
import {
  Wrench,
  Zap,
  Sparkles,
  HeartHandshake,
  Car,
  HelpCircle,
  Flame,
  Calendar,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  RotateCcw,
  LayoutDashboard,
} from 'lucide-react';

interface ServiceOption {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const SERVICE_OPTIONS: ServiceOption[] = [
  { id: 'Plumbing', name: 'Plumbing', icon: Wrench, description: 'Pipes, leakage, drain clearing & tap repairs' },
  { id: 'Electrical', name: 'Electrical', icon: Zap, description: 'Wiring, fixtures, fuse box & switches' },
  { id: 'House Cleaning', name: 'House Cleaning', icon: Sparkles, description: 'Deep cleaning, dusting & kitchen sanitation' },
  { id: 'Caregiving', name: 'Caregiving', icon: HeartHandshake, description: 'Elderly assistance, patient care & home companionship' },
  { id: 'Driver', name: 'Driver', icon: Car, description: 'Personal car transit, city navigation & daily errands' },
  { id: 'Other', name: 'Other', icon: HelpCircle, description: 'Custom handyman or cooperative trade requests' },
];

export const BookingWizardPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createCustomerBooking } = useBooking();

  // URL query pre-fills
  const initialTypeParam = searchParams.get('type');
  const initialServiceParam = searchParams.get('service');

  // Find preselected service from query param if available
  const matchService = SERVICE_OPTIONS.find(
    (s) =>
      s.id.toLowerCase() === initialServiceParam?.toLowerCase() ||
      s.name.toLowerCase() === initialServiceParam?.toLowerCase()
  );

  // Form states
  const [serviceType, setServiceType] = useState<string>(matchService ? matchService.name : 'Plumbing');
  const [description, setDescription] = useState<string>('');
  const [address, setAddress] = useState<string>(user?.address || '');
  const [bookingType, setBookingType] = useState<'Emergency' | 'Scheduled'>(
    initialTypeParam?.toLowerCase() === 'emergency' ? 'Emergency' : 'Scheduled'
  );
  const [scheduledDate, setScheduledDate] = useState<string>(() => {
    const today = new Date().toISOString().split('T')[0];
    return today;
  });
  const [scheduledTime, setScheduledTime] = useState<string>('09:00 AM - 12:00 PM');
  const [phoneNumber, setPhoneNumber] = useState<string>(user?.phone || '');

  // Submission states
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdBooking, setCreatedBooking] = useState<FirestoreBooking | null>(null);

  // Update address & phone if user profile loads after mount
  useEffect(() => {
    if (user?.address && !address) {
      setAddress(user.address);
    }
    if (user?.phone && !phoneNumber) {
      setPhoneNumber(user.phone);
    }
  }, [user]);

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form Validations
    if (!serviceType) {
      setErrorMessage('Please select a service type.');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('Please describe the service you need.');
      return;
    }
    if (!address.trim()) {
      setErrorMessage('Please enter your service address.');
      return;
    }
    if (bookingType === 'Scheduled' && (!scheduledDate || !scheduledTime)) {
      setErrorMessage('Please select a preferred date and time for scheduled booking.');
      return;
    }

    if (!user?.uid) {
      setErrorMessage('You must be signed in to create a booking.');
      return;
    }

    setSubmitting(true);

    try {
      const newBooking = await createCustomerBooking({
        customerId: user.uid,
        customerName: user.name || 'Cooperative Member',
        customerEmail: user.email || '',
        customerPhotoURL: user.photoURL || null,
        serviceType,
        description: description.trim(),
        address: address.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
        bookingType,
        scheduledDate: bookingType === 'Scheduled' ? scheduledDate : null,
        scheduledTime: bookingType === 'Scheduled' ? scheduledTime : null,
      });

      setCreatedBooking(newBooking);
    } catch (err: any) {
      console.error('Failed to create booking in Firestore:', err);
      setErrorMessage(
        err?.message || 'Failed to create your booking request. Please check your connection and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION SCREEN
  if (createdBooking) {
    return (
      <div className="max-w-2xl mx-auto py-4 animate-fadeIn">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DED1] shadow-civic text-center space-y-6">
          {/* Success Icon */}
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Confirmed In Firestore</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Booking Request Created
            </h1>
            <p className="text-sm text-slate-600 mt-2 max-w-lg mx-auto leading-relaxed">
              Your service request has been submitted. We will match you with a suitable cooperative worker.
            </p>
          </div>

          {/* Booking Summary Card */}
          <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#E8DED1] text-left space-y-3 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DED1]">
              <span className="text-slate-500 font-semibold uppercase tracking-wider">
                Booking Reference
              </span>
              <span className="font-mono font-extrabold text-sm text-[#0D6E66] bg-white px-2.5 py-1 rounded-lg border border-teal-200">
                {createdBooking.bookingReference}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-slate-500 block text-[11px]">Service</span>
                <strong className="text-slate-900 text-sm">{createdBooking.serviceType}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Booking Type</span>
                <span className={`inline-flex items-center gap-1 font-bold text-xs ${
                  createdBooking.bookingType === 'Emergency' ? 'text-orange-700' : 'text-slate-900'
                }`}>
                  {createdBooking.bookingType === 'Emergency' && <Flame className="w-3.5 h-3.5 text-orange-500" />}
                  {createdBooking.bookingType}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Status</span>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[11px] border border-amber-300">
                  {createdBooking.status}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Date / Timing</span>
                <span className="text-slate-800 font-medium">
                  {createdBooking.bookingType === 'Emergency'
                    ? 'Immediate Dispatch (<45 mins)'
                    : `${createdBooking.scheduledDate} (${createdBooking.scheduledTime})`}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E8DED1]">
              <span className="text-slate-500 block text-[11px]">Service Address</span>
              <p className="text-slate-800 font-medium mt-0.5 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#0D6E66] shrink-0 mt-0.5" />
                <span>{createdBooking.address}</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/customer/bookings"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0D6E66] hover:bg-[#0A554F] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <span>View My Bookings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/customer/dashboard"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-slate-500" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // BOOKING FORM
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DED1] shadow-civic">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-[#0D6E66] text-xs font-semibold mb-2 border border-teal-200">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Direct Cooperative Service Booking</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Book a Service
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Connect with vetted local cooperative artisans for fair, trusted household service.
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Unable to proceed</strong>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleConfirmBooking} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DED1] shadow-civic space-y-8">
        
        {/* A. SERVICE TYPE */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            A. Select Service Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SERVICE_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = serviceType === option.name;
              return (
                <button
                  type="button"
                  key={option.id}
                  onClick={() => setServiceType(option.name)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#0D6E66] bg-teal-50/70 shadow-sm ring-2 ring-[#0D6E66]/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between w-full mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-[#0D6E66] text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-[#0D6E66]" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{option.name}</h3>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      {option.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* B. SERVICE DESCRIPTION */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            B. Service Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the service you need (e.g., Kitchen sink pipe leakage, ceiling fan installation, etc.)"
            className="w-full p-3.5 rounded-2xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0D6E66] focus:border-transparent outline-none transition-all placeholder:text-slate-400"
            required
          />
        </div>

        {/* C. SERVICE ADDRESS */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            C. Service Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter service address (House/Flat, Street, Area, Landmark)"
              className="w-full pl-10 pr-3.5 py-3 rounded-2xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0D6E66] focus:border-transparent outline-none transition-all placeholder:text-slate-400"
              required
            />
          </div>
        </div>

        {/* D. BOOKING TYPE */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            D. Booking Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Scheduled option */}
            <button
              type="button"
              onClick={() => setBookingType('Scheduled')}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                bookingType === 'Scheduled'
                  ? 'border-[#0D6E66] bg-teal-50/60 shadow-sm ring-2 ring-[#0D6E66]/20'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                  <Calendar className="w-4 h-4 text-[#0D6E66]" />
                  <span>Scheduled</span>
                </div>
                {bookingType === 'Scheduled' && (
                  <CheckCircle2 className="w-4 h-4 text-[#0D6E66]" />
                )}
              </div>
              <p className="text-xs text-slate-500 leading-snug">
                Pick a convenient future date and time window for worker visit.
              </p>
            </button>

            {/* Emergency option */}
            <button
              type="button"
              onClick={() => setBookingType('Emergency')}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                bookingType === 'Emergency'
                  ? 'border-[#D05A3F] bg-orange-50/70 shadow-sm ring-2 ring-[#D05A3F]/20'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 font-bold text-sm text-[#D05A3F]">
                  <Flame className="w-4 h-4 text-[#D05A3F]" />
                  <span>Emergency</span>
                </div>
                {bookingType === 'Emergency' && (
                  <CheckCircle2 className="w-4 h-4 text-[#D05A3F]" />
                )}
              </div>
              <p className="text-xs text-slate-500 leading-snug">
                Urgent request! Fastest available cooperative technician dispatch within 45 minutes.
              </p>
            </button>
          </div>

          {/* Conditional Date / Time inputs */}
          {bookingType === 'Scheduled' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 mt-3 animate-fadeIn">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#0D6E66]" />
                  <span>Preferred Date</span>
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-[#0D6E66] bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#0D6E66]" />
                  <span>Preferred Time</span>
                </label>
                <select
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-[#0D6E66] bg-white"
                >
                  <option value="09:00 AM - 12:00 PM">Morning (09:00 AM - 12:00 PM)</option>
                  <option value="12:00 PM - 03:00 PM">Afternoon (12:00 PM - 03:00 PM)</option>
                  <option value="03:00 PM - 06:00 PM">Late Afternoon (03:00 PM - 06:00 PM)</option>
                  <option value="06:00 PM - 09:00 PM">Evening (06:00 PM - 09:00 PM)</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-xs text-orange-900 flex items-start gap-3 mt-3 animate-fadeIn">
              <Flame className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-orange-950">Urgent Priority Service</strong>
                <p className="mt-0.5 text-[11px] text-orange-900 leading-relaxed">
                  No future date or time scheduling required. Our algorithmic balancing will immediately alert nearby on-duty certified trade members to respond.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* E. OPTIONAL CUSTOMER PHONE NUMBER */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              E. Customer Phone Number
            </label>
            <span className="text-[11px] text-slate-400 font-medium">Optional</span>
          </div>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter contact number (e.g. +91 98860 12345)"
              className="w-full pl-10 pr-3.5 py-3 rounded-2xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0D6E66] focus:border-transparent outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* F. CONFIRM BOOKING BUTTON */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-slate-500">
            By confirming, a verified cooperative service document will be recorded in Cloud Firestore.
          </p>

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#0D6E66] hover:bg-[#0A554F] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-civic disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating booking...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Booking</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
