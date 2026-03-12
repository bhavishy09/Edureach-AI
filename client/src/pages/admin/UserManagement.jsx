import React from 'react';
import { Search, UserPlus, Filter, MoreVertical } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';

export default function UserManagement() {
  const users = [
    { id: 'USR102', name: 'Ravi Kumar', role: 'Student', school: 'Apex High', status: 'Active', joined: 'Oct 12, 2024' },
    { id: 'USR089', name: 'Aditi Sharma', role: 'Teacher', school: 'Apex High', status: 'Active', joined: 'Sep 05, 2024' },
    { id: 'USR205', name: 'Priya Patel', role: 'Student', school: 'Oakville Prep', status: 'Inactive', joined: 'Nov 01, 2024' },
    { id: 'USR042', name: 'Mr. Verma', role: 'Teacher', school: 'Greenfield Public', status: 'Active', joined: 'Aug 22, 2024' },
    { id: 'USR311', name: 'Rahul Dev', role: 'Student', school: 'Apex High', status: 'Suspended', joined: 'Dec 15, 2024' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ marginBottom: '8px' }}>User Management</h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>View, edit, and manage accounts across the platform.</p>
        </div>
        <Button style={{ padding: '0 24px', background: 'var(--accent-orange)' }}>
          <UserPlus size={20} style={{ marginRight: '8px' }} /> Add User
        </Button>
      </div>

      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '12px' }} />
            <Input placeholder="Search users by name, ID, or school..." style={{ paddingLeft: '48px', width: '100%', marginBottom: 0 }} />
          </div>
          <Button variant="secondary" style={{ padding: '0 16px', height: '44px' }}>
            <Filter size={18} style={{ marginRight: '8px' }} /> Filters
          </Button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '16px', fontWeight: '600' }}>User</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>Role</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>School</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>Joined</th>
                <th style={{ padding: '16px', fontWeight: '600', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 150ms ease' }} className="table-row-hover">
                  <td style={{ padding: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: user.role === 'Teacher' ? 'rgba(225, 29, 116, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: user.role === 'Teacher' ? 'var(--accent-blue)' : 'var(--accent-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 'bold' }}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>{user.name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 'normal' }}>{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{user.role}</td>
                  <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{user.school}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '8px', 
                      fontSize: '12px', 
                      fontWeight: 'bold',
                      background: user.status === 'Active' ? 'rgba(16, 185, 129, 0.15)' : user.status === 'Suspended' ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-tertiary)',
                      color: user.status === 'Active' ? 'var(--accent-green)' : user.status === 'Suspended' ? 'var(--accent-red)' : 'var(--text-muted)'
                    }}>
                      {user.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{user.joined}</td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', transition: 'background 150ms' }} className="icon-hover">
                      <MoreVertical size={18} color="var(--text-secondary)" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <style>{`
            .table-row-hover:hover {
              background: var(--bg-tertiary);
            }
            .icon-hover:hover {
              background: var(--border);
            }
          `}</style>
        </div>
      </Card>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Showing 1-5 of 15,420 users · <span style={{ color: 'var(--accent-orange)', cursor: 'pointer', fontWeight: '600' }}>Next Page</span></p>
      </div>
    </div>
  );
}
