import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { categories } from '../data/mockData';
import IssueCard from '../components/common/IssueCard';
import { Search, Filter, MessageSquare, TrendingUp, CheckCircle, Clock, AlertTriangle, Users, Award, Target } from 'lucide-react';

const HomePage = () => {
  const { issues, user, loading, error } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-25">
        <div className="container section">
          <div className="animate-fade-in">
            <div className="skeleton skeleton-title mb-6"></div>
            <div className="skeleton skeleton-text mb-12"></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="card">
                  <div className="card-content p-6">
                    <div className="skeleton skeleton-avatar mx-auto mb-4"></div>
                    <div className="skeleton skeleton-title mb-2"></div>
                    <div className="skeleton skeleton-text"></div>
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
      <div className="min-h-screen bg-gray-25 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-12 h-12 text-error-600" />
          </div>
          <h2 className="text-display-lg text-gray-900 mb-4">Service Unavailable</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary btn-lg"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  const filteredIssues = issues.filter(issue => {
    const matchesFilter = filter === 'all' || issue.category === filter;
    const matchesSearch = (issue.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                          (issue.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: issues.length,
    resolved: issues.filter(i => i.status === 'resolved').length,
    inProgress: issues.filter(i => i.status === 'in-progress').length,
    pending: issues.filter(i => i.status === 'pending').length
  };

  const resolutionRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-25">
      <div className="container section">
        {/* Enhanced Hero Section */}
        <div className="hero animate-fade-in">
          <div className="hero-content">
            <h1 className="hero-title">
              नागरिक सेवा
              <span className="block text-4xl mt-2 opacity-90">Civic Connect</span>
            </h1>
            <p className="hero-subtitle">
              Empowering citizens to report civic issues, track their resolution, and build stronger communities. 
              Your participation drives positive change in our neighborhoods.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/report')} 
                className="btn btn-primary btn-lg animate-scale-in"
                style={{ animationDelay: '0.2s' }}
              >
                <AlertTriangle className="btn-icon" />
                Report an Issue
              </button>
              <button 
                onClick={() => navigate('/dashboard')} 
                className="btn btn-secondary btn-lg animate-scale-in"
                style={{ animationDelay: '0.3s' }}
              >
                <TrendingUp className="btn-icon" />
                My Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="card bg-primary-50 border-primary-200 hover:shadow-xl transition-all">
            <div className="card-content p-6 text-center">
              <div className="w-14 h-14 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div className="text-3xl font-bold text-primary-600 mb-2">{stats.total}</div>
              <div className="text-sm font-semibold text-gray-700">Community Issues</div>
              <div className="text-xs text-gray-500 mt-1">Total reported</div>
            </div>
          </div>

          <div className="card bg-success-50 border-success-200 hover:shadow-xl transition-all">
            <div className="card-content p-6 text-center">
              <div className="w-14 h-14 bg-success-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div className="text-3xl font-bold text-success-600 mb-2">{stats.resolved}</div>
              <div className="text-sm font-semibold text-gray-700">Issues Resolved</div>
              <div className="text-xs text-gray-500 mt-1">{resolutionRate}% completion rate</div>
            </div>
          </div>

          <div className="card bg-warning-50 border-warning-200 hover:shadow-xl transition-all">
            <div className="card-content p-6 text-center">
              <div className="w-14 h-14 bg-warning-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <div className="text-3xl font-bold text-warning-600 mb-2">{stats.inProgress}</div>
              <div className="text-sm font-semibold text-gray-700">In Progress</div>
              <div className="text-xs text-gray-500 mt-1">Being addressed</div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-primary-50 to-success-50 border-primary-200 hover:shadow-xl transition-all">
            <div className="card-content p-6 text-center">
              <div className="w-14 h-14 bg-gradient-to-r from-primary-600 to-success-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-7 h-7 text-white" />
              </div>
              <div className="text-3xl font-bold text-primary-600 mb-2">{user?.points || 0}</div>
              <div className="text-sm font-semibold text-gray-700">Your Civic Points</div>
              <div className="text-xs text-gray-500 mt-1">Community contribution</div>
            </div>
          </div>
        </div>

        {/* Enhanced WhatsApp Integration */}
        <div className="card mb-12 bg-gradient-to-r from-success-50 via-primary-25 to-success-50 border-success-200 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="card-content p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gradient-to-r from-success-600 to-success-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-2xl font-bold text-gray-900">Alternative Reporting Channel</h3>
                  <span className="badge badge-success text-xs">ACTIVE</span>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Experience seamless civic reporting through our WhatsApp integration. Perfect for quick reports, 
                  photo submissions, and real-time updates when you're on the go.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="https://wa.me/14155238886?text=Hi, I'd like to report a civic issue in my area"
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-primary"
                  >
                    <MessageSquare className="btn-icon" />
                    Launch WhatsApp Reporter
                  </a>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Trusted by community members</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="card mb-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <div className="card-content p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-primary-600" />
              <h3 className="text-lg font-bold text-gray-900">Explore Community Issues</h3>
            </div>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-12 w-full"
                />
              </div>
              <div className="relative min-w-0 lg:w-64">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)} 
                  className="form-input pl-12 w-full"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Results Summary */}
        {searchTerm || filter !== 'all' ? (
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Search className="w-4 h-4 text-primary-600" />
                </div>
                <p className="text-gray-700">
                  <span className="font-bold text-primary-600">{filteredIssues.length}</span> 
                  <span className="text-gray-600"> issue{filteredIssues.length !== 1 ? 's' : ''} found</span>
                  {searchTerm && <span className="text-gray-500"> matching "<span className="font-medium text-gray-700">{searchTerm}</span>"</span>}
                  {filter !== 'all' && <span className="text-gray-500"> in <span className="font-medium text-gray-700">{categories.find(c => c.id === filter)?.name}</span></span>}
                </p>
              </div>
              {(searchTerm || filter !== 'all') && (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setFilter('all');
                  }}
                  className="btn btn-secondary text-sm"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : null}

        {/* Enhanced Issues Display */}
        {filteredIssues.length > 0 ? (
          <div className="grid items-stretch grid-cols-1 h-80 md:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: '0.7s' }}>
            {filteredIssues.map((issue, index) => (
              <div 
                key={issue.id} 
                className="animate-scale-in"
                style={{ animationDelay: `${0.8 + (index * 0.05)}s` }}
              >
                <IssueCard issue={issue} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              {searchTerm || filter !== 'all' ? (
                <Search className="w-12 h-12 text-gray-400" />
              ) : (
                <Target className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {searchTerm || filter !== 'all' ? 'No Matching Issues Found' : 'No Issues Reported Yet'}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm || filter !== 'all' 
                ? "Try adjusting your search terms or browse all categories to find relevant issues."
                : "Be the first to make a difference! Report a civic issue and help improve your community."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {searchTerm || filter !== 'all' ? (
                <>
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setFilter('all');
                    }}
                    className="btn btn-secondary btn-lg"
                  >
                    <Search className="btn-icon" />
                    Browse All Issues
                  </button>
                  <button 
                    onClick={() => navigate('/report')} 
                    className="btn btn-primary btn-lg"
                  >
                    <AlertTriangle className="btn-icon" />
                    Report New Issue
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => navigate('/report')} 
                    className="btn btn-primary btn-lg"
                  >
                    <AlertTriangle className="btn-icon" />
                    Report First Issue
                  </button>
                  <a 
                    href="https://wa.me/14155238886?text=Hi, I'd like to report a civic issue"
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-lg"
                  >
                    <MessageSquare className="btn-icon" />
                    Use WhatsApp
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;