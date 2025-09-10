// src/pages/HomePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { categories } from '../data/mockData';
import IssueCard from '../components/common/IssueCard';
import { Search, Filter } from 'lucide-react';

const HomePage = () => {
  const { issues, user, loading, error } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', padding: '2rem' }}>Loading issues...</div>;
  }

  if (error) {
    return <div className="container" style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>Error: {error}</div>;
  }

  const filteredIssues = issues.filter(issue => {
    const matchesFilter = filter === 'all' || issue.category === filter;
    const matchesSearch = (issue.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                          (issue.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="hero-section">
        <h2 className="hero-title">Welcome to the Civic Connect Platform!</h2>
        <p className="hero-subtitle">Report civic issues, track progress, and help build a better community.</p>
        <button onClick={() => navigate('/report')} className="hero-button">
          Report an Issue
        </button>
      </div>

      {/* Stats Section */}
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-number text-blue-600">{issues.length}</div><div className="stat-label">Total Issues</div></div>
        <div className="stat-card"><div className="stat-number text-green-600">{issues.filter(i => i.status === 'resolved').length}</div><div className="stat-label">Resolved</div></div>
        <div className="stat-card"><div className="stat-number text-yellow-600">{issues.filter(i => i.status === 'in-progress').length}</div><div className="stat-label">In Progress</div></div>
        <div className="stat-card">
          <div className="stat-number text-purple-600">{user ? user.points : 0}</div>
          <div className="stat-label">Your Points</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search issues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-select-wrapper">
          <Filter className="filter-icon" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Issues List */}
      <div className="issues-grid">
        {filteredIssues.map(issue => (
          // Use issue.id for the key, which comes from Firestore
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>

      {filteredIssues.length === 0 && !loading && (
        <div className="empty-state">
          <div className="empty-state-title">No issues found</div>
          <p className="empty-state-subtitle">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;