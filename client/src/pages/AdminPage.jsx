import React from 'react';
import { useApp } from '../contexts/AppContext';
import { NavLink } from 'react-router-dom';
import { issueService } from '../services/issueService'; // <-- Import the service
import toast from 'react-hot-toast'; // <-- Import toast for notifications
import AnalyticsChart from '../components/admin/AnalyticsChart';

const AdminPage = () => {
  const { issues, user, loading } = useApp();
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

  // This function now calls the service to update the status in the database
  const handleStatusChange = async (issueId, newStatus) => {
    const promise = issueService.updateIssueStatus(issueId, newStatus);
    
    toast.promise(promise, {
      loading: 'Updating status...',
      success: 'Status updated successfully!',
      error: 'Failed to update status.',
    });
    // Because you are using a real-time listener, the UI will update automatically!
  };
  
  if (!user || user.email !== adminEmail) {
    return (
      <div className="container text-center">
        <h2 className="page-title">Access Denied</h2>
        <p className="page-subtitle">You do not have permission to view this page.</p>
        <NavLink to="/" className="button-primary mt-4">Go to Homepage</NavLink>
      </div>
    );
  }

  if (loading) {
    return <div className="container">Loading issues...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h2 className="page-title">Admin Dashboard</h2>
        <p className="page-subtitle">Manage all submitted civic issues.</p>
      </div>
      
      <div className="mb-8">
        <AnalyticsChart issues={issues} />
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Reported On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.map(issue => (
              <tr key={issue.id}>
                <td>{issue.title}</td>
                <td>{issue.category}</td>
                <td><span className={`badge status-${issue.status}`}>{issue.status}</span></td>
                <td>{issue.reportedAt ? issue.reportedAt.toLocaleDateString() : 'N/A'}</td>
                <td>
                  <select 
                    className="filter-select"
                    onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                    value={issue.status}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;