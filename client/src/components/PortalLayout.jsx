import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function PortalLayout({ children, portal, title }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', display: 'flex' }}>
      <Sidebar portal={portal} />
      <div style={{ marginLeft: '240px', display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
        <Navbar portal={portal} title={title} />
        <main style={{ padding: '32px', flex: 1, maxWidth: '1100px', margin: '0 auto', width: '100%' }} className="page-enter">
          {children}
        </main>
      </div>
    </div>
  );
}
