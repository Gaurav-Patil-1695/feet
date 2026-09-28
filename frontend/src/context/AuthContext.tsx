import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthUser, TokenPayload } from '../types/auth';

const TOKEN_KEY = 'auth_token';

export interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextValue>({
  token: null,
  user: null,
  login: () => undefined,
  logout: () => undefined,
  isAuthenticated: false,
});

function decodeUser(token: string): AuthUser | null {
  try {
    const payload = jwtDecode<TokenPayload>(token);
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      name: payload.name,
    };
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY);
  });

  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) return null;
    return decodeUser(stored);
  });

  useEffect(() => {
    if (token) {
      const decoded = decodeUser(token);
      if (decoded) {
        localStorage.setItem(TOKEN_KEY, token);
        setUser(decoded);
      } else {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      }
    } else {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    }
  }, [token]);

  const login = useCallback((newToken: string) => {
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
  }, []);

  const isAuthenticated = useMemo(() => {
    return token !== null && user !== null;
  }, [token, user]);

  const value = useMemo<AuthContextValue>(() => ({
    token,
    user,
    login,
    logout,
    isAuthenticated,
  }), [token, user, login, logout, isAuthenticated]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
