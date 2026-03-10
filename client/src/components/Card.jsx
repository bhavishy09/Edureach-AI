import React from 'react';

export default function Card({ children, className = '', hover = false, ...props }) {
  const style = {
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow-sm)',
    transition: hover ? 'transform 150ms ease, box-shadow 150ms ease' : 'none'
  };

  const { style: customStyle, ...restProps } = props;

  return (
    <div 
      style={{ ...style, ...customStyle }} 
      className={`card ${hover ? 'card-hover' : ''} ${className}`} 
      {...restProps}
    >
      {children}
    </div>
  );
}
