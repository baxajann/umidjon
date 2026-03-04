import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { DataProvider } from './context/DataContext.jsx';
import { AppLayout } from './components/Layout/AppLayout.jsx';
import { LandingPage } from './pages/Landing/LandingPage.jsx';
import { LoginPage } from './pages/Auth/LoginPage.jsx';
import { RegisterPage } from './pages/Auth/RegisterPage.jsx';
import { DashboardPage } from './pages/Dashboard/DashboardPage.jsx';
import { ProjectsPage } from './pages/Projects/ProjectsPage.jsx';
import { ProjectDetailPage } from './pages/Projects/ProjectDetailPage.jsx';
import { TasksPage } from './pages/Tasks/TasksPage.jsx';
import { MarketplacePage } from './pages/Marketplace/MarketplacePage.jsx';
import { AdminPage } from './pages/Admin/AdminPage.jsx';
import { NotificationsPage } from './pages/Notifications/NotificationsPage.jsx';
import { ProfilePage } from './pages/Profile/ProfilePage.jsx';
import { canAccessAdmin } from './utils/helpers.js';

function ProtectedRoute({ children, adminOnly = false }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-base)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: 12, animation: 'pulse 1s infinite' }}>⚡</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Загрузка...</div>
      </div>
    </div>
  );

  if (!currentUser) return <Navigate to="/login" state={{ from: location }} replace />;
  if (adminOnly && !canAccessAdmin(currentUser.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={currentUser ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* PROTECTED - wrapped in AppLayout */}
      <Route path="/dashboard" element={
        <ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>
      } />
      <Route path="/projects" element={
        <ProtectedRoute><AppLayout><ProjectsPage /></AppLayout></ProtectedRoute>
      } />
      <Route path="/projects/:id" element={
        <ProtectedRoute><AppLayout><ProjectDetailPage /></AppLayout></ProtectedRoute>
      } />
      <Route path="/tasks" element={
        <ProtectedRoute><AppLayout><TasksPage /></AppLayout></ProtectedRoute>
      } />
      <Route path="/marketplace" element={
        <ProtectedRoute><AppLayout><MarketplacePage /></AppLayout></ProtectedRoute>
      } />
      <Route path="/notifications" element={
        <ProtectedRoute><AppLayout><NotificationsPage /></AppLayout></ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute><AppLayout><ProfilePage /></AppLayout></ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute adminOnly><AppLayout><AdminPage /></AppLayout></ProtectedRoute>
      } />
      <Route path="/admin/*" element={
        <ProtectedRoute adminOnly><AppLayout><AdminPage /></AppLayout></ProtectedRoute>
      } />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
