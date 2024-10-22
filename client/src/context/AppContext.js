import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const adminLogin = () => {
    setIsAdminLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAdminLoggedIn(false);
    setUser(null);
  };

  return (
    <AppContext.Provider value={{ isLoggedIn, isAdminLoggedIn, user, login, adminLogin, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
