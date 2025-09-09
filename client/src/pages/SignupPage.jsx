import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth'; // 1. Import Firebase function
import { auth } from '../firebase-config'; // 2. Import your auth instance
import toast from 'react-hot-toast';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  // 3. Update the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // This creates the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created:', userCredential.user);
      toast.success('Account created successfully!');
      navigate('/'); // Redirect to homepage on success
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error(error.message); // Show a more specific error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              minLength="6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Must be at least 6 characters"
            />
          </div>
          <button type="submit" className="button-primary w-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          <p className="text-center text-sm">
            Already have an account?{' '}
            <NavLink to="/login" className="text-blue-600 hover:underline">
              Login
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;