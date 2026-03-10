import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, FileText, Calendar, ClipboardList } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';

export default function StudentDashboard() {
  const navigate = useNavigate();
  
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div>
      {/* Greeting Banner */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ marginBottom: '8px' }}>Good morning, Ravi 👋</h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Class 10 · CBSE · {today}</p>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <Card>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontWeight: '600' }}>Doubts Solved</p>
          <h2 style={{ fontSize: '32px', margin: 0, fontFamily: 'Plus Jakarta Sans' }}>24</h2>
        </Card>
        <Card>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontWeight: '600' }}>Notes Uploaded</p>
          <h2 style={{ fontSize: '32px', margin: 0, fontFamily: 'Plus Jakarta Sans' }}>7</h2>
        </Card>
        <Card>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontWeight: '600' }}>Planner Progress</p>
          <h2 style={{ fontSize: '32px', margin: 0, fontFamily: 'Plus Jakarta Sans', color: 'var(--accent-green)' }}>68%</h2>
        </Card>
        <Card>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontWeight: '600' }}>Pending Assignments</p>
          <h2 style={{ fontSize: '32px', margin: 0, fontFamily: 'Plus Jakarta Sans', color: 'var(--accent-orange)' }}>2</h2>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Module Area */}
        <div>
          <h2 style={{ marginBottom: '16px', fontSize: '20px' }}>Your Study Modules</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            <Card hover style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: '#FEE2E2', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <HelpCircle size={20} color="var(--accent-red)" />
              </div>
              <h3 style={{ marginBottom: '8px' }}>Doubt Solver</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', flex: 1 }}>Instant step-by-step AI solutions for your math and science doubts.</p>
              <Button onClick={() => navigate('/student/doubts')} style={{ width: '100%' }}>Open →</Button>
            </Card>

            <Card hover style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: '#FCE7F3', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <FileText size={20} color="#DB2777" />
              </div>
              <h3 style={{ marginBottom: '8px' }}>Notes & Chatbot</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', flex: 1 }}>Upload notes to generate flashcards and a revision chatbot.</p>
              <Button onClick={() => navigate('/student/notes')} style={{ width: '100%' }}>Open →</Button>
            </Card>

            <Card hover style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: 'var(--accent-blue-light)', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Calendar size={20} color="var(--accent-blue)" />
              </div>
              <h3 style={{ marginBottom: '8px' }}>Exam Planner</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', flex: 1 }}>Generate a personalized, day-by-day exam prep roadmap.</p>
              <Button onClick={() => navigate('/student/planner')} style={{ width: '100%' }}>Open →</Button>
            </Card>

            <Card hover style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: '#FFEDD5', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <ClipboardList size={20} color="var(--accent-orange)" />
              </div>
              <h3 style={{ marginBottom: '8px' }}>Assignments</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', flex: 1 }}>Mock live quizzes and submit homework directly.</p>
              <Button onClick={() => navigate('/student/assignments')} style={{ width: '100%' }}>Open →</Button>
            </Card>

          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 style={{ marginBottom: '16px', fontSize: '20px' }}>Recent Activity</h2>
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {['Solved Trigonometry Doubt', 'Uploaded Biology Ch 4', 'Finished MCQ Quiz', 'Checked Planner Tracker', 'Read Science Revision'].map((act, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-blue)', marginTop: '6px' }}></div>
                  <div>
                    <p style={{ fontWeight: '500', fontSize: '14px', color: 'var(--text-primary)', marginBottom: '4px' }}>{act}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{i * 2 + 1} hours ago</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="secondary" style={{ width: '100%', marginTop: '24px' }}>View Full History</Button>
          </Card>
        </div>

      </div>
    </div>
  );
}
