import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { RoleSwitcherModal } from '../components/common/RoleSwitcherModal';
import { 
  LayoutGrid, 
  Users2, 
  UserCheck, 
  Building2, 
  Wrench, 
  BookOpenCheck, 
  BarChart3, 
  AlertOctagon, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ArrowLeftRight,
  ShieldCheck,
  Scale
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { disputes, bookings } = useBooking();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  const openDisputesCount = disputes.filter((d) => d.status === 'Open').length;

  const navItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutGrid },
    { label: 'Workers Registry', path: '/admin/workers', icon: UserCheck },
    { label: 'Customers', path: '/admin/customers', icon: Users2 },
    { label: 'Cooperatives', path: '/admin/cooperatives', icon: Building2 },
    { label: 'Services Catalogue', path: '/admin/services', icon: Wrench },
    { label: 'Bookings Ledger', path: '/admin/bookings', icon: BookOpenCheck },
    { label: 'Disputes Desk', path: '/admin/disputes', icon: AlertOctagon, badge: openDisputesCount > 0 ? `${openDisputesCount}` : undefined },
    { label: 'AI Demand & Fairness', path: '/admin/analytics', icon: BarChart3, highlight: true },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col lg:flex-row text-slate-800">
      
      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-30 bg-[#1A283C] text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-serif font-bold text-lg text-white">CoopConnect</span>
          <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold px-2 py-0.5 rounded-full">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRoleModalOpen(true)}
            className="p-1.5 text-xs font-semibold bg-slate-800 text-slate-200 rounded-lg border border-slate-700"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Sidebar Desktop & Mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1A283C] text-slate-300 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif font-bold text-lg text-white leading-none block">
                  Coop<span className="text-amber-400">Connect</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Governance Desk
                </span>
              </div>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Admin Identity Badge */}
          <div className="p-4 mx-3 my-3 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
            <img
              src={user?.photoURL || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120'}
              alt={user?.name || 'Admin'}
              className="w-10 h-10 rounded-full object-cover border border-amber-500/40"
            />
            <div className="overflow-hidden">
              <h4 className="font-bold text-xs text-white truncate">{user?.name || 'Anand Verma, IAS'}</h4>
              <p className="text-[10px] text-amber-400 font-semibold truncate">Registrar of Cooperatives</p>
            </div>
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
                      ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : item.highlight ? 'text-amber-400' : 'text-slate-400'}`} />
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
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => setRoleModalOpen(true)}
            className="w-full py-2 px-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" />
            <span>Switch Role</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl hover:bg-red-950/40 text-red-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-transparent hover:border-red-900/40"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top bar Desktop */}
        <header className="hidden lg:flex sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200 px-8 py-3.5 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">Civic Governance Ledger</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              Department of Labor & Cooperatives
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setRoleModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-xs"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Switch Role</span>
            </button>

            <div className="h-4 w-px bg-slate-200"></div>

            <div className="flex items-center gap-3">
              <img
                src={user?.photoURL || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120'}
                alt={user?.name || 'Admin'}
                className="w-8 h-8 rounded-full object-cover border border-slate-300"
              />
              <div className="text-left">
                <span className="text-xs font-bold text-slate-900 block leading-tight">{user?.name}</span>
                <span className="text-[10px] text-amber-700 font-bold">Admin Authority</span>
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
