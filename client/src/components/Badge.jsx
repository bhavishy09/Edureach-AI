import React from 'react';

export default function Badge({ children, variant = 'info', className = '', ...props }) {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 8px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const variants = {
    success: { backgroundColor: '#D1FAE5', color: '#065F46' },
    warning: { backgroundColor: '#FEF3C7', color: '#92400E' },
    error: { backgroundColor: '#FEE2E2', color: '#991B1B' },
    info: { backgroundColor: '#DBEAFE', color: '#1E40AF' },
    purple: { backgroundColor: '#EDE9FE', color: '#5B21B6' },
    orange: { backgroundColor: '#FFEDD5', color: '#9A3412' }
  };

  return (
    <span style={{ ...baseStyle, ...variants[variant] }} className={className} {...props}>
      {children}
    </span>
  );
}
