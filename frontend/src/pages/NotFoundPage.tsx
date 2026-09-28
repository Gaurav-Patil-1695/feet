import React from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';

const NotFoundPage: React.FC = () => {
  return (
    <AppLayout>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          padding: 'var(--space-6)',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: 'var(--font-size-3xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-primary)',
            lineHeight: 'var(--font-line-height-3xl)',
            margin: '0 0 var(--space-4) 0',
            fontFamily: 'var(--font-family-mono)',
          }}
        >
          404
        </p>

        <h1
          style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-ink)',
            lineHeight: 'var(--font-line-height-xl)',
            margin: '0 0 var(--space-3) 0',
          }}
        >
          Page not found
        </h1>

        <p
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-muted)',
            lineHeight: 'var(--font-line-height-sm)',
            margin: '0 0 var(--space-8) 0',
            maxWidth: '400px',
          }}
        >
          The page you are looking for does not exist or has been moved.
        </p>

        <Link
          to="/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--color-primary)',
            textDecoration: 'none',
          }}
        >
          ← Back to Dashboard
        </Link>
      </div>
    </AppLayout>
  );
};

export default NotFoundPage;
