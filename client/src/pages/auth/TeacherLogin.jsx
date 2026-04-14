import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { verifySchoolCode, createUser, updateLastLogin, getUser, incrementTeacherCount } from '../../lib/firestore';

export default function TeacherLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [schoolCode, setSchoolCode] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email || !schoolCode) {
      setError('Please enter both email and school code');
      return;
    }

    setLoading(true);
    try {
      // Step 1: Verify school code exists in Firestore
      const codeResult = await verifySchoolCode(schoolCode.toUpperCase());
      if (!codeResult.valid) {
        setError(codeResult.reason);
        setLoading(false);
        return;
      }

      // Step 2: Sign in with Firebase Auth (Email/Password)
      if (!password) {
        setError('Please enter your password');
        setLoading(false);
        return;
      }

      const userCred = await signInWithEmailAndPassword(auth, email, password);
      
      // Step 3: Verify user is a teacher with this school code
      const profile = await getUser(userCred.user.uid);
      if (profile && profile.role !== 'teacher') {
        setError('This account is not registered as a teacher');
        await auth.signOut();
        setLoading(false);
        return;
      }

      if (profile && profile.school_code !== schoolCode.toUpperCase()) {
        setError('School code does not match your account');
        await auth.signOut();
        setLoading(false);
        return;
      }

      // Update last login
      await updateLastLogin(userCred.user.uid);
      navigate('/teacher');
    } catch (err) {
      console.error('Login Error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Invalid credentials. Register first if you are a new teacher.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError('');
    if (!email || !schoolCode || !password || !name) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      // Step 1: Verify school code
      const codeResult = await verifySchoolCode(schoolCode.toUpperCase());
      if (!codeResult.valid) {
        setError(codeResult.reason);
        setLoading(false);
        return;
      }

      // Step 2: Create Firebase Auth account
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      // Step 3: Create Firestore user document
      await createUser(userCred.user.uid, {
        name: name,
        role: 'teacher',
        email: email,
        school_code: schoolCode.toUpperCase(),
        teacher_id: `TCH-${userCred.user.uid.substring(0, 6).toUpperCase()}`,
      });

      // Step 4: Increment teacher count for the school
      await incrementTeacherCount(schoolCode.toUpperCase());

      navigate('/teacher');
    } catch (err) {
      console.error('Register Error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already registered. Please login instead.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Use at least 6 characters.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

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
          <div style={{ width: '300px', height: '240px', background: 'var(--bg-tertiary)', borderRadius: '24px', position: 'relative', overflow: 'hidden', border: '2px solid rgba(37, 99, 235, 0.2)' }}>
            <div style={{ position: 'absolute', bottom: '-40px', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '200px', background: 'var(--accent-blue)', borderRadius: '50%', opacity: 0.1 }}></div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
        <div style={{ width: '100%', maxWidth: '400px' }} className="page-enter">
          <h2 style={{ marginBottom: '8px' }}>
            {isRegistering ? 'Teacher Registration' : 'Teacher Login'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
            {isRegistering ? 'Create your teacher account with a valid school code.' : 'Access your classroom tools and analytics.'}
          </p>

          {/* Error Display */}
          {error && (
            <div style={{
              padding: '12px 16px', background: 'rgba(239,68,68,0.12)', borderRadius: '10px',
              marginBottom: '16px', fontSize: '14px', color: 'var(--accent-red)', fontWeight: '500'
            }}>
              {error}
            </div>
          )}

          {isRegistering && (
            <Input
              label="Full Name"
              placeholder="Mr. Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <Input
            label="Email Address"
            placeholder="alex@school.edu"
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

          <Input
            label="School Code"
            placeholder="e.g. DPS-AGR"
            value={schoolCode}
            onChange={(e) => setSchoolCode(e.target.value)}
          />

          <Button
            variant="purple"
            style={{ width: '100%', marginBottom: '16px' }}
            onClick={isRegistering ? handleRegister : handleLogin}
            disabled={loading}
          >
            {loading
              ? (isRegistering ? 'Registering...' : 'Logging in...')
              : (isRegistering ? 'Register as Teacher' : 'Login to Portal')
            }
          </Button>

          <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
            {isRegistering ? (
              <>
                Already have an account?{' '}
                <span
                  onClick={() => { setIsRegistering(false); setError(''); }}
                  style={{ color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: '600' }}
                >
                  Login here
                </span>
              </>
            ) : (
              <>
                New teacher?{' '}
                <span
                  onClick={() => { setIsRegistering(true); setError(''); }}
                  style={{ color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: '600' }}
                >
                  Register with School Code
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
