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

          {/* <button className="mobile-menu-button" onClick={() => setShowMobileMenu(!showMobileMenu)}>
            {showMobileMenu ? <X /> : <Menu />}
          </button> */}
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

// import React, { useState, useEffect } from 'react';
// import { NavLink } from 'react-router-dom';
// import { 
//   Star, 
//   Menu, 
//   X, 
//   LogIn, 
//   LogOut, 
//   Home,
//   FileText,
//   AlertCircle,
//   BarChart3,
//   Shield,
//   User,
//   ChevronDown,
//   Award,
//   Flag
// } from 'lucide-react';

// const Header = () => {
//   // Mock data for demonstration - replace with your actual context/props
//   const user = { 
//     email: 'user@example.com', 
//     points: 1250,
//     name: 'राज शर्मा',
//     avatar: 'RS'
//   };
//   const adminEmail = 'admin@example.com';
  
//   const [showMobileMenu, setShowMobileMenu] = useState(false);
//   const [showUserMenu, setShowUserMenu] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 20);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const handleLogout = async () => {
//     console.log('Logout clicked');
//     setShowMobileMenu(false);
//     setShowUserMenu(false);
//   };

//   const navItems = [
//     { path: '/', label: 'Home', icon: Home },
//     ...(user ? [{ path: '/my-reports', label: 'My Reports', icon: FileText }] : []),
//     { path: '/report', label: 'Report Issue', icon: AlertCircle },
//     { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
//     ...(user && user.email === adminEmail ? [{ path: '/admin', label: 'Admin', icon: Shield }] : [])
//   ];

//   return (
//     <>
//       <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//         scrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-white/90 backdrop-blur-md'
//       }`}>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-20">
//             {/* Brand Section */}
//             <NavLink to="/" className="flex items-center gap-3 group">
//               <div className="relative">
//                 <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-green-600 rounded-xl flex items-center justify-center transform transition-transform group-hover:scale-110 group-hover:rotate-3">
//                   <Flag className="w-6 h-6 text-white" />
//                 </div>
//                 <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-xl font-bold bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
//                   नागरिक सेवा
//                 </span>
//                 <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">
//                   Civic Connect
//                 </span>
//               </div>
//             </NavLink>

//             {/* Desktop Navigation */}
//             <nav className="hidden lg:flex items-center gap-2">
//               {navItems.map((item) => (
//                 <NavLink
//                   key={item.path}
//                   to={item.path}
//                   className={({ isActive }) => `
//                     relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm
//                     transition-all duration-200 group
//                     ${isActive 
//                       ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm' 
//                       : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
//                     }
//                   `}
//                 >
//                   <item.icon className="w-4 h-4" />
//                   <span>{item.label}</span>
//                   {({ isActive }) => isActive && (
//                     <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></span>
//                   )}
//                 </NavLink>
//               ))}
//             </nav>

//             {/* Right Section */}
//             <div className="flex items-center gap-4">
//               {/* Points Badge - Visible on desktop */}
//               {user && (
//                 <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-full">
//                   <Award className="w-4 h-4 text-yellow-600" />
//                   <span className="text-sm font-bold text-yellow-800">{user.points}</span>
//                   <span className="text-xs text-yellow-600">pts</span>
//                 </div>
//               )}

//               {/* User Menu / Login Button */}
//               {user ? (
//                 <div className="relative hidden md:block">
//                   <button
//                     onClick={() => setShowUserMenu(!showUserMenu)}
//                     className="flex items-center gap-3 px-3 py-2 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200"
//                   >
//                     <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
//                       {user.avatar}
//                     </div>
//                     <div className="hidden lg:block text-left">
//                       <p className="text-sm font-semibold text-gray-900">{user.name}</p>
//                       <p className="text-xs text-gray-500">{user.email.split('@')[0]}</p>
//                     </div>
//                     <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
//                   </button>

