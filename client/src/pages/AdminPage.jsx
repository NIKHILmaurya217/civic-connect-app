import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { NavLink } from 'react-router-dom';
import { issueService } from '../services/issueService';
import toast from 'react-hot-toast';
import AnalyticsChart from '../components/admin/AnalyticsChart';
import { 
  Shield, 
  Settings, 
  Filter, 
  Search, 
  Calendar, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  FileText,
  BarChart3,
  Users,
  TrendingUp
} from 'lucide-react';

const AdminPage = () => {
  const { issues, user, loading } = useApp();
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Filter issues based on search and filters
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || issue.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Get unique categories for filter
  const categories = [...new Set(issues.map(issue => issue.category))];

  // Calculate stats
  const stats = {
    total: issues.length,
    pending: issues.filter(i => i.status === 'pending').length,
    inProgress: issues.filter(i => i.status === 'in-progress').length,
    resolved: issues.filter(i => i.status === 'resolved').length
  };

  const handleStatusChange = async (issueId, newStatus) => {
    const promise = issueService.updateIssueStatus(issueId, newStatus);
    
    toast.promise(promise, {
      loading: 'Updating status...',
      success: 'Status updated successfully!',
      error: 'Failed to update status.',
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'pending': return <AlertTriangle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'badge-success';
      case 'in-progress': return 'badge-warning';
      case 'pending': return 'badge-pending';
      default: return 'badge-pending';
    }
  };
  
  if (!user || user.email !== adminEmail) {
    return (
      <div className="min-h-screen bg-gray-25 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-12 h-12 text-error-600" />
          </div>
          <h2 className="text-display-lg text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-8">
            You do not have permission to view this admin dashboard. Administrator access required.
          </p>
          <NavLink to="/" className="btn btn-primary btn-lg">
            Return to Homepage
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="card">
                  <div className="card-content p-6">
                    <div className="skeleton skeleton-title mb-2"></div>
                    <div className="skeleton skeleton-text"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="card-content p-6">
                <div className="skeleton skeleton-title mb-4"></div>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div key={n} className="flex gap-4">
                      <div className="skeleton skeleton-text flex-1"></div>
                      <div className="skeleton skeleton-text w-20"></div>
                      <div className="skeleton skeleton-text w-20"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-25">
      <div className="container section">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-error-600 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-display-xl text-gray-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Manage and oversee all civic issue reports
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
          <div className="card bg-primary-50 border-primary-200">
            <div className="card-content p-6 text-center">
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {stats.total}
              </div>
              <div className="text-sm font-medium text-gray-700">Total Issues</div>
            </div>
          </div>

          <div className="card bg-warning-50 border-warning-200">
            <div className="card-content p-6 text-center">
              <div className="w-12 h-12 bg-warning-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-warning-600 mb-2">
                {stats.pending}
              </div>
              <div className="text-sm font-medium text-gray-700">Pending</div>
            </div>
          </div>

          <div className="card bg-primary-50 border-primary-200">
            <div className="card-content p-6 text-center">
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {stats.inProgress}
              </div>
              <div className="text-sm font-medium text-gray-700">In Progress</div>
            </div>
          </div>

          <div className="card bg-success-50 border-success-200">
            <div className="card-content p-6 text-center">
              <div className="w-12 h-12 bg-success-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-success-600 mb-2">
                {stats.resolved}
              </div>
              <div className="text-sm font-medium text-gray-700">Resolved</div>
            </div>
          </div>
        </div>

        {/* Analytics Chart */}
        <div className="card mb-8 animate-scale-in">
          <div className="card-content p-8">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-primary-600" />
              <h3 className="text-xl font-bold text-gray-900">Analytics Overview</h3>
            </div>
            <AnalyticsChart issues={issues} />
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card mb-8 animate-fade-in">
          <div className="card-content p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search issues by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="min-w-0 md:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="form-input"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="min-w-0 md:w-48">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="form-input"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredIssues.length} of {issues.length} issues
            </div>
          </div>
        </div>

        {/* Issues Table */}
        <div className="card animate-scale-in">
          <div className="card-content p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Issue Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Reported
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredIssues.length > 0 ? (
                    filteredIssues.map((issue, index) => (
                      <tr key={issue.id} className="hover:bg-gray-25 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText className="w-5 h-5 text-primary-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-gray-900 mb-1 line-clamp-2">
                                {issue.title}
                              </div>
                              <div className="text-sm text-gray-600 line-clamp-2">
                                {issue.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {issue.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`badge ${getStatusColor(issue.status)} inline-flex items-center gap-1`}>
                            {getStatusIcon(issue.status)}
                            <span className="capitalize">{issue.status.replace('-', ' ')}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {issue.reportedAt ? issue.reportedAt.toLocaleDateString() : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select 
                            className="form-input text-sm min-w-0"
                            onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                            value={issue.status}
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <FileText className="w-8 h-8 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Issues Found</h3>
                            <p className="text-gray-600">
                              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                                ? 'Try adjusting your search terms or filters.'
                                : 'No issues have been reported yet.'}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage