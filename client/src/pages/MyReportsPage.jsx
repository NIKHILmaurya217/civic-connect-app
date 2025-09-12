// src/pages/MyReportsPage.jsx
import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { issueService } from '../services/issueService';
import IssueCard from '../components/common/IssueCard';
import { NavLink } from 'react-router-dom';
import { FileText, Plus, AlertCircle } from 'lucide-react';

const MyReportsPage = () => {
  const { user } = useApp();
  const [myIssues, setMyIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch reports only if a user is logged in
    if (user) {
      const fetchMyReports = async () => {
        try {
          setLoading(true);
          const fetchedIssues = await issueService.getMyReports(user.uid);
          // Convert date strings back to Date objects
          const issuesWithDates = fetchedIssues.map(issue => ({
            ...issue,
            reportedAt: new Date(issue.createdAt || issue.reportedAt)
          }));
          setMyIssues(issuesWithDates);
        } catch (err) {
          console.error("Failed to fetch user reports:", err);
          setError("Could not load your reports.");
        } finally {
          setLoading(false);
        }
      };
      fetchMyReports();
    } else {
      // If no user, stop loading and show nothing
      setLoading(false);
    }
  }, [user]); // Rerun this effect if the user object changes

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-25 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-12 h-12 text-primary-600" />
          </div>
          <h2 className="text-display-lg text-gray-900 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-8">
            You need to be logged in to view your reports and track your civic engagement.
          </p>
          <NavLink to="/login" className="btn btn-primary btn-lg">
            Sign In to Continue
          </NavLink>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-25">
        <div className="container section">
          <div className="animate-fade-in">
            <div className="skeleton skeleton-title mb-4"></div>
            <div className="skeleton skeleton-text mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="card">
                  <div className="card-content p-6">
                    <div className="skeleton skeleton-title mb-4"></div>
                    <div className="skeleton skeleton-text mb-2"></div>
                    <div className="skeleton skeleton-text mb-2"></div>
                    <div className="skeleton skeleton-text w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-25">
        <div className="container section">
          <div className="text-center animate-fade-in">
            <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-error-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Reports</h2>
            <p className="text-error-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-25">
      <div className="container section">
        {/* Page Header */}
        <div className="mb-12 animate-slide-up">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-display-xl text-gray-900 mb-2">
                My Reported Issues
              </h1>
              <p className="text-lg text-gray-600">
                Track all the civic issues you've submitted and their progress
              </p>
            </div>
            <NavLink to="/report" className="btn btn-primary">
              <Plus className="btn-icon" />
              Report New Issue
            </NavLink>
          </div>

          {/* Stats Summary */}
          {myIssues.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-in">
              <div className="card bg-primary-50 border-primary-200">
                <div className="card-content p-6 text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">
                    {myIssues.length}
                  </div>
                  <div className="text-sm font-medium text-gray-700">Total Reports</div>
                </div>
              </div>
              <div className="card bg-success-50 border-success-200">
                <div className="card-content p-6 text-center">
                  <div className="text-3xl font-bold text-success-600 mb-2">
                    {myIssues.filter(issue => issue.status === 'resolved').length}
                  </div>
                  <div className="text-sm font-medium text-gray-700">Resolved</div>
                </div>
              </div>
              <div className="card bg-warning-50 border-warning-200">
                <div className="card-content p-6 text-center">
                  <div className="text-3xl font-bold text-warning-600 mb-2">
                    {myIssues.filter(issue => issue.status === 'in-progress').length}
                  </div>
                  <div className="text-sm font-medium text-gray-700">In Progress</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Issues Grid or Empty State */}
        {myIssues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-scale-in">
            {myIssues.map(issue => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              No Reports Yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't submitted any civic issues yet. Start making a difference in your community by reporting your first issue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavLink to="/report" className="btn btn-primary btn-lg">
                <Plus className="btn-icon" />
                Report Your First Issue
              </NavLink>
              <NavLink to="/" className="btn btn-secondary btn-lg">
                Browse Community Issues
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReportsPage;