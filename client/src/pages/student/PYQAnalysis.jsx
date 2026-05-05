import React, { useState, useEffect } from 'react';
import { Lock, BarChart, BookOpen, AlertCircle, Info, RefreshCw, Layers } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { trackActivity } from '../../utils/trackActivity';

export default function PYQAnalysis() {
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [classLevel, setClassLevel] = useState('10');
  const [subject, setSubject] = useState('Science');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('chapters');

  useEffect(() => {
    // Fetch available subjects
    fetch('/api/pyq/available-subjects')
      .then(res => res.json())
      .then(data => {
        setAvailableSubjects(data);
      })
      .catch(err => console.error("Error fetching subjects:", err));
  }, []);

  const handleFetchAnalysis = () => {
    setLoading(true);
    setResults(null);
    fetch(`/api/pyq/results?class_level=${classLevel}&subject=${subject.toLowerCase()}`)
      .then(res => res.json())
      .then(data => {
        setResults(data);
        setLoading(false);
        
        // Track Activity
        const uid = auth.currentUser?.uid;
        if (uid && data.available) {
          trackActivity(uid, `Viewed PYQ Analysis: ${subject} (Class ${classLevel})`, 'notes');
        }
      })
      .catch(err => {
        console.error("Error fetching results:", err);
        setLoading(false);
      });
  };

  // Helper to filter subjects based on class level
  const filteredSubjects = availableSubjects.filter(s => s.class_level === classLevel);

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      {/* SECTION 1: Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <BarChart color="#f5c518" size={32} />
          PYQ Analysis
        </h1>
        <p style={{ color: '#a0a0a0', fontSize: '16px' }}>
          Chapter importance and expected questions based on previous year paper analysis
        </p>
      </div>

      {/* SECTION 2: Subject Selector */}
      <div style={{ 
        backgroundColor: '#1a1a1a', 
        padding: '24px', 
        borderRadius: '12px', 
        border: '1px solid #333',
        marginBottom: '32px' 
      }}>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#ccc' }}>Class</label>
            <select 
              value={classLevel} 
              onChange={(e) => {
                setClassLevel(e.target.value);
                const subjs = availableSubjects.filter(s => s.class_level === e.target.value);
                if(subjs.length > 0) setSubject(subjs[0].subject);
              }}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#2a2a2a',
                color: '#fff',
                border: '1px solid #444',
                borderRadius: '8px',
                outline: 'none'
              }}
            >
              <option value="10">Class 10</option>
              <option value="12">Class 12</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#ccc' }}>Subject</label>
            <select 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#2a2a2a',
                color: '#fff',
                border: '1px solid #444',
                borderRadius: '8px',
                outline: 'none'
              }}
            >
              {filteredSubjects.map((s, idx) => (
                <option key={idx} value={s.subject} disabled={!s.available}>
                  {s.subject} {s.available ? '' : '🔒'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button 
          onClick={handleFetchAnalysis}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#f5c518',
            color: '#000',
            fontWeight: 'bold',
            fontSize: '16px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'opacity 0.2s'
          }}
          onMouseOver={(e) => e.target.style.opacity = '0.9'}
          onMouseOut={(e) => e.target.style.opacity = '1'}
        >
          View Analysis
        </button>
      </div>

      {/* SECTION 3: Results Display */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <RefreshCw size={40} color="#f5c518" style={{ animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          <p style={{ marginTop: '16px', color: '#a0a0a0' }}>Analyzing previous year papers...</p>
        </div>
      )}

      {results && !loading && (
        <div style={{ marginBottom: '32px' }}>
          {!results.available ? (
            <div style={{ 
              backgroundColor: '#1a1a1a', 
              padding: '40px', 
              borderRadius: '12px', 
              border: '1px solid #333',
              textAlign: 'center'
            }}>
              <Lock size={48} color="#666" style={{ margin: '0 auto 16px' }} />
              <h2 style={{ fontSize: '20px', marginBottom: '8px', color: '#ccc' }}>Coming Soon!</h2>
              <p style={{ color: '#888' }}>
                Analysis for this subject is coming soon! Check back after your teacher uploads the data.
              </p>
            </div>
          ) : (
            <div>
              {/* Tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid #333', marginBottom: '24px' }}>
                <button 
                  onClick={() => setActiveTab('chapters')}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: 'transparent',
                    color: activeTab === 'chapters' ? '#f5c518' : '#888',
                    border: 'none',
                    borderBottom: activeTab === 'chapters' ? '2px solid #f5c518' : '2px solid transparent',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Layers size={18} />
                  Chapter Importance
                </button>
                <button 
                  onClick={() => setActiveTab('questions')}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: 'transparent',
                    color: activeTab === 'questions' ? '#f5c518' : '#888',
                    border: 'none',
                    borderBottom: activeTab === 'questions' ? '2px solid #f5c518' : '2px solid transparent',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <BookOpen size={18} />
                  Expected Questions
                </button>
              </div>

              {/* Tab Content: Chapters */}
              {activeTab === 'chapters' && results.data && results.data.chapters && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {results.data.chapters.map((chap, idx) => {
                    const badgeColor = chap.label?.includes('Very Important') ? '#f5c518' : 
                                       chap.label?.includes('Less Important') ? '#666' : '#9d4edd';
                    const textColor = chap.label?.includes('Very Important') ? '#000' : '#fff';
                    
                    return (
                      <div key={idx} style={{ 
                        backgroundColor: '#1a1a1a', 
                        padding: '20px', 
                        borderRadius: '12px', 
                        border: '1px solid #333'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                          <h3 style={{ fontSize: '18px', margin: 0, color: '#fff' }}>{chap.chapter}</h3>
                          <span style={{ 
                            backgroundColor: badgeColor, 
                            color: textColor,
                            padding: '4px 12px', 
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            {chap.label || 'Standard'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ flex: 1, backgroundColor: '#333', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ 
                              backgroundColor: '#f5c518', 
                              height: '100%', 
                              width: `${Math.min((chap.importance || 0) * 3, 100)}%`
                            }}></div>
                          </div>
                          <span style={{ color: '#ccc', fontSize: '14px', minWidth: '50px' }}>
                            {typeof chap.importance === 'number' ? chap.importance.toFixed(1) : chap.importance}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tab Content: Questions */}
              {activeTab === 'questions' && results.data && results.data.questions && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {results.data.questions.map((q, idx) => (
                    <div key={idx} style={{ 
                      backgroundColor: '#1a1a1a', 
                      padding: '20px', 
                      borderRadius: '12px', 
                      borderLeft: '4px solid #f5c518',
                      borderTop: '1px solid #333',
                      borderRight: '1px solid #333',
                      borderBottom: '1px solid #333',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <span style={{ 
                          backgroundColor: '#333', 
                          color: '#fff',
                          padding: '4px 12px', 
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <RefreshCw size={12} />
                          Asked ~{q.repeat_per_year || 1} times per year
                        </span>
                        {q.label && (
                          <span style={{ 
                            color: q.label.includes('⭐') ? '#f5c518' : '#fff',
                            fontSize: '14px',
                            fontWeight: 'bold'
                          }}>
                            {q.label}
                          </span>
                        )}
                      </div>
                      <p style={{ color: '#eee', fontSize: '16px', lineHeight: '1.6', margin: 0 }}>
                        {q.question.split('\n').map((line, i) => (
                          <React.Fragment key={i}>
                            {line}
                            <br />
                          </React.Fragment>
                        ))}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SECTION 4: Info Banner */}
      <div style={{ 
        backgroundColor: '#1a1a1a', 
        padding: '16px', 
        borderRadius: '8px', 
        borderLeft: '4px solid #f5c518',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <Info color="#f5c518" size={24} style={{ minWidth: '24px' }} />
        <p style={{ margin: 0, color: '#ccc', fontSize: '14px' }}>
          📌 This analysis is based on previous year CBSE board papers and question banks. Use it to prioritize your revision.
        </p>
      </div>
    </div>
  );
}
