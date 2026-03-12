import React, { useState } from 'react';
import { Search, Flame, Beaker, ShieldCheck } from 'lucide-react';
import Card from '../../components/Card';
import Input from '../../components/Input';

export default function FeatureToggles() {
  const [features, setFeatures] = useState([
    { id: 1, name: 'AI Doubt Solver', desc: 'Enable the generative AI doubt solver for all active Student accounts.', category: 'Core', enabled: true },
    { id: 2, name: 'Teacher Quiz Generator', desc: 'Allow teachers to generate quizzes from a syllabus link.', category: 'Beta', enabled: true },
    { id: 3, name: 'Parent Portal Access', desc: 'Enable the limited-view access portal for registered parents.', category: 'Rollout', enabled: false },
    { id: 4, name: 'Gamification Leaderboard', desc: 'Show points and leaderboards across student dashboards.', category: 'Beta', enabled: false },
    { id: 5, name: 'Flashcard Export to PDF', desc: 'Allow printing auto-generated flashcards directly from Notes.', category: 'Core', enabled: true },
  ]);

  const toggleFeature = (id) => {
    setFeatures(features.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ marginBottom: '8px' }}>Feature Toggles</h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Manage global availability of platform features and beta programs.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <Card hover style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '12px', borderRadius: '12px' }}>
            <ShieldCheck size={24} color="var(--accent-green)" />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, fontWeight: '600' }}>Core Services</p>
            <h2 style={{ fontSize: '24px', margin: 0, color: 'var(--text-primary)' }}>12 Active</h2>
          </div>
        </Card>
        <Card hover style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '12px', borderRadius: '12px' }}>
            <Beaker size={24} color="var(--accent-orange)" />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, fontWeight: '600' }}>Beta Features</p>
            <h2 style={{ fontSize: '24px', margin: 0, color: 'var(--text-primary)' }}>4 Testing</h2>
          </div>
        </Card>
        <Card hover style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(225, 29, 116, 0.15)', padding: '12px', borderRadius: '12px' }}>
            <Flame size={24} color="var(--accent-blue)" />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, fontWeight: '600' }}>Deprecations</p>
            <h2 style={{ fontSize: '24px', margin: 0, color: 'var(--text-primary)' }}>0 Pending</h2>
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ marginBottom: '24px', position: 'relative' }}>
          <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '12px' }} />
          <Input placeholder="Search features..." style={{ paddingLeft: '48px', width: '100%', marginBottom: 0 }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {features.map((feature) => (
            <div key={feature.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)' }}>{feature.name}</h3>
                  <span style={{ 
                    padding: '2px 8px', 
                    borderRadius: '999px', 
                    fontSize: '11px', 
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    background: feature.category === 'Core' ? 'rgba(16, 185, 129, 0.15)' : feature.category === 'Beta' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(139, 92, 246, 0.15)',
                    color: feature.category === 'Core' ? 'var(--accent-green)' : feature.category === 'Beta' ? 'var(--accent-orange)' : 'var(--accent-purple)'
                  }}>
                    {feature.category}
                  </span>
                </div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '80%' }}>{feature.desc}</p>
              </div>
              
              <div 
                onClick={() => toggleFeature(feature.id)}
                style={{ 
                  width: '56px', 
                  height: '32px', 
                  borderRadius: '16px', 
                  background: feature.enabled ? 'var(--accent-orange)' : 'var(--border)', 
                  position: 'relative', 
                  cursor: 'pointer',
                  transition: 'background 200ms ease'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#fff',
                  position: 'absolute',
                  top: '4px',
                  left: feature.enabled ? '28px' : '4px',
                  transition: 'left 200ms ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
