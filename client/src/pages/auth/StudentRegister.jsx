import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { createUser, updateLastLogin, getUser } from '../../lib/firestore';

export default function StudentRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0: Choice, 1: Auth, 2: Profile
  const [authMode, setAuthMode] = useState('register'); // 'register' or 'signin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('CBSE');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Create/Login Account with Email/Password
  const handleEmailAuth = async () => {
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
      if (authMode === 'register') {
        await createUserWithEmailAndPassword(auth, email, password);
        setStep(2);
      } else {
        const userCredential = await signInWithPopup(auth, new GoogleAuthProvider()); // Placeholder for email login if needed, but the prompt says email/password register
        // Actually, the user asked for "Account Details (Email/Password OR Google)".
        // I should implement signInWithEmailAndPassword too.
      }
    } catch (err) {
      console.error('Auth Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Improved handleEmailRegister
  const handleEmailRegister = async () => {
    setError('');
    if (!email || !password) {
      setError('Please provide both email and password');
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setStep(2);
    } catch (err) {
      setError(err.code === 'auth/email-already-in-use' ? 'Email already in use.' : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async () => {
    setError('');
    if (!email || !password) {
      setError('Please provide both email and password');
      return;
    }
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const existing = await getUser(result.user.uid);
      if (existing) {
        await updateLastLogin(result.user.uid);
        navigate('/student');
      } else {
        setStep(2);
      }
    } catch (err) {
      setError('Invalid email or password');
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
      
      // Check if user already exists in Firestore
      const existing = await getUser(user.uid);
      if (existing) {
        await updateLastLogin(user.uid);
        navigate('/student');
      } else {
        // New user - move to step 2 (Profile Setup)
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

      await createUser(user.uid, {
        name: user.displayName || email.split('@')[0],
        role: 'student',
        email: user.email || email,
        class: selectedClass,
        board: selectedBoard,
        created_at: new Date(),
        doubts_solved: 0,
        notes_uploaded: 0,
        planner_progress: 0,
        pending_assignments: 0
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
    <div className="bg-dots flex-center" style={{ minHeight: '100vh', padding: '24px', backgroundColor: '#000' }}>
      <Card style={{ width: '100%', maxWidth: '440px', padding: '40px', border: '1px solid #333' }}>
        
        {step > 0 && (
          <div onClick={() => setStep(step - 1)} style={{ cursor: 'pointer', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <ArrowLeft size={18} />
            <span style={{ fontSize: '14px' }}>Back</span>
          </div>
        )}

        {step === 0 && (
          <div className="page-enter text-center">
            <GraduationCap size={48} color="#f5c518" style={{ marginBottom: '24px' }} />
            <h2 style={{ fontSize: '28px', marginBottom: '12px' }}>Welcome to EduReach</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Empowering your learning journey with AI.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Button style={{ width: '100%', height: '56px', fontSize: '16px' }} onClick={() => { setStep(1); setAuthMode('register'); }}>
                Create Student Account
              </Button>
              <Button variant="secondary" style={{ width: '100%', height: '56px', fontSize: '16px' }} onClick={() => { setStep(1); setAuthMode('signin'); }}>
                Sign In to Your Account
              </Button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="page-enter">
            <h2 style={{ marginBottom: '8px' }}>{authMode === 'register' ? 'Create Account' : 'Welcome Back'}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '14px' }}>
              {authMode === 'register' ? 'Step 1: Set up your login credentials' : 'Enter your details to continue'}
            </p>

            {error && (
              <div style={{ padding: '12px', background: 'rgba(239,68,68,0.1)', borderRadius: '8px', color: '#ef4444', fontSize: '13px', marginBottom: '20px', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </div>
            )}

            <Button
              variant="secondary"
              style={{ width: '100%', marginBottom: '24px', display: 'flex', gap: '12px', background: '#fff', color: '#000', height: '48px' }}
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px' }} />
              Continue with Google
            </Button>
            
            <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#333' }}></div>
              <span style={{ padding: '0 12px', fontSize: '12px', color: 'var(--text-muted)' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: '#333' }}></div>
            </div>

            <Input
              label="Email Address"
              placeholder="name@email.com"
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
              style={{ width: '100%', marginTop: '8px', height: '48px' }}
              onClick={authMode === 'register' ? handleEmailRegister : handleEmailSignIn}
              disabled={loading}
            >
              {loading ? 'Processing...' : authMode === 'register' ? 'Create Account' : 'Sign In'}
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="page-enter">
            <h2 style={{ marginBottom: '8px' }}>Complete Profile</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '14px' }}>Step 2: Tell us about your academics</p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Current Class</label>
              <select
                className="custom-input"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid #333', color: '#fff', padding: '12px', borderRadius: '8px', appearance: 'none' }}
              >
                <option value="">Select Class</option>
                <option value="10">Class 10</option>
                <option value="12">Class 12</option>
              </select>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Education Board</label>
              <select
                className="custom-input"
                value={selectedBoard}
                onChange={(e) => setSelectedBoard(e.target.value)}
                style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid #333', color: '#fff', padding: '12px', borderRadius: '8px', appearance: 'none' }}
              >
                <option value="CBSE">CBSE</option>
              </select>
            </div>

            <Button
              style={{ width: '100%', height: '48px' }}
              onClick={handleCompleteProfile}
              disabled={loading}
            >
              {loading ? 'Saving Profile...' : 'Start Learning →'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
