import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export default function PublicNavbar() {
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '70px',
      backgroundColor: 'var(--bg-primary)',
      borderBottom: '1px solid var(--accent-blue)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <GraduationCap size={28} color="var(--accent-blue)" />
        <span style={{ fontFamily: 'Fraunces', fontSize: '20px', fontWeight: '700', color: 'var(--accent-blue)' }}>EduReach AI</span>
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <Link 
          to="/" 
          style={{
            color: '#fff',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.color = 'var(--accent-blue)'}
          onMouseLeave={(e) => e.target.style.color = '#fff'}
        >
          Home
        </Link>
        <Link 
          to="/about" 
          style={{
            color: '#fff',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.color = 'var(--accent-blue)'}
          onMouseLeave={(e) => e.target.style.color = '#fff'}
        >
          About
        </Link>
      </div>
    </nav>
  );
}
