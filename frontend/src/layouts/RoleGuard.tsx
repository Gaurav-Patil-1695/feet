import React from 'react';
import { useAuth } from '../hooks/useAuth';

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <div className="role-guard__denied" role="alert" aria-live="assertive">
        <div className="role-guard__denied-inner">
          <span className="role-guard__code">403</span>
          <h2 className="role-guard__title">Access Denied</h2>
          <p className="role-guard__message">
            You do not have permission to view this page.
          </p>
        </div>

        <style>{`
          .role-guard__denied {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 320px;
            padding: var(--spacing-8, 2rem) var(--spacing-4, 1rem);
          }

          .role-guard__denied-inner {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--spacing-2, 0.5rem);
            text-align: center;
          }

          .role-guard__code {
            font-size: var(--font-size-4xl, 3rem);
            font-weight: 700;
            color: var(--color-danger, #c53030);
            line-height: 1;
          }

          .role-guard__title {
            margin: 0;
            font-size: var(--font-size-xl, 1.25rem);
            font-weight: 600;
            color: var(--color-text-primary, #1a202c);
          }

          .role-guard__message {
            margin: 0;
            font-size: var(--font-size-sm, 0.875rem);
            color: var(--color-text-secondary, #4a5568);
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleGuard;
