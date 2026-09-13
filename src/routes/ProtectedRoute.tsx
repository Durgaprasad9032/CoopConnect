import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { ShieldAlert, ArrowRight, Lock } from 'lucide-react';
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
          <p className="text-sm font-medium text-slate-600">Verifying Firebase authentication & roles...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    const requestedRole = allowedRoles[0] || 'customer';
    return <Navigate to={`/login?role=${requestedRole}`} state={{ from: location }} replace />;
  }

  // Check if any of the allowedRoles exist in user.roles array
  const hasAuthorizedRole = allowedRoles.some((r) => user.roles && user.roles.includes(r));

  if (!hasAuthorizedRole) {
    const primaryRole = user.roles[0] || 'customer';
    const fallbackDashboard = getDashboardRouteForRole(primaryRole);

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E8DED1] shadow-civic text-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-200">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#1A2332] mb-2">
            Access Denied
          </h2>
          <p className="text-xs text-slate-500 mb-2 font-mono">
            Signed in as: {user.email}
          </p>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Your Firestore profile has roles: <strong className="text-slate-800">[{user.roles.join(', ')}]</strong>.
            Access to this section requires the <span className="font-semibold text-red-600">{allowedRoles.map(getRoleDisplayName).join(' / ')}</span> role.
          </p>

          <div className="flex flex-col gap-3">
            {user.roles.length > 0 ? (
              <Link
                to={fallbackDashboard}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D6E66] hover:bg-[#0A554F] text-white font-medium text-xs transition-all shadow-sm"
              >
                <span>Go to your {primaryRole.toUpperCase()} Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                Please contact cooperative administration to assign appropriate roles to your profile.
              </p>
            )}

            <Link
              to="/auth/role-select"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs transition-all"
            >
              Switch Role or Re-authenticate
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
