import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { categories } from "../../data/mockData";
import toast from "react-hot-toast";
import {
  X,
  Camera,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  AlertTriangle,
  FileText,
  CheckCircle
} from "lucide-react";

const ReportForm = () => {
  const { isOnline, addReport, user } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: null,
    location: null,
  });

  const [locationStatus, setLocationStatus] = useState("idle");

  const handleImageCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const getLocation = async () => {
    setLocationStatus("loading");
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      setLocationStatus("error");
      return;
    }
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
        });
      });
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        address: `Lat: ${position.coords.latitude.toFixed(
          4
        )}, Lng: ${position.coords.longitude.toFixed(4)}`,
      };
      setFormData((prev) => ({ ...prev, location }));
      setLocationStatus("success");
      toast.success("Location captured!");
    } catch (err) {
      console.error("Error getting location:", err);
      setLocationStatus("error");
      toast.error("Could not get location.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to submit a report.");
      return navigate("/login");
    }

    const submissionPromise = async () => {
      const reportData = {
        ...formData,
        reportedBy: user.uid,
      };
      await addReport(reportData, !isOnline);
    };

    toast.promise(submissionPromise(), {
      loading: "Submitting report...",
      success: () => {
        navigate("/");
        return "Report submitted successfully!";
      },
      error: () => "Submission failed. Report saved offline.",
    });
  };

  return (
    <div className="space-y-8">
      {/* Form Header */}
      <div className="text-center animate-fade-in">
        <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-success-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Report an Issue</h2>
        <p className="text-gray-600">Help improve your community by reporting civic issues</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Issue Title */}
        <div className="form-group animate-slide-up">
          <label htmlFor="title" className="form-label">
            Issue Title *
          </label>
          <input
            id="title"
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
            className="form-input"
            placeholder="e.g., Large pothole on Main Street near City Hall"
          />
        </div>

        {/* Category Selection */}
        <div className="form-group animate-slide-up">
          <label htmlFor="category" className="form-label">Category *</label>
          <select
            id="category"
            required
            value={formData.category}
            onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
            className="form-input"
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="form-group animate-slide-up">
          <label htmlFor="description" className="form-label">
            Description *
          </label>
          <textarea
            id="description"
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
            className="form-input form-textarea"
            placeholder="Provide detailed information about the issue, including location details, severity, and any safety concerns..."
          />
        </div>

        {/* Photo Evidence */}
        <div className="form-group animate-slide-up">
          <label className="form-label">Photo Evidence</label>
          <div className="upload-zone">
            <input
              id="photo-input"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageCapture}
              className="sr-only"
            />
            <label htmlFor="photo-input" className="cursor-pointer block">
              <Camera className="upload-icon mx-auto" />
              <div className="upload-text">Take / Upload Photo</div>
              <div className="upload-subtext">
                PNG, JPG files. Clear photos help prioritize your report.
              </div>
            </label>
          </div>
          {formData.image && (
            <div className="file-preview mt-4">
              <CheckCircle className="file-preview-icon" />
              <span className="file-preview-name">{formData.image.name}</span>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="form-group animate-slide-up">
          <label className="form-label">Location</label>
          <div className="location-section">
            <button
              type="button"
              onClick={getLocation}
              disabled={locationStatus === "loading"}
              className="location-btn"
            >
              <MapPin className="w-5 h-5" />
              <span>
                {locationStatus === "loading" ? "Getting..." : "Get Current Location"}
              </span>
            </button>
            
            {locationStatus === "success" && (
              <div className="location-success">
                <CheckCircle className="w-5 h-5" />
                <span>Location captured successfully!</span>
              </div>
            )}
          </div>
        </div>

        {/* Offline Notice */}
        {!isOnline && (
          <div className="alert alert-warning animate-fade-in">
            <AlertTriangle className="alert-icon" />
            <div>
              <div className="font-medium mb-1">Offline Mode</div>
              <div className="text-sm">
                Your report will be saved and submitted when you're next online.
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="form-actions animate-fade-in">
          <button type="submit" className="btn btn-primary btn-lg w-full">
            Submit Report
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn btn-secondary w-full mt-4"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Alternative Reporting Methods */}
      <div className="card bg-gray-25 border-gray-200 animate-fade-in">
        <div className="card-content p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Alternative Reporting Methods</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="https://wa.me/14155238886"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-success-300 hover:bg-success-25 transition-colors"
            >
              <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-success-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">WhatsApp</div>
                <div className="text-sm text-success-600">Active</div>
              </div>
            </a>
            
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 opacity-60">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Call</div>
                <div className="text-sm text-gray-500">Coming Soon</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 opacity-60">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Send className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">SMS</div>
                <div className="text-sm text-gray-500">Coming Soon</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;