import React from 'react';

export type AlertVariant = 'success' | 'warning' | 'error';

export interface AlertProps {
  variant: AlertVariant;
  message: React.ReactNode;
  onClose?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

const SuccessIcon: React.FC = () => (
  <svg
    width="1.25rem"
    height="1.25rem"
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
    width="1.25rem"
    height="1.25rem"
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
    width="1.25rem"
    height="1.25rem"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    style={{ flexShrink: 0 }}
  >
    <circle
      cx="8"
      cy="8"
      r="7"
      fill="currentColor"
      opacity="0.15"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M5.5 5.5l5 5M10.5 5.5l-5 5"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </svg>
);

const CloseIcon: React.FC = () => (
  <svg
    width="1rem"
    height="1rem"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M3 3l10 10M13 3L3 13"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </svg>
);

const variantConfig: Record<
  AlertVariant,
  {
    color: string;
    backgroundColor: string;
    borderColor: string;
    Icon: React.FC;
    role: string;
    label: string;
  }
> = {
  success: {
    color: 'var(--color-success)',
    backgroundColor: 'var(--color-success-light, #ecfdf5)',
    borderColor: 'var(--color-success)',
    Icon: SuccessIcon,
    role: 'status',
    label: 'Success',
  },
  warning: {
    color: 'var(--color-warning)',
    backgroundColor: 'var(--color-warning-light, #fffbeb)',
    borderColor: 'var(--color-warning)',
    Icon: WarningIcon,
    role: 'alert',
    label: 'Warning',
  },
  error: {
    color: 'var(--color-danger)',
    backgroundColor: 'var(--color-danger-light, #fef2f2)',
    borderColor: 'var(--color-danger)',
    Icon: ErrorIcon,
    role: 'alert',
    label: 'Error',
  },
};

export const Alert: React.FC<AlertProps> = ({
  variant,
  message,
  onClose,
  style,
  className,
}) => {
  const config = variantConfig[variant];
  const { Icon } = config;

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '0.875rem 1rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid',
    borderColor: config.borderColor,
    backgroundColor: config.backgroundColor,
    color: config.color,
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 500,
    lineHeight: 1.5,
    ...style,
  };

  const iconWrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    paddingTop: '0.0625rem',
    flexShrink: 0,
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: 700,
    marginRight: '0.25rem',
  };

  const messageWrapperStyle: React.CSSProperties = {
    flex: 1,
    color: 'var(--color-text)',
  };

  const closeButtonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.5rem',
    height: '1.5rem',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    backgroundColor: 'transparent',
    color: config.color,
    cursor: 'pointer',
    padding: 0,
    flexShrink: 0,
    opacity: 0.7,
    transition: 'opacity 150ms ease',
  };

  return (
    <div
      role={config.role}
      aria-label={config.label}
      style={containerStyle}
      className={className}
    >
      <span style={iconWrapperStyle}>
        <Icon />
      </span>
      <div style={messageWrapperStyle}>
        <span style={labelStyle}>{config.label}:</span>
        {message}
      </div>
      {onClose && (
        <button
          type="button"
          aria-label="Dismiss alert"
          style={closeButtonStyle}
          onClick={onClose}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = '0.7';
          }}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
};

export default Alert;
