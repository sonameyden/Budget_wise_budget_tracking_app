/**
 * AuthContext — global auth state + currency preference.
 * currency is stored in user object and used app-wide via useCurrency().
 */
import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bw_user')); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('bw_token'));

  const login = useCallback((newToken, newUser) => {
    localStorage.setItem('bw_token', newToken);
    localStorage.setItem('bw_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('bw_token');
    localStorage.removeItem('bw_user');
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updates) => {
    const updated = { ...user, ...updates };
    localStorage.setItem('bw_user', JSON.stringify(updated));
    setUser(updated);
  }, [user]);

  // Currency derived from user — defaults to USD
  const currency = user?.currency || 'USD';

  return (
    <AuthContext.Provider value={{
      user, token, currency,
      isAuthenticated: !!token,
      login, logout, updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

/** Convenience hook — use this anywhere you need the active currency */
export const useCurrency = () => {
  const { currency } = useAuth();
  return currency;
};
