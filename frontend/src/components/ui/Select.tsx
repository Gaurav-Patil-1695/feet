import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
  options: SelectOption[];
  placeholder?: string;
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-sans)',
  fontSize: 'var(--font-size-sm)',
  fontWeight: 600,
  color: 'var(--color-text)',
  marginBottom: '0.375rem',
};

const selectBaseStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  fontFamily: 'var(--font-sans)',
  fontSize: 'var(--font-size-base)',
  color: 'var(--color-text)',
  backgroundColor: 'var(--color-white)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  padding: '0.5rem 2.25rem 0.5rem 0.75rem',
  height: '2.5rem',
  outline: 'none',
  transition: 'border-color 150ms ease, box-shadow 150ms ease',
  boxSizing: 'border-box',
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  backgroundImage:
    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M4 6l4 4 4-4' stroke='%236B7280' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 0.625rem center',
  backgroundSize: '1rem',
  cursor: 'pointer',
};

const selectErrorStyle: React.CSSProperties = {
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

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      fullWidth = false,
      options,
      placeholder,
      id,
      style,
      disabled,
      ...rest
    },
    ref
  ) => {
    const [focused, setFocused] = React.useState(false);

    const wrapperStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      width: fullWidth ? '100%' : undefined,
    };

    const computedSelectStyle: React.CSSProperties = {
      ...selectBaseStyle,
      ...(error ? selectErrorStyle : {}),
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

    const selectId =
      id ?? (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div style={wrapperStyle}>
        {label && (
          <label htmlFor={selectId} style={labelStyle}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={
            error
              ? `${selectId}-error`
              : hint
              ? `${selectId}-hint`
              : undefined
          }
          style={computedSelectStyle}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <span id={`${selectId}-error`} role="alert" style={errorStyle}>
            {error}
          </span>
        )}
        {!error && hint && (
          <span id={`${selectId}-hint`} style={hintStyle}>
            {hint}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
