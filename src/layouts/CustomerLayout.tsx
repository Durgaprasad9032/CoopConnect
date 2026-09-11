import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { RoleSwitcherModal } from '../components/common/RoleSwitcherModal';
import { 
  Home, 
  Search, 
  CalendarPlus, 
  Clock, 
  MapPin, 
  Receipt, 
  Star, 
  User, 
  Bell, 
  LogOut, 
  Menu, 
  X, 
  ArrowLeftRight,
  Shield,
  HelpCircle,
  Flame
} from 'lucide-react';

export const CustomerLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard Home', path: '/customer/dashboard', icon: Home },
    { label: 'Find Services', path: '/customer/services', icon: Search },
    { label: 'Book a Service', path: '/customer/book', icon: CalendarPlus, highlight: true },
    { label: 'My Bookings', path: '/customer/bookings', icon: Clock },
    { label: 'Track Worker', path: '/customer/track', icon: MapPin },
    { label: 'Invoices & Payments', path: '/customer/invoices', icon: Receipt },
    { label: 'Ratings & Reviews', path: '/customer/reviews', icon: Star },
    { label: 'Profile', path: '/customer/profile', icon: User },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col lg:flex-row text-slate-800">
      
      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-[#D9E8E5] px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-serif font-bold text-lg text-[#0D6E66]">CoopConnect</span>
          <span className="text-[10px] bg-teal-100 text-[#0D6E66] font-bold px-2 py-0.5 rounded-full">Customer</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRoleModalOpen(true)}
            className="p-1.5 text-xs font-semibold bg-teal-50 text-[#0D6E66] rounded-lg border border-teal-200 flex items-center gap-1"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Role</span>
          </button>
        </div>
      </header>

      {/* Sidebar Desktop & Mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#D9E8E5] flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-[#D9E8E5] flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#0D6E66] text-white flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif font-bold text-lg text-slate-900 leading-none block">
                  Coop<span className="text-[#0D6E66]">Connect</span>
                </span>
                <span className="text-[11px] font-semibold text-[#0D6E66] uppercase tracking-wider">
                  Customer Portal
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

          {/* User Quick Info */}
          <div className="p-4 mx-3 my-3 rounded-2xl bg-teal-50/60 border border-teal-100 flex items-center gap-3">
            <img
              src={user?.photoURL || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120'}
              alt={user?.name || 'Customer'}
              className="w-10 h-10 rounded-full object-cover border border-teal-300"
            />
            <div className="overflow-hidden">
              <h4 className="font-bold text-xs text-slate-900 truncate">{user?.name || 'Customer'}</h4>
              <p className="text-[11px] text-teal-800 truncate">Verified Household</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1 mt-2">
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
                      ? 'bg-[#0D6E66] text-white shadow-sm'
                      : item.highlight
                      ? 'bg-amber-50 text-[#C97716] border border-amber-200 hover:bg-amber-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-[#C97716]' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.highlight && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#D9E8E5] space-y-2">
          <button
            onClick={() => setRoleModalOpen(true)}
            className="w-full py-2 px-3 rounded-xl border border-teal-200 bg-teal-50 hover:bg-teal-100 text-[#0D6E66] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
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
        {/* Top bar on Desktop */}
        <header className="hidden lg:flex sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#D9E8E5] px-8 py-3.5 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">Customer Workspace</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              Cooperative Direct Care
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/customer/book?type=emergency"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 text-xs font-bold transition-colors"
            >
              <Flame className="w-3.5 h-3.5 text-orange-600" />
              <span>Emergency Service</span>
            </Link>

            <button
              onClick={() => setRoleModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal-200 bg-teal-50/70 hover:bg-teal-100 text-[#0D6E66] text-xs font-semibold transition-colors"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Switch Role</span>
            </button>

            <div className="h-4 w-px bg-slate-200"></div>

            <div className="flex items-center gap-3">
              <img
                src={user?.photoURL || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120'}
                alt={user?.name || 'Customer'}
                className="w-8 h-8 rounded-full object-cover border border-teal-200"
              />
              <span className="text-xs font-bold text-slate-800">{user?.name}</span>
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

      {/* Overlay for mobile drawer */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}
    </div>
  );
};
