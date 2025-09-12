import React, { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Award, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  FileText,
  ThumbsUp,
  Calendar,
  BarChart3,
  Target,
  Star,
  Activity,
  Plus
} from 'lucide-react';

const DashboardPage = () => {
  const { issues, user } = useApp();
  const navigate = useNavigate();

  // Calculate comprehensive statistics
  const stats = useMemo(() => {
    if (!user || !issues.length) {
      return {
        userStats: {
          totalReports: 0,
          issuesVerified: 0,
          pointsEarned: user?.points || 0,
          resolutionRate: 0
        },
        systemStats: {
          totalReports: 0,
          resolved: 0,
          inProgress: 0,
          pending: 0
        },
        recentActivity: []
      };
    }

    const userIssues = issues.filter(i => i.reportedBy === user.uid);
    const userVerifications = issues.filter(i => i.upvotedBy?.includes(user.uid));
    const resolvedUserIssues = userIssues.filter(i => i.status === 'resolved');

    // Recent activity for user
    const userActivity = [
      ...userIssues.slice(0, 3).map(issue => ({
        type: 'reported',
        title: issue.title,
        date: issue.reportedAt,
        status: issue.status
      })),
      ...userVerifications.slice(0, 2).map(issue => ({
        type: 'verified',
        title: issue.title,
        date: issue.reportedAt,
        status: issue.status
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    return {
      userStats: {
        totalReports: userIssues.length,
        issuesVerified: userVerifications.length,
        pointsEarned: user.points || 0,
        resolutionRate: userIssues.length > 0 ? Math.round((resolvedUserIssues.length / userIssues.length) * 100) : 0
      },
      systemStats: {
        totalReports: issues.length,
        resolved: issues.filter(i => i.status === 'resolved').length,
        inProgress: issues.filter(i => i.status === 'in-progress').length,
        pending: issues.filter(i => i.status === 'pending').length
      },
      recentActivity: userActivity
    };
  }, [issues, user]);

  const getImpactLevel = (points) => {
    if (points >= 100) return { level: 'Champion', color: 'text-primary-600', bgColor: 'bg-primary-100' };
    if (points >= 50) return { level: 'Advocate', color: 'text-success-600', bgColor: 'bg-success-100' };
    if (points >= 25) return { level: 'Contributor', color: 'text-warning-600', bgColor: 'bg-warning-100' };
    return { level: 'Newcomer', color: 'text-gray-600', bgColor: 'bg-gray-100' };
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'reported': return FileText;
      case 'verified': return ThumbsUp;
      default: return Activity;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-25 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-12 h-12 text-primary-600" />
          </div>
          <h2 className="text-display-lg text-gray-900 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-8">
            Please log in to view your personal dashboard and track your civic engagement.
          </p>
          <NavLink to="/login" className="btn btn-primary btn-lg">
            Sign In to Continue
          </NavLink>
        </div>
      </div>
    );
  }

  const impactLevel = getImpactLevel(stats.userStats.pointsEarned);

  return (
    <div className="min-h-screen bg-gray-25">
      <div className="container section">
        {/* Welcome Header */}
        <div className="mb-8 animate-slide-up">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-display-xl text-gray-900 mb-2">
                Welcome back, {user.displayName || user.email?.split('@')[0]}!
              </h1>
              <p className="text-gray-600">
                Here's your civic engagement overview and community impact
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => navigate('/report')}
                className="btn btn-primary"
              >
                <Plus className="btn-icon" />
                Report Issue
              </button>
              <NavLink to="/my-reports" className="btn btn-secondary">
                View My Reports
              </NavLink>
            </div>
          </div>
        </div>

        {/* User Impact Section */}
        <div className="card mb-8 bg-gradient-to-r from-primary-50 to-success-50 border-primary-200 animate-fade-in">
          <div className="card-content p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-success-600 rounded-2xl flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Your Civic Impact
                </h2>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${impactLevel.bgColor} ${impactLevel.color}`}>
                    <Star className="w-4 h-4 mr-1" />
                    {impactLevel.level}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {stats.userStats.pointsEarned}
                </div>
                <div className="text-gray-700 font-medium">Civic Points</div>
                <div className="text-xs text-gray-500 mt-1">Earned through engagement</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-success-600 mb-2">
                  {stats.userStats.totalReports}
                </div>
                <div className="text-gray-700 font-medium">Issues Reported</div>
                <div className="text-xs text-gray-500 mt-1">Your contributions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-warning-600 mb-2">
                  {stats.userStats.issuesVerified}
                </div>
                <div className="text-gray-700 font-medium">Issues Verified</div>
                <div className="text-xs text-gray-500 mt-1">Community validation</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {stats.userStats.resolutionRate}%
                </div>
                <div className="text-gray-700 font-medium">Resolution Rate</div>
                <div className="text-xs text-gray-500 mt-1">Issues resolved</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Community Overview */}
          <div className="lg:col-span-2 space-y-8">
            {/* System Statistics */}
            <div className="card animate-scale-in">
              <div className="card-content p-6">
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="w-6 h-6 text-primary-600" />
                  <h3 className="text-xl font-bold text-gray-900">Community Overview</h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {stats.systemStats.totalReports}
                    </div>
                    <div className="text-sm text-gray-600">Total Reports</div>
                  </div>

                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="w-6 h-6 text-success-600" />
                    </div>
                    <div className="text-2xl font-bold text-success-600 mb-1">
                      {stats.systemStats.resolved}
                    </div>
                    <div className="text-sm text-gray-600">Resolved</div>
                  </div>

                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-6 h-6 text-warning-600" />
                    </div>
                    <div className="text-2xl font-bold text-warning-600 mb-1">
                      {stats.systemStats.inProgress}
                    </div>
                    <div className="text-sm text-gray-600">In Progress</div>
                  </div>

                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-error-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <AlertTriangle className="w-6 h-6 text-error-600" />
                    </div>
                    <div className="text-2xl font-bold text-error-600 mb-1">
                      {stats.systemStats.pending}
                    </div>
                    <div className="text-sm text-gray-600">Pending</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card animate-fade-in">
              <div className="card-content p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-6 h-6 text-success-600" />
                  <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => navigate('/report')}
                    className="p-6 bg-primary-50 border-2 border-primary-200 rounded-xl hover:bg-primary-100 hover:border-primary-300 transition-all text-left group"
                  >
                    <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Report New Issue</h4>
                    <p className="text-sm text-gray-600">
                      Help improve your community by reporting a civic issue
                    </p>
                  </button>

                  <button 
                    onClick={() => navigate('/')}
                    className="p-6 bg-success-50 border-2 border-success-200 rounded-xl hover:bg-success-100 hover:border-success-300 transition-all text-left group"
                  >
                    <div className="w-12 h-12 bg-success-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                      <ThumbsUp className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Verify Issues</h4>
                    <p className="text-sm text-gray-600">
                      Help validate community issues by upvoting them
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-8">
            <div className="card animate-slide-up">
              <div className="card-content p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="w-6 h-6 text-primary-600" />
                  <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                </div>
                
                {stats.recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {stats.recentActivity.map((activity, index) => {
                      const IconComponent = getActivityIcon(activity.type);
                      return (
                        <div 
                          key={index}
                          className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-4 h-4 text-primary-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-900 mb-1">
                              {activity.type === 'reported' ? 'Reported:' : 'Verified:'} {activity.title}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              {activity.date?.toLocaleDateString()}
                              <span className={`badge badge-${
                                activity.status === 'resolved' ? 'success' : 
                                activity.status === 'in-progress' ? 'warning' : 'pending'
                              } text-xs`}>
                                {activity.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Activity className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 mb-4">No recent activity</p>
                    <button 
                      onClick={() => navigate('/report')}
                      className="btn btn-sm btn-primary"
                    >
                      Get Started
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Toward Next Level */}
            <div className="card animate-fade-in">
              <div className="card-content p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Progress to Next Level</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Current: {impactLevel.level}</span>
                      <span className="text-gray-600">
                        {stats.userStats.pointsEarned >= 100 ? 'Max Level!' : 
                         stats.userStats.pointsEarned >= 50 ? '50 more to Champion' :
                         stats.userStats.pointsEarned >= 25 ? `${50 - stats.userStats.pointsEarned} more to Advocate` :
                         `${25 - stats.userStats.pointsEarned} more to Contributor`}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-primary-600 to-success-600 h-3 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.min((stats.userStats.pointsEarned / 100) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>

                  {/* Milestone indicators */}
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span className={stats.userStats.pointsEarned >= 0 ? 'text-primary-600 font-medium' : ''}>
                      Newcomer (0)
                    </span>
                    <span className={stats.userStats.pointsEarned >= 25 ? 'text-primary-600 font-medium' : ''}>
                      Contributor (25)
                    </span>
                    <span className={stats.userStats.pointsEarned >= 50 ? 'text-primary-600 font-medium' : ''}>
                      Advocate (50)
                    </span>
                    <span className={stats.userStats.pointsEarned >= 100 ? 'text-primary-600 font-medium' : ''}>
                      Champion (100)
                    </span>
                  </div>
                </div>

                {/* Tips for earning more points */}
                <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
                  <h4 className="font-medium text-gray-900 mb-2">Earn More Points:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Report new issues (+10 points)</li>
                    <li>• Verify other reports (+5 points)</li>
                    <li>• Get your reports resolved (+15 bonus)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;