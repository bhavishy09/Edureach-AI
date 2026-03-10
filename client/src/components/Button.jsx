import React from 'react';
import './Button.css';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '40px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'transform 100ms ease, background-color 150ms ease, box-shadow 150ms ease',
    padding: '0 16px',
    userSelect: 'none'
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--accent-blue)',
      color: '#ffffff',
      boxShadow: 'var(--shadow-sm)'
    },
    secondary: {
      backgroundColor: '#ffffff',
      color: 'var(--accent-blue)',
      border: '1px solid var(--accent-blue)',
    },
    danger: {
      backgroundColor: 'var(--accent-red)',
      color: '#ffffff',
    },
    purple: {
      backgroundColor: 'var(--accent-purple)',
      color: '#ffffff',
      boxShadow: 'var(--shadow-sm)'
    },
    orange: {
      backgroundColor: 'var(--accent-orange)',
      color: '#ffffff',
      boxShadow: 'var(--shadow-sm)'
    }
  };

  const { style: customStyle, ...restProps } = props;

  return (
    <button 
      style={{ ...baseStyle, ...variants[variant], ...customStyle }} 
      className={`btn-hover ${className}`} 
      {...restProps}
    >
      {children}
    </button>
  );
}
