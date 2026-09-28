import React from 'react';
import { Outlet } from 'react-router-dom';
import zensarLogo from '../assets/zensar-logo.svg';

const AuthLayout: React.FC = () => {
  return (
    <div className="auth-layout">
      <div className="auth-layout__card">
        <div className="auth-layout__header">
          <img
            src={zensarLogo}
            alt="Zensar"
            className="auth-layout__logo"
          />
          <h1 className="auth-layout__title">Fleet Management</h1>
          <p className="auth-layout__subtitle">Sign in to your account</p>
        </div>
        <div className="auth-layout__body">
          <Outlet />
        </div>
      </div>

      <style>{`
        .auth-layout {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: var(--spacing-4, 1rem);
          background-color: var(--color-bg-base, #f5f7fa);
          background-image: url('/src/assets/brand-shapes.svg');
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
        }

        .auth-layout__card {
          width: 100%;
          max-width: 420px;
          background-color: var(--color-surface, #ffffff);
          border-radius: var(--radius-lg, 8px);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.10), 0 1px 4px rgba(0, 0, 0, 0.06);
          overflow: hidden;
        }

        .auth-layout__header {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--spacing-8, 2rem) var(--spacing-6, 1.5rem) var(--spacing-4, 1rem);
          background-color: var(--color-primary, #1a3c6e);
          text-align: center;
        }

        .auth-layout__logo {
          height: 48px;
          width: auto;
          margin-bottom: var(--spacing-3, 0.75rem);
        }

        .auth-layout__title {
          margin: 0 0 var(--spacing-1, 0.25rem);
          font-size: var(--font-size-xl, 1.25rem);
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.01em;
        }

        .auth-layout__subtitle {
          margin: 0;
          font-size: var(--font-size-sm, 0.875rem);
          color: rgba(255, 255, 255, 0.75);
        }

        .auth-layout__body {
          padding: var(--spacing-6, 1.5rem);
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
