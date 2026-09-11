import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { RoleSwitcherModal } from '../components/common/RoleSwitcherModal';
import { 
  LayoutDashboard, 
  Briefcase, 
  Inbox, 
  Clock, 
  Award, 
  Wallet, 
  HeartHandshake, 
  Star, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ArrowLeftRight,
  CheckCircle2,
  Power
} from 'lucide-react';

export const WorkerLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { workers, updateWorkerAvailability, bookings } = useBooking();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  // Active worker state from BookingContext or fallback
  const activeWorkerData = workers.find((w) => w.uid === user?.uid) || user;
  const isAvailable = activeWorkerData?.availability?.isAvailable ?? true;

  // Count pending job requests
  const pendingRequestsCount = bookings.filter((b) => b.status === 'REQUESTED').length;

  const navItems = [
    { label: 'Dashboard', path: '/worker/dashboard', icon: LayoutDashboard },
    { label: 'Job Requests', path: '/worker/requests', icon: Inbox, badge: pendingRequestsCount > 0 ? `${pendingRequestsCount}` : undefined },
    { label: 'My Jobs', path: '/worker/jobs', icon: Briefcase },
    { label: 'Part-Time Schedule', path: '/worker/availability', icon: Clock, highlight: true },
    { label: 'Skill Passport', path: '/worker/skill-passport', icon: Award },
    { label: 'Earnings', path: '/worker/earnings', icon: Wallet },
    { label: 'Cooperative Welfare', path: '/worker/welfare', icon: HeartHandshake },
    { label: 'Ratings & Reviews', path: '/worker/ratings', icon: Star },
    { label: 'Profile', path: '/worker/profile', icon: User },
  ];

  const toggleAvailability = async () => {
    if (user?.uid) {
      await updateWorkerAvailability(user.uid, !isAvailable);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col lg:flex-row text-slate-800">
      
      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-[#EDDEC9] px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-serif font-bold text-lg text-[#C97716]">CoopConnect</span>
          <span className="text-[10px] bg-amber-100 text-[#C97716] font-bold px-2 py-0.5 rounded-full">Worker</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleAvailability}
            className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors ${
              isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
            <span>{isAvailable ? 'On Duty' : 'Off Duty'}</span>
          </button>
          <button
            onClick={() => setRoleModalOpen(true)}
            className="p-1.5 text-xs font-semibold bg-amber-50 text-[#C97716] rounded-lg border border-amber-200"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Sidebar Desktop & Mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#EDDEC9] flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-[#EDDEC9] flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#C97716] text-white flex items-center justify-center font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif font-bold text-lg text-slate-900 leading-none block">
                  Coop<span className="text-[#C97716]">Connect</span>
                </span>
                <span className="text-[11px] font-semibold text-[#C97716] uppercase tracking-wider">
                  Worker Guild
                </span>
              </div>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Worker Status & Zero-Fee Guarantee Badge */}
          <div className="p-4 mx-3 my-3 rounded-2xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-center gap-3 mb-2.5">
              <img
                src={user?.photoURL || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=120'}
                alt={user?.name || 'Worker'}
                className="w-10 h-10 rounded-full object-cover border border-amber-300"
              />
              <div className="overflow-hidden">
                <h4 className="font-bold text-xs text-slate-900 truncate">{user?.name || 'Ramesh Kumar'}</h4>
                <p className="text-[11px] text-amber-800 font-semibold truncate">{activeWorkerData?.profession || 'Coop Electrician'}</p>
              </div>
            </div>

            {/* Quick Availability Toggle Switch */}
            <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-600">Part-Time Status:</span>
              <button
                onClick={toggleAvailability}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-colors ${
                  isAvailable
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-200 text-slate-600 border border-slate-300'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                <span>{isAvailable ? 'Available' : 'Unavailable'}</span>
              </button>
            </div>
          </div>

          {/* Zero Platform Fee Promise Notice */}
          <div className="mx-3 mb-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>0% Platform Commission Guaranteed</span>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#C97716] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-amber-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-red-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#EDDEC9] space-y-2">
          <button
            onClick={() => setRoleModalOpen(true)}
            className="w-full py-2 px-3 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-[#C97716] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Switch Role</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl hover:bg-red-50 text-red-600 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top bar Desktop */}
        <header className="hidden lg:flex sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#EDDEC9] px-8 py-3.5 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">Worker Guild Workspace</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Cooperative Member #MSCS-491
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Availability Toggle button */}
            <button
              onClick={toggleAvailability}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 border transition-all ${
                isAvailable
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-slate-100 text-slate-600 border-slate-300'
              }`}
            >
              <Power className={`w-3.5 h-3.5 ${isAvailable ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{isAvailable ? 'Available for Jobs' : 'Marked Unavailable'}</span>
            </button>

            <button
              onClick={() => setRoleModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-[#C97716] text-xs font-semibold transition-colors"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Switch Role</span>
            </button>

            <div className="h-4 w-px bg-slate-200"></div>

            <div className="flex items-center gap-3">
              <img
                src={user?.photoURL || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=120'}
                alt={user?.name || 'Worker'}
                className="w-8 h-8 rounded-full object-cover border border-amber-300"
              />
              <div className="text-left">
                <span className="text-xs font-bold text-slate-900 block leading-tight">{user?.name}</span>
                <span className="text-[10px] text-slate-500 font-medium">Part-Time Artisan</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Role Switcher Modal */}
      <RoleSwitcherModal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
      />

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}
    </div>
  );
};
