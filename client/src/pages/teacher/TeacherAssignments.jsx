import React from 'react';
import { ClipboardCheck, Plus, Search } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';

export default function TeacherAssignments() {
  const assignments = [
    { id: 1, title: 'Cell Biology Quiz', class: 'Class 10 A', status: 'Active', submissions: '32/40', dueDate: 'Today, 5:00 PM' },
    { id: 2, title: 'Physics Numericals', class: 'Class 10 B', status: 'Active', submissions: '15/38', dueDate: 'Tomorrow' },
    { id: 3, title: 'Chemistry Lab Report', class: 'Class 11 Science', status: 'Closed', submissions: '45/45', dueDate: 'Last Week' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ marginBottom: '8px' }}>Assignments</h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Manage quizzes, homework, and track submissions.</p>
        </div>
        <Button style={{ padding: '0 24px' }}>
          <Plus size={20} style={{ marginRight: '8px' }} /> Create New
        </Button>
      </div>

      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '12px' }} />
            <Input placeholder="Search assignments..." style={{ paddingLeft: '48px', width: '100%', marginBottom: 0 }} />
          </div>
          <select className="custom-input" style={{ width: '200px' }}>
            <option>All Classes</option>
            <option>Class 10 A</option>
            <option>Class 10 B</option>
            <option>Class 11 Science</option>
          </select>
          <select className="custom-input" style={{ width: '150px' }}>
            <option>Status: All</option>
            <option>Active</option>
            <option>Closed</option>
          </select>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '16px', fontWeight: '600' }}>Title</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>Class</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>Submissions</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>Due Date</th>
                <th style={{ padding: '16px', fontWeight: '600', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 150ms ease' }} className="table-row-hover">
                  <td style={{ padding: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ background: 'var(--bg-tertiary)', padding: '8px', borderRadius: '8px' }}>
                        <ClipboardCheck size={18} color="var(--accent-purple)" />
                      </div>
                      {assignment.title}
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{assignment.class}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '999px', 
                      fontSize: '12px', 
                      fontWeight: 'bold',
                      background: assignment.status === 'Active' ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-tertiary)',
                      color: assignment.status === 'Active' ? 'var(--accent-green)' : 'var(--text-muted)'
                    }}>
                      {assignment.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-primary)', fontWeight: '500' }}>{assignment.submissions}</td>
                  <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{assignment.dueDate}</td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <Button variant="secondary" style={{ height: '32px', padding: '0 16px', fontSize: '13px' }}>View Details</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <style>{`
            .table-row-hover:hover {
              background: var(--bg-tertiary);
            }
          `}</style>
        </div>
      </Card>
    </div>
  );
}
