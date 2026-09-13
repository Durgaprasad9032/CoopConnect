import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { RoleSwitcherModal } from './RoleSwitcherModal';
import { 
  Users, 
  HardHat, 
  ShieldCheck, 
  ArrowLeftRight, 
  Menu, 
  X, 
  Sparkles,
  ChevronDown,
  Layers,
  Scale
} from 'lucide-react';
import { getDashboardRouteForRole } from '../../firebase/roleService';

export const Navbar: React.FC = () => {
  const { user, activeRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentRole = activeRole || (user?.roles && user.roles[0]);

  const getRoleIcon = () => {
    switch (currentRole) {
      case 'customer':
        return <Users className="w-3.5 h-3.5 text-[#0D6E66]" />;
      case 'worker':
        return <HardHat className="w-3.5 h-3.5 text-[#C97716]" />;
      case 'admin':
        return <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const getRoleThemeBadge = () => {
    switch (currentRole) {
      case 'customer':
        return 'bg-teal-50 text-[#0D6E66] border-teal-200';
      case 'worker':
        return 'bg-amber-50 text-[#C97716] border-amber-200';
      case 'admin':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const dashboardRoute = currentRole ? getDashboardRouteForRole(currentRole) : '/login';

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8DED1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#D05A3F] to-[#B3442B] text-white flex items-center justify-center shadow-md shadow-[#D05A3F]/20 group-hover:scale-105 transition-transform">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-2xl tracking-tight text-[#1A2332]">
                    Coop<span className="text-[#D05A3F]">Connect</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FBECE8] text-[#D05A3F] border border-[#F4ECE1]">
                    Civic
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 tracking-normal hidden sm:block -mt-1 font-medium">
                  Cooperative Gig Services Ledger
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <Link to="/#services" className="hover:text-[#D05A3F] transition-colors">
                Services
              </Link>
              <Link to="/#how-it-works" className="hover:text-[#D05A3F] transition-colors">
                How It Works
              </Link>
              <Link to="/#fair-matching" className="hover:text-[#D05A3F] transition-colors flex items-center gap-1.5 text-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Fair Matching
              </Link>
              <Link to="/#worker-benefits" className="hover:text-[#D05A3F] transition-colors text-emerald-800 font-semibold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 text-xs">
                Zero Worker Fees
              </Link>
            </nav>

            {/* Role Switcher & Action buttons */}
            <div className="flex items-center gap-3">
              {/* Active Role & Switcher button */}
              <button
                onClick={() => setIsRoleModalOpen(true)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all hover:shadow-sm ${getRoleThemeBadge()}`}
                title="Switch between Customer, Worker, and Admin roles"
              >
                {getRoleIcon()}
                <span className="capitalize">{currentRole ? currentRole : 'Select Role'}</span>
                <ArrowLeftRight className="w-3 h-3 text-slate-400 ml-0.5" />
              </button>

              {/* Dashboard / Login CTA */}
              {user && currentRole ? (
                <button
                  onClick={() => navigate(dashboardRoute)}
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1A2332] hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all hover:-translate-y-0.5"
                >
                  <span>{currentRole.toUpperCase()} Dashboard</span>
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D05A3F] hover:bg-[#B3442B] text-white text-xs font-semibold shadow-sm transition-all hover:-translate-y-0.5"
                >
                  Get Started
                </button>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 md:hidden text-slate-600 hover:text-slate-900 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E8DED1] bg-[#FAF7F2] px-4 pt-3 pb-6 space-y-3">
            <Link
              to="/#services"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700"
            >
              Services
            </Link>
            <Link
              to="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700"
            >
              How It Works
            </Link>
            <Link
              to="/#fair-matching"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700"
            >
              Fair Matching
            </Link>
            <Link
              to="/#worker-benefits"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-emerald-800"
            >
              Worker Zero Fee Guarantee
            </Link>
            <div className="pt-3 border-t border-[#E8DED1] flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsRoleModalOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 bg-white"
              >
                <ArrowLeftRight className="w-4 h-4" />
                Switch Role (Customer / Worker / Admin)
              </button>
              {user && currentRole && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(dashboardRoute);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1A2332] text-white text-xs font-semibold"
                >
                  Open {currentRole.toUpperCase()} Dashboard
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Role Switcher Modal */}
      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />
    </>
  );
};
