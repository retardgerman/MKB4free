// components/Button.tsx
import React, { ButtonHTMLAttributes, ReactNode } from 'react';

// Definiere die Typen für die Button-Props
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-md focus:outline-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
