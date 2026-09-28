import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useDepots } from '../../hooks/useDepots';
import type { Depot } from '../../types/depot';

interface TopNavProps {
  selectedDepotId?: number | null;
  onDepotChange?: (depotId: number | null) => void;
  onMenuToggle?: () => void;
  sideNavOpen?: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  selectedDepotId,
  onDepotChange,
  onMenuToggle,
  sideNavOpen,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { depots, loading: depotsLoading } = useDepots();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    navigate('/login');
  };

  const handleDepotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onDepotChange?.(value === '' ? null : Number(value));
  };

  const getUserInitials = () => {
    if (!user) return '?';
    const name = user.full_name || user.email || '';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    return user.full_name || user.email || '';
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: 'var(--color-primary-700)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 var(--spacing-4)',
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        gap: 'var(--spacing-4)',
      }}
    >
      {/* Hamburger / menu toggle */}
      <button
        onClick={onMenuToggle}
        aria-label={sideNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={sideNavOpen}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '5px',
          padding: 'var(--spacing-2)',
          borderRadius: 'var(--radius-sm)',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            display: 'block',
            width: '20px',
            height: '2px',
            backgroundColor: 'var(--color-white)',
            transition: 'transform 0.2s, opacity 0.2s',
            transform: sideNavOpen ? 'translateY(7px) rotate(45deg)' : 'none',
          }}
        />
        <span
          style={{
            display: 'block',
            width: '20px',
            height: '2px',
            backgroundColor: 'var(--color-white)',
            opacity: sideNavOpen ? 0 : 1,
            transition: 'opacity 0.2s',
          }}
        />
        <span
          style={{
            display: 'block',
            width: '20px',
            height: '2px',
            backgroundColor: 'var(--color-white)',
            transition: 'transform 0.2s, opacity 0.2s',
            transform: sideNavOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
          }}
        />
      </button>

      {/* Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-2)',
          flexShrink: 0,
          cursor: 'pointer',
        }}
        onClick={() => navigate('/')}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
        aria-label="Go to home"
      >
        <img
          src="/logo.svg"
          alt="Zensar Fleet"
          style={{ height: '32px', width: 'auto' }}
        />
        <span
          style={{
            color: 'var(--color-white)',
            fontWeight: 'var(--font-weight-bold)',
            fontSize: 'var(--font-size-lg)',
            letterSpacing: '0.02em',
            display: 'none',
          }}
          className="topnav-brand-text"
        >
          Fleet Manager
        </span>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Depot Selector */}
      {onDepotChange && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-2)',
            flexShrink: 0,
          }}
        >
          <label
            htmlFor="depot-selector"
            style={{
              color: 'var(--color-primary-100)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              whiteSpace: 'nowrap',
            }}
          >
            Depot:
          </label>
          <select
            id="depot-selector"
            value={selectedDepotId ?? ''}
            onChange={handleDepotChange}
            disabled={depotsLoading}
            style={{
              backgroundColor: 'var(--color-primary-600)',
              color: 'var(--color-white)',
              border: '1px solid var(--color-primary-400)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--spacing-1) var(--spacing-3)',
              fontSize: 'var(--font-size-sm)',
              cursor: 'pointer',
              outline: 'none',
              minWidth: '140px',
              maxWidth: '220px',
            }}
            aria-label="Select depot"
          >
            <option value="">All Depots</option>
            {depots.map((depot: Depot) => (
              <option key={depot.id} value={depot.id}>
                {depot.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* User Menu */}
      <div
        ref={userMenuRef}
        style={{ position: 'relative', flexShrink: 0 }}
      >
        <button
          onClick={() => setUserMenuOpen((prev) => !prev)}
          aria-label="User menu"
          aria-expanded={userMenuOpen}
          aria-haspopup="true"
          style={{
            background: 'none',
            border: '2px solid var(--color-primary-400)',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--color-primary-500)',
            color: 'var(--color-white)',
            fontWeight: 'var(--font-weight-bold)',
            fontSize: 'var(--font-size-sm)',
            transition: 'background-color 0.15s',
          }}
        >
          {getUserInitials()}
        </button>

        {userMenuOpen && (
          <div
            role="menu"
            aria-label="User options"
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              backgroundColor: 'var(--color-white)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              minWidth: '200px',
              zIndex: 200,
              overflow: 'hidden',
              border: '1px solid var(--color-neutral-200)',
            }}
          >
            {/* User info header */}
            <div
              style={{
                padding: 'var(--spacing-3) var(--spacing-4)',
                borderBottom: '1px solid var(--color-neutral-100)',
                backgroundColor: 'var(--color-neutral-50)',
              }}
            >
              <div
                style={{
                  fontWeight: 'var(--font-weight-semibold)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-neutral-900)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {getUserDisplayName()}
              </div>
              {user?.role && (
                <div
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-neutral-500)',
                    textTransform: 'capitalize',
                    marginTop: '2px',
                  }}
                >
                  {user.role.replace('_', ' ')}
                </div>
              )}
            </div>

            {/* Profile link */}
            <button
              role="menuitem"
              onClick={() => {
                setUserMenuOpen(false);
                navigate('/profile');
              }}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: 'var(--spacing-3) var(--spacing-4)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-neutral-700)',
                transition: 'background-color 0.1s',
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLButtonElement).style.backgroundColor =
                  'var(--color-neutral-50)')
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLButtonElement).style.backgroundColor = 'transparent')
              }
            >
              My Profile
            </button>

            {/* Divider */}
            <div
              style={{
                height: '1px',
                backgroundColor: 'var(--color-neutral-100)',
                margin: '0',
              }}
            />

            {/* Logout */}
            <button
              role="menuitem"
              onClick={handleLogout}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: 'var(--spacing-3) var(--spacing-4)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-error-600)',
                fontWeight: 'var(--font-weight-medium)',
                transition: 'background-color 0.1s',
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLButtonElement).style.backgroundColor =
                  'var(--color-error-50)')
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLButtonElement).style.backgroundColor = 'transparent')
              }
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopNav;
