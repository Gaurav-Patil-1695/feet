import React from 'react';

export type BadgeStatus = 'success' | 'warning' | 'error';

export interface BadgeProps {
  status: BadgeStatus;
  label: string;
}

const CheckIcon: React.FC = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    style={{ flexShrink: 0 }}
  >
    <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.15" />
    <path
      d="M4.5 8.5l2.5 2.5 4.5-5"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const WarningIcon: React.FC = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    style={{ flexShrink: 0 }}
  >
    <path
      d="M8 2L14.5 13.5H1.5L8 2Z"
      fill="currentColor"
      opacity="0.15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M8 6.5v3"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
    <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
  </svg>
);

const ErrorIcon: React.FC = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    style={{ flexShrink: 0 }}
  >
    <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M5.5 5.5l5 5M10.5 5.5l-5 5"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </svg>
);

const statusConfig: Record<
  BadgeStatus,
  { color: string; backgroundColor: string; borderColor: string; Icon: React.FC; label: string }
> = {
  success: {
    color: 'var(--color-success)',
    backgroundColor: 'var(--color-success-light, #ecfdf5)',
    borderColor: 'var(--color-success)',
    Icon: CheckIcon,
    label: 'success',
  },
  warning: {
    color: 'var(--color-warning)',
    backgroundColor: 'var(--color-warning-light, #fffbeb)',
    borderColor: 'var(--color-warning)',
    Icon: WarningIcon,
    label: 'warning',
  },
  error: {
    color: 'var(--color-danger)',
    backgroundColor: 'var(--color-danger-light, #fef2f2)',
    borderColor: 'var(--color-danger)',
    Icon: ErrorIcon,
    label: 'error',
  },
};

export const Badge: React.FC<BadgeProps> = ({ status, label }) => {
  const config = statusConfig[status];
  const { Icon } = config;

  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem',
    paddingLeft: '0.625rem',
    paddingRight: '0.625rem',
    borderRadius: 'var(--radius-full, 9999px)',
    border: '1px solid',
    borderColor: config.borderColor,
    backgroundColor: config.backgroundColor,
    color: config.color,
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 600,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    userSelect: 'none',
  };

  return (
    <span
      role="status"
      aria-label={`${status}: ${label}`}
      style={containerStyle}
    >
      <Icon />
      {label}
    </span>
  );
};

export default Badge;
