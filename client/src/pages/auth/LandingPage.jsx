import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, User, GraduationCap, Shield } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-dots flex-center" style={{ minHeight: '100vh', flexDirection: 'column', padding: '32px' }}>
      
      <div style={{ position: 'absolute', top: '32px', left: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <GraduationCap size={28} color="var(--accent-blue)" />
        <span style={{ fontFamily: 'Fraunces', fontSize: '20px', fontWeight: '700', color: 'var(--accent-blue)' }}>EduReach AI</span>
      </div>

      <div style={{ position: 'absolute', top: '32px', right: '32px' }}>
        <div style={{ background: '#fff', borderRadius: '999px', border: '1px solid var(--border)', padding: '4px', display: 'flex', gap: '4px' }}>
          <span style={{ padding: '4px 12px', background: 'var(--accent-blue)', color: '#fff', borderRadius: '999px', fontSize: '13px', fontWeight: '600' }}>EN</span>
          <span style={{ padding: '4px 12px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600' }}>HI</span>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '48px', maxWidth: '600px' }}>
        <h1 style={{ marginBottom: '16px' }}>Your AI Study Companion</h1>
        <p style={{ fontSize: '18px', lineHeight: '1.6' }}>
          A premium, intelligent platform designed to empower students, teachers, and administrators across India with data-driven insights.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', width: '100%', maxWidth: '1000px' }}>
        
        {/* Student Card */}
        <Card hover style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderTop: '4px solid var(--accent-blue)' }}>
          <div style={{ background: 'var(--accent-blue-light)', padding: '16px', borderRadius: '50%', marginBottom: '20px', color: 'var(--accent-blue)' }}>
            <User size={32} />
          </div>
          <h2 style={{ marginBottom: '12px' }}>Student</h2>
          <p style={{ marginBottom: '24px', flex: 1 }}>Access AI-powered tools like doubt solver, notes chatbot, and exam planners.</p>
          <Button style={{ width: '100%' }} onClick={() => navigate('/register/student')}>Login / Register</Button>
        </Card>

        {/* Teacher Card */}
        <Card hover style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderTop: '4px solid var(--accent-purple)' }}>
          <div style={{ background: '#F3E8FF', padding: '16px', borderRadius: '50%', marginBottom: '20px', color: 'var(--accent-purple)' }}>
            <BookOpen size={32} />
          </div>
          <h2 style={{ marginBottom: '12px' }}>Teacher</h2>
          <p style={{ marginBottom: '24px', flex: 1 }}>Generate quizzes with AI, track student progress, and manage assignments.</p>
          <Button variant="purple" style={{ width: '100%' }} onClick={() => navigate('/login/teacher')}>Teacher Login</Button>
        </Card>

        {/* Admin Card */}
        <Card hover style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderTop: '4px solid var(--accent-orange)' }}>
          <div style={{ background: '#FFEDD5', padding: '16px', borderRadius: '50%', marginBottom: '20px', color: 'var(--accent-orange)' }}>
            <Shield size={32} />
          </div>
          <h2 style={{ marginBottom: '12px' }}>Admin</h2>
          <p style={{ marginBottom: '24px', flex: 1 }}>Manage institutions, control feature toggles, and view platform analytics.</p>
          <Button variant="orange" style={{ width: '100%' }} onClick={() => navigate('/login/admin')}>Admin Login</Button>
        </Card>

      </div>

      <div style={{ marginTop: '48px', color: 'var(--text-muted)', fontSize: '14px' }}>
        Trusted by students across India 🇮🇳
      </div>

    </div>
  );
}
