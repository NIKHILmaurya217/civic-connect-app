import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { issueService } from '../../services/issueService';
import toast from 'react-hot-toast';
import { MapPin, User, Star, CheckCircle, Clock, AlertTriangle, BrainCircuit, Calendar, ThumbsUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IssueCard = ({ issue }) => {
  const { user, allUsers } = useApp();
  const navigate = useNavigate();
  
  const hasUpvoted = user && issue.upvotedBy && issue.upvotedBy.includes(user.uid);
  const reporter = allUsers[issue.reportedBy];

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
      toast.error(error.message || "Failed to upvote issue.");
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'resolved': 
        return { 
          badge: 'badge-success', 
          icon: CheckCircle, 
          text: 'Resolved',
          bg: 'bg-success-50',
          border: 'border-success-200'
        };
      case 'in-progress': 
        return { 
          badge: 'badge-warning', 
          icon: Clock, 
          text: 'In Progress',
          bg: 'bg-warning-50',
          border: 'border-warning-200'
        };
      default: 
        return { 
          badge: 'badge-pending', 
          icon: AlertTriangle, 
          text: 'Pending Review',
          bg: 'bg-primary-50',
          border: 'border-primary-200'
        };
    }
  };

  const statusConfig = getStatusConfig(issue.status);
  const StatusIcon = statusConfig.icon;

  // Format location for display
  const formatLocation = (location) => {
    if (!location) return 'Location not specified';
    if (location.address) return location.address;
    if (location.lat && location.lng) {
      return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
    }
    return 'Location provided';
  };

  return (
    <div className={`card hover:shadow-2xl transition-all duration-300 ${statusConfig.bg} ${statusConfig.border} p-4`}>
      {/* Card Header */}
      <div className="card-header">
        <div className="flex items-start justify-between gap-4 line-clamp-2">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1 ">
            {issue.title}
          </h3>
          <div className={`badge ${statusConfig.badge} flex items-center gap-1 flex-shrink-0`}>
            <StatusIcon className="w-3 h-3" />
            <span className="text-xs font-semibold">{statusConfig.text}</span>
          </div>
        </div>
      </div>

      {/* Image Section - Professional Display */}
      {issue.imageUrl && (
        <div className="relative overflow-hidden">
          <img 
            src={issue.imageUrl} 
            alt={`Visual evidence for ${issue.title}`}
            className="card-image hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}

      {/* Content Section */}
      <div className="card-content p-4 space-y-4">
        {/* Description */}
        <div>
          <p className="text-2xl text-gray-700 leading-relaxed line-clamp-4">
            {issue.description}
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="space-y-3">
          {/* Location */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin className="w-4 h-4 text-primary-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-gray-900 mb-1">Location</div>
              <div className="text-sm text-gray-600 break-words">
                {formatLocation(issue.location)}
              </div>
            </div>
          </div>

          {/* Reporter */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-gray-900 mb-1">Reported by</div>
              <div className="text-sm text-gray-600">
                {reporter ? (reporter.displayName || reporter.email?.split('@')[0] || 'Community Member') : 'Anonymous'}
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Calendar className="w-4 h-4 text-gray-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-gray-900 mb-1">Reported on</div>
              <div className="text-sm text-gray-600">
                {issue.reportedAt ? issue.reportedAt.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }) : 'Date not available'}
              </div>
            </div>
          </div>
        </div>

        {/* AI Labels Section */}
        {issue.aiLabels && issue.aiLabels.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                <BrainCircuit className="w-3 h-3 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-purple-800">AI Analysis</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {issue.aiLabels.slice(0, 4).map(label => (
                <span 
                  key={label} 
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200"
                >
                  {label}
                </span>
              ))}
              {issue.aiLabels.length > 4 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  +{issue.aiLabels.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="card-footer">
        <div className="flex items-center justify-between">
          {/* Upvote Button */}
          <button 
            onClick={handleUpvote} 
            disabled={hasUpvoted}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
              ${hasUpvoted 
                ? 'bg-primary-600 text-white cursor-default' 
                : 'bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200 hover:border-primary-300'
              }
            `}
          >
            {hasUpvoted ? (
              <ThumbsUp className="w-4 h-4" fill="currentColor" />
            ) : (
              <ThumbsUp className="w-4 h-4" />
            )}
            <span>{issue.upvotes || 0} {hasUpvoted ? 'Supported' : 'Support'}</span>
          </button>

          {/* Category Badge */}
          <div className="text-right">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
              {issue.category || 'General'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;