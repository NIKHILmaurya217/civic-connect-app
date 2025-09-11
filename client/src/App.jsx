import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import ReportPage from './pages/ReportPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminPage from './pages/AdminPage';
import MyReportsPage from './pages/MyReportsPage';
import { useApp } from './contexts/AppContext';
import { RefreshCw } from 'lucide-react';

function App() {
  const { isSyncing, pendingReports } = useApp();

  return (
    <>
      <div className="min-h-screen bg-gray-50 font-sans">
        <Header />
        <main className="py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/my-reports" element={<MyReportsPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>

        {(isSyncing || (pendingReports && pendingReports.length > 0)) && (
          <div className="status-footer">
            {/* Status footer content here */}
          </div>
        )}
      </div>
      <Toaster position="top-center" />
    </>
  );
}

export default App;