import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import { Users, HardHat, ShieldCheck, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getDashboardRouteForRole, getRoleDisplayName } from '../../firebase/roleService';

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithGoogle, switchDemoRole, isFirebaseConfigured } = useAuth();

  // Role can come from URL query param e.g. /login?role=worker
  const queryRole = (searchParams.get('role') as UserRole) || 'customer';
  const [selectedRole, setSelectedRole] = useState<UserRole>(queryRole);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getRoleTheme = () => {
    switch (selectedRole) {
      case 'customer':
        return {
          title: 'Customer Login',
          subtitle: 'Sign in to book verified household and community services',
          icon: <Users className="w-6 h-6 text-[#0D6E66]" />,
          accentColor: '#0D6E66',
          bgAccent: 'bg-teal-50',
          borderAccent: 'border-teal-200',
        };
      case 'worker':
        return {
          title: 'Cooperative Worker Login',
          subtitle: 'Sign in to access your part-time schedule, jobs, and earnings',
          icon: <HardHat className="w-6 h-6 text-[#C97716]" />,
          accentColor: '#C97716',
          bgAccent: 'bg-amber-50',
          borderAccent: 'border-amber-200',
        };
      case 'admin':
        return {
          title: 'Admin Governance Login',
          subtitle: 'Authorized cooperative registrars and dispute administrators',
          icon: <ShieldCheck className="w-6 h-6 text-[#1A283C]" />,
          accentColor: '#1A283C',
          bgAccent: 'bg-slate-100',
          borderAccent: 'border-slate-300',
        };
    }
  };

  const currentTheme = getRoleTheme();

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const profile = await loginWithGoogle(selectedRole);

      // Verify that user matches requested role or redirect to user's assigned role
      if (selectedRole === 'admin' && profile.role !== 'admin') {
        setError('Unauthorized: Your Google account is not registered with administrative privileges.');
        return;
      }

      // Check if user has an assigned role
      if (!profile.role) {
        setError('Please complete your profile before continuing.');
        return;
      }

      // Successful role verification: redirect to dashboard
      const targetRoute = getDashboardRouteForRole(profile.role);
      navigate(targetRoute, { replace: true });
    } catch (err: any) {
      console.error('Sign-in error:', err);
      setError(err.message || 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async (role: UserRole) => {
    setError(null);
    setLoading(true);
    try {
      await switchDemoRole(role);
      navigate(getDashboardRouteForRole(role), { replace: true });
    } catch (err: any) {
      setError(err.message || 'Error loading demo profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#E8DED1] shadow-civic p-6 sm:p-8 relative">
        
        {/* Back Link */}
        <Link
          to="/auth/role-select"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Role Selection</span>
        </Link>

        {/* Role Switcher Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#FAF7F2] border border-[#E8DED1] rounded-2xl mb-6">
          {(['customer', 'worker', 'admin'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => {
                setSelectedRole(r);
                setError(null);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all ${
                selectedRole === r
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <div className={`w-14 h-14 rounded-2xl ${currentTheme.bgAccent} ${currentTheme.borderAccent} border flex items-center justify-center mx-auto mb-3`}>
            {currentTheme.icon}
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#1A2332]">
            {currentTheme.title}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
            {currentTheme.subtitle}
          </p>
        </div>

        {/* Zero fee callout for workers */}
        {selectedRole === 'worker' && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Zero Fee Platform:</strong> 100% free registration, no monthly subscription, and flexible part-time hours.
            </span>
          </div>
        )}

        {/* Error message banner */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold">{error}</span>
            </div>
          </div>
        )}

        {/* Google Authentication Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-3 disabled:opacity-60"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              {/* Google G SVG */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.94 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E8DED1]"></div>
          </div>
          <span className="relative px-3 bg-white text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Instant Demo Account
          </span>
        </div>

        {/* Direct Demo Sign-in Button */}
        <button
          onClick={() => handleDemoSignIn(selectedRole)}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-xl text-white font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-2 ${
            selectedRole === 'customer'
              ? 'bg-[#0D6E66] hover:bg-[#0A554F]'
              : selectedRole === 'worker'
              ? 'bg-[#C97716] hover:bg-[#A85F0C]'
              : 'bg-[#1A283C] hover:bg-slate-800'
          }`}
        >
          <span>Sign In as Demo {selectedRole.toUpperCase()}</span>
        </button>

        {/* Security / Firestore notice */}
        <p className="text-[11px] text-slate-400 text-center mt-6 leading-relaxed">
          Authentication is verified via Firebase and role permissions stored securely in Firestore. 
          Admin access requires registered authority clearance.
        </p>

      </div>
    </div>
  );
};
