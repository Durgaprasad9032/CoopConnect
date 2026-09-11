import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import { Star, ShieldCheck, Award, Heart, MessageSquare } from 'lucide-react';

export const WorkerRatingsPage: React.FC = () => {
  const { user } = useAuth();
  const { workers, bookings } = useBooking();

  const activeWorker = workers.find((w) => w.uid === user?.uid) || workers[0];

  const reviewedBookings = bookings.filter((b) => b.review && (b.workerId === activeWorker.uid || !b.workerId));

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDDEC9] shadow-civic flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C97716]">
            Reputation Ledger
          </span>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mt-0.5">
            Ratings & Customer Reviews
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Transparent feedback recorded by verified households following completed visits.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
          <div className="flex items-center justify-center gap-1">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span className="text-2xl font-serif font-bold text-slate-900">{activeWorker.rating || 4.88}</span>
          </div>
          <span className="text-[11px] text-amber-800 font-bold block mt-0.5">
            Based on {activeWorker.totalJobs || 78} jobs
          </span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDDEC9] shadow-civic space-y-4">
        <h3 className="font-serif font-bold text-lg text-slate-900 mb-4">
          Customer Testimonials
        </h3>

        {reviewedBookings.length > 0 ? (
          reviewedBookings.map((b) => (
            <div key={b.id} className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#EDDEC9] space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{b.customerName}</h4>
                  <span className="text-xs text-slate-500">{b.serviceName} • {b.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(b.review?.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic bg-white p-3 rounded-xl border border-slate-200">
                &ldquo;{b.review?.comment}&rdquo;
              </p>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-500 text-center py-6">
            No customer reviews logged yet. Completed jobs will reflect ratings here automatically.
          </p>
        )}
      </div>

    </div>
  );
};
