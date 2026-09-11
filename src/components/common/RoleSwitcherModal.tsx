import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import { Users, HardHat, ShieldCheck, X, CheckCircle2, ArrowRight } from 'lucide-react';
import { getDashboardRouteForRole } from '../../firebase/roleService';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { user, switchDemoRole, logout } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSelectRole = async (targetRole: UserRole) => {
    // If currently logged in as that role already, navigate directly
    if (user?.role === targetRole) {
      navigate(getDashboardRouteForRole(targetRole));
      onClose();
      return;
    }

    // Otherwise switch active persona / login
    await switchDemoRole(targetRole);
    navigate(getDashboardRouteForRole(targetRole));
    onClose();
  };

  const handleAuthRedirect = (targetRole: UserRole) => {
    navigate(`/login?role=${targetRole}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-3xl border border-[#E8DED1] shadow-2xl overflow-hidden p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBECE8] text-[#D05A3F] text-xs font-bold uppercase tracking-wider mb-2">
            Civic Role Gateway
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2332]">
            Select Your Role in CoopConnect
          </h3>
          <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
            Experience the platform through three dedicated, purpose-built dashboards in one unified application.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Customer */}
          <div
            onClick={() => handleSelectRole('customer')}
            className={`cursor-pointer rounded-2xl p-5 border-2 transition-all duration-200 flex flex-col justify-between hover:shadow-md ${
              user?.role === 'customer'
                ? 'border-[#0D6E66] bg-teal-50/50 ring-2 ring-[#0D6E66]/20'
                : 'border-[#E8DED1] bg-white hover:border-[#0D6E66]/60'
            }`}
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-[#0D6E66] flex items-center justify-center mb-3">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-lg">Customer</h4>
                {user?.role === 'customer' && (
                  <CheckCircle2 className="w-5 h-5 text-[#0D6E66]" />
                )}
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Find verified cooperative workers for home repairs, cleaning, plumbing, and elder care.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0D6E66]">
              <span>Continue as Customer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Worker */}
          <div
            onClick={() => handleSelectRole('worker')}
            className={`cursor-pointer rounded-2xl p-5 border-2 transition-all duration-200 flex flex-col justify-between hover:shadow-md ${
              user?.role === 'worker'
                ? 'border-[#C97716] bg-amber-50/50 ring-2 ring-[#C97716]/20'
                : 'border-[#E8DED1] bg-white hover:border-[#C97716]/60'
            }`}
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-[#C97716] flex items-center justify-center mb-3">
                <HardHat className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-lg">Worker</h4>
                {user?.role === 'worker' && (
                  <CheckCircle2 className="w-5 h-5 text-[#C97716]" />
                )}
              </div>
              <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                0% Fees • Part-Time
              </span>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Set flexible part-time hours, accept local jobs, and showcase your cooperative Skill Passport.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#C97716]">
              <span>Continue as Worker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Admin */}
          <div
            onClick={() => handleSelectRole('admin')}
            className={`cursor-pointer rounded-2xl p-5 border-2 transition-all duration-200 flex flex-col justify-between hover:shadow-md ${
              user?.role === 'admin'
                ? 'border-[#1A283C] bg-slate-100 ring-2 ring-[#1A283C]/20'
                : 'border-[#E8DED1] bg-white hover:border-[#1A283C]/60'
            }`}
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-lg">Admin</h4>
                {user?.role === 'admin' && (
                  <CheckCircle2 className="w-5 h-5 text-[#1A283C]" />
                )}
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Verify worker credentials, supervise cooperatives, handle disputes, and monitor fair job distribution.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#1A283C]">
              <span>Continue as Admin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Security / Google sign-in note */}
        <div className="bg-white/80 rounded-xl p-4 border border-[#E8DED1] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Active session: <strong className="text-slate-800">{user?.name || 'Guest'}</strong> ({user?.role?.toUpperCase() || 'NONE'})</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAuthRedirect('customer')}
              className="text-[#0D6E66] hover:underline font-medium"
            >
              Sign In with Google
            </button>
            <span>•</span>
            <button
              onClick={async () => {
                await logout();
                onClose();
                navigate('/');
              }}
              className="text-red-600 hover:underline font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
