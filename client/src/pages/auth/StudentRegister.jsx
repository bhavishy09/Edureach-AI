import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';

export default function StudentRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  return (
    <div className="bg-dots flex-center" style={{ minHeight: '100vh', padding: '24px' }}>
      <div style={{ position: 'absolute', top: '24px', right: '24px' }}>
        <div style={{ background: '#fff', borderRadius: '999px', border: '1px solid var(--border)', padding: '4px', display: 'flex', gap: '4px' }}>
          <span style={{ padding: '4px 12px', background: 'var(--accent-blue)', color: '#fff', borderRadius: '999px', fontSize: '13px', fontWeight: '600' }}>EN</span>
          <span style={{ padding: '4px 12px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600' }}>HI</span>
        </div>
      </div>

      <Card style={{ width: '100%', maxWidth: '440px', padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div onClick={() => step > 1 ? setStep(step - 1) : navigate('/')} style={{ cursor: 'pointer', padding: '8px', background: 'var(--bg-tertiary)', borderRadius: '50%' }}>
            <ArrowLeft size={20} color="var(--text-primary)" />
          </div>
          <h2 style={{ margin: 0 }}>Create Student Account</h2>
        </div>

        {/* Stepper */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          {['Mobile OTP', 'Class & Board', 'Done'].map((s, i) => (
            <div key={s} style={{ 
              flex: 1, 
              textAlign: 'center', 
              padding: '8px 0', 
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: '600',
              backgroundColor: step >= i + 1 ? 'var(--accent-blue-light)' : 'var(--bg-tertiary)',
              color: step >= i + 1 ? 'var(--accent-blue)' : 'var(--text-muted)'
            }}>
              {s}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="page-enter">
            <Input label="Mobile Number" placeholder="+91" type="tel" />
            <Button style={{ width: '100%', marginTop: '8px' }} onClick={() => setStep(2)}>Send OTP</Button>
          </div>
        )}

        {step === 2 && (
          <div className="page-enter" style={{ textAlign: 'center' }}>
            <p style={{ marginBottom: '16px', fontSize: '14px' }}>Enter the 6-digit code sent to your mobile</p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
              {[1,2,3,4,5,6].map(i => (
                <input key={i} className="mono" maxLength={1} style={{
                  width: '48px', height: '56px', fontSize: '24px', textAlign: 'center', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-tertiary)'
                }} />
              ))}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>Resend in 0:45</p>
            <Button style={{ width: '100%' }} onClick={() => setStep(3)}>Verify OTP</Button>
          </div>
        )}

        {step === 3 && (
          <div className="page-enter">
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>Select Class</label>
              <select className="custom-input" style={{ width: '100%', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%20%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M6%209L12%2015L18%209%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}>
                <option value="">Select Class</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>Select Board</label>
              <select className="custom-input" style={{ width: '100%', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%20%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M6%209L12%2015L18%209%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}>
                <option value="">Select Board</option>
                <option value="cbse">CBSE</option>
                <option value="icse">ICSE</option>
                <option value="state_up">State Board UP</option>
                <option value="state_bihar">State Board Bihar</option>
                <option value="other">Other</option>
              </select>
            </div>
            <Button style={{ width: '100%' }} onClick={() => navigate('/student')}>Create Account</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
