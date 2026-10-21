import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import NetworkLab from './components/NetworkLab';
import Challenges from './components/Challenges';
import Learn from './components/Learn';
import MyNetworks from './components/MyNetworks';
import Progress from './components/Progress';
import Settings from './components/Settings';
import NetworkCanvas from './components/NetworkCanvas';
import GlobalTelemetry from './components/GlobalTelemetry';

// مكون حماية المسارات (Protected Route) المصحح
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem('netforge_user');
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter basename="/netforge-lab">
      <Routes>
        {/* صفحة تسجيل الدخول / الواجهة الرئيسية */}
        <Route path="/" element={<Hero />} />
        
        {/* الصفحات الداخلية المحمية */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/lab" element={<ProtectedRoute><NetworkLab /></ProtectedRoute>} />
        <Route path="/challenges" element={<ProtectedRoute><Challenges /></ProtectedRoute>} />
        <Route path="/learn" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
        <Route path="/networks" element={<ProtectedRoute><MyNetworks /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/canvas" element={<ProtectedRoute><NetworkCanvas /></ProtectedRoute>} />
        <Route path="/global-telemetry" element={<ProtectedRoute><GlobalTelemetry /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;