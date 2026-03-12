import React from 'react';
import { Users, Server, Building2, Bell } from 'lucide-react';
import Card from '../../components/Card';

export default function AdminDashboard() {
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ marginBottom: '8px' }}>System Overview</h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Monitor platform health, active users, and system alerts.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
        <Card hover style={{ borderTop: '4px solid var(--accent-orange)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '12px', borderRadius: '12px' }}>
              <Users size={28} color="var(--accent-orange)" />
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, fontWeight: '600' }}>Total Users</p>
              <h2 style={{ fontSize: '32px', margin: 0 }}>15,420</h2>
            </div>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--accent-green)', fontWeight: '600' }}>+2.4% this week</div>
        </Card>
        
        <Card hover style={{ borderTop: '4px solid var(--accent-blue)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(225, 29, 116, 0.15)', padding: '12px', borderRadius: '12px' }}>
              <Building2 size={28} color="var(--accent-blue)" />
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, fontWeight: '600' }}>Active Schools</p>
              <h2 style={{ fontSize: '32px', margin: 0 }}>42</h2>
            </div>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--accent-green)', fontWeight: '600' }}>+1 onboarded</div>
        </Card>

        <Card hover style={{ borderTop: '4px solid var(--accent-green)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '12px', borderRadius: '12px' }}>
              <Server size={28} color="var(--accent-green)" />
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, fontWeight: '600' }}>Platform Uptime</p>
              <h2 style={{ fontSize: '32px', margin: 0, color: 'var(--accent-green)' }}>99.99%</h2>
            </div>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>All systems operational</div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <Card>
          <h2 style={{ marginBottom: '24px', fontSize: '20px' }}>User Registration Analytics</h2>
          <div style={{ height: '300px', background: 'var(--bg-tertiary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border)' }}>
            <p style={{ color: 'var(--text-muted)' }}>[Line Chart Placeholder: Registrations over 30 days]</p>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <Bell color="var(--accent-orange)" size={20} />
            <h2 style={{ fontSize: '20px', margin: 0 }}>Recent System Alerts</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { type: 'warning', msg: 'Database connection latency spike detected.', time: '10 mins ago' },
              { type: 'info', msg: 'New school onboarding requested: Apex High.', time: '2 hours ago' },
              { type: 'success', msg: 'Daily backup completed successfully.', time: '6 hours ago' },
              { type: 'error', msg: 'Failed API request from unrecognized IP.', time: '1 day ago' },
            ].map((alert, i) => (
              <div key={i} style={{ padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: `3px solid ${alert.type === 'error' ? 'var(--accent-red)' : alert.type === 'warning' ? 'var(--accent-orange)' : alert.type === 'success' ? 'var(--accent-green)' : 'var(--accent-blue)'}` }}>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-primary)', fontWeight: '500' }}>{alert.msg}</p>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{alert.time}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
