import React from 'react';
import { useApp } from '../contexts/AppContext';
import { NavLink } from 'react-router-dom';
import { Award, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const DashboardPage = () => {
  const { issues, user } = useApp();

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
  
  // Calculate user-specific stats
  const issuesReportedByUser = issues.filter(i => i.reportedBy === user.uid).length;
  const issuesVerifiedByUser = issues.filter(i => i.upvotedBy?.includes(user.uid)).length;
  
  const stats = {
    totalReports: issues.length,
    resolved: issues.filter(i => i.status === 'resolved').length,
    inProgress: issues.filter(i => i.status === 'in-progress').length,
    pending: issues.filter(i => i.status === 'pending').length
  };

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
            <div className="text-2xl font-bold text-blue-600">{user.points || 0}</div>
            <div className="text-gray-600">Civic Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{issuesReportedByUser}</div>
            <div className="text-gray-600">Issues Reported</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{issuesVerifiedByUser}</div>
            <div className="text-gray-600">Issues Verified</div>
          </div>
        </div>
      </div>

      {/* Overall Stats Grid (remains the same) */}
      <div className="stats-grid mb-8">
        {/* ... */}
      </div>
    </div>
  );
};

export default DashboardPage;