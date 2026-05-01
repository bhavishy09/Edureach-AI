import React from 'react';
import { ClipboardCheck, Plus, Search } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';

export default function TeacherAssignments() {
  const [assignments, setAssignments] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch('/api/quiz/all');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load assignments');
        setAssignments(data.quizzes || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

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
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Loading assignments...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: 'var(--accent-red)' }}>
                    Error loading assignments: {error}
                  </td>
                </tr>
              ) : assignments.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No assignments found. Create one above.
                  </td>
                </tr>
              ) : (
                assignments.map((assignment) => (
                  <tr key={assignment.quiz_id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 150ms ease' }} className="table-row-hover">
                    <td style={{ padding: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: 'var(--bg-tertiary)', padding: '8px', borderRadius: '8px' }}>
                          <ClipboardCheck size={18} color="var(--accent-purple)" />
                        </div>
                        {assignment.title}
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{assignment.grade}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: '999px', 
                        fontSize: '12px', 
                        fontWeight: 'bold',
                        background: assignment.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-tertiary)',
                        color: assignment.status === 'active' ? 'var(--accent-green)' : 'var(--text-muted)',
                        textTransform: 'capitalize'
                      }}>
                        {assignment.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-primary)', fontWeight: '500' }}>-</td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{assignment.due_date || 'No due date'}</td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <Button variant="secondary" style={{ height: '32px', padding: '0 16px', fontSize: '13px' }}>View Details</Button>
                    </td>
                  </tr>
                ))
              )}
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
