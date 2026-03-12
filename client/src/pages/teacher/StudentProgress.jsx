import React from 'react';
import { BarChart3, Search, Filter } from 'lucide-react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function StudentProgress() {
  const students = [
    { id: 1, name: 'Ananya Sharma', class: '10 A', grade: 'A+', score: '95%', trend: '+2%' },
    { id: 2, name: 'Rahul Dev', class: '10 A', grade: 'B', score: '78%', trend: '-4%' },
    { id: 3, name: 'Priya Patel', class: '10 B', grade: 'A', score: '88%', trend: '+5%' },
    { id: 4, name: 'Vikram Singh', class: '10 A', grade: 'C+', score: '65%', trend: '+1%' },
    { id: 5, name: 'Sneha Gupta', class: '10 B', grade: 'A+', score: '92%', trend: '0%' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ marginBottom: '8px' }}>Student Progress</h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Analyze individual and class-wide performance metrics.</p>
        </div>
        <Button variant="secondary" style={{ padding: '0 24px' }}>
          <Filter size={20} style={{ marginRight: '8px' }} /> Export Report
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
        <Card style={{ background: 'var(--bg-tertiary)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontWeight: '600' }}>Class Average</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <h2 style={{ fontSize: '32px', margin: 0, color: 'var(--accent-blue)' }}>83.6%</h2>
            <span style={{ color: 'var(--accent-green)', fontWeight: 'bold', fontSize: '14px' }}>+1.2%</span>
          </div>
        </Card>
        <Card style={{ background: 'var(--bg-tertiary)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontWeight: '600' }}>Top Quartile</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <h2 style={{ fontSize: '32px', margin: 0, color: 'var(--text-primary)' }}>&gt; 88%</h2>
          </div>
        </Card>
        <Card style={{ background: 'var(--bg-tertiary)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontWeight: '600' }}>Needs Attention</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <h2 style={{ fontSize: '32px', margin: 0, color: 'var(--accent-red)' }}>12</h2>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>students</span>
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '12px' }} />
            <Input placeholder="Search students by name or ID..." style={{ paddingLeft: '48px', width: '100%', marginBottom: 0 }} />
          </div>
          <select className="custom-input" style={{ width: '200px' }}>
            <option>Class 10 (All Sections)</option>
            <option>Class 10 A</option>
            <option>Class 10 B</option>
          </select>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '16px', fontWeight: '600' }}>Student Name</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>Class</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>Grade</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>Overall Score</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>Term Trend</th>
                <th style={{ padding: '16px', fontWeight: '600', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 150ms ease' }} className="table-row-hover">
                  <td style={{ padding: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-tertiary)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>
                        {student.name.charAt(0)}
                      </div>
                      {student.name}
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{student.class}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '8px', 
                      fontSize: '13px', 
                      fontWeight: 'bold',
                      background: student.grade.startsWith('A') ? 'rgba(16, 185, 129, 0.15)' : student.grade.startsWith('B') ? 'var(--bg-tertiary)' : 'rgba(245, 158, 11, 0.15)',
                      color: student.grade.startsWith('A') ? 'var(--accent-green)' : student.grade.startsWith('B') ? 'var(--text-primary)' : 'var(--accent-orange)'
                    }}>
                      {student.grade}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-primary)', fontWeight: 'bold' }}>{student.score}</td>
                  <td style={{ padding: '16px', color: student.trend.startsWith('+') ? 'var(--accent-green)' : student.trend.startsWith('-') ? 'var(--accent-red)' : 'var(--text-muted)', fontWeight: '500' }}>
                    {student.trend}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <Button variant="secondary" style={{ height: '32px', padding: '0 16px', fontSize: '13px' }}>
                      <BarChart3 size={16} style={{ marginRight: '8px' }}/> View Analytics
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
