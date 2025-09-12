// src/pages/SignupPage.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase-config';
import toast from 'react-hot-toast';
import { UserPlus, Mail, Lock, Eye, EyeOff, Shield, Users, Award } from 'lucide-react';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created:', userCredential.user);
      toast.success('Account created successfully! Welcome to Civic Connect!');
      navigate('/');
    } catch (error) {
      console.error('Error signing up:', error);
      let errorMessage = 'Failed to create account. Please try again.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists. Please sign in instead.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters long.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password accounts are not enabled. Please contact support.';
          break;
        default:
          errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-25 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Branding & Benefits */}
        <div className="hidden lg:block animate-slide-up">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-success-600 rounded-2xl flex items-center justify-center">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Civic Connect</h1>
                <p className="text-gray-600">Join Your Community</p>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Make a Real Difference in Your Community
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Connect with your neighbors, report civic issues, and help build a better community for everyone.
            </p>

            {/* Benefits */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-primary-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 mb-2">Report & Track Issues</h3>
                  <p className="text-gray-600 text-sm">
                    Easily report potholes, broken streetlights, and other civic issues. Track their progress to resolution.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-success-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 mb-2">Community Engagement</h3>
                  <p className="text-gray-600 text-sm">
                    Verify and support issues reported by your neighbors. Build stronger community connections.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-warning-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 mb-2">Earn Recognition</h3>
                  <p className="text-gray-600 text-sm">
                    Gain civic points and recognition for your community contributions. Level up your civic impact.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="card animate-fade-in">
            <div className="form-header">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-success-600 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:hidden">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h2 className="form-title">Create Your Account</h2>
              <p className="form-subtitle">
                Join thousands of community members making a difference
              </p>
            </div>

            <div className="form-content">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="you@example.com"
                    disabled={loading}
                  />
                </div>

                {/* Password Field */}
                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength="6"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-input pr-12"
                      placeholder="Must be at least 6 characters"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Password should be at least 6 characters long
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="btn btn-primary w-full btn-lg" 
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Account...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <UserPlus className="w-5 h-5" />
                      Create Account
                    </div>
                  )}
                </button>

                {/* Sign In Link */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <NavLink 
                      to="/login" 
                      className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                    >
                      Sign in here
                    </NavLink>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 text-center animate-fade-in">
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>1,247 Members</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>Trusted Platform</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;