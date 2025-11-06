import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}
// Estilo básico em OrdersManagement.css
export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return <button className="btn" {...props}>{children}</button>;
};