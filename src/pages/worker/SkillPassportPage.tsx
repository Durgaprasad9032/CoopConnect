import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import { 
  Award, 
  ShieldCheck, 
  Star, 
  Briefcase, 
  Calendar, 
  CheckCircle2, 
  FileCheck, 
  QrCode, 
  Printer,
  Sparkles,
  Layers,
  Scale
} from 'lucide-react';

export const SkillPassportPage: React.FC = () => {
  const { user } = useAuth();
  const { workers } = useBooking();

  const activeWorker = workers.find((w) => w.uid === user?.uid) || workers[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDDEC9] shadow-civic flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C97716]">
            Civic Credentials Protocol
          </span>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mt-0.5">
            Digital Skill Passport
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Portable, cooperative-verified trade credentials recognized across civic municipal wards.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-xl bg-[#C97716] hover:bg-[#A85F0C] text-white text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto shadow-sm transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Passport</span>
        </button>
      </div>

      {/* Main Digital Skill Passport Document */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-amber-300 shadow-civic relative overflow-hidden print:border-none print:shadow-none">
        
        {/* Background Passport Guilloche Watermark */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Passport Header Strip */}
        <div className="pb-6 border-b-2 border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C97716] to-[#8C4F07] text-white flex items-center justify-center font-bold shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C97716] block">
                NATIONAL COOPERATIVE LABOR ALLIANCE
              </span>
              <h2 className="text-xl font-serif font-bold text-slate-900">
                Cooperative Worker Skill Passport
              </h2>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
              PASSPORT ID / REGISTRY
            </span>
            <span className="text-base font-mono font-bold text-[#C97716]">
              IN-COOP-882910
            </span>
            <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
              Status: Verified & In Good Standing
            </span>
          </div>
        </div>

        {/* Worker Primary Identity Block */}
        <div className="py-8 grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-slate-200">
          
          {/* Avatar & Photo Badge */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <div className="relative mb-3">
              <img
                src={activeWorker.photoURL || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=250'}
                alt={activeWorker.name}
                className="w-32 h-32 rounded-3xl object-cover border-4 border-amber-200 shadow-md"
              />
              <span className="absolute bottom-2 right-2 w-7 h-7 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-md border-2 border-white">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>
            <h3 className="font-serif font-bold text-xl text-slate-900">
              {activeWorker.name}
            </h3>
            <p className="text-xs font-bold text-[#C97716]">
              {activeWorker.profession}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Member of {activeWorker.cooperativeName}
            </p>
          </div>

          {/* Core Metrics */}
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#EDDEC9]">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Trade Experience</span>
              <strong className="text-slate-900 text-lg block mt-1">{activeWorker.experienceYears || 6} Years</strong>
              <span className="text-[11px] text-slate-500">Master Level</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#EDDEC9]">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Peer Trust Rating</span>
              <strong className="text-slate-900 text-lg block mt-1 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {activeWorker.rating || 4.88}
              </strong>
              <span className="text-[11px] text-amber-700 font-semibold">Exemplary Track</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#EDDEC9]">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Completed Jobs</span>
              <strong className="text-slate-900 text-lg block mt-1">{activeWorker.totalJobs || 78}</strong>
              <span className="text-[11px] text-emerald-700 font-semibold">100% Payout Disbursed</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#EDDEC9]">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Work Mode</span>
              <strong className="text-slate-900 text-sm block mt-1">Flexible Part-Time</strong>
              <span className="text-[11px] text-slate-500">Autonomous Shifts</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-emerald-800 block text-[10px] uppercase font-bold">Platform Fees</span>
              <strong className="text-emerald-900 text-lg block mt-1">₹0.00 (0%)</strong>
              <span className="text-[11px] text-emerald-700 font-semibold">Free Forever</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#EDDEC9]">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Welfare Reserve</span>
              <strong className="text-[#C97716] text-lg block mt-1">₹{activeWorker.welfareBalance || 12400}</strong>
              <span className="text-[11px] text-slate-500">Healthcare Backed</span>
            </div>
          </div>
        </div>

        {/* Verified Skills Badges */}
        <div className="py-6 border-b border-slate-200">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
            Assessed & Certified Competencies
          </span>
          <div className="flex flex-wrap gap-2">
            {(activeWorker.skills || [
              'Domestic Wiring',
              'Distribution Board Repair',
              'Ceiling Fan Installation',
              'Inverter Setup',
              'Safety Audits',
              'Concealed Wiring'
            ]).map((skill, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-xl bg-[#FAF8F4] border border-[#EDDEC9] text-xs font-semibold text-slate-800 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Recognized Certificates & Diplomas */}
        <div className="py-6 border-b border-slate-200">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-4">
            Formal Trade Certificates
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(activeWorker.certificates || [
              {
                id: 'cert-1',
                title: 'National Trade Certificate (NTC) Electrician',
                issuer: 'National Council for Vocational Training',
                issuedYear: '2018',
                verified: true
              },
              {
                id: 'cert-2',
                title: 'Cooperative Safety & High Voltage Protocol',
                issuer: 'Kalyan Shramik Guild',
                issuedYear: '2022',
                verified: true
              }
            ]).map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#EDDEC9] flex items-start gap-3">
                <FileCheck className="w-5 h-5 text-[#C97716] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-slate-900 leading-snug">{c.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{c.issuer} • Class of {c.issuedYear}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Cooperative Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cooperative Signature & QR Verification Footer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-100 rounded-xl border border-slate-300 flex items-center justify-center text-slate-800 font-mono text-[9px] font-bold p-1 text-center">
              [CIVIC QR CODE]
            </div>
            <div>
              <p className="font-bold text-slate-800">Scan to Verify Live on Cooperative Ledger</p>
              <p className="text-[11px] text-slate-500">Backed by Ministry of Cooperation & Labor Standards</p>
            </div>
          </div>

          <div className="text-right">
            <div className="font-serif italic font-bold text-slate-800 text-sm">
              Anand Verma, IAS
            </div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Registrar of Labor Cooperatives
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
