import React from 'react';
import { Bell } from 'lucide-react';

export default function Navbar({ portal, title }) {
  return (
    <header style={{
      height: '56px',
      backgroundColor: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 30
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontWeight: '500', color: 'var(--text-muted)' }}>
          <span style={{ textTransform: 'capitalize' }}>{portal}</span> / <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{title}</span>
        </h3>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ background: 'var(--bg-tertiary)', borderRadius: '999px', border: '1px solid var(--border)', padding: '2px', display: 'flex' }}>
          <span style={{ padding: '4px 12px', background: 'var(--accent-blue)', color: '#fff', borderRadius: '999px', fontSize: '12px', fontWeight: '600' }}>EN</span>
          <span style={{ padding: '4px 12px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>HI</span>
        </div>

        <div style={{ position: 'relative', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <Bell size={20} />
          <div style={{ position: 'absolute', top: 0, right: 0, width: '8px', height: '8px', backgroundColor: 'var(--accent-red)', borderRadius: '50%', border: '2px solid #fff' }}></div>
        </div>

        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', overflow: 'hidden', border: '1px solid var(--border)', cursor: 'pointer' }}>
          <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix" alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
    </header>
  );
}
