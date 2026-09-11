import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Briefcase, 
  Save, 
  CheckCircle2,
  Award
} from 'lucide-react';

export const WorkerProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { workers } = useBooking();

  const activeWorker = workers.find((w) => w.uid === user?.uid) || workers[0];

  const [name, setName] = useState(activeWorker.name);
  const [phone, setPhone] = useState(activeWorker.phone || '+91 98450 12345');
  const [address, setAddress] = useState(activeWorker.address || 'Indiranagar 2nd Stage, Bengaluru');
  const [profession, setProfession] = useState(activeWorker.profession || 'Electrician & Wireman');
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser({ name, phone, address, profession });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDDEC9] shadow-civic flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={activeWorker.photoURL || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=200'}
          alt={activeWorker.name}
          className="w-24 h-24 rounded-3xl object-cover border-4 border-amber-200 shadow-md"
        />
        <div className="text-center sm:text-left flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-[#C97716] text-xs font-bold uppercase tracking-wider mb-2 border border-amber-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Cooperative Member</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            {activeWorker.name}
          </h1>
          <p className="text-xs font-bold text-[#C97716] mt-0.5">{activeWorker.profession}</p>
          <p className="text-xs text-slate-500">{activeWorker.cooperativeName}</p>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDDEC9] shadow-civic">
        <h3 className="font-serif font-bold text-lg text-slate-900 mb-6">
          Member Contact & Trade Profile
        </h3>

        {saved && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Worker profile updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-[#C97716]"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Primary Trade / Profession
              </label>
              <input
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-[#C97716]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-[#C97716]"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Cooperative Society Affiliation
              </label>
              <input
                type="text"
                value={activeWorker.cooperativeName || 'Kalyan Shramik Labour Cooperative Society'}
                disabled
                className="w-full p-2.5 rounded-xl bg-slate-100 border border-slate-200 font-semibold text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Base Address / Ward
            </label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-[#C97716] resize-none"
              required
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#C97716] hover:bg-[#A85F0C] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
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
