import React from 'react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const DefaultIcon: React.FC = () => (
  <svg
    width="3rem"
    height="3rem"
    viewBox="0 0 48 48"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="24" cy="24" r="22" fill="var(--color-bg-subtle, #f9fafb)" stroke="var(--color-border)" strokeWidth="1.5" />
    <path
      d="M16 20h16M16 24h10M16 28h8"
      stroke="var(--color-text-muted)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <rect
      x="13"
      y="14"
      width="22"
      height="20"
      rx="2"
      stroke="var(--color-text-muted)"
      strokeWidth="1.75"
      fill="none"
    />
  </svg>
);

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  style,
  className,
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 'var(--space-12, 3rem) var(--space-6, 1.5rem)',
    fontFamily: 'var(--font-sans)',
    ...style,
  };

  const iconWrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.25rem',
    color: 'var(--color-text-muted)',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 'var(--font-size-lg)',
    fontWeight: 700,
    color: 'var(--color-text)',
    margin: 0,
    marginBottom: description ? '0.5rem' : action ? '1.25rem' : 0,
    lineHeight: 1.3,
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: 'var(--font-size-base)',
    color: 'var(--color-text-muted)',
    margin: 0,
    marginBottom: action ? '1.5rem' : 0,
    maxWidth: '28rem',
    lineHeight: 1.6,
  };

  return (
    <div
      role="status"
      aria-label={title}
      style={containerStyle}
      className={className}
    >
      <div style={iconWrapperStyle}>
        {icon ?? <DefaultIcon />}
      </div>
      <h3 style={titleStyle}>{title}</h3>
      {description && (
        <p style={descriptionStyle}>{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
