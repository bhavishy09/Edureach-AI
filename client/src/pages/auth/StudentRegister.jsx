import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { createUser, updateLastLogin, getUser } from '../../lib/firestore';

export default function StudentRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Create Account with Email/Password
  const handleEmailRegister = async () => {
    setError('');
    if (!email || !password) {
      setError('Please provide both email and password');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Success, move to step 2 (class & board)
      setStep(2);
    } catch (err) {
      console.error('Register Error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use. Please login instead.');
      } else {
        setError(`Registration failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Login/Register with Google
  const handleGoogleSignIn = async () => {
    setError('');
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user already exists
      const existing = await getUser(user.uid);
      if (existing) {
        // Returning user - update login and go to dashboard
        await updateLastLogin(user.uid);
        navigate('/student');
      } else {
        // New user - move to step 2
        setStep(2);
      }
    } catch (err) {
      console.error('Google Sign In Error:', err);
      setError(`Google Sign In failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Save profile & go to dashboard
  const handleCompleteProfile = async () => {
    setError('');
    if (!selectedClass || !selectedBoard) {
      setError('Please select both class and board');
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      // Create Firestore document
      await createUser(user.uid, {
        name: user.displayName || '',
        role: 'student',
        email: user.email || email,
        class: selectedClass,
        board: selectedBoard,
      });

      navigate('/student');
    } catch (err) {
      console.error('Profile Error:', err);
      setError('Failed to setup profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          <div onClick={() => step === 2 ? setStep(1) : navigate('/')} style={{ cursor: 'pointer', padding: '8px', background: 'var(--bg-tertiary)', borderRadius: '50%' }}>
            <ArrowLeft size={20} color="var(--text-primary)" />
          </div>
          <h2 style={{ margin: 0 }}>Create Student Account</h2>
        </div>

        {/* Stepper */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          {['Account Details', 'Class & Board'].map((s, i) => (
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

        {/* Error Display */}
        {error && (
          <div style={{
            padding: '12px 16px', background: 'rgba(239,68,68,0.12)', borderRadius: '10px',
            marginBottom: '16px', fontSize: '14px', color: 'var(--accent-red)', fontWeight: '500'
          }}>
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="page-enter">
            <Button
              variant="secondary"
              style={{ width: '100%', marginBottom: '24px', display: 'flex', gap: '12px', background: '#fff', color: '#000' }}
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px' }} />
              {loading ? 'Connecting...' : 'Sign in with Google'}
            </Button>
            
            <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
              <span style={{ padding: '0 12px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>OR EMAIL</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
            </div>

            <Input
              label="Email Address"
              placeholder="student@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <Input
              label="Password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <Button
              style={{ width: '100%', marginTop: '8px' }}
              onClick={handleEmailRegister}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Continue with Email'}
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="page-enter">
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>Select Class</label>
              <select
                className="custom-input"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                style={{ width: '100%', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%20%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M6%209L12%2015L18%209%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
              >
                <option value="">Select Class</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>Select Board</label>
              <select
                className="custom-input"
                value={selectedBoard}
                onChange={(e) => setSelectedBoard(e.target.value)}
                style={{ width: '100%', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%20%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M6%209L12%2015L18%209%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
              >
                <option value="">Select Board</option>
                <option value="cbse">CBSE</option>
                <option value="icse">ICSE</option>
                <option value="state_up">State Board UP</option>
                <option value="state_bihar">State Board Bihar</option>
                <option value="other">Other</option>
              </select>
            </div>
            <Button
              style={{ width: '100%' }}
              onClick={handleCompleteProfile}
              disabled={loading}
            >
              {loading ? 'Setting up...' : 'Complete Profile'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
