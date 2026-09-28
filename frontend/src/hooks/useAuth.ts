import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import type { AuthContextValue } from '../types/auth';

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useIsAdmin(): boolean {
  const { user } = useAuth();
  return user?.role === 'admin';
}

export function useIsManager(): boolean {
  const { user } = useAuth();
  return user?.role === 'manager' || user?.role === 'admin';
}

export function useIsTechnician(): boolean {
  const { user } = useAuth();
  return user?.role === 'technician';
}

export function useHasRole(role: string): boolean {
  const { user } = useAuth();
  return user?.role === role;
}
