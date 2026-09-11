import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  Heart, 
  Coins,
  Save
} from 'lucide-react';

export const CustomerProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { bookings } = useBooking();

  const [name, setName] = useState(user?.name || 'Priya Sharma');
  const [phone, setPhone] = useState(user?.phone || '+91 98860 55443');
  const [address, setAddress] = useState(user?.address || 'Flat 402, Green Meadows Apt, Indiranagar, Bengaluru');
  const [saved, setSaved] = useState(false);

  const completedCount = bookings.filter((b) => b.status === 'COMPLETED').length;
  const totalContributed = bookings
    .filter((b) => b.status === 'COMPLETED')
    .reduce((sum, b) => sum + (b.actualAmount || b.estimatedAmount || 0), 0);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser({ name, phone, address });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DED1] shadow-civic flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={user?.photoURL || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'}
          alt={user?.name || 'Customer'}
          className="w-24 h-24 rounded-3xl object-cover border-4 border-teal-100 shadow-md"
        />
        <div className="text-center sm:text-left flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-[#0D6E66] text-xs font-bold uppercase tracking-wider mb-2 border border-teal-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Household Member</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            {user?.name || 'Priya Sharma'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>

          <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Services Booked</span>
              <strong className="text-slate-900 text-sm">{completedCount} Completed</strong>
            </div>
            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200">
              <span className="text-teal-800 block text-[10px] uppercase font-bold">Direct Worker Income</span>
              <strong className="text-[#0D6E66] text-sm">₹{totalContributed} Disbursed</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DED1] shadow-civic">
        <h3 className="text-lg font-serif font-bold text-slate-900 mb-6">
          Household & Contact Information
        </h3>

        {saved && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0D6E66] outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Email Address (Firebase Google Auth)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={user?.email || 'priya.customer@coopconnect.org'}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0D6E66] outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Role Authority
              </label>
              <input
                type="text"
                value="Registered Customer / Household"
                disabled
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Primary Home Address
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0D6E66] outline-none resize-none"
                required
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#0D6E66] hover:bg-[#0A554F] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
