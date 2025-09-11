import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { categories } from '../../data/mockData';
import toast from 'react-hot-toast';
import { X, Camera, MapPin, MessageSquare, Phone, Send, AlertTriangle } from 'lucide-react';

const ReportForm = () => {
  const { isOnline, addReport, user } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', description: '', category: '', image: null, location: null
  });
  const [locationStatus, setLocationStatus] = useState('idle');

  const handleImageCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const getLocation = async () => {
    setLocationStatus('loading');
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      setLocationStatus('error');
      return;
    }
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
      });
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        address: `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`
      };
      setFormData(prev => ({ ...prev, location }));
      setLocationStatus('success');
      toast.success("Location captured!"); // This provides the notice
    } catch (err) {
      console.error('Error getting location:', err);
      setLocationStatus('error');
      toast.error("Could not get location.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to submit a report.");
      return navigate('/login');
    }

    const submissionPromise = async () => {
      const reportData = {
        ...formData,
        reportedBy: user.uid,
      };
      await addReport(reportData, !isOnline);
    };
    
    toast.promise(
      submissionPromise(),
      {
        loading: 'Submitting report...',
        success: () => {
          navigate('/');
          return 'Report submitted successfully!';
        },
        error: (err) => `Submission failed. Report saved offline.`,
      }
    );
  };

  return (
    <div className="form-container">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Report an Issue</h2>
          <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full"><X/></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div><label className="form-label">Issue Title *</label><input type="text" required value={formData.title} onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))} className="form-input" placeholder="e.g., Large pothole on Main St"/></div>
            <div><label className="form-label">Category *</label><select required value={formData.category} onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))} className="form-input"><option value="">Select a category</option>{categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select></div>
            <div><label className="form-label">Description *</label><textarea required rows={4} value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} className="form-input" placeholder="Provide details about the issue..."/></div>
            <div><label className="form-label">Photo Evidence</label><div className="flex items-center space-x-4"><label className="button-secondary"><Camera className="w-5 h-5"/><span>Take Photo</span><input type="file" accept="image/*" capture="environment" onChange={handleImageCapture} className="hidden"/></label>{formData.image && <span className="text-sm text-green-600">{formData.image.name}</span>}</div></div>
            <div><label className="form-label">Location</label><div className="flex items-center space-x-4"><button type="button" onClick={getLocation} disabled={locationStatus === 'loading'} className="button-secondary"><MapPin className="w-5 h-5"/><span>{locationStatus === 'loading' ? 'Getting...' : 'Get Current Location'}</span></button>{locationStatus === 'success' && <span className="text-sm text-green-600">Location captured!</span>}</div></div>
            
            <div className="alt-reporting">
              <h3 className="font-medium mb-3">Alternative Reporting Methods</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <a 
                  href="https://wa.me/14155238886"
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="alt-reporting-item-link"
                >
                  <MessageSquare className="w-4 h-4 text-green-600"/>
                  <span>WhatsApp: (Active)</span>
                </a>
                <div className="alt-reporting-item-disabled">
                  <Phone className="w-4 h-4 text-gray-400"/>
                  <span>Call (IVR): (Coming Soon)</span>
                </div>
                <div className="alt-reporting-item-disabled">
                  <Send className="w-4 h-4 text-gray-400"/>
                  <span>SMS: (Coming Soon)</span>
                </div>
              </div>
            </div>
            
            {!isOnline && <div className="notice notice-warning"><AlertTriangle className="w-5 h-5"/><div><span className="font-medium">Offline Mode</span><p>Your report will be saved and submitted when you're next online.</p></div></div>}

            <div className="flex space-x-4"><button type="submit" className="button-primary flex-1">Submit Report</button><button type="button" onClick={() => navigate('/')} className="button-secondary">Cancel</button></div>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;