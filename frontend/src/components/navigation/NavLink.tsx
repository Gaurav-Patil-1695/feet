import React from 'react';
import { Link } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ to, label, icon, active = false, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-3)',
        padding: 'var(--spacing-3) var(--spacing-4)',
        textDecoration: 'none',
        color: active ? 'var(--color-white)' : 'var(--color-neutral-400)',
        backgroundColor: active ? 'var(--color-primary-600)' : 'transparent',
        borderLeft: active
          ? '3px solid var(--color-primary-300)'
          : '3px solid transparent',
        fontWeight: active ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
        fontSize: 'var(--font-size-sm)',
        borderRadius: '0',
        transition: 'background-color 0.15s, color 0.15s, border-color 0.15s',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        minHeight: '44px',
        boxSizing: 'border-box',
        lineHeight: 1.4,
      }}
      onMouseEnter={(e) => {
        if (!active) {
          (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
            'var(--color-neutral-800)';
          (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-white)';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent';
          (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-neutral-400)';
        }
      }}
    >
      {icon && (
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: active ? 'var(--color-primary-200)' : 'inherit',
          }}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      <span
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </Link>
  );
};

export default NavLink;
