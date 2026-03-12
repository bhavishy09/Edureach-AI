import React, { useState } from 'react';
import { Sparkles, Settings2, FileCheck2 } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';

export default function QuizGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerate = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowPreview(true);
    }, 2000); // Simulate AI generation delay
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ marginBottom: '8px' }}>AI Quiz Generator</h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Instantly create engaging assessments tailored to your syllabus.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: showPreview ? '1fr 1fr' : '1fr', gap: '32px', transition: 'all 0.3s ease' }}>
        
        {/* Configuration Panel */}
        <Card style={{ height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <Settings2 color="var(--accent-blue)" />
            <h2 style={{ fontSize: '20px', margin: 0 }}>Configuration</h2>
          </div>
          
          <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Input label="Topic or Syllabus Link" placeholder="e.g., Photosynthesis or CBSE Class 10 Chapter 6" required />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>Grade Level</label>
                <select className="custom-input" style={{ width: '100%' }}>
                  <option>Class 8</option>
                  <option>Class 9</option>
                  <option>Class 10</option>
                  <option>Class 11</option>
                  <option>Class 12</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>Difficulty</label>
                <select className="custom-input" style={{ width: '100%' }}>
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                  <option>Mixed (Adaptive)</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>Question Types</label>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {['Multiple Choice', 'True / False', 'Short Answer', 'Fill in the Blanks'].map((type, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked={i === 0} style={{ accentColor: 'var(--accent-blue)' }} /> {type}
                  </label>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={isGenerating} style={{ marginTop: '16px' }}>
              {isGenerating ? 'Analyzing Syllabus...' : <><Sparkles size={18} style={{ marginRight: '8px' }} /> Generate Quiz</>}
            </Button>
          </form>
        </Card>

        {/* Preview Panel */}
        {showPreview && (
          <div className="page-enter">
            <Card style={{ background: 'var(--bg-tertiary)', border: '2px solid var(--border-focus)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileCheck2 color="var(--accent-green)" />
                  <h2 style={{ fontSize: '20px', margin: 0 }}>Preview Generated Quiz</h2>
                </div>
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-green)', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                  10 Questions Ready
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Sample Question Mock */}
                <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: 'var(--accent-blue)', fontWeight: 'bold', fontSize: '14px' }}>Q1. Multiple Choice</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Medium</span>
                  </div>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: 'var(--text-primary)', lineHeight: '1.5' }}>What is the primary function of chlorophyll in plants?</h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                    <div style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--accent-green)', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>✓</div>
                      To absorb light energy for photosynthesis
                    </div>
                    <div style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                      <span style={{ fontWeight: 'bold', marginRight: '12px', color: 'var(--text-muted)' }}>B</span>
                      To absorb water from the soil
                    </div>
                  </div>
                </div>

                {/* Masked out other questions for briefness */}
                <div style={{ height: '40px', background: 'var(--bg-secondary)', borderRadius: '8px', opacity: 0.5, border: '1px dashed var(--border)' }}></div>
                <div style={{ height: '40px', background: 'var(--bg-secondary)', borderRadius: '8px', opacity: 0.3, border: '1px dashed var(--border)' }}></div>

              </div>

              <div style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
                <Button style={{ flex: 1 }}>Publish to Class</Button>
                <Button variant="secondary" style={{ flex: 1 }}>Edit Manually</Button>
              </div>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