//                   {/* Dropdown Menu */}
//                   {showUserMenu && (
//                     <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-5">
//                       <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 border-b">
//                         <div className="flex items-center gap-3">
//                           <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
//                             {user.avatar}
//                           </div>
//                           <div className="flex-1">
//                             <p className="font-semibold text-gray-900">{user.name}</p>
//                             <p className="text-xs text-gray-600">{user.email}</p>
//                             <div className="flex items-center gap-1 mt-1">
//                               <Award className="w-3 h-3 text-yellow-600" />
//                               <span className="text-xs font-bold text-yellow-700">{user.points} points</span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="p-2">
//                         <NavLink
//                           to="/profile"
//                           className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
//                           onClick={() => setShowUserMenu(false)}
//                         >
//                           <User className="w-4 h-4" />
//                           <span>My Profile</span>
//                         </NavLink>
//                         <button
//                           onClick={handleLogout}
//                           className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1"
//                         >
//                           <LogOut className="w-4 h-4" />
//                           <span>Logout</span>
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <NavLink
//                   to="/login"
//                   className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium text-sm rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
//                 >
//                   <LogIn className="w-4 h-4" />
//                   <span>Login</span>
//                 </NavLink>
//               )}

//               {/* Mobile Menu Button */}
//               <button
//                 onClick={() => setShowMobileMenu(!showMobileMenu)}
//                 className="lg:hidden p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
//               >
//                 {showMobileMenu ? (
//                   <X className="w-6 h-6 text-gray-700" />
//                 ) : (
//                   <Menu className="w-6 h-6 text-gray-700" />
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Mobile Menu Overlay */}
//       {showMobileMenu && (
//         <div className="fixed inset-0 z-40 lg:hidden">
//           <div 
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm"
//             onClick={() => setShowMobileMenu(false)}
//           />
          
//           <nav className="fixed top-20 left-0 right-0 bg-white border-t border-gray-100 shadow-xl max-h-[calc(100vh-5rem)] overflow-y-auto">
//             <div className="p-4">
//               {/* User Info Section for Mobile */}
//               {user && (
//                 <div className="mb-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
//                       {user.avatar}
//                     </div>
//                     <div className="flex-1">
//                       <p className="font-semibold text-gray-900">{user.name}</p>
//                       <p className="text-sm text-gray-600">{user.email}</p>
//                       <div className="flex items-center gap-2 mt-1">
//                         <Award className="w-4 h-4 text-yellow-600" />
//                         <span className="text-sm font-bold text-yellow-700">{user.points} points</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Navigation Links */}
//               <div className="space-y-2">
//                 {navItems.map((item) => (
//                   <NavLink
//                     key={item.path}
//                     to={item.path}
//                     className={({ isActive }) => `
//                       flex items-center gap-3 px-4 py-3 rounded-xl font-medium
//                       transition-all duration-200
//                       ${isActive 
//                         ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-l-4 border-blue-600' 
//                         : 'text-gray-700 hover:bg-gray-50'
//                       }
//                     `}
//                     onClick={() => setShowMobileMenu(false)}
//                   >
//                     <item.icon className="w-5 h-5" />
//                     <span>{item.label}</span>
//                   </NavLink>
//                 ))}
//               </div>

//               {/* Auth Section */}
//               <div className="mt-6 pt-6 border-t border-gray-200">
//                 {user ? (
//                   <button
//                     onClick={handleLogout}
//                     className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-colors"
//                   >
//                     <LogOut className="w-5 h-5" />
//                     <span>Logout</span>
//                   </button>
//                 ) : (
//                   <NavLink
//                     to="/login"
//                     className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all"
//                     onClick={() => setShowMobileMenu(false)}
//                   >
//                     <LogIn className="w-5 h-5" />
//                     <span>Login</span>
//                   </NavLink>
//                 )}
//               </div>
//             </div>
//           </nav>
//         </div>
//       )}

//       {/* Spacer to prevent content from going under fixed header */}
//       <div className="h-20"></div>
//     </>
//   );
// };

// export default Header;