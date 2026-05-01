import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-primary)',
      borderTop: '1px solid var(--accent-blue)',
      padding: '40px 24px',
      textAlign: 'center',
      marginTop: 'auto'
    }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ margin: 0, color: 'var(--accent-blue)', fontFamily: 'Fraunces', fontSize: '24px' }}>EduReach AI</h3>
        <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)' }}>Empowering Indian Students with AI — One Doubt at a Time.</p>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '24px' }}>
        <a 
          href="https://github.com/bhavishy09/Edureach-AI" 
          target="_blank" 
          rel="noreferrer"
          style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: '500' }}
          onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
          onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
        >
          GitHub
        </a>
        <a 
          href="https://www.linkedin.com/in/bhavishy09/" 
          target="_blank" 
          rel="noreferrer"
          style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: '500' }}
          onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
          onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
        >
          LinkedIn
        </a>
      </div>

      <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
        © 2026 EduReach AI. Built with ❤️ for Indian Students.
      </div>
    </footer>
  );
}
