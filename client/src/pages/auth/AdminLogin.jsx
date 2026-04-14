import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      // Call Flask API to validate admin credentials
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        loginAdmin(); // Set admin session in AuthContext
        navigate('/admin');
      } else {
        setError(data.message || 'Invalid admin credentials');
      }
    } catch (err) {
      console.error('Admin Login Error:', err);
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

          {/* Error Display */}
          {error && (
            <div style={{
              padding: '12px 16px', background: 'rgba(239,68,68,0.12)', borderRadius: '10px',
              marginBottom: '16px', fontSize: '14px', color: 'var(--accent-red)', fontWeight: '500'
            }}>
              {error}
            </div>
          )}

          <div className="page-enter">
            <Input
              label="Email Address"
              placeholder="admin@edureach.ai"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              variant="orange"
              style={{ width: '100%', marginTop: '8px', marginBottom: '32px' }}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Secure Login'}
            </Button>
          </div>
        </div>
        <div style={{ height: '6px', backgroundColor: 'var(--accent-blue)', width: '100%' }}></div>
      </Card>
    </div>
  );
}
