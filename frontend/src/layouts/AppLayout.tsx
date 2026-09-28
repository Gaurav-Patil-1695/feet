import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import zensarLogo from '../assets/zensar-logo.svg';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  roles?: string[];
}

const TruckIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="1" y="3" width="15" height="13" rx="1" />
    <path d="M16 8h4l3 5v4h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const ClipboardIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" ry="1" />
    <line x1="9" y1="12" x2="15" y2="12" />
    <line x1="9" y1="16" x2="13" y2="16" />
  </svg>
);

const CalendarIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const BellIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const UsersIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const DashboardIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);

const MenuIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const LogoutIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const NAV_ITEMS: NavItem[] = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    to: '/vehicles',
    label: 'Vehicles',
    icon: <TruckIcon />,
  },
  {
    to: '/work-orders',
    label: 'Work Orders',
    icon: <ClipboardIcon />,
  },
  {
    to: '/schedules',
    label: 'Schedules',
    icon: <CalendarIcon />,
  },
  {
    to: '/service-due',
    label: 'Service Due',
    icon: <BellIcon />,
  },
  {
    to: '/users',
    label: 'Users',
    icon: <UsersIcon />,
    roles: ['admin'],
  },
];

const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (!item.roles || item.roles.length === 0) return true;
    if (!user) return false;
    return item.roles.includes(user.role);
  });

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-layout">
      {/* Top Navigation Bar */}
      <header className="app-layout__topnav">
        <div className="app-layout__topnav-left">
          <button
            className="app-layout__menu-toggle"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label={sidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
          <NavLink to="/dashboard" className="app-layout__logo-link" aria-label="Zensar Fleet — Dashboard">
            <img src={zensarLogo} alt="Zensar" className="app-layout__logo" />
          </NavLink>
          <span className="app-layout__product-name">Fleet Management</span>
        </div>

        <div className="app-layout__topnav-right">
          {user && (
            <div className="app-layout__user-info">
              <span className="app-layout__user-name">{user.name ?? user.email}</span>
              <span className="app-layout__user-role">{user.role}</span>
            </div>
          )}
          <button
            className="app-layout__logout-btn"
            onClick={handleLogout}
            aria-label="Log out"
            title="Log out"
          >
            <LogoutIcon />
            <span className="app-layout__logout-label">Logout</span>
          </button>
        </div>
      </header>

      <div className="app-layout__body">
        {/* Sidebar Overlay (mobile) */}
        {sidebarOpen && (
          <div
            className="app-layout__overlay"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        {/* Sidebar Navigation */}
        <nav
          className={`app-layout__sidebar${sidebarOpen ? ' app-layout__sidebar--open' : ''}`}
          aria-label="Main navigation"
        >
          <ul className="app-layout__nav-list" role="list">
            {visibleNavItems.map((item) => (
              <li key={item.to} className="app-layout__nav-item">
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `app-layout__nav-link${isActive ? ' app-layout__nav-link--active' : ''}`
                  }
                  onClick={closeSidebar}
                  end={item.to === '/dashboard'}
                >
                  <span className="app-layout__nav-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="app-layout__nav-label">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content Area */}
        <main className="app-layout__main" id="main-content">
          <Outlet />
        </main>
      </div>

      <style>{`
        .app-layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: var(--color-bg-base, #f5f7fa);
        }

        /* ── Top Nav ── */
        .app-layout__topnav {
          position: sticky;
          top: 0;
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 60px;
          padding: 0 var(--spacing-4, 1rem);
          background-color: var(--color-primary, #1a3c6e);
          color: #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        }

        .app-layout__topnav-left {
          display: flex;
          align-items: center;
          gap: var(--spacing-3, 0.75rem);
        }

        .app-layout__topnav-right {
          display: flex;
          align-items: center;
          gap: var(--spacing-3, 0.75rem);
        }

        .app-layout__menu-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          padding: 0;
          background: transparent;
          border: none;
          border-radius: var(--radius-sm, 4px);
          color: #ffffff;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .app-layout__menu-toggle:hover,
        .app-layout__menu-toggle:focus-visible {
          background-color: rgba(255, 255, 255, 0.15);
          outline: 2px solid rgba(255, 255, 255, 0.5);
          outline-offset: 2px;
        }

        .app-layout__logo-link {
          display: flex;
          align-items: center;
          text-decoration: none;
        }

        .app-layout__logo {
          height: 32px;
          width: auto;
        }

        .app-layout__product-name {
          font-size: var(--font-size-sm, 0.875rem);
          font-weight: 600;
          color: rgba(255, 255, 255, 0.85);
          white-space: nowrap;
          display: none;
        }

        @media (min-width: 640px) {
          .app-layout__product-name {
            display: block;
          }
        }

        .app-layout__user-info {
          display: none;
          flex-direction: column;
          align-items: flex-end;
          line-height: 1.2;
        }

        @media (min-width: 768px) {
          .app-layout__user-info {
            display: flex;
          }
        }

        .app-layout__user-name {
          font-size: var(--font-size-sm, 0.875rem);
          font-weight: 600;
          color: #ffffff;
        }

        .app-layout__user-role {
          font-size: var(--font-size-xs, 0.75rem);
          color: rgba(255, 255, 255, 0.7);
          text-transform: capitalize;
        }

        .app-layout__logout-btn {
          display: flex;
          align-items: center;
          gap: var(--spacing-1, 0.25rem);
          padding: var(--spacing-1, 0.25rem) var(--spacing-2, 0.5rem);
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.4);
          border-radius: var(--radius-sm, 4px);
          color: #ffffff;
          font-size: var(--font-size-sm, 0.875rem);
          cursor: pointer;
          transition: background-color 0.15s ease, border-color 0.15s ease;
          white-space: nowrap;
        }

        .app-layout__logout-btn:hover,
        .app-layout__logout-btn:focus-visible {
          background-color: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.7);
          outline: none;
        }

        .app-layout__logout-label {
          display: none;
        }

        @media (min-width: 640px) {
          .app-layout__logout-label {
            display: inline;
          }
        }

        /* ── Body layout ── */
        .app-layout__body {
          display: flex;
          flex: 1;
          position: relative;
          overflow: hidden;
        }

        /* ── Overlay (mobile) ── */
        .app-layout__overlay {
          position: fixed;
          inset: 60px 0 0 0;
          background-color: rgba(0, 0, 0, 0.4);
          z-index: 150;
        }

        @media (min-width: 1024px) {
          .app-layout__overlay {
            display: none;
          }
        }

        /* ── Sidebar ── */
        .app-layout__sidebar {
          position: fixed;
          top: 60px;
          left: 0;
          bottom: 0;
          width: 240px;
          z-index: 160;
          background-color: var(--color-surface, #ffffff);
          border-right: 1px solid var(--color-border, #e2e8f0);
          overflow-y: auto;
          transform: translateX(-100%);
          transition: transform 0.25s ease;
        }

        .app-layout__sidebar--open {
          transform: translateX(0);
        }

        @media (min-width: 1024px) {
          .app-layout__sidebar {
            position: sticky;
            top: 60px;
            height: calc(100vh - 60px);
            flex-shrink: 0;
            transform: translateX(0);
          }
        }

        /* ── Nav list ── */
        .app-layout__nav-list {
          list-style: none;
          margin: 0;
          padding: var(--spacing-2, 0.5rem) 0;
        }

        .app-layout__nav-item {
          margin: 0;
        }

        .app-layout__nav-link {
          display: flex;
          align-items: center;
          gap: var(--spacing-3, 0.75rem);
          padding: var(--spacing-3, 0.75rem) var(--spacing-4, 1rem);
          color: var(--color-text-secondary, #4a5568);
          text-decoration: none;
          font-size: var(--font-size-sm, 0.875rem);
          font-weight: 500;
          border-left: 3px solid transparent;
          transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
        }

        .app-layout__nav-link:hover,
        .app-layout__nav-link:focus-visible {
          background-color: var(--color-bg-subtle, #f0f4f8);
          color: var(--color-primary, #1a3c6e);
          outline: none;
        }

        .app-layout__nav-link--active {
          background-color: var(--color-primary-subtle, #e8eef7);
          color: var(--color-primary, #1a3c6e);
          border-left-color: var(--color-primary, #1a3c6e);
          font-weight: 600;
        }

        .app-layout__nav-icon {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          color: inherit;
        }

        .app-layout__nav-label {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── Main content ── */
        .app-layout__main {
          flex: 1;
          min-width: 0;
          padding: var(--spacing-6, 1.5rem);
          overflow-y: auto;
        }

        @media (min-width: 1024px) {
          .app-layout__main {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default AppLayout;
