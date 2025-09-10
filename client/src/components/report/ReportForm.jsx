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
    title: '', description: '', category: '', priority: 'medium', image: null, location: null
  });
  const [locationStatus, setLocationStatus] = useState('idle');

  const handleImageCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const getLocation = async () => {
    // ... (This function remains the same)
  };

  const handleSubmit = (e) => {
    // ... (This function remains the same)
  };

  return (
    <div className="form-container">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Report an Issue</h2>
          <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full"><X/></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* All the form fields remain the same */}
            
            {/* --- MODIFIED ALTERNATIVE REPORTING SECTION --- */}
            <div className="alt-reporting">
              <h3 className="font-medium mb-3">Alternative Reporting Methods</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="alt-reporting-item">
                  <MessageSquare className="w-4 h-4 text-green-600"/>
                  <span>WhatsApp: (Active)</span>
                </div>
                <div className="alt-reporting-item">
                  <Phone className="w-4 h-4 text-gray-400"/>
                  <span>Call (IVR): (Coming Soon)</span>
                </div>
                <div className="alt-reporting-item">
                  <Send className="w-4 h-4 text-gray-400"/>
                  <span>SMS: (Coming Soon)</span>
                </div>
              </div>
            </div>
            
            {!isOnline && <div className="notice notice-warning">{/* ... */}</div>}

            <div className="flex space-x-4"><button type="submit" className="button-primary flex-1">Submit Report</button><button type="button" onClick={() => navigate('/')} className="button-secondary">Cancel</button></div>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;