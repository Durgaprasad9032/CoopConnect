import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { getDashboardRouteForRole, getRoleDisplayName } from '../firebase/roleService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#D05A3F] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-600">Verifying civic credentials...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role unauthorized
  if (!allowedRoles.includes(user.role)) {
    const userRoleDashboard = getDashboardRouteForRole(user.role);
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] p-6">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-[#E8DED1] shadow-civic text-center">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#1A2332] mb-2">Unauthorized Role Access</h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            You are currently signed in as a <span className="font-semibold text-[#D05A3F]">{getRoleDisplayName(user.role)}</span>.
            This section is reserved exclusively for <span className="font-semibold text-slate-800">{allowedRoles.map(getRoleDisplayName).join(' / ')}</span>.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href={userRoleDashboard}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D6E66] hover:bg-[#0A554F] text-white font-medium text-sm transition-all shadow-sm"
            >
              Go to your {user.role.toUpperCase()} Dashboard <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/auth/role-select"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-sm transition-all"
            >
              Switch Role or Log In as Another User
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
