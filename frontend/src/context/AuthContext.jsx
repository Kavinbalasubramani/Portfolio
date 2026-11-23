import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('kavin_portfolio_token'));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('kavin_portfolio_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check token validity on mount
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('kavin_portfolio_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.user);  // res is already the JSON body { success, user }
        } catch (err) {
          console.error('Session expired or invalid token:', err);
          logout();
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    // res is already the JSON body: { success, token, user }
    const { token: jwtToken, user: userData } = res;

    localStorage.setItem('kavin_portfolio_token', jwtToken);
    localStorage.setItem('kavin_portfolio_user', JSON.stringify(userData));

    setToken(jwtToken);
    setUser(userData);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('kavin_portfolio_token');
    localStorage.removeItem('kavin_portfolio_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
