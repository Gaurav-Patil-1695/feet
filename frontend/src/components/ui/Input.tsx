import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-sans)',
  fontSize: 'var(--font-size-sm)',
  fontWeight: 600,
  color: 'var(--color-text)',
  marginBottom: '0.375rem',
};

const inputBaseStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  fontFamily: 'var(--font-sans)',
  fontSize: 'var(--font-size-base)',
  color: 'var(--color-text)',
  backgroundColor: 'var(--color-white)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  padding: '0.5rem 0.75rem',
  height: '2.5rem',
  outline: 'none',
  transition: 'border-color 150ms ease, box-shadow 150ms ease',
  boxSizing: 'border-box',
};

const inputErrorStyle: React.CSSProperties = {
  borderColor: 'var(--color-danger)',
};

const hintStyle: React.CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontSize: 'var(--font-size-sm)',
  color: 'var(--color-text-muted)',
  marginTop: '0.25rem',
};

const errorStyle: React.CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontSize: 'var(--font-size-sm)',
  color: 'var(--color-danger)',
  marginTop: '0.25rem',
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, fullWidth = false, id, style, disabled, ...rest }, ref) => {
    const [focused, setFocused] = React.useState(false);

    const wrapperStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      width: fullWidth ? '100%' : undefined,
    };

    const computedInputStyle: React.CSSProperties = {
      ...inputBaseStyle,
      ...(error ? inputErrorStyle : {}),
      ...(focused && !error
        ? {
            borderColor: 'var(--color-primary)',
            boxShadow: '0 0 0 3px var(--color-primary-focus, rgba(59,130,246,0.25))',
          }
        : {}),
      ...(focused && error
        ? {
            boxShadow: '0 0 0 3px var(--color-danger-focus, rgba(239,68,68,0.2))',
          }
        : {}),
      ...(disabled
        ? {
            opacity: 0.5,
            cursor: 'not-allowed',
            backgroundColor: 'var(--color-bg-subtle, #f9fafb)',
          }
        : {}),
      ...style,
    };

    const inputId = id ?? (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div style={wrapperStyle}>
        {label && (
          <label htmlFor={inputId} style={labelStyle}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={
            error
              ? `${inputId}-error`
              : hint
              ? `${inputId}-hint`
              : undefined
          }
          style={computedInputStyle}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          {...rest}
        />
        {error && (
          <span id={`${inputId}-error`} role="alert" style={errorStyle}>
            {error}
          </span>
        )}
        {!error && hint && (
          <span id={`${inputId}-hint`} style={hintStyle}>
            {hint}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
