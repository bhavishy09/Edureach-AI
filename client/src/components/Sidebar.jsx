import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Lightbulb, FileText, Calendar, ClipboardList, Settings, Presentation, ClipboardCheck, BarChart3, Users, ToggleLeft, Building2 } from 'lucide-react';
import { GraduationCap } from 'lucide-react';

export default function Sidebar({ portal }) {
  const location = useLocation();

  const portalConfig = {
    student: {
      color: 'var(--accent-blue)',
      bgActive: 'var(--portal-bg)',
      links: [
        { label: 'Home', path: '/student', icon: Home },
        { label: 'Doubt Solver', path: '/student/doubts', icon: Lightbulb },
        { label: 'My Notes', path: '/student/notes', icon: FileText },
        { label: 'Exam Planner', path: '/student/planner', icon: Calendar },
        { label: 'Assignments', path: '/student/assignments', icon: ClipboardList },
        { label: 'Settings', path: '/student/settings', icon: Settings },
      ]
    },
    teacher: {
      color: 'var(--accent-purple)',
      bgActive: 'var(--portal-bg)',
      links: [
        { label: 'Overview', path: '/teacher', icon: Presentation },
        { label: 'Quiz Generator', path: '/teacher/quiz', icon: FileText },
        { label: 'Assignments', path: '/teacher/assignments', icon: ClipboardCheck },
        { label: 'Student Progress', path: '/teacher/progress', icon: BarChart3 },
        { label: 'Settings', path: '/teacher/settings', icon: Settings },
      ]
    },
    admin: {
      color: 'var(--accent-orange)',
      bgActive: 'var(--portal-bg)',
      links: [
        { label: 'Dashboard', path: '/admin', icon: BarChart3 },
        { label: 'Users', path: '/admin/users', icon: Users },
        { label: 'Feature Toggles', path: '/admin/features', icon: ToggleLeft },
        { label: 'Schools', path: '/admin/schools', icon: Building2 },
        { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
        { label: 'Settings', path: '/admin/settings', icon: Settings },
      ]
    }
  };

  const config = portalConfig[portal];

  return (
    <aside style={{
      width: '240px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      backgroundColor: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 40
    }}>
      <div style={{ height: '56px', display: 'flex', alignItems: 'center', padding: '0 24px', borderBottom: '1px solid var(--border)' }}>
        <GraduationCap size={24} color={config.color} style={{ marginRight: '8px' }} />
        <span style={{ fontFamily: 'Fraunces', fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>EduReach AI</span>
      </div>

      <nav style={{ flex: 1, padding: '16px 8px', overflowY: 'auto' }}>
        {config.links.map(link => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          
          return (
            <NavLink 
              key={link.path} 
              to={link.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                height: '44px',
                borderRadius: '10px',
                textDecoration: 'none',
                marginBottom: '4px',
                backgroundColor: isActive ? config.bgActive : 'transparent',
                color: isActive ? config.color : 'var(--text-secondary)',
                fontWeight: isActive ? '600' : '500',
                fontSize: '14px',
                transition: 'all 150ms ease'
              }}
            >
              <Icon size={20} style={{ marginRight: '12px', color: isActive ? config.color : 'var(--text-muted)' }} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
      
      <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
          EduReach AI v1.0
        </div>
      </div>
    </aside>
  );
}
