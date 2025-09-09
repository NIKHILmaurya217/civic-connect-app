// src/services/issueService.js
import { db, storage } from '../firebase-config';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

// Initialize Cloud Functions
const functions = getFunctions();

export const issueService = {
  getAllIssues: async () => {
    // ... (This function remains unchanged)
  },

  createIssue: async (reportData) => {
    // ... (This function remains unchanged)
  },

  updateIssueStatus: async (issueId, status) => {
    // ... (This function remains unchanged)
  },
  
  getMyReports: async (userId) => {
    // ... (This function remains unchanged)
  },

  // --- THIS FUNCTION IS REWRITTEN ---
  upvoteIssue: async (issueId) => {
    // Get a reference to the callable cloud function
    const upvoteIssueCallable = httpsCallable(functions, 'upvoteIssue');
    
    // Call the function with the issueId
    const result = await upvoteIssueCallable({ issueId: issueId });
    return result.data;
  },
};