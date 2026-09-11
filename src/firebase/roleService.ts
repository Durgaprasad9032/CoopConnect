import { UserRole } from '../types';

export function validateRoleAccess(userRole: UserRole | undefined | null, requiredRole: UserRole): boolean {
  if (!userRole) return false;
  return userRole === requiredRole;
}

export function getDashboardRouteForRole(role: UserRole): string {
  switch (role) {
    case 'customer':
      return '/customer/dashboard';
    case 'worker':
      return '/worker/dashboard';
    case 'admin':
      return '/admin/dashboard';
    default:
      return '/';
  }
}

export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case 'customer':
      return 'Customer / Household';
    case 'worker':
      return 'Cooperative Worker (Part-Time)';
    case 'admin':
      return 'Cooperative Registrar & Admin';
    default:
      return role;
  }
}
