import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase-config';
import toast from 'react-hot-toast';
import { Star, Menu, X, LogIn, LogOut } from 'lucide-react'; // Wifi and WifiOff icons removed

const Header = () => {
  const { user } = useApp(); // "isOnline" is no longer needed here
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  
  const activeLinkStyle = { backgroundColor: 'rgba(255, 255, 255, 0.1)' };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully!');
      setShowMobileMenu(false);
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out.');
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-brand">
          <h1 className="header-title">नागरिक सेवा</h1>
          <span className="header-subtitle">Civic Connect</span>
        </div>
        
        <nav className="header-nav-desktop">
          <NavLink to="/" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="nav-link">Home</NavLink>
          {user && (
            <NavLink to="/my-reports" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="nav-link">
              My Reports
            </NavLink>
          )}
          <NavLink to="/report" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="nav-link">Report Issue</NavLink>
          <NavLink to="/dashboard" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="nav-link">Dashboard</NavLink>
          {user && user.email === adminEmail && (
            <NavLink to="/admin" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="nav-link">
              Admin
            </NavLink>
          )}
        </nav>

        <div className="header-actions">
          {/* The status-indicator div has been completely removed */}
          {user ? (
            <>
              <div className="points-indicator">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">{user.points}</span>
              </div>
              <button onClick={handleLogout} className="nav-link hidden md:flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className="nav-link hidden md:flex items-center gap-2">
              <LogIn className="w-4 h-4" /> Login
            </NavLink>
          )}

          <button className="mobile-menu-button" onClick={() => setShowMobileMenu(!showMobileMenu)}>
            {showMobileMenu ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {showMobileMenu && (
        <nav className="header-nav-mobile">
          <NavLink to="/" className="nav-link-mobile" onClick={() => setShowMobileMenu(false)}>Home</NavLink>
          {user && (
            <NavLink to="/my-reports" className="nav-link-mobile" onClick={() => setShowMobileMenu(false)}>My Reports</NavLink>
          )}
          <NavLink to="/report" className="nav-link-mobile" onClick={() => setShowMobileMenu(false)}>Report Issue</NavLink>
          <NavLink to="/dashboard" className="nav-link-mobile" onClick={() => setShowMobileMenu(false)}>Dashboard</NavLink>
          {user && user.email === adminEmail && (
            <NavLink to="/admin" className="nav-link-mobile" onClick={() => setShowMobileMenu(false)}>Admin</NavLink>
          )}
          {user ? (
            <button onClick={handleLogout} className="nav-link-mobile text-left w-full">Logout</button>
          ) : (
            <NavLink to="/login" className="nav-link-mobile" onClick={() => setShowMobileMenu(false)}>Login</NavLink>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;