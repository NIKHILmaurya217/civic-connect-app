// // src/firebase-config.js
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCMz62X-dyTMiNUZ1JWbDdw4TZa7IJAVUQ",
//   authDomain: "civic-connect-app.firebaseapp.com",
//   projectId: "civic-connect-app",
//   storageBucket: "civic-connect-app.firebasestorage.app",
//   messagingSenderId: "114841620433",
//   appId: "1:114841620433:web:f134cd929911a0909a5af0",
//   measurementId: "G-0J7SXX03HR"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Export the auth service to be used in your components
// export const auth = getAuth(app);
// src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // <-- Import Firestore
import { getStorage } from "firebase/storage";   // <-- Import Storage

const firebaseConfig = {
  apiKey: "AIzaSyCMz62X-dyTMiNUZ1JWbDdw4TZa7IJAVUQ",
  authDomain: "civic-connect-app.firebaseapp.com",
  projectId: "civic-connect-app",
  storageBucket: "civic-connect-app.firebasestorage.app",
  messagingSenderId: "114841620433",
  appId: "1:114841620433:web:f134cd929911a0909a5af0",
  measurementId: "G-0J7SXX03HR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services to be used in your components
export const auth = getAuth(app);
export const db = getFirestore(app);     // <-- Export Firestore instance
export const storage = getStorage(app);  // <-- Export Storage instance