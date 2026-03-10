import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';

export default function TeacherLogin() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      {/* Left Panel */}
      <div style={{ flex: '0 0 40%', backgroundColor: 'var(--accent-blue-light)', display: 'flex', flexDirection: 'column', padding: '48px', justifyContent: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '32px', left: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={24} color="var(--accent-blue)" />
          <span style={{ fontFamily: 'Fraunces', fontSize: '18px', fontWeight: '700', color: 'var(--accent-blue)' }}>EduReach AI</span>
        </div>
        
        <h1 style={{ color: 'var(--accent-blue)', fontSize: '36px', lineHeight: '1.3', maxWidth: '400px', marginTop: 'auto' }}>
          Empower every student with data.
        </h1>
        
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center' }}>
          {/* Mock Illustration Placeholder */}
          <div style={{ width: '300px', height: '240px', background: 'var(--bg-tertiary)', borderRadius: '24px', position: 'relative', overflow: 'hidden', border: '2px solid rgba(37, 99, 235, 0.2)' }}>
            <div style={{ position: 'absolute', bottom: '-40px', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '200px', background: 'var(--accent-blue)', borderRadius: '50%', opacity: 0.1 }}></div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
        <div style={{ width: '100%', maxWidth: '400px' }} className="page-enter">
          <h2 style={{ marginBottom: '8px' }}>Teacher Login</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Access your classroom tools and analytics.</p>

          <Input label="Email Address" placeholder="alex@school.edu" type="email" />
          <Input label="School Code" placeholder="e.g. DPS-AGR" />
          
          <div style={{ margin: '24px 0', borderTop: '1px solid var(--border)', position: 'relative' }}>
            <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: 'var(--bg-secondary)', padding: '0 12px', fontSize: '12px', color: 'var(--text-muted)' }}>OR</span>
          </div>

          <Button variant="secondary" style={{ width: '100%', marginBottom: '24px' }}>Login with OTP instead</Button>

          <Button variant="purple" style={{ width: '100%', marginBottom: '24px' }} onClick={() => navigate('/teacher')}>Login to Portal</Button>

          <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
            Don't have an account? <span style={{ color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: '600' }}>Contact your admin</span>
          </p>
        </div>
      </div>
    </div>
  );
}
