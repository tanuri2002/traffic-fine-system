import React, { createContext, useState, useEffect, useCallback } from 'react';

const isMockAuth =
  process.env.REACT_APP_MOCK_AUTH === 'true' ||
  process.env.REACT_APP_USE_MOCK === 'true';

/**
 * Decode a JWT payload without extra dependencies.
 * Uses built‑in Base64 decoding (atob) with URL‑safe char replacements.
 */
function decodeJwtPayload(token) {
  try {
    const payloadBase64 = token.split('.')[1];
    const json = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [officer, setOfficer] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('officerToken');
    const storedOfficer = localStorage.getItem('officerData');
    if (storedToken && storedOfficer) {
      if (isMockAuth) {
        setToken(storedToken);
        setOfficer(JSON.parse(storedOfficer));
      } else {
        const decoded = decodeJwtPayload(storedToken);
        if (decoded && decoded.exp * 1000 > Date.now()) {
          setToken(storedToken);
          setOfficer(JSON.parse(storedOfficer));
        } else {
          localStorage.removeItem('officerToken');
          localStorage.removeItem('officerData');
        }
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((newToken, officerData) => {
    localStorage.setItem('officerToken', newToken);
    localStorage.setItem('officerData', JSON.stringify(officerData));
    setToken(newToken);
    setOfficer(officerData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('officerToken');
    localStorage.removeItem('officerData');
    setToken(null);
    setOfficer(null);
  }, []);

  const value = {
    officer,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;

