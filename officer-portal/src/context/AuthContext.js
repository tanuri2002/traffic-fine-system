import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const isMockAuth = process.env.REACT_APP_MOCK_AUTH === 'true';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [officer, setOfficer] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('officerToken') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('officerToken');
    const storedOfficer = localStorage.getItem('officerData');
    if (storedToken && storedOfficer) {
      if (isMockAuth) {
        setToken(storedToken);
        setOfficer(JSON.parse(storedOfficer));
      } else {
        try {
          const decoded = jwtDecode(storedToken);
          if (decoded.exp * 1000 > Date.now()) {
            setToken(storedToken);
            setOfficer(JSON.parse(storedOfficer));
          } else {
            localStorage.removeItem('officerToken');
            localStorage.removeItem('officerData');
          }
        } catch {
          localStorage.removeItem('officerToken');
          localStorage.removeItem('officerData');
        }
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken, officerData) => {
    localStorage.setItem('officerToken', newToken);
    localStorage.setItem('officerData', JSON.stringify(officerData));
    setToken(newToken);
    setOfficer(officerData);
  };

  const logout = () => {
    localStorage.removeItem('officerToken');
    localStorage.removeItem('officerData');
    setToken(null);
    setOfficer(null);
  };

  return (
    <AuthContext.Provider value={{ officer, token, loading, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;