import React from "react";
// Estilo básico pode ser adicionado em globals.css
export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props
) => {
  return <input className="input-field" {...props} />;
};
