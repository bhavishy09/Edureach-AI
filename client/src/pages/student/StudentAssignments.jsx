import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, Calendar, BookOpen, AlertCircle } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

const ACCENT = '#f5c518';

export default function StudentAssignments() {
  const navigate = useNavigate();
  const [studentGrade, setStudentGrade] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate('/register/student');
        return;
      }

      try {
        // Get user's class from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const classLevel = userDoc.exists() ? userDoc.data().class : '10';
        const grade = `Class ${classLevel}`;
        setStudentGrade(grade);

        // Fetch quizzes for the student's class
        const gradeParam = grade.replace(' ', '-');
        const res = await fetch(`/api/quiz/assignments/${gradeParam}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load assignments');
        setQuizzes(data.quizzes || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  const formatDue = (dateStr) => {
    if (!dateStr) return 'No due date';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ marginBottom: '8px' }}>Assignments & Quizzes</h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
          Quizzes posted by your teacher for {studentGrade}.
        </p>
      </div>

      {loading && (
        <Card>
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
            <div style={{ width: '32px', height: '32px', border: `3px solid ${ACCENT}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 16px' }} />
            Loading quizzes...
          </div>
        </Card>
      )}

      {!loading && error && (
        <Card style={{ border: '1px solid rgba(239,68,68,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ef4444' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        </Card>
      )}

      {!loading && !error && quizzes.length === 0 && (
        <Card style={{ textAlign: 'center', padding: '64px 32px' }}>
          <BookOpen size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <h3 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>No Quizzes Yet</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Your teacher hasn't posted any quizzes for {studentGrade} yet. Check back soon!
          </p>
        </Card>
      )}

      {!loading && !error && quizzes.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {quizzes.map((quiz) => (
            <div
              key={quiz.quiz_id}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderLeft: `4px solid ${ACCENT}`,
                borderRadius: '12px',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                <div style={{
                  background: 'rgba(245,197,24,0.15)',
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <ClipboardCheck size={24} color={ACCENT} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {quiz.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      📚 {quiz.topic}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      🎓 {quiz.grade}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      ❓ {quiz.question_count} Questions
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: ACCENT }}>
                      <Calendar size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                      Due: {formatDue(quiz.due_date)}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ flexShrink: 0 }}>
                <span style={{
                  display: 'inline-block',
                  padding: '3px 10px',
                  background: 'rgba(245,197,24,0.12)',
                  color: ACCENT,
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '700',
                  marginRight: '12px',
                }}>
                  {quiz.difficulty}
                </span>
                <Button
                  onClick={() => navigate(`/student/quiz/${quiz.quiz_id}`, { state: { quiz } })}
                >
                  Attempt Quiz →
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
