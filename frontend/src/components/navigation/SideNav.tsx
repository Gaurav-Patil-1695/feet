import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import NavLink from './NavLink';

interface SideNavProps {
  open: boolean;
  onClose?: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: string[];
}

const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);

const VehiclesIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="1" y="3" width="15" height="13" rx="2" />
    <path d="M16 8h4l3 3v5h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const WorkOrdersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const SchedulesIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ServiceDueIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const DepotsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const MyWorkOrdersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" />
    <polygon points="18 2 22 6 12 16 8 16 8 12 18 2" />
  </svg>
);

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/',
    icon: <DashboardIcon />,
    roles: ['admin', 'depot_manager', 'technician', 'scheduler'],
  },
  {
    label: 'Vehicles',
    path: '/vehicles',
    icon: <VehiclesIcon />,
    roles: ['admin', 'depot_manager', 'scheduler'],
  },
  {
    label: 'Work Orders',
    path: '/work-orders',
    icon: <WorkOrdersIcon />,
    roles: ['admin', 'depot_manager', 'scheduler'],
  },
  {
    label: 'My Work Orders',
    path: '/work-orders/mine',
    icon: <MyWorkOrdersIcon />,
    roles: ['technician'],
  },
  {
    label: 'Schedules',
    path: '/schedules',
    icon: <SchedulesIcon />,
    roles: ['admin', 'depot_manager', 'scheduler'],
  },
  {
    label: 'Service Due',
    path: '/service-due',
    icon: <ServiceDueIcon />,
    roles: ['admin', 'depot_manager', 'scheduler', 'technician'],
  },
  {
    label: 'Users',
    path: '/users',
    icon: <UsersIcon />,
    roles: ['admin'],
  },
  {
    label: 'Depots',
    path: '/depots',
    icon: <DepotsIcon />,
    roles: ['admin'],
  },
];

export const SideNav: React.FC<SideNavProps> = ({ open, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const userRole = user?.role ?? '';

  const visibleItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <>
      {/* Backdrop for mobile */}
      {open && (
        <div
          aria-hidden="true"
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 90,
          }}
        />
      )}

      <nav
        aria-label="Main navigation"
        style={{
          position: 'fixed',
          top: '64px',
          left: 0,
          bottom: 0,
          width: '240px',
          backgroundColor: 'var(--color-neutral-900)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 95,
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowY: 'auto',
          overflowX: 'hidden',
          boxShadow: open ? '4px 0 16px rgba(0,0,0,0.18)' : 'none',
        }}
      >
        <ul
          role="list"
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 'var(--spacing-3) 0',
            flex: 1,
          }}
        >
          {visibleItems.map((item) => {
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname === item.path ||
                  location.pathname.startsWith(item.path + '/');

            return (
              <li key={item.path} role="none">
                <NavLink
                  to={item.path}
                  icon={item.icon}
                  label={item.label}
                  active={isActive}
                  onClick={onClose}
                />
              </li>
            );
          })}
        </ul>

        {/* Role badge at the bottom */}
        {userRole && (
          <div
            style={{
              padding: 'var(--spacing-4)',
              borderTop: '1px solid var(--color-neutral-700)',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--spacing-2)',
                backgroundColor: 'var(--color-primary-700)',
                borderRadius: 'var(--radius-full)',
                padding: 'var(--spacing-1) var(--spacing-3)',
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-success-400)',
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-primary-100)',
                  fontWeight: 'var(--font-weight-medium)',
                  textTransform: 'capitalize',
                  whiteSpace: 'nowrap',
                }}
              >
                {userRole.replace('_', ' ')}
              </span>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default SideNav;
