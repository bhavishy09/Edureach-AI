import React from 'react';
import './Button.css';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '48px',
    borderRadius: '999px',
    fontSize: '15px',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
    transition: 'transform 100ms ease, background-color 150ms ease, box-shadow 150ms ease',
    padding: '0 24px',
    userSelect: 'none'
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--accent-blue)',
      color: '#ffffff',
      boxShadow: '0 4px 14px 0 rgba(225, 29, 116, 0.39)'
    },
    secondary: {
      backgroundColor: 'transparent',
      color: 'var(--text-primary)',
      border: '2px solid var(--border)',
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
