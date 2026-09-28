import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const baseStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  fontFamily: 'var(--font-sans)',
  fontWeight: 600,
  borderRadius: 'var(--radius-md)',
  border: '2px solid transparent',
  cursor: 'pointer',
  transition: 'background-color 150ms ease, border-color 150ms ease, color 150ms ease, opacity 150ms ease',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  userSelect: 'none',
};

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-white)',
    borderColor: 'var(--color-primary)',
  },
  secondary: {
    backgroundColor: 'transparent',
    color: 'var(--color-primary)',
    borderColor: 'var(--color-primary)',
  },
  danger: {
    backgroundColor: 'var(--color-danger)',
    color: 'var(--color-white)',
    borderColor: 'var(--color-danger)',
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: {
    fontSize: 'var(--font-size-sm)',
    padding: '0.375rem 0.75rem',
    height: '2rem',
  },
  md: {
    fontSize: 'var(--font-size-base)',
    padding: '0.5rem 1.25rem',
    height: '2.5rem',
  },
  lg: {
    fontSize: 'var(--font-size-lg)',
    padding: '0.625rem 1.75rem',
    height: '3rem',
  },
};

const disabledStyles: React.CSSProperties = {
  opacity: 0.5,
  cursor: 'not-allowed',
  pointerEvents: 'none',
};

const Spinner: React.FC = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    style={{ animation: 'spin 0.75s linear infinite' }}
  >
    <circle
      cx="8"
      cy="8"
      r="6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="28"
      strokeDashoffset="10"
    />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </svg>
);

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled = false,
  children,
  style,
  ...rest
}) => {
  const isDisabled = disabled || loading;

  const computedStyle: React.CSSProperties = {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...(fullWidth ? { width: '100%' } : {}),
    ...(isDisabled ? disabledStyles : {}),
    ...style,
  };

  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      style={computedStyle}
      {...rest}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
};

export default Button;
