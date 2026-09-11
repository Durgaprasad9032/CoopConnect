import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Power, 
  Save, 
  Info, 
  Sparkles,
  Scale
} from 'lucide-react';
import { WeeklyScheduleDay } from '../../types';

export const AvailabilityPage: React.FC = () => {
  const { user } = useAuth();
  const { workers, updateWorkerAvailability } = useBooking();

  const activeWorker = workers.find((w) => w.uid === user?.uid) || workers[0];
  const availability = activeWorker.availability || {
    isAvailable: true,
    preference: 'evening',
    weeklySchedule: {
      monday: { available: true, timeSlot: '6 PM - 9 PM' },
      tuesday: { available: false, timeSlot: 'Not Available' },
      wednesday: { available: true, timeSlot: '6 PM - 9 PM' },
      thursday: { available: true, timeSlot: '6 PM - 9 PM' },
      friday: { available: true, timeSlot: '6 PM - 10 PM' },
      saturday: { available: true, timeSlot: '10 AM - 6 PM' },
      sunday: { available: true, timeSlot: '10 AM - 2 PM' },
    }
  };

  const [isAvailable, setIsAvailable] = useState<boolean>(availability.isAvailable);
  const [preference, setPreference] = useState<string>(availability.preference || 'evening');
  const [schedule, setSchedule] = useState<Record<string, WeeklyScheduleDay>>(
    availability.weeklySchedule || {}
  );
  const [saved, setSaved] = useState<boolean>(false);

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ];

  const handleDayToggle = (dayKey: string) => {
    setSchedule((prev) => {
      const current = prev[dayKey] || { available: true, timeSlot: '6 PM - 9 PM' };
      return {
        ...prev,
        [dayKey]: {
          available: !current.available,
          timeSlot: !current.available ? '6 PM - 9 PM' : 'Not Available',
        },
      };
    });
  };

  const handleTimeSlotChange = (dayKey: string, timeSlot: string) => {
    setSchedule((prev) => ({
      ...prev,
      [dayKey]: {
        available: true,
        timeSlot,
      },
    }));
  };

  const handleSave = async () => {
    await updateWorkerAvailability(activeWorker.uid, isAvailable, schedule);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDDEC9] shadow-civic">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C97716]">
              Part-Time Labor Autonomy
            </span>
            <h1 className="text-3xl font-serif font-bold text-slate-900 mt-0.5">
              Part-Time Schedule & Availability
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              &ldquo;Work when you are available. CoopConnect supports flexible part-time work.&rdquo;
            </p>
          </div>

          <button
            onClick={() => setIsAvailable(!isAvailable)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all self-start sm:self-auto shadow-sm ${
              isAvailable
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-700 hover:bg-slate-800 text-slate-200'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{isAvailable ? 'Status: Available for Work' : 'Status: Marked Unavailable'}</span>
          </button>
        </div>

        {/* Fair matching highlight */}
        <div className="mt-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <Scale className="w-5 h-5 text-[#C97716] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            The CoopConnect matching engine matches job requests <strong>strictly within your declared shifts</strong>. 
            There are never algorithmic penalties for marking days off or working only a few hours per week.
          </p>
        </div>
      </div>

      {/* Preferences Selector */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDDEC9] shadow-civic">
        <h3 className="font-serif font-bold text-lg text-slate-900 mb-3">
          General Working Preference
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Indicate your typical availability pattern to assist cooperative job dispatchers.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { id: 'full_day', label: 'Full Day' },
            { id: 'morning', label: 'Morning' },
            { id: 'afternoon', label: 'Afternoon' },
            { id: 'evening', label: 'Evening' },
            { id: 'custom', label: 'Custom Hours' },
          ].map((pref) => (
            <button
              key={pref.id}
              onClick={() => setPreference(pref.id)}
              className={`p-3 rounded-xl border text-center transition-all ${
                preference === pref.id
                  ? 'border-[#C97716] bg-amber-50 text-[#C97716] font-bold ring-1 ring-[#C97716]'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="text-xs">{pref.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDDEC9] shadow-civic">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-serif font-bold text-lg text-slate-900">
              Weekly Shift Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Configure your exact working hours for each day of the week
            </p>
          </div>

          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-[#C97716] hover:bg-[#A85F0C] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Availability</span>
          </button>
        </div>

        {saved && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2 border border-emerald-200 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Your part-time schedule was updated and synced with cooperative dispatch!</span>
          </div>
        )}

        <div className="space-y-3">
          {daysOfWeek.map(({ key, label }) => {
            const dayData = schedule[key] || { available: false, timeSlot: 'Not Available' };
            return (
              <div
                key={key}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  dayData.available
                    ? 'border-amber-200 bg-[#FAF8F4]'
                    : 'border-slate-200 bg-slate-50/70 opacity-70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDayToggle(key)}
                    className={`w-6 h-6 rounded-md flex items-center justify-center border transition-colors ${
                      dayData.available
                        ? 'bg-[#C97716] text-white border-[#C97716]'
                        : 'bg-white border-slate-300'
                    }`}
                  >
                    {dayData.available && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                  <div>
                    <strong className="text-sm text-slate-900 block">{label}</strong>
                    <span className="text-[11px] text-slate-500">
                      {dayData.available ? 'Active Part-Time Shift' : 'Marked Off-Duty'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {dayData.available ? (
                    <select
                      value={dayData.timeSlot}
                      onChange={(e) => handleTimeSlotChange(key, e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-medium bg-white outline-none focus:ring-2 focus:ring-[#C97716]"
                    >
                      <option value="6 PM - 9 PM">6 PM - 9 PM (Evening)</option>
                      <option value="6 PM - 10 PM">6 PM - 10 PM (Extended Evening)</option>
                      <option value="8 AM - 1 PM">8 AM - 1 PM (Morning Shift)</option>
                      <option value="10 AM - 6 PM">10 AM - 6 PM (Weekend Shift)</option>
                      <option value="10 AM - 2 PM">10 AM - 2 PM (Half Day)</option>
                      <option value="2 PM - 6 PM">2 PM - 6 PM (Afternoon)</option>
                    </select>
                  ) : (
                    <span className="text-xs text-slate-400 font-semibold px-3 py-1.5 bg-slate-200/60 rounded-lg">
                      Not Available
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
