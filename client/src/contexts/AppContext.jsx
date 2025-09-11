import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { issueService } from '../services/issueService';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase-config';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- STATE MANAGEMENT ---
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [issues, setIssues] = useState([]);
  const [loadingIssues, setLoadingIssues] = useState(true);
  const [error, setError] = useState(null);
  const [allUsers, setAllUsers] = useState({});

  // --- AUTHENTICATION LISTENER ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          points: 150 // Placeholder points
        });
      } else {
        setUser(null);
      }
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, []);

  // --- REAL-TIME DATA LISTENERS ---
  useEffect(() => {
    // Listener for all issues
    const issuesCollectionRef = collection(db, 'issues');
    const qIssues = query(issuesCollectionRef, orderBy('createdAt', 'desc'));
    const unsubscribeIssues = onSnapshot(qIssues, (snapshot) => {
      const issuesList = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        reportedAt: doc.data().createdAt?.toDate() || new Date(),
      }));
      setIssues(issuesList);
      setLoadingIssues(false);
      setError(null);
    }, (err) => {
      console.error("Error listening to issues collection:", err);
      setError("Could not load issues from the database.");
      setLoadingIssues(false);
    });

    // Listener for all users (to display emails on cards)
    const usersCollectionRef = collection(db, 'users');
    const unsubscribeUsers = onSnapshot(usersCollectionRef, (snapshot) => {
      const usersMap = {};
      snapshot.docs.forEach(doc => {
        usersMap[doc.id] = doc.data();
      });
      setAllUsers(usersMap);
    });

    // Cleanup listeners on unmount
    return () => {
      unsubscribeIssues();
      unsubscribeUsers();
    };
  }, []);

  // --- FUNCTIONS ---
  const addReport = async (reportData) => {
    await issueService.createIssue(reportData);
    awardPoints(10, 'New Report Submitted');
  };
  
  const awardPoints = (points, reason) => {
    if (user) {
      setUser(prev => ({...prev, points: (prev.points || 0) + points }));
      // In a real app, you would also update the user's points in Firestore here
    }
  };
  
  // --- CONTEXT VALUE ---
  const value = { 
    user,
    issues,
    allUsers,
    loading: loadingIssues || loadingUser, // App is loading if either is true
    error,
    addReport,
    awardPoints 
  };

  // Show a single loading screen until authentication is checked
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