import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import "./Layout.css";
import { useAuth } from "../../hooks/useAuth";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();

  // O App.tsx já cuida disso, mas é uma boa garantia.
  if (!user) {
    return null;
  }

  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
};
