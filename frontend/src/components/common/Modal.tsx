import React from 'react';
export const Modal: React.FC<{ children: React.ReactNode; isOpen: boolean; onClose: () => void; }> = ({ isOpen, children }) => {
  if (!isOpen) return null;
  return <div className="modal-backdrop">{children}</div>;
};