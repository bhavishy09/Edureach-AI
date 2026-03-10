import React from 'react';
import './Input.css';

export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className={`input-wrapper ${className}`} style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column' }}>
      {label && <label style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>{label}</label>}
      <input className="custom-input" {...props} />
      {error && <span style={{ fontSize: '12px', color: 'var(--accent-red)', marginTop: '4px' }}>{error}</span>}
    </div>
  );
}
