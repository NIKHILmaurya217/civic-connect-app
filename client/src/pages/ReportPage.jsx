// src/pages/ReportPage.jsx
import React from 'react';
import ReportForm from '../components/report/ReportForm';
import { FileText, Users, Target, TrendingUp } from 'lucide-react';

const ReportPage = () => {
    return (
        <div className="min-h-screen bg-gray-25">
            <div className="container section">
                {/* Hero Section */}
                <div className="hero mb-16 animate-slide-up">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Report a Civic Issue
                        </h1>
                        <p className="hero-subtitle">
                            Help improve your community by reporting infrastructure problems, safety concerns, or other civic issues that need attention.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Form Section */}
                    <div className="lg:col-span-2">
                        <div className="card animate-fade-in">
                            <div className="card-content p-8">
                                <ReportForm />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Information */}
                    <div className="space-y-8">
                        {/* Impact Information */}
                        <div className="card animate-scale-in">
                            <div className="card-content p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                        <Target className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Your Impact</h3>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">
                                    Every report you submit helps build a better community. Here's how:
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <div className="text-sm text-gray-700">
                                            <span className="font-medium">Earn +10 civic points</span> for each report
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-success-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <div className="text-sm text-gray-700">
                                            <span className="font-medium">Get +15 bonus points</span> when resolved
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-warning-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <div className="text-sm text-gray-700">
                                            <span className="font-medium">Help prioritize</span> community needs
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reporting Guidelines */}
                        <div className="card animate-fade-in">
                            <div className="card-content p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-success-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Guidelines</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-sm text-gray-800 mb-2">What to Report</h4>
                                        <ul className="text-xs text-gray-600 space-y-1">
                                            <li>• Potholes and road damage</li>
                                            <li>• Broken streetlights</li>
                                            <li>• Graffiti and vandalism</li>
                                            <li>• Traffic signal issues</li>
                                            <li>• Park maintenance needs</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm text-gray-800 mb-2">Best Practices</h4>
                                        <ul className="text-xs text-gray-600 space-y-1">
                                            <li>• Be specific and detailed</li>
                                            <li>• Include clear photos</li>
                                            <li>• Provide exact location</li>
                                            <li>• Check for duplicates first</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tips & Encouragement */}
                        <div className="card animate-scale-in">
                            <div className="card-content p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-warning-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Make an Impact</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Users className="w-4 h-4 text-primary-600" />
                                            <span className="text-sm font-semibold text-primary-800">
                                                Community Driven
                                            </span>
                                        </div>
                                        <p className="text-xs text-primary-700">
                                            Every report helps build a comprehensive picture of community needs and priorities.
                                        </p>
                                    </div>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                                            <span>Reports are reviewed by local authorities</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                                            <span>Community verification increases priority</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                                            <span>Track progress from report to resolution</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Emergency Notice */}
                        <div className="alert alert-warning animate-fade-in">
                            <div className="alert-icon">
                                ⚠️
                            </div>
                            <div>
                                <div className="font-medium mb-1">Emergency Issues</div>
                                <div className="text-xs">
                                    For urgent safety hazards or emergencies, please contact your local authorities directly at 112 or your city's emergency line.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportPage;