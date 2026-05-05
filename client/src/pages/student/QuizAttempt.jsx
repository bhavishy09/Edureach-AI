import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, AlertCircle } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { auth } from '../../lib/firebase';
import { trackActivity } from '../../utils/trackActivity';

const ACCENT = '#f5c518';

export default function QuizAttempt() {
  const location = useLocation();
  const navigate = useNavigate();
  const quiz = location.state?.quiz;

  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!quiz) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 32px' }}>
        <AlertCircle size={48} color="#ef4444" style={{ marginBottom: '16px' }} />
        <h2 style={{ marginBottom: '8px' }}>Quiz Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          We couldn't find the quiz data. Please go back and try again.
        </p>
        <Button onClick={() => navigate('/student/assignments')}>← Back to Assignments</Button>
      </div>
    );
  }

  const questions = quiz.questions || [];
  const answeredCount = Object.keys(answers).filter(k => answers[k]?.trim()).length;
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  const setAnswer = (qId, value) => {
    setAnswers(prev => ({ ...prev, [String(qId)]: value }));
  };

  const handleSubmit = async () => {
    if (answeredCount < questions.length) {
      setError(`Please answer all questions before submitting. (${questions.length - answeredCount} remaining)`);
      return;
    }
    setError('');
    setSubmitting(true);
    
    const user = auth.currentUser;
    if (!user) {
      setError('You must be logged in to submit a quiz.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quiz_id: quiz.quiz_id,
          student_id: user.uid,
          student_name: user.displayName || 'Student',
          answers,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Submission failed');
      
      // Track activity
      await trackActivity(user.uid, `Completed Quiz: ${quiz.title}`, 'quiz');
      
      // Navigate to result page with the data
      navigate('/student/quiz/result', { state: { result: data, quizTitle: quiz.title } });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ marginBottom: '6px' }}>{quiz.title}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          {quiz.topic} · {quiz.grade} · {quiz.difficulty}
        </p>
      </div>

      {/* Progress Bar */}
      <Card style={{ marginBottom: '28px', padding: '16px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Progress</span>
          <span style={{ color: ACCENT, fontWeight: '700' }}>{answeredCount} / {questions.length} answered</span>
        </div>
        <div style={{ background: 'var(--bg-tertiary)', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: ACCENT,
            borderRadius: '999px',
            transition: 'width 0.3s ease',
          }} />
        </div>
      </Card>

      {/* Questions */}
      {questions.map((q, i) => {
        const qId = String(q.id);
        const currentAnswer = answers[qId] || '';

        return (
          <Card key={qId} style={{ marginBottom: '20px', border: currentAnswer ? `1px solid rgba(245,197,24,0.35)` : '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{
                background: 'rgba(245,197,24,0.12)',
                color: ACCENT,
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '700',
              }}>
                Q{i + 1}
              </span>
              {currentAnswer && (
                <span style={{ color: '#10b981', fontSize: '13px', fontWeight: '600' }}>✓ Answered</span>
              )}
            </div>

            <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '20px', lineHeight: 1.6 }}>
              {q.question}
            </p>

            {/* MCQ */}
            {q.type === 'mcq' && q.options && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {q.options.map((opt, oi) => {
                  const selected = currentAnswer === opt;
                  return (
                    <label
                      key={oi}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        border: selected ? `1px solid ${ACCENT}` : '1px solid var(--border)',
                        background: selected ? 'rgba(245,197,24,0.08)' : 'transparent',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: selected ? ACCENT : 'var(--text-secondary)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <input
                        type="radio"
                        name={`q_${qId}`}
                        value={opt}
                        checked={selected}
                        onChange={() => setAnswer(qId, opt)}
                        style={{ accentColor: ACCENT }}
                      />
                      {opt}
                    </label>
                  );
                })}
              </div>
            )}

            {/* True / False */}
            {q.type === 'true_false' && (
              <div style={{ display: 'flex', gap: '12px' }}>
                {['True', 'False'].map(opt => {
                  const selected = currentAnswer === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setAnswer(qId, opt)}
                      style={{
                        flex: 1,
                        padding: '14px',
                        borderRadius: '10px',
                        border: selected ? `2px solid ${ACCENT}` : '2px solid var(--border)',
                        background: selected ? 'rgba(245,197,24,0.1)' : 'transparent',
                        color: selected ? ACCENT : 'var(--text-secondary)',
                        fontSize: '15px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {opt === 'True' ? '✅' : '❌'} {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Short Answer / Fill Blank */}
            {(q.type === 'short_answer' || q.type === 'fill_blank') && (
              <input
                className="custom-input"
                style={{ width: '100%' }}
                placeholder={q.type === 'fill_blank' ? 'Fill in the blank...' : 'Write your answer here...'}
                value={currentAnswer}
                onChange={e => setAnswer(qId, e.target.value)}
              />
            )}
          </Card>
        );
      })}

      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '8px',
          padding: '12px 16px',
          color: '#ef4444',
          fontSize: '14px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
        <Button variant="secondary" onClick={() => navigate('/student/assignments')}>
          ← Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          style={{ flex: 1 }}
        >
          {submitting
            ? 'Submitting...'
            : <><ChevronRight size={18} style={{ marginRight: '6px' }} />Submit Quiz</>
          }
        </Button>
      </div>
    </div>
  );
}
