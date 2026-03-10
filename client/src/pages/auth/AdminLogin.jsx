import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [show2FA, setShow2FA] = useState(false);

  return (
    <div className="bg-dots flex-center" style={{ minHeight: '100vh', padding: '24px' }}>
      <Card style={{ width: '100%', maxWidth: '440px', padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '32px 32px 0 32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
            <div style={{ background: 'var(--accent-orange)', padding: '12px', borderRadius: '16px', marginBottom: '16px', color: '#fff' }}>
              <Shield size={32} />
            </div>
            <h2 style={{ textAlign: 'center', margin: 0 }}>Admin Portal</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>Authorized personnel only</p>
          </div>

          <div className="page-enter">
            <Input label="Email Address" placeholder="admin@edureach.ai" type="email" />
            <Input label="Password" type="password" placeholder="••••••••" />
            
            {!show2FA ? (
              <Button variant="secondary" style={{ width: '100%', marginTop: '8px', marginBottom: '32px' }} onClick={() => setShow2FA(true)}>
                Send 2FA Code
              </Button>
            ) : (
              <div className="page-enter" style={{ marginTop: '16px', marginBottom: '32px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>Enter 6-digit OTP (JetBrains Mono)</label>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                  {[1,2,3,4,5,6].map(i => (
                    <input key={i} className="mono" maxLength={1} style={{
                      width: '44px', height: '52px', fontSize: '20px', textAlign: 'center', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-tertiary)'
                    }} />
                  ))}
                </div>
              </div>
            )}

            <Button variant="orange" style={{ width: '100%', marginBottom: '32px' }} onClick={() => navigate('/admin')}>
              Secure Login
            </Button>
          </div>
        </div>
        <div style={{ height: '6px', backgroundColor: 'var(--accent-blue)', width: '100%' }}></div>
      </Card>
    </div>
  );
}
