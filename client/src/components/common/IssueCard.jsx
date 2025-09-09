import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { issueService } from '../../services/issueService';
import toast from 'react-hot-toast';
import { MapPin, User, Star, CheckCircle, BrainCircuit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IssueCard = ({ issue }) => {
  const { user } = useApp();
  const navigate = useNavigate();
  
  const hasUpvoted = user && issue.upvotedBy && issue.upvotedBy.includes(user.uid);

  const handleUpvote = async () => {
    if (!user) {
      toast.error("You must be logged in to upvote.");
      return navigate('/login');
    }
    if (hasUpvoted) {
      toast.error("You've already upvoted this issue.");
      return;
    }

    try {
      await issueService.upvoteIssue(issue.id);
      toast.success("Issue upvoted!");
    } catch (error) {
      console.error("Failed to upvote:", error);
      toast.error(error.message || "Failed to upvote issue.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'status-resolved';
      case 'in-progress': return 'status-in-progress';
      default: return 'status-pending';
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-issue-title">{issue.title}</h3>
        <div className="flex space-x-2">
          <span className={`badge ${getStatusColor(issue.status)}`}>{issue.status}</span>
        </div>
      </div>
      {issue.imageUrl && (
        <img src={issue.imageUrl} alt={issue.title} className="card-image" />
      )}
      <div className="card-body">
        <p className="card-description">{issue.description}</p>
        <div className="card-meta">
          <div className="meta-item"><MapPin className="w-4 h-4" /><span>{issue.location?.address}</span></div>
          <div className="meta-item"><User className="w-4 h-4" /><span>{issue.reportedBy?.substring(0, 6) || 'N/A'}...</span></div>
        </div>
      </div>
      <div className="card-footer">
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleUpvote} 
            className={`upvote-button ${hasUpvoted ? 'text-yellow-500' : 'text-blue-600'}`}
            disabled={hasUpvoted}
          >
            <Star className="w-4 h-4" fill={hasUpvoted ? 'currentColor' : 'none'} />
            <span>{issue.upvotes}</span>
          </button>
          {issue.verified && <div className="verified-badge"><CheckCircle className="w-4 h-4" /><span>Verified</span></div>}
        </div>
        <div className="text-xs text-gray-500">
          {issue.reportedAt ? issue.reportedAt.toLocaleDateString() : 'N/A'}
        </div>
      </div>

      {/* --- ADD THIS NEW SECTION FOR AI LABELS --- */}
      {issue.aiLabels && issue.aiLabels.length > 0 && (
        <div className="ai-footer">
          <div className="flex items-center gap-2 text-purple-600">
            <BrainCircuit className="w-4 h-4" />
            <div className="flex flex-wrap gap-1">
              {issue.aiLabels.slice(0, 4).map(label => (
                <span key={label} className="ai-badge bg-purple-50 text-purple-600">{label}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueCard;