import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, FileText, Calendar, ClipboardList, Trophy, Clock } from 'lucide-react';
import { doc, onSnapshot, collection, query, orderBy, limit } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import Card from '../../components/Card';
import Button from '../../components/Button';

const ACCENT = '#f5c518';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  
  // Dynamic Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        // 1. Listen to User Profile
        const userRef = doc(db, 'users', user.uid);
        const unsubUser = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
          setLoading(false);
        });

        // 2. Listen to Recent Activity (Last 5)
        const activityRef = collection(db, 'users', user.uid, 'activity');
        const activityQuery = query(activityRef, orderBy('timestamp', 'desc'), limit(5));
        const unsubActivity = onSnapshot(activityQuery, (querySnapshot) => {
          const acts = [];
          querySnapshot.forEach((doc) => {
            acts.push({ id: doc.id, ...doc.data() });
          });
          setActivities(acts);
        });

        // 3. Fetch Quiz Results + Pending Assignments count
        const fetchResultsAndPending = async () => {
          try {
            // Fetch student's quiz results
            const res = await fetch(`/api/quiz/result/${user.uid}`);
            const data = await res.json();
            let attemptedQuizIds = [];
            if (res.ok && data.results) {
              setRecentResults(data.results.slice(0, 3));
              attemptedQuizIds = data.results.map(r => r.quiz_id);
            }

            // Fetch available assignments for student's grade
            const userDoc = await import('firebase/firestore').then(m => m.getDoc(doc(db, 'users', user.uid)));
            const classLevel = userDoc.exists() ? userDoc.data().class : '10';
            const grade = `Class-${classLevel}`;
            const assignRes = await fetch(`/api/quiz/assignments/${grade}`);
            const assignData = await assignRes.json();
            if (assignRes.ok && assignData.quizzes) {
              const notAttempted = assignData.quizzes.filter(q => !attemptedQuizIds.includes(q.quiz_id));
              setPendingCount(notAttempted.length);
            }
          } catch (e) {
            console.error('Results/pending fetch error:', e);
          }
        };
        fetchResultsAndPending();

        return () => {
          unsubUser();
          unsubActivity();
        };
      } else {
        navigate('/register/student');
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loader" style={{ borderTopColor: ACCENT }}></div>
      </div>
    );
  }

  return (
    <div className="page-enter">
      {/* Greeting Banner */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ marginBottom: '8px' }}>{getGreeting()}, {userData?.name || 'Student'} 👋</h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
          Class {userData?.class || '10'} · {userData?.board || 'CBSE'} · {today}
        </p>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <Card>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontWeight: '600' }}>Doubts Solved</p>
          <h2 style={{ fontSize: '32px', margin: 0, fontFamily: 'Plus Jakarta Sans', color: ACCENT }}>{userData?.doubts_solved || 0}</h2>
        </Card>
        <Card>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontWeight: '600' }}>Notes Uploaded</p>
          <h2 style={{ fontSize: '32px', margin: 0, fontFamily: 'Plus Jakarta Sans' }}>{userData?.notes_uploaded || 0}</h2>
        </Card>
        <Card>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontWeight: '600' }}>Planner Progress</p>
          <h2 style={{ fontSize: '32px', margin: 0, fontFamily: 'Plus Jakarta Sans', color: 'var(--accent-green)' }}>{userData?.planner_progress || 0}%</h2>
        </Card>
        <Card>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontWeight: '600' }}>Pending Assignments</p>
          <h2 style={{ fontSize: '32px', margin: 0, fontFamily: 'Plus Jakarta Sans', color: 'var(--accent-orange)' }}>{pendingCount}</h2>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>

        {/* Left column: Modules + Quiz Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Study Modules */}
          <div>
            <h2 style={{ marginBottom: '16px', fontSize: '20px' }}>Your Study Modules</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <Card hover style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <HelpCircle size={20} color="var(--accent-red)" />
                </div>
                <h3 style={{ marginBottom: '8px' }}>Doubt Solver</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', flex: 1 }}>Instant step-by-step AI solutions for your math and science doubts.</p>
                <Button onClick={() => navigate('/student/doubts')} style={{ width: '100%' }}>Open →</Button>
              </Card>

              <Card hover style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ background: 'rgba(219, 39, 119, 0.1)', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
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
                <div style={{ background: 'rgba(245, 158, 11, 0.1)', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <ClipboardList size={20} color="var(--accent-orange)" />
                </div>
                <h3 style={{ marginBottom: '8px' }}>Assignments</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', flex: 1 }}>Mock live quizzes and submit homework directly.</p>
                <Button onClick={() => navigate('/student/assignments')} style={{ width: '100%' }}>Open →</Button>
              </Card>
            </div>
          </div>

          {/* Recent Quiz Results */}
          <div>
            <h2 style={{ marginBottom: '16px', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trophy size={20} color={ACCENT} /> Recent Quiz Results
            </h2>
            <Card>
              {recentResults.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '16px 0' }}>
                  No quiz results yet. Attempt a quiz from Assignments!
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {recentResults.map((r, i) => {
                    const color = r.score >= 70 ? '#10b981' : r.score >= 40 ? ACCENT : '#ef4444';
                    return (
                      <div key={i} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        background: 'var(--bg-tertiary)',
                        borderRadius: '10px',
                        border: '1px solid var(--border)'
                      }}>
                        <div>
                          <p style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)', margin: 0 }}>{r.quiz_title || 'Quiz'}</p>
                          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                            {r.submitted_at ? new Date(r.submitted_at).toLocaleDateString('en-IN') : ''}
                          </p>
                        </div>
                        <span style={{ fontSize: '18px', fontWeight: '800', color }}>{r.score}%</span>
                      </div>
                    );
                  })}
                </div>
              )}
              <Button variant="secondary" style={{ width: '100%', marginTop: '16px' }} onClick={() => navigate('/student/assignments')}>
                View All Assignments
              </Button>
            </Card>
          </div>
        </div>

        {/* Right column: Recent Activity */}
        <div>
          <h2 style={{ marginBottom: '16px', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <Clock size={20} color="var(--accent-blue)" /> Recent Activity
          </h2>
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {activities.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center' }}>No recent activity.</p>
              ) : (
                activities.map((act, i) => (
                  <div key={act.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-blue)', marginTop: '6px' }} />
                    <div>
                      <p style={{ fontWeight: '500', fontSize: '14px', color: 'var(--text-primary)', marginBottom: '4px' }}>{act.action}</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {act.timestamp ? new Date(act.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            {activities.length > 0 && (
              <Button variant="secondary" style={{ width: '100%', marginTop: '24px' }}>View Full History</Button>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
}
