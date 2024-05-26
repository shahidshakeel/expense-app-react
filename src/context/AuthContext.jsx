import PropTypes from 'prop-types';
import React, { useMemo, useState, createContext } from 'react';

const AuthContext = createContext({ isAuthenticated: false });

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Set the initial state based on localStorage directly during initialization
    const storedAuth = localStorage.getItem('isAuthenticated');
    return storedAuth === 'true';
  });

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
    }),
    [isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
