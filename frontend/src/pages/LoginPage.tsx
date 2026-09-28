import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { useAuth } from '../hooks/useAuth';

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [values, setValues] = useState<LoginFormValues>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from =
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ||
    '/dashboard';

  const validate = (): LoginFormErrors => {
    const newErrors: LoginFormErrors = {};

    if (!values.email.trim()) {
      newErrors.email = 'Enter a valid email address.';
    } else if (values.email.length > 254) {
      newErrors.email = 'Enter a valid email address.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(values.email)) {
        newErrors.email = 'Enter a valid email address.';
      }
    }

    if (!values.password) {
      newErrors.password = 'Password must be at least 8 characters.';
    } else if (values.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof LoginFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (serverError) {
      setServerError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    try {
      await login({ email: values.email, password: values.password });
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Invalid email or password. Please try again.';
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <p
        style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-muted)',
          marginBottom: 'var(--space-6)',
        }}
      >
        Enter your credentials to access the depot dashboard.
      </p>

      {serverError && (
        <Alert variant="error" style={{ marginBottom: 'var(--space-4)' }}>
          {serverError}
        </Alert>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <label
            htmlFor="login-email"
            style={{
              display: 'block',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-body)',
              marginBottom: 'var(--space-2)',
            }}
          >
            Email address
          </label>
          <Input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={handleChange}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
            aria-invalid={!!errors.email}
            placeholder="you@example.com"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p
              id="login-email-error"
              role="alert"
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-error)',
                marginTop: 'var(--space-1)',
                marginBottom: 0,
              }}
            >
              {errors.email}
            </p>
          )}
        </div>

        <div style={{ marginBottom: 'var(--space-6)' }}>
          <label
            htmlFor="login-password"
            style={{
              display: 'block',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-body)',
              marginBottom: 'var(--space-2)',
            }}
          >
            Password
          </label>
          <Input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={values.password}
            onChange={handleChange}
            aria-describedby={errors.password ? 'login-password-error' : undefined}
            aria-invalid={!!errors.password}
            placeholder="••••••••"
            disabled={isSubmitting}
          />
          {errors.password && (
            <p
              id="login-password-error"
              role="alert"
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-error)',
                marginTop: 'var(--space-1)',
                marginBottom: 0,
              }}
            >
              {errors.password}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          style={{ width: '100%' }}
        >
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
