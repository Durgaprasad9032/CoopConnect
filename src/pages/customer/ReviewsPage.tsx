import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBooking } from '../../contexts/BookingContext';
import { Star, CheckCircle2, MessageSquare, ShieldCheck, Heart } from 'lucide-react';

export const ReviewsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { bookings, addReview } = useBooking();

  const queryBookingId = searchParams.get('bookingId');
  const completedBookings = bookings.filter((b) => b.status === 'COMPLETED');
  const [selectedBookingId, setSelectedBookingId] = useState<string>(
    queryBookingId || completedBookings[0]?.id || ''
  );

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const currentBooking = bookings.find((b) => b.id === selectedBookingId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId || !comment) return;
    await addReview(selectedBookingId, rating, comment);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
    setComment('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DED1] shadow-civic">
        <span className="text-xs font-bold uppercase tracking-wider text-[#0D6E66]">
          Democratic Feedback
        </span>
        <h1 className="text-3xl font-serif font-bold text-slate-900 mt-1">
          Ratings & Reviews
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
          Your feedback directly strengthens the worker's cooperative Skill Passport and peer trust index.
        </p>
      </div>

      {/* Write a Review Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DED1] shadow-civic">
        <h3 className="text-lg font-serif font-bold text-slate-900 mb-4">
          Rate Completed Service
        </h3>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-50 text-emerald-900 text-center border border-emerald-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <h4 className="font-bold text-sm">Thank You for Supporting Cooperative Labor!</h4>
            <p className="text-xs text-emerald-700 mt-1">
              Your review and rating have been recorded in the civic ledger.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Select Completed Service
              </label>
              <select
                value={selectedBookingId}
                onChange={(e) => setSelectedBookingId(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs outline-none bg-white font-medium"
              >
                {completedBookings.map((b) => (
                  <option key={b.id} value={b.id}>
                    #{b.id} — {b.serviceName} by {b.workerName} ({b.date})
                  </option>
                ))}
              </select>
            </div>

            {/* Star Rating selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-700 ml-2">
                  {rating} of 5 Stars
                </span>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Detailed Feedback
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience regarding punctuality, quality of repair, polite conduct, and cooperative values..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-[#0D6E66] resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!comment || !selectedBookingId}
              className="px-6 py-2.5 rounded-xl bg-[#0D6E66] hover:bg-[#0A554F] text-white text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
            >
              Submit Review to Ledger
            </button>
          </form>
        )}
      </div>

      {/* Past Reviews List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DED1] shadow-civic">
        <h3 className="text-lg font-serif font-bold text-slate-900 mb-4">
          Reviews on Cooperative Technicians
        </h3>

        <div className="space-y-4">
          {bookings
            .filter((b) => b.review)
            .map((b) => (
              <div key={b.id} className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DED1]">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{b.serviceName}</h4>
                    <span className="text-xs text-slate-500">Technician: {b.workerName} ({b.cooperativeName})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(b.review?.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic bg-white p-3 rounded-xl border border-slate-200">
                  &ldquo;{b.review?.comment}&rdquo;
                </p>
              </div>
            ))}
        </div>
      </div>

    </div>
  );
};
