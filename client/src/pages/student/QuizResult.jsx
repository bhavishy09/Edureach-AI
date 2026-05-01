import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Home } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';

const ACCENT = '#f5c518';
const GREEN = '#10b981';
const RED = '#ef4444';

function ScoreCircle({ score }) {
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const fill = (score / 100) * circ;
  const color = score >= 70 ? GREEN : score >= 40 ? ACCENT : RED;

  return (
    <div style={{ position: 'relative', width: '140px', height: '140px', margin: '0 auto 24px' }}>
      <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="70" cy="70" r={radius} fill="none" stroke="var(--bg-tertiary)" strokeWidth="12" />
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={circ}
          strokeDashoffset={circ - fill}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span style={{ fontSize: '28px', fontWeight: '800', color }}>{score}%</span>
      </div>
    </div>
  );
}

export default function QuizResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, quizTitle } = location.state || {};

  if (!result) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 32px' }}>
        <h2>No result data found.</h2>
        <Button style={{ marginTop: '16px' }} onClick={() => navigate('/student/assignments')}>
          ← Back to Assignments
        </Button>
      </div>
    );
  }

  const { score, total_questions, correct_count, results } = result;
  const grade = score >= 90 ? 'Excellent! 🏆' : score >= 70 ? 'Good Job! 👍' : score >= 40 ? 'Keep Practicing 💪' : 'Needs Improvement 📖';

  return (
    <div>
      {/* Score Header */}
      <Card style={{ textAlign: 'center', marginBottom: '28px', border: `2px solid rgba(245,197,24,0.3)` }}>
        <div style={{ marginBottom: '8px', fontSize: '28px' }}>🎯</div>
        <h1 style={{ marginBottom: '4px', fontSize: '22px' }}>{quizTitle || 'Quiz Result'}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{grade}</p>

        <ScoreCircle score={score} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxWidth: '400px', margin: '0 auto' }}>
          <div>
            <p style={{ fontSize: '28px', fontWeight: '800', color: ACCENT, margin: 0 }}>{correct_count}</p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Correct</p>
          </div>
          <div>
            <p style={{ fontSize: '28px', fontWeight: '800', color: RED, margin: 0 }}>{total_questions - correct_count}</p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Incorrect</p>
          </div>
          <div>
            <p style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>{total_questions}</p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Total</p>
          </div>
        </div>
      </Card>

      {/* Question Breakdown */}
      <h2 style={{ marginBottom: '16px', fontSize: '18px' }}>Question Breakdown</h2>
      {results.map((r, i) => (
        <div
          key={i}
          style={{
            background: 'var(--bg-secondary)',
            border: `1px solid ${r.is_correct ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
            borderRadius: '12px',
            padding: '18px 20px',
            marginBottom: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ flexShrink: 0, marginTop: '2px' }}>
              {r.is_correct
                ? <CheckCircle size={20} color={GREEN} />
                : <XCircle size={20} color={RED} />
              }
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.5 }}>
                Q{i + 1}. {r.question}
              </p>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '13px' }}>
                <span style={{ color: r.is_correct ? GREEN : RED }}>
                  Your answer: <strong>{r.student_answer || '(no answer)'}</strong>
                </span>
                {!r.is_correct && (
                  <span style={{ color: GREEN }}>
                    Correct: <strong>{r.correct_answer}</strong>
                  </span>
                )}
              </div>
              {!r.is_correct && r.explanation && (
                <div style={{
                  marginTop: '10px',
                  padding: '10px 14px',
                  background: 'rgba(245,197,24,0.07)',
                  border: '1px solid rgba(245,197,24,0.2)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                }}>
                  💡 {r.explanation}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
        <Button onClick={() => navigate('/student/assignments')} style={{ flex: 1 }}>
          <Home size={16} style={{ marginRight: '8px' }} />
          Back to Assignments
        </Button>
        <Button variant="secondary" onClick={() => navigate('/student')} style={{ flex: 1 }}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
