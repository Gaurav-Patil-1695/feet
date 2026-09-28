import React from 'react';

export interface PageHeadingProps {
  title: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export const PageHeading: React.FC<PageHeadingProps> = ({
  title,
  subtitle,
  actions,
  style,
  className,
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '1rem',
    marginBottom: 'var(--space-6, 1.5rem)',
    ...style,
  };

  const textBlockStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    minWidth: 0,
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-display, var(--font-sans))',
    fontSize: 'var(--type-display, 1.75rem)',
    fontWeight: 700,
    color: 'var(--color-text)',
    lineHeight: 1.2,
    margin: 0,
    letterSpacing: '-0.01em',
  };

  const subtitleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--font-size-base)',
    color: 'var(--color-text-muted)',
    margin: 0,
    lineHeight: 1.5,
  };

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexShrink: 0,
  };

  return (
    <div style={containerStyle} className={className}>
      <div style={textBlockStyle}>
        <h1 style={titleStyle}>{title}</h1>
        {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
      </div>
      {actions && <div style={actionsStyle}>{actions}</div>}
    </div>
  );
};

export default PageHeading;
