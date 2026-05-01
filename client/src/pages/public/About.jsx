import React from 'react';
import PublicNavbar from '../../components/PublicNavbar';
import Footer from '../../components/Footer';
import Card from '../../components/Card';

export default function About() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <PublicNavbar />
      
      <main style={{ flex: 1, paddingTop: '100px', paddingBottom: '64px', maxWidth: '800px', margin: '0 auto', width: '100%', paddingLeft: '24px', paddingRight: '24px' }}>
        
        {/* Section 1 - Overview */}
        <section style={{ marginBottom: '48px', textAlign: 'center' }}>
          <h1 style={{ marginBottom: '16px', color: '#fff' }}>About EduReach AI</h1>
          <p style={{ fontSize: '18px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
            EduReach AI is a premium AI-powered study platform built for Class 10 and Class 12 students across India. It combines the power of Google Gemini with an intuitive interface to deliver real-time academic assistance.
          </p>
        </section>

        {/* Section 2 - Tech Stack */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ marginBottom: '24px', color: '#fff', textAlign: 'center' }}>Tech Stack</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
            {['Frontend: Reactjs', 'Backend: Flask (Python)', 'AI Model: Gemma (API)', 'Framework: LangChain', 'Styling: Tailwind CSS'].map((tech, idx) => (
              <div key={idx} style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--accent-blue)',
                padding: '12px 24px',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontWeight: '500'
              }}>
                {tech}
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 - Team Info */}
        <section>
          <h2 style={{ marginBottom: '24px', color: '#fff', textAlign: 'center' }}>Meet the Team</h2>
          <Card style={{ borderLeft: '4px solid var(--accent-blue)', textAlign: 'center', padding: '32px' }}>
            <h3 style={{ fontSize: '24px', color: 'var(--accent-blue)', marginBottom: '8px' }}>Bhavishya Katariya</h3>
            <p style={{ color: 'var(--text-primary)', fontWeight: '500', marginBottom: '8px' }}>Role: Full Stack & AI Developer</p>
            <p style={{ color: 'var(--text-secondary)' }}>B.Tech pre-Final Year</p>
          </Card>
        </section>

      </main>

      <Footer />
    </div>
  );
}
