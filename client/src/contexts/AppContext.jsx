import React, { useState, useEffect, createContext, useContext } from 'react';
import { issueService } from '../services/issueService';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase-config';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [issues, setIssues] = useState([]);
  const [loadingIssues, setLoadingIssues] = useState(true);
  const [error, setError] = useState(null);
  const [allUsers, setAllUsers] = useState({});
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingReports, setPendingReports] = useState(() => {
    return JSON.parse(localStorage.getItem('pendingReports')) || [];
  });

  // Authentication listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser ? { uid: currentUser.uid, email: currentUser.email } : null);
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, []);

  // Sync user profile data from Firestore
  useEffect(() => {
    if (user && allUsers[user.uid]) {
      setUser(prevUser => ({ ...prevUser, points: allUsers[user.uid].points }));
    }
  }, [user?.uid, allUsers]);

  // Real-time data listeners
  useEffect(() => {
    // Listener for all issues
    const issuesCollectionRef = collection(db, 'issues');
    const qIssues = query(issuesCollectionRef, orderBy('createdAt', 'desc'));
    const unsubscribeIssues = onSnapshot(qIssues, (snapshot) => {
      const issuesList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, reportedAt: doc.data().createdAt?.toDate() || new Date() }));
      setIssues(issuesList);
      setLoadingIssues(false);
      setError(null);
    }, (err) => {
      console.error("Error listening to issues collection:", err);
      setError("Could not load issues from the database.");
      setLoadingIssues(false);
    });

    // Listener for all users
    const usersCollectionRef = collection(db, 'users');
    const unsubscribeUsers = onSnapshot(usersCollectionRef, (snapshot) => {
      const usersMap = {};
      snapshot.docs.forEach(doc => { usersMap[doc.id] = doc.data(); });
      setAllUsers(usersMap);
    });

    // Listeners for online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      unsubscribeIssues();
      unsubscribeUsers();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const addReport = async (reportData, isOffline = false) => {
    if (isOffline) {
        const newPending = [...pendingReports, reportData];
        setPendingReports(newPending);
        localStorage.setItem('pendingReports', JSON.stringify(newPending));
        return reportData;
    }
    try {
      await issueService.createIssue(reportData);
      awardPoints(10, 'New Report Submitted');
    } catch (err) {
      console.error("Failed to submit report:", err);
      addReport(reportData, true); // Save offline if online submission fails
      throw err;
    }
  };
  
  const awardPoints = (points, reason) => {
    if (user) {
      setUser(prev => ({...prev, points: (prev.points || 0) + points }));
    }
  };

  const value = { 
    user,
    issues,
    allUsers,
    setIssues,
    loading: loadingIssues || loadingUser,
    error,
    isOnline, // isOnline is now correctly defined and provided
    pendingReports,
    addReport, // addReport is now correctly defined and provided
    awardPoints 
  };

  if (loadingUser) {
    return <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>Loading Application...</div>;
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};