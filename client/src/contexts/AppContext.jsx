// src/contexts/AppContext.jsx
import React, { useState, useEffect, createContext, useContext } from 'react';
import { issueService } from '../services/issueService';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase-config'; // Import db from firebase-config
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'; // Import onSnapshot

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- AUTHENTICATION STATE ---
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // --- ISSUE DATA STATE ---
  const [issues, setIssues] = useState([]);
  const [loadingIssues, setLoadingIssues] = useState(true);
  const [error, setError] = useState(null);
  
  // ... (keep the offline state if you wish to maintain that logic)

  // This useEffect listens for login/logout events from Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser ? { uid: currentUser.uid, email: currentUser.email, points: 150 } : null);
      setLoadingUser(false);
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, []);
  
  // This new useEffect sets up the REAL-TIME listener for issues
  useEffect(() => {
    setLoadingIssues(true);
    const issuesCollectionRef = collection(db, 'issues');
    const q = query(issuesCollectionRef, orderBy('createdAt', 'desc'));

    // onSnapshot creates a real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const issuesList = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        // Convert Firestore Timestamp to JS Date object
        reportedAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date(),
      }));
      setIssues(issuesList);
      setLoadingIssues(false);
      setError(null);
    }, (err) => {
      console.error("Error listening to issues collection:", err);
      setError("Could not load issues from the database.");
      setLoadingIssues(false);
    });

    // Return the unsubscribe function to clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // The addReport function now just calls the service.
  // The real-time listener will automatically update the UI.
  const addReport = async (reportData) => {
    // The service now handles all logic for image upload and DB writing
    await issueService.createIssue(reportData);
    // No need to call setIssues() here anymore!
    awardPoints(10, 'New Report Submitted');
  };
  
  const awardPoints = (points, reason) => {
    if (user) {
      setUser(prev => ({...prev, points: prev.points + points }));
      // In a real app, you would update the user's points in your Firestore 'users' collection here
    }
  };

  const value = { 
    user,
    issues,
    loading: loadingIssues,
    error,
    addReport,
    awardPoints,
    // Note: The admin and upvoting logic will need to be rewritten for Firestore
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