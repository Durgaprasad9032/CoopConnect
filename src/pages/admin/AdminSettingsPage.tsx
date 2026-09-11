import React from 'react';
import { Settings, ShieldCheck, Scale, Cpu, Bell, CheckCircle2 } from 'lucide-react';
import { isFirebaseConfigured } from '../../firebase/firebase';

export const AdminSettingsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-civic">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Governance Parameters
        </span>
        <h1 className="text-3xl font-serif font-bold text-slate-900 mt-0.5">
          Platform Architecture & Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          CoopConnect infrastructure, Firebase security rules, and future integration endpoints.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-civic space-y-6">
        <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">
          Infrastructure Connectivity
        </h3>

        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <strong className="text-slate-900 block font-bold text-sm">Firebase Authentication & Firestore</strong>
              <span className="text-slate-500">
                {isFirebaseConfigured ? 'Connected to production GCP Firebase Project' : 'Running in Offline Resilient Simulation Mode'}
              </span>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              isFirebaseConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {isFirebaseConfigured ? 'Configured' : 'Demo / Standby'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <strong className="text-slate-900 block font-bold text-sm">Python AI Demand Forecasting Service</strong>
              <span className="text-slate-500">gRPC/REST hook ready at localhost:8000/api/v1/forecast</span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              Ready for Integration
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <strong className="text-slate-900 block font-bold text-sm">Razorpay Civic Escrow Gateway</strong>
              <span className="text-slate-500">Split payment logic: 100% to worker + cooperative welfare fund</span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
              Schema Prepared
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <span className="font-bold text-slate-800 block text-xs uppercase mb-2">Security Enforcement:</span>
          <p className="text-xs text-slate-600 leading-relaxed">
            Frontend route protection blocks unauthorized role crossing. Firestore security rules enforce role checks via:
            <code className="block bg-slate-100 p-2.5 rounded-lg text-slate-800 font-mono mt-1 text-[11px]">
              allow read, write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
            </code>
          </p>
        </div>
      </div>
    </div>
  );
};
