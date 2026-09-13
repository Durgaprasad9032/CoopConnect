import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, HardHat, ShieldCheck, ArrowRight, Scale, Lock } from 'lucide-react';
import { UserRole } from '../../types';

export const RoleSelectPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectRole = (role: UserRole) => {
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-3xl w-full bg-white rounded-3xl border border-[#E8DED1] shadow-civic p-6 sm:p-10 relative overflow-hidden">
        
        {/* Top Civic Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D05A3F] to-[#B3442B] text-white mx-auto mb-4 shadow-md">
            <Scale className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#D05A3F] bg-[#FBECE8] px-3 py-1 rounded-full">
            CoopConnect Gateway
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#1A2332] mt-3">
            Continue to CoopConnect
          </h2>
          <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
            Select the role you wish to sign into via Firebase Authentication.
          </p>
        </div>

        {/* 3 Role Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {/* Customer */}
          <div 
            onClick={() => handleSelectRole('customer')}
            className="group cursor-pointer rounded-2xl p-6 border-2 border-teal-100 bg-teal-50/40 hover:bg-teal-50 hover:border-[#0D6E66] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#0D6E66] text-white flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-1">
                Customer
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Household & community member requesting plumbing, electrical, cleaning, or domestic care.
              </p>
            </div>
            <div className="pt-3 border-t border-teal-200/60 flex items-center justify-between text-xs font-bold text-[#0D6E66]">
              <span>Customer Login</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Worker */}
          <div 
            onClick={() => handleSelectRole('worker')}
            className="group cursor-pointer rounded-2xl p-6 border-2 border-amber-100 bg-amber-50/40 hover:bg-amber-50 hover:border-[#C97716] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#C97716] text-white flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <HardHat className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-slate-900 mb-1">
                  Worker
                </h3>
              </div>
              <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded mb-2">
                0% Fees • Part-Time
              </span>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Cooperative artisan or technician taking part-time shifts with zero registration or platform fees.
              </p>
            </div>
            <div className="pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs font-bold text-[#C97716]">
              <span>Worker Login</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Admin */}
          <div 
            onClick={() => handleSelectRole('admin')}
            className="group cursor-pointer rounded-2xl p-6 border-2 border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-[#1A283C] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#1A283C] text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-1">
                Admin
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Cooperative society registrar, KYC verifier, dispute resolution official, and platform auditor.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800">
              <span>Admin Login</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Security Info Notice */}
        <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#E8DED1] flex items-center gap-3 text-xs text-slate-600">
          <Lock className="w-4 h-4 text-slate-400 shrink-0" />
          <p>
            Role authorization is verified securely through Firebase Authentication and Cloud Firestore permissions.
          </p>
        </div>

      </div>
    </div>
  );
};
