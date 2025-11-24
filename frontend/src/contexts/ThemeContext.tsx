import React, { createContext } from 'react';
export const ThemeContext = createContext({});
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeContext.Provider value={{}}>{children}</ThemeContext.Provider>
);