// src/pages/DashboardPage.jsx
import React from 'react';
import { useApp } from '../contexts/AppContext';
import { NavLink } from 'react-router-dom';
import { Award, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const DashboardPage = () => {
  const { issues, user } = useApp();

  // 1. Add a check to see if a user is logged in.
  if (!user) {
    return (
      <div className="container text-center">
        <h2 className="page-title">Access Denied</h2>
        <p className="page-subtitle">You must be logged in to view this page.</p>
        <NavLink to="/login" className="button-primary" style={{marginTop: '1rem', display: 'inline-block'}}>
          Go to Login
        </NavLink>
      </div>
    );
  }
  
  const stats = {
    totalReports: issues.length,
    resolved: issues.filter(i => i.status === 'resolved').length,
    inProgress: issues.filter(i => i.status === 'in-progress').length,
    pending: issues.filter(i => i.status === 'pending').length
  };

  // 2. The rest of the component will only render if a user exists.
  return (
    <div className="container">
      <div className="page-header">
        <h2 className="page-title">Dashboard</h2>
        <p className="page-subtitle">Overview of civic issues and your contributions</p>
      </div>

      {/* User Stats */}
      <div className="card mb-8">
        <h3 className="card-title"><Award className="w-6 h-6 text-yellow-500 mr-2" />Your Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{user.points}</div>
            <div className="text-gray-600">Civic Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{issues.filter(i => i.reportedBy === user.uid).length}</div>
            <div className="text-gray-600">Issues Reported</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{/* Mock */}12</div>
            <div className="text-gray-600">Issues Verified</div>
          </div>
        </div>
      </div>

      {/* Overall Stats Grid */}
      <div className="stats-grid mb-8">
        <div className="stat-card"><div className="flex items-center justify-between"><div><div className="text-2xl font-bold">{stats.totalReports}</div><div>Total Reports</div></div><div className="stat-icon bg-blue-100"><AlertTriangle className="text-blue-600"/></div></div></div>
        <div className="stat-card"><div className="flex items-center justify-between"><div><div className="text-2xl font-bold">{stats.resolved}</div><div>Resolved</div></div><div className="stat-icon bg-green-100"><CheckCircle className="text-green-600"/></div></div></div>
        <div className="stat-card"><div className="flex items-center justify-between"><div><div className="text-2xl font-bold">{stats.inProgress}</div><div>In Progress</div></div><div className="stat-icon bg-yellow-100"><Clock className="text-yellow-600"/></div></div></div>
        <div className="stat-card"><div className="flex items-center justify-between"><div><div className="text-2xl font-bold">{stats.pending}</div><div>Pending</div></div><div className="stat-icon bg-red-100"><Clock className="text-red-600"/></div></div></div>
      </div>
    </div>
  );
};

export default DashboardPage;