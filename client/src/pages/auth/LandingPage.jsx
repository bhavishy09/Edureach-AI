import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, User, GraduationCap, Shield, Target, Calendar, FileText } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import PublicNavbar from '../../components/PublicNavbar';
import Footer from '../../components/Footer';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <PublicNavbar />

      <main className="bg-dots" style={{ flex: 1, paddingTop: '100px', paddingBottom: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* SECTION 1 - HERO */}
        <section style={{ textAlign: 'center', marginBottom: '80px', maxWidth: '600px', padding: '0 24px' }}>
          <h1 style={{ marginBottom: '16px', color: '#fff' }}>Your AI Study Companion</h1>
          <p style={{ fontSize: '18px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
            A premium, intelligent platform designed to empower students, teachers, and administrators across India with data-driven insights.
          </p>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', width: '100%', maxWidth: '1000px', padding: '0 24px', marginBottom: '100px' }}>
          {/* Student Card */}
          <Card hover style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderTop: '4px solid var(--accent-blue)' }}>
            <div style={{ background: 'var(--accent-blue-light)', padding: '16px', borderRadius: '50%', marginBottom: '20px', color: 'var(--accent-blue)' }}>
              <User size={32} />
            </div>
            <h2 style={{ marginBottom: '12px', color: '#fff' }}>Student</h2>
            <p style={{ marginBottom: '24px', flex: 1, color: 'var(--text-secondary)' }}>Access AI-powered tools like doubt solver, notes chatbot, and exam planners.</p>
            <Button style={{ width: '100%' }} onClick={() => navigate('/register/student')}>Login / Register</Button>
          </Card>

          {/* Teacher Card */}
          <Card hover style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderTop: '4px solid var(--accent-purple)' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.15)', padding: '16px', borderRadius: '50%', marginBottom: '20px', color: 'var(--accent-purple)' }}>
              <BookOpen size={32} />
            </div>
            <h2 style={{ marginBottom: '12px', color: '#fff' }}>Teacher</h2>
            <p style={{ marginBottom: '24px', flex: 1, color: 'var(--text-secondary)' }}>Generate quizzes with AI, track student progress, and manage assignments.</p>
            <Button variant="purple" style={{ width: '100%' }} onClick={() => navigate('/login/teacher')}>Teacher Login</Button>
          </Card>

          {/* Admin Card */}
          <Card hover style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderTop: '4px solid var(--accent-orange)' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '16px', borderRadius: '50%', marginBottom: '20px', color: 'var(--accent-orange)' }}>
              <Shield size={32} />
            </div>
            <h2 style={{ marginBottom: '12px', color: '#fff' }}>Admin</h2>
            <p style={{ marginBottom: '24px', flex: 1, color: 'var(--text-secondary)' }}>Manage institutions, control feature toggles, and view platform analytics.</p>
            <Button variant="orange" style={{ width: '100%' }} onClick={() => navigate('/login/admin')}>Admin Login</Button>
          </Card>
        </section>

        {/* SECTION 2 - ABOUT THE PROJECT */}
        <section style={{ width: '100%', maxWidth: '1000px', padding: '0 24px', marginBottom: '100px' }}>
          <h2 style={{ marginBottom: '24px', color: '#fff', textAlign: 'center' }}>What is EduReach AI?</h2>
          <Card style={{ borderLeft: '4px solid var(--accent-blue)', padding: '32px' }}>
            <p style={{ fontSize: '18px', lineHeight: '1.6', color: 'var(--text-primary)', margin: 0 }}>
              An AI-powered educational platform for Class 10 and 12 students in India, offering intelligent tools like a Doubt Solver, Exam Planner, and Notes Summarizer.
            </p>
          </Card>
        </section>

        {/* SECTION 3 - OBJECTIVES */}
        <section style={{ width: '100%', maxWidth: '1000px', padding: '0 24px', marginBottom: '64px' }}>
          <h2 style={{ marginBottom: '32px', color: '#fff', textAlign: 'center' }}>Our Objectives</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>

            <Card hover style={{ borderTop: '4px solid var(--accent-blue)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ color: 'var(--accent-blue)', marginBottom: '16px' }}>
                <Target size={40} />
              </div>
              <h3 style={{ color: '#fff', marginBottom: '12px' }}>Instant Doubt Resolution</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Provide stepwise NCERT solutions for Class 10 & 12 students instantly using AI.</p>
            </Card>

            <Card hover style={{ borderTop: '4px solid var(--accent-blue)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ color: 'var(--accent-blue)', marginBottom: '16px' }}>
                <Calendar size={40} />
              </div>
              <h3 style={{ color: '#fff', marginBottom: '12px' }}>Smart Exam Planning</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Generate personalized day-wise study roadmaps based on student schedule and syllabus.</p>
            </Card>

            <Card hover style={{ borderTop: '4px solid var(--accent-blue)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ color: 'var(--accent-blue)', marginBottom: '16px' }}>
                <FileText size={40} />
              </div>
              <h3 style={{ color: '#fff', marginBottom: '12px' }}>Intelligent Notes Summary</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Convert raw study notes into structured summaries, topic trees, and key points.</p>
            </Card>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
