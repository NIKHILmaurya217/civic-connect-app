// src/services/issueService.js
import { db, storage } from '../firebase-config';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy, doc, updateDoc, increment, where } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const functions = getFunctions();

export const issueService = {
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

  createIssue: async (reportData) => {
    const issuesCollectionRef = collection(db, 'issues');
    const docRef = await addDoc(issuesCollectionRef, {
      title: reportData.title,
      description: reportData.description,
      category: reportData.category,
      location: reportData.location || null,
      reportedBy: reportData.reportedBy,
      upvotes: 0,
      status: 'pending',
      imageUrl: null,
      createdAt: serverTimestamp(),
    });
    
    if (reportData.image) {
      const fileExtension = reportData.image.name.split('.').pop();
      const imageRef = ref(storage, `issue-images/${docRef.id}.${fileExtension}`);
      const snapshot = await uploadBytes(imageRef, reportData.image);
      const imageUrl = await getDownloadURL(snapshot.ref);
      
      await updateDoc(docRef, { imageUrl: imageUrl });
      return { ...reportData, id: docRef.id, imageUrl: imageUrl };
    }
    
    return { ...reportData, id: docRef.id };
  },

  updateIssueStatus: async (issueId, status) => {
    const issueDocRef = doc(db, 'issues', issueId);
    await updateDoc(issueDocRef, { status: status });
  },
  
  upvoteIssue: async (issueId) => {
    const upvoteIssueCallable = httpsCallable(functions, 'upvoteIssue');
    const result = await upvoteIssueCallable({ issueId: issueId });
    return result.data;
  },

  // --- THIS IS THE CORRECTED FUNCTION ---
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
    
    // This 'return' statement is the crucial fix
    return issuesList;
  },
};