import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth Pages
import LandingPage from './pages/auth/LandingPage';
import StudentRegister from './pages/auth/StudentRegister';
import TeacherLogin from './pages/auth/TeacherLogin';
import AdminLogin from './pages/auth/AdminLogin';

// Layout & Portals
import PortalLayout from './components/PortalLayout';
import StudentDashboard from './pages/student/StudentDashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register/student" element={<StudentRegister />} />
        <Route path="/login/teacher" element={<TeacherLogin />} />
        <Route path="/login/admin" element={<AdminLogin />} />

        {/* Student Portal */}
        <Route path="/student" element={<PortalLayout portal="student" title="Dashboard"><StudentDashboard /></PortalLayout>} />
        <Route path="/student/*" element={<PortalLayout portal="student" title="Feature Setup">Feature coming soon</PortalLayout>} />

        {/* Teacher / Admin Portals placeholder fallback */}
        <Route path="/teacher/*" element={<PortalLayout portal="teacher" title="Dashboard">Teacher Portal Coming Soon</PortalLayout>} />
        <Route path="/admin/*" element={<PortalLayout portal="admin" title="Dashboard">Admin Portal Coming Soon</PortalLayout>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
