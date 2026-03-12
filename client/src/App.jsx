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

// Teacher Portal
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import QuizGenerator from './pages/teacher/QuizGenerator';
import TeacherAssignments from './pages/teacher/TeacherAssignments';
import StudentProgress from './pages/teacher/StudentProgress';

// Admin Portal
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import FeatureToggles from './pages/admin/FeatureToggles';

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

        {/* Teacher Portal */}
        <Route path="/teacher" element={<PortalLayout portal="teacher" title="Dashboard"><TeacherDashboard /></PortalLayout>} />
        <Route path="/teacher/dashboard" element={<Navigate to="/teacher" replace />} />
        <Route path="/teacher/assignments" element={<PortalLayout portal="teacher" title="Assignments"><TeacherAssignments /></PortalLayout>} />
        <Route path="/teacher/quiz" element={<PortalLayout portal="teacher" title="Quiz Generator"><QuizGenerator /></PortalLayout>} />
        <Route path="/teacher/progress" element={<PortalLayout portal="teacher" title="Student Progress"><StudentProgress /></PortalLayout>} />
        <Route path="/teacher/*" element={<PortalLayout portal="teacher" title="Feature Setup">Feature coming soon</PortalLayout>} />

        {/* Admin Portal */}
        <Route path="/admin" element={<PortalLayout portal="admin" title="System Overview"><AdminDashboard /></PortalLayout>} />
        <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
        <Route path="/admin/users" element={<PortalLayout portal="admin" title="User Management"><UserManagement /></PortalLayout>} />
        <Route path="/admin/toggles" element={<PortalLayout portal="admin" title="Feature Toggles"><FeatureToggles /></PortalLayout>} />
        <Route path="/admin/*" element={<PortalLayout portal="admin" title="Feature Setup">Feature coming soon</PortalLayout>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
