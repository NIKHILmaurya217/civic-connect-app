import { db, storage } from '../firebase-config';
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  doc,
  updateDoc,
  increment,
  where
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

// Initialize Cloud Functions
const functions = getFunctions();

export const issueService = {
  /**
   * Fetches all issues from the server.
   * @returns {Promise<Array>} A promise that resolves to an array of all issues.
   */
  getAllIssues: async () => {
    const issuesCollectionRef = collection(db, 'issues');
    const q = query(issuesCollectionRef, orderBy('createdAt', 'desc'));
    const issueSnapshot = await getDocs(q);
    
    const issuesList = issueSnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    }));
    return issuesList;
  },

  /**
   * Submits a new report, including an image file.
   * @param {Object} reportData - The data for the new report.
   * @returns {Promise<Object>} A promise that resolves to the newly created issue.
   */
  createIssue: async (reportData) => {
    // 1. Create the document in Firestore first, but without the imageUrl
    const newIssueData = {
      title: reportData.title,
      description: reportData.description,
      category: reportData.category,
      location: reportData.location || null,
      reportedBy: reportData.reportedBy,
      upvotes: 0,
      status: 'pending',
      imageUrl: null, // Start with no image URL
      createdAt: serverTimestamp(),
    };
    
    const issuesCollectionRef = collection(db, 'issues');
    const docRef = await addDoc(issuesCollectionRef, newIssueData);
    
    // 2. If an image exists, upload it using the new document's ID as the name
    if (reportData.image) {
      const fileExtension = reportData.image.name.split('.').pop();
      const imageRef = ref(storage, `issue-images/${docRef.id}.${fileExtension}`);
      const snapshot = await uploadBytes(imageRef, reportData.image);
      const imageUrl = await getDownloadURL(snapshot.ref);

      // 3. Update the document with the final imageUrl
      const issueDocRef = doc(db, 'issues', docRef.id);
      await updateDoc(issueDocRef, { imageUrl: imageUrl });
      
      return { ...newIssueData, id: docRef.id, imageUrl: imageUrl };
    }
    
    return { ...newIssueData, id: docRef.id };
  },

  /**
   * Updates the status of a specific issue.
   * @param {string} issueId - The ID of the issue to update.
   * @param {string} status - The new status ('pending', 'in-progress', 'resolved').
   * @returns {Promise<void>}
   */
  updateIssueStatus: async (issueId, status) => {
    const issueDocRef = doc(db, 'issues', issueId);
    await updateDoc(issueDocRef, { status: status });
  },
  
  /**
   * Fetches all issues submitted by a specific user.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<Array>} A promise that resolves to an array of the user's issues.
   */
  getMyReports: async (userId) => {
    const issuesCollectionRef = collection(db, 'issues');
    const q = query(
      issuesCollectionRef, 
      where("reportedBy", "==", userId), 
      orderBy('createdAt', 'desc')
    );
    const issueSnapshot = await getDocs(q);
    const issuesList = issueSnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    }));
    
    return issuesList;
  },

  /**
   * Upvotes a specific issue by calling a cloud function.
   * @param {string} issueId - The ID of the issue to upvote.
   * @returns {Promise<any>} A promise that resolves with the result of the cloud function.
   */
  upvoteIssue: async (issueId) => {
    const upvoteIssueCallable = httpsCallable(functions, 'upvoteIssue');
    const result = await upvoteIssueCallable({ issueId: issueId });
    return result.data;
  },
};