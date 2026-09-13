import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import { MOCK_SERVICES } from '../../data/mockData';
import { 
  Flame, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  Wrench, 
  Zap, 
  HeartHandshake, 
  Home, 
  Sparkles, 
  Car,
  ChevronRight,
  Loader2,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    customerBookings, 
    loadingCustomerBookings, 
    customerBookingsError 
  } = useBooking();
  const navigate = useNavigate();

  // Find active booking from real Firestore customer bookings (status not COMPLETED or CANCELLED)
  const activeBooking = customerBookings.find((b) => 
    ['REQUESTED', 'ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'STARTED'].includes(b.status)
  );

  // Recent completed/disputed bookings from real Firestore data
  const recentBookings = customerBookings
    .filter((b) => b.status === 'COMPLETED' || b.status === 'DISPUTED')
    .slice(0, 3);

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
      case 'ASSIGNED':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full">ACCEPTED</span>;
      case 'ON_THE_WAY':
        return <span className="bg-blue-100 text-blue-800 border border-blue-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full animate-pulse">ON THE WAY</span>;
      case 'STARTED':
        return <span className="bg-purple-100 text-purple-800 border border-purple-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full">IN PROGRESS</span>;
      case 'REQUESTED':
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full">REQUESTED</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0D6E66] to-[#094634] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-civic">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-teal-100 text-xs font-semibold mb-3 border border-white/20">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cooperative Verified Community Network</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-2">
            Good day, {user?.name?.split(' ')[0] || 'Member'}!
          </h1>
          <p className="text-sm sm:text-base text-teal-100 leading-relaxed mb-6 font-normal">
            How can our local labor cooperatives assist your household today? Connect with vetted electricians, plumbers, caregivers, and domestic helpers.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/customer/book"
              className="px-5 py-2.5 rounded-xl bg-white text-[#0D6E66] hover:bg-teal-50 font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>Quick Booking</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/customer/book?type=emergency"
              className="px-5 py-2.5 rounded-xl bg-[#D05A3F] hover:bg-[#B3442B] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
            >
              <Flame className="w-4 h-4 text-amber-300" />
              <span>Emergency Service Request</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Active Booking Section */}
      {loadingCustomerBookings ? (
        <div className="bg-white rounded-3xl p-6 border border-[#E8DED1] shadow-civic flex items-center justify-center gap-3 text-xs text-slate-600">
          <Loader2 className="w-5 h-5 text-[#0D6E66] animate-spin" />
          <span>Loading your bookings...</span>
        </div>
      ) : customerBookingsError ? (
        <div className="bg-red-50 rounded-3xl p-5 border border-red-200 text-red-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>Unable to load bookings. Please try again.</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1 bg-red-600 text-white rounded-lg font-bold text-xs"
          >
            Retry
          </button>
        </div>
      ) : activeBooking ? (
        /* Real Active Booking Alert Card */
        <div className="bg-white rounded-3xl p-6 border-2 border-teal-200 shadow-civic">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-teal-500 animate-ping"></span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                  Active Booking #{activeBooking.bookingReference}
                </span>
                <h3 className="font-bold text-lg text-slate-900">
                  {activeBooking.serviceType}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(activeBooking.status)}
              <Link
                to={`/customer/track?bookingId=${activeBooking.id}`}
                className="px-4 py-2 rounded-xl bg-[#0D6E66] hover:bg-[#0A554F] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Live Track Worker</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
              <div className="w-10 h-10 rounded-full bg-teal-100 border border-teal-200 flex items-center justify-center text-[#0D6E66] font-bold text-xs shrink-0">
                {activeBooking.workerName ? activeBooking.workerName.slice(0, 2).toUpperCase() : 'CC'}
              </div>
              <div>
                <span className="text-slate-500 block">Assigned Worker</span>
                <strong className={`text-sm block ${
                  activeBooking.workerId ? 'text-slate-900' : 'text-amber-800 font-medium'
                }`}>
                  {activeBooking.workerId && activeBooking.workerName
                    ? activeBooking.workerName
                    : 'Waiting for worker assignment'}
                </strong>
                <span className="text-[11px] text-teal-700 block font-medium">
                  {activeBooking.workerId ? 'Cooperative Member' : 'Pending algorithmic dispatch'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 flex flex-col justify-center">
              <span className="text-slate-500">Scheduled Slot</span>
              <strong className="text-slate-900 text-xs mt-0.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                {activeBooking.bookingType === 'Emergency'
                  ? 'Emergency Dispatch (<45 mins)'
                  : `${activeBooking.scheduledDate || 'Today'} • ${activeBooking.scheduledTime || 'Preferred Window'}`}
              </strong>
              <span className="text-[11px] text-slate-500 truncate mt-1">
                {activeBooking.address}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-teal-50 border border-teal-100 flex flex-col justify-center">
              <span className="text-teal-800 font-semibold">Service OTP Verification</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-mono font-extrabold text-[#0D6E66] tracking-widest bg-white px-3 py-0.5 rounded border border-teal-200">
                  {activeBooking.otp || '----'}
                </span>
                <span className="text-[10px] text-slate-500">Share with worker at doorstep</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* No active bookings card */
        <div className="bg-white rounded-3xl p-6 border border-[#E8DED1] shadow-civic flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#0D6E66] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">No active bookings</h3>
              <p className="text-xs text-slate-500">You currently have no pending or in-progress service requests.</p>
            </div>
          </div>
          <Link
            to="/customer/book"
            className="px-5 py-2.5 rounded-xl bg-[#0D6E66] hover:bg-[#0A554F] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto shrink-0"
          >
            <span>Book a Service</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Services Grid Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-slate-900">
              Explore Cooperative Services
            </h2>
            <p className="text-xs text-slate-500">
              Vetted trade technicians working through local labor societies
            </p>
          </div>
          <Link
            to="/customer/services"
            className="text-xs font-bold text-[#0D6E66] hover:underline flex items-center gap-1"
          >
            <span>View All Services</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MOCK_SERVICES.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl p-5 border border-[#E8DED1] hover:border-[#0D6E66] shadow-civic hover:shadow-civic-hover transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-50 group-hover:bg-teal-50 border border-slate-100 flex items-center justify-center transition-colors">
                    {getServiceIcon(service.iconName)}
                  </div>
                  <span className="text-xs font-bold text-slate-700 bg-[#FAF7F2] px-2.5 py-1 rounded-md border border-[#E8DED1]">
                    ₹{service.baseRate}/{service.rateUnit}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0D6E66] transition-colors mb-1">
                  {service.name}
                </h3>
                <p className="text-xs text-slate-500 mb-2 leading-relaxed">
                  {service.tagline}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-3">
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {service.availableWorkersCount} verified workers
                </span>
                <button
                  onClick={() => navigate(`/customer/book?service=${service.name.toLowerCase()}`)}
                  className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-[#0D6E66] text-[#0D6E66] hover:text-white font-bold text-xs transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity & Bookings */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DED1] shadow-civic">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-serif font-bold text-slate-900">
              Recent Service History
            </h3>
            <p className="text-xs text-slate-500">Completed jobs and past invoices from Cloud Firestore</p>
          </div>
          <Link
            to="/customer/bookings"
            className="text-xs font-bold text-[#0D6E66] hover:underline"
          >
            View Full Ledger
          </Link>
        </div>

        {recentBookings.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {recentBookings.map((b) => (
              <div key={b.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0D6E66] flex items-center justify-center font-bold text-xs">
                    {b.serviceType.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{b.serviceType}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">#{b.bookingReference}</span>
                      {b.status === 'COMPLETED' ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Completed</span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Disputed</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Served by <strong>{b.workerName || 'Assigned Worker'}</strong> on {b.scheduledDate || 'Recent'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to={`/customer/invoices?bookingId=${b.id}`}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Invoice
                  </Link>
                  <Link
                    to={`/customer/reviews?bookingId=${b.id}`}
                    className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs font-semibold text-[#C97716] hover:bg-amber-100 flex items-center gap-1"
                  >
                    <Star className="w-3 h-3 fill-amber-500" />
                    <span>Review</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-6">
            No completed services yet. Book your first cooperative trade service above!
          </p>
        )}
      </div>

    </div>
  );
};
