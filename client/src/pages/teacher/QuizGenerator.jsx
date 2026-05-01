import React, { useState, useRef } from 'react';
import { Sparkles, Settings2, FileCheck2, Download, Send, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';

const ACCENT = '#f5c518';
const GREEN = '#10b981';
const RED = '#ef4444';

const TYPE_LABELS = {
  mcq: 'MCQ',
  true_false: 'True / False',
  short_answer: 'Short Answer',
  fill_blank: 'Fill in Blank',
};

function QuestionCard({ question, index }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{
          background: 'rgba(245,197,24,0.15)',
          color: ACCENT,
          padding: '3px 10px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>
          {TYPE_LABELS[question.type] || question.type}
        </span>
        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Q{index + 1}</span>
      </div>

      <p style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text-primary)', marginBottom: '16px', lineHeight: 1.5 }}>
        {question.question}
      </p>

      {question.options && question.options.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
          {question.options.map((opt, i) => {
            const isCorrect = opt.trim().toLowerCase() === question.correct_answer?.trim().toLowerCase();
            return (
              <div key={i} style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: isCorrect ? `1px solid ${GREEN}` : '1px solid var(--border)',
                background: isCorrect ? 'rgba(16,185,129,0.1)' : 'transparent',
                color: isCorrect ? GREEN : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '14px',
              }}>
                {isCorrect && <CheckCircle size={16} color={GREEN} />}
                <span style={{ fontWeight: isCorrect ? '700' : '400' }}>{opt}</span>
              </div>
            );
          })}
        </div>
      )}

      {(question.type === 'short_answer' || question.type === 'fill_blank') && (
        <div style={{
          padding: '10px 14px',
          border: `1px solid ${GREEN}`,
          borderRadius: '8px',
          background: 'rgba(16,185,129,0.1)',
          color: GREEN,
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '12px',
        }}>
          ✓ Correct Answer: {question.correct_answer}
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: ACCENT,
          fontSize: '13px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: 0,
        }}
      >
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        {open ? 'Hide Explanation' : 'Show Explanation'}
      </button>
      {open && (
        <div style={{
          marginTop: '10px',
          padding: '12px',
          background: 'rgba(245,197,24,0.07)',
          border: `1px solid rgba(245,197,24,0.25)`,
          borderRadius: '8px',
          fontSize: '14px',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
        }}>
          💡 {question.explanation}
        </div>
      )}
    </div>
  );
}

