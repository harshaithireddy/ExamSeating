import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import ChangePassword from './components/ChangePassword';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import InvigilatorDashboard from './pages/InvigilatorDashboard';
import SendNotifications from './pages/SendMails';
import SplashPage from './pages/splash';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('authSession');
    return saved ? JSON.parse(saved) : null;
  });

  const logout = () => {
    sessionStorage.removeItem('authSession');
    setUser(null);
  };

  const ProtectedRoute = ({ roleRequired, children }) => {
    if (!user) return <Navigate to="/login" replace />;
    if (roleRequired && user.role !== roleRequired) return <Navigate to="/login" replace />;
    return children;
  };

  const handleLogin = (userData) => {
    setUser(userData);
    sessionStorage.setItem('authSession', JSON.stringify(userData));
  };

  if (showSplash) {
    return <SplashPage />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/change-password" element={<ChangePassword />} />

        <Route
          path="/dashboard/admin/*"
          element={
            <ProtectedRoute roleRequired="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute roleRequired="student">
              <StudentDashboard logout={logout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/invigilator"
          element={
            <ProtectedRoute roleRequired="invigilator">
              <InvigilatorDashboard logout={logout} />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
