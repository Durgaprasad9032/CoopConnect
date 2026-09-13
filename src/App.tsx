import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';
import { AppRoutes } from './routes/AppRoutes';
import { RoleSwitcherModal } from './components/common/RoleSwitcherModal';
import { ArrowLeftRight, Shield, CheckCircle2, Sparkles, Scale } from 'lucide-react';

const FloatingRoleQuickBar: React.FC = () => {
  const { user, activeRole } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-[#1A2332]/95 backdrop-blur-md text-white px-3.5 py-2 rounded-2xl border border-slate-700 shadow-2xl transition-all hover:scale-105">
        <div className="flex items-center gap-2 pr-2 border-r border-slate-700">
          <span className={`w-2 h-2 rounded-full ${user ? 'bg-emerald-400' : 'bg-slate-400'} animate-pulse`}></span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
            {activeRole || (user?.roles && user.roles[0]) || 'Guest'}
          </span>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
          title="Switch Role between Customer, Worker, and Admin"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" />
          <span>Switch Role</span>
        </button>
      </div>

      <RoleSwitcherModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <div className="min-h-screen bg-[#FAF7F2] font-sans selection:bg-[#FBECE8] selection:text-[#B3442B]">
            <AppRoutes />
            <FloatingRoleQuickBar />
          </div>
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
