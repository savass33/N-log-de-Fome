import React, { createContext } from 'react';
// Lógica completa de auth seria implementada aqui
export const AuthContext = createContext({});
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>
);