function downloadPDF(questions, meta, teacherCopy) {
  // Build a printable HTML page and use window.print via a hidden iframe
  const title = meta.title || meta.topic;
  const questionRows = questions.map((q, i) => {
    const optionsHtml = q.options && q.options.length
      ? q.options.map(o => `<div style="padding:4px 0">◯ ${o}</div>`).join('')
      : '';
    const answerHtml = teacherCopy
      ? `<div style="color:#10b981;font-weight:bold;margin-top:6px">✓ ${q.correct_answer}</div>
         <div style="color:#888;font-size:12px;margin-top:4px">💡 ${q.explanation}</div>`
      : '';
    return `
      <div style="margin-bottom:24px;padding:16px;border:1px solid #ddd;border-radius:8px">
        <div style="font-weight:700;margin-bottom:8px">Q${i + 1}. [${TYPE_LABELS[q.type] || q.type}] ${q.question}</div>
        ${optionsHtml}
        ${answerHtml}
      </div>`;
  }).join('');

  const html = `<!DOCTYPE html><html><head><title>${title}</title>
  <style>body{font-family:Arial,sans-serif;padding:24px;max-width:800px;margin:auto}
  h1{font-size:22px}h2{font-size:16px;color:#666}</style></head><body>
  <h1>${title} — ${teacherCopy ? 'Teacher Copy' : 'Student Copy'}</h1>
  <h2>Topic: ${meta.topic} | Grade: ${meta.grade} | Difficulty: ${meta.difficulty}</h2>
  <hr/>
  ${questionRows}
  </body></html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/\s+/g, '_')}_${teacherCopy ? 'teacher' : 'student'}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function QuizGenerator() {
  const [form, setForm] = useState({
    topic: '',
    grade: 'Class 10',
    difficulty: 'Medium',
    num_questions: 10,
  });
  const [questionTypes, setQuestionTypes] = useState({ mcq: true, true_false: false, short_answer: false, fill_blank: false });
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');

  const [postTitle, setPostTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    setQuestions([]);
    setPostSuccess('');
    const selectedTypes = Object.entries(questionTypes).filter(([, v]) => v).map(([k]) => k);
    if (selectedTypes.length === 0) {
      setError('Please select at least one question type.');
      return;
    }
    setIsGenerating(true);
    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: form.topic,
          grade: form.grade,
          difficulty: form.difficulty,
          question_types: selectedTypes,
          num_questions: form.num_questions,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Generation failed');
      setQuestions(data.questions);
      setPostTitle(form.topic);
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePost = async () => {
    if (!postTitle || !dueDate) {
      setError('Please enter a quiz title and due date before posting.');
      return;
    }
    setIsPosting(true);
    setError('');
    try {
      const res = await fetch('/api/quiz/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: postTitle,
          topic: form.topic,
          grade: form.grade,
          difficulty: form.difficulty,
          questions,
          due_date: dueDate,
          posted_by: 'teacher',
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Post failed');
      setPostSuccess(`✅ Quiz posted! Students can now see it in Assignments. (ID: ${data.quiz_id})`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsPosting(false);
    }
  };

  const toggleType = (key) => setQuestionTypes(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ marginBottom: '8px' }}>AI Quiz Generator</h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
          Instantly create engaging assessments tailored to your syllabus.
        </p>
      </div>

      {/* Config Panel */}
      <Card style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <Settings2 color={ACCENT} />
          <h2 style={{ fontSize: '20px', margin: 0 }}>Configuration</h2>
        </div>

        <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>
              Topic or Chapter
            </label>
            <input
              className="custom-input"
              style={{ width: '100%' }}
              placeholder="e.g., Photosynthesis or CBSE Class 10 Chapter 6"
              value={form.topic}
              onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>Grade Level</label>
              <select className="custom-input" style={{ width: '100%' }} value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value }))}>
                {['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>Difficulty</label>
              <select className="custom-input" style={{ width: '100%' }} value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}>
                {['Easy', 'Medium', 'Hard', 'Mixed (Adaptive)'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>No. of Questions</label>
              <input
                className="custom-input"
                style={{ width: '100%' }}
                type="number"
                min={3}
                max={30}
                value={form.num_questions}
                onChange={e => setForm(f => ({ ...f, num_questions: parseInt(e.target.value) || 10 }))}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>Question Types</label>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              {[['mcq', 'Multiple Choice'], ['true_false', 'True / False'], ['short_answer', 'Short Answer'], ['fill_blank', 'Fill in the Blanks']].map(([key, label]) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    checked={!!questionTypes[key]}
                    onChange={() => toggleType(key)}
                    style={{ accentColor: ACCENT, width: '16px', height: '16px' }}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '12px 16px', color: RED, fontSize: '14px' }}>
              {error}
            </div>
          )}

          <Button type="submit" disabled={isGenerating} style={{ marginTop: '8px' }}>
            {isGenerating
              ? <><span className="spinner" style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', marginRight: '10px' }} />Generating quiz with AI...</>
              : <><Sparkles size={18} style={{ marginRight: '8px' }} />Generate Quiz</>
            }
          </Button>
        </form>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </Card>

      {/* Generated Questions Preview */}
      {questions.length > 0 && (
        <div className="page-enter">
          <Card style={{ border: `2px solid rgba(245,197,24,0.35)`, marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileCheck2 color={GREEN} />
                <h2 style={{ fontSize: '20px', margin: 0 }}>Teacher Preview</h2>
              </div>
              <div style={{ background: 'rgba(16,185,129,0.15)', color: GREEN, padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                {questions.length} Questions Ready
              </div>
            </div>

            {questions.map((q, i) => <QuestionCard key={i} question={q} index={i} />)}
          </Card>

          {/* Post Quiz Section */}
          <Card style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Post Quiz to Students</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>Quiz Title</label>
                <input
                  className="custom-input"
                  style={{ width: '100%' }}
                  value={postTitle}
                  onChange={e => setPostTitle(e.target.value)}
                  placeholder="Enter quiz title"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>Due Date</label>
                <input
                  className="custom-input"
                  style={{ width: '100%' }}
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                />
              </div>
            </div>

            {postSuccess && (
              <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '12px 16px', color: GREEN, fontSize: '14px', marginBottom: '16px' }}>
                {postSuccess}
              </div>
            )}

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Button onClick={handlePost} disabled={isPosting} style={{ flex: 1, minWidth: '200px' }}>
                <Send size={16} style={{ marginRight: '8px' }} />
                {isPosting ? 'Posting...' : 'Post Quiz to Students'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => downloadPDF(questions, { title: postTitle, topic: form.topic, grade: form.grade, difficulty: form.difficulty }, false)}
                style={{ flex: 1, minWidth: '200px' }}
              >
                <Download size={16} style={{ marginRight: '8px' }} />Download Student PDF
              </Button>
              <Button
                variant="secondary"
                onClick={() => downloadPDF(questions, { title: postTitle, topic: form.topic, grade: form.grade, difficulty: form.difficulty }, true)}
                style={{ flex: 1, minWidth: '200px' }}
              >
                <Download size={16} style={{ marginRight: '8px' }} />Download Teacher PDF
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
