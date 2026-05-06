import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilePlus2, Users, TrendingUp, Award } from 'lucide-react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import Card from '../../components/Card';
import Button from '../../components/Button';

export default function TeacherDashboard() {
  const navigate = useNavigate();

  const [teacherName, setTeacherName] = useState('Teacher');
  const [totalStudents, setTotalStudents] = useState(0);
  const [avgScore, setAvgScore] = useState(null);
  const [activeQuizzes, setActiveQuizzes] = useState(0);
  const [aPlusCount, setAPlusCount] = useState(0);
  const [topPerformers, setTopPerformers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set teacher name from auth
    const user = auth.currentUser;
    if (user?.displayName) {
      setTeacherName(user.displayName);
    }

    const fetchDashboardData = async () => {
      try {
        // 1. Total Students — count docs in "users" with role === "student"
        const usersSnap = await getDocs(
          query(collection(db, 'users'), where('role', '==', 'student'))
        );
        setTotalStudents(usersSnap.size);

        // 2. Active Quizzes — count docs in "quizzes" with status === "active"
        const quizzesSnap = await getDocs(
          query(collection(db, 'quizzes'), where('status', '==', 'active'))
        );
        setActiveQuizzes(quizzesSnap.size);

        // 3. All Quiz Results — compute avg score, A+ count, top performers
        const resultsSnap = await getDocs(collection(db, 'quiz_results'));

        if (!resultsSnap.empty) {
          let totalScore = 0;
          let resultCount = 0;
          let aPlusResults = 0;
          // Map: student_id -> { name, scores[] }
          const studentScores = {};

          resultsSnap.forEach((doc) => {
            const data = doc.data();
            const score = data.score ?? 0;
            const studentId = data.student_id || 'unknown';
            const studentName = data.student_name || 'Student';

            totalScore += score;
            resultCount++;

            if (score >= 90) {
              aPlusResults++;
            }

            if (!studentScores[studentId]) {
              studentScores[studentId] = { name: studentName, scores: [] };
            }
            studentScores[studentId].scores.push(score);
          });

          // Avg class score
          setAvgScore(resultCount > 0 ? Math.round(totalScore / resultCount) : null);

          // A+ grades count
          setAPlusCount(aPlusResults);

          // Top 5 performers by average score
          const performers = Object.entries(studentScores)
            .map(([id, { name, scores }]) => ({
              id,
              name,
              avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
            }))
            .sort((a, b) => b.avgScore - a.avgScore)
            .slice(0, 5);

          setTopPerformers(performers);
        }
      } catch (err) {
        console.error('Teacher dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      {/* Greeting Banner */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ marginBottom: '8px' }}>Welcome back, {teacherName} 🎒</h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Science Department · Let's make learning awesome today!</p>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <Card hover>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ background: 'rgba(225, 29, 116, 0.15)', padding: '10px', borderRadius: '12px' }}>
              <Users size={24} color="var(--accent-blue)" />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Total Students</p>
          </div>
          <h2 style={{ fontSize: '36px', margin: 0 }}>{loading ? '–' : totalStudents}</h2>
        </Card>
        <Card hover>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '10px', borderRadius: '12px' }}>
              <TrendingUp size={24} color="var(--accent-green)" />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Avg Class Score</p>
          </div>
          <h2 style={{ fontSize: '36px', margin: 0, color: 'var(--accent-green)' }}>{loading ? '–' : avgScore !== null ? `${avgScore}%` : 'N/A'}</h2>
        </Card>
        <Card hover>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '10px', borderRadius: '12px' }}>
              <FilePlus2 size={24} color="var(--accent-orange)" />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Active Quizzes</p>
          </div>
          <h2 style={{ fontSize: '36px', margin: 0 }}>{loading ? '–' : activeQuizzes}</h2>
        </Card>
        <Card hover>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.15)', padding: '10px', borderRadius: '12px' }}>
              <Award size={24} color="var(--accent-purple)" />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>A+ Grades</p>
          </div>
          <h2 style={{ fontSize: '36px', margin: 0 }}>{loading ? '–' : aPlusCount}</h2>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Main Action Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <Card style={{ display: 'flex', alignItems: 'center', gap: '24px', border: '2px dashed var(--accent-blue)', background: 'var(--bg-tertiary)' }}>
            <div style={{ background: 'rgba(225, 29, 116, 0.2)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FilePlus2 size={32} color="var(--accent-blue)" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '20px', marginBottom: '4px' }}>Need a new quiz fast?</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Use AI to generate a complete quiz from your syllabus in seconds.</p>
            </div>
            <Button onClick={() => navigate('/teacher/quiz')} style={{ height: '48px', padding: '0 32px' }}>Generate AI Quiz ✨</Button>
          </Card>

          <Card>
            <h2 style={{ marginBottom: '20px', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              Upcoming Deadlines
              <span style={{ fontSize: '13px', color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: 'bold' }}>View All</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { title: 'Biology Chapter 4 Test', type: 'Quiz', due: 'Tomorrow, 10:00 AM' },
                { title: 'Physics Kinematics Lab', type: 'Assignment', due: 'Friday, 11:59 PM' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>{item.title}</h4>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>{item.type} · Due {item.due}</p>
                  </div>
                  <Button variant="secondary" onClick={() => navigate('/teacher/assignments')}>Manage</Button>
                </div>
              ))}
            </div>
          </Card>

        </div>

        {/* Top Performers */}
        <div>
          <Card style={{ height: '100%' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '20px' }}>Top Performers</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {loading ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '16px 0' }}>Loading…</p>
              ) : topPerformers.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '16px 0' }}>No results yet</p>
              ) : (
                topPerformers.map((student, i) => (
                  <div key={student.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '8px 0', borderBottom: i < topPerformers.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: i === 0 ? 'var(--accent-orange)' : 'var(--bg-tertiary)', color: i === 0 ? '#fff' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
                      #{i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text-primary)', margin: 0 }}>{student.name}</p>
                    </div>
                    <div style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>
                      {student.avgScore}%
                    </div>
                  </div>
                ))
              )}
            </div>
            <Button variant="secondary" style={{ width: '100%', marginTop: '24px' }} onClick={() => navigate('/teacher/progress')}>View All Progress</Button>
          </Card>
        </div>

      </div>
    </div>
  );
}
