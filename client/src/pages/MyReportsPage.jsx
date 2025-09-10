// src/pages/MyReportsPage.jsx
import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { issueService } from '../services/issueService';
import IssueCard from '../components/common/IssueCard';
import { NavLink } from 'react-router-dom';

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
      <div className="container text-center">
        <h2 className="page-title">Please Log In</h2>
        <p className="page-subtitle">You need to be logged in to view your reports.</p>
        <NavLink to="/login" className="button-primary mt-4">Go to Login</NavLink>
      </div>
    );
  }

  if (loading) {
    return <div className="container text-center">Loading your reports...</div>;
  }
  
  if (error) {
    return <div className="container text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h2 className="page-title">My Reported Issues</h2>
        <p className="page-subtitle">Here is a list of all the issues you have submitted.</p>
      </div>

      {myIssues.length > 0 ? (
        <div className="issues-grid">
          {myIssues.map(issue => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-title">No reports found</div>
          <p className="empty-state-subtitle">You have not submitted any issues yet.</p>
        </div>
      )}
    </div>
  );
};

export default MyReportsPage;