const functions = require("firebase-functions");
const twilio = require("twilio");
const admin = require("firebase-admin");
const vision = require('@google-cloud/vision');
const { onObjectFinalized } = require("firebase-functions/v2/storage");
const { HttpsError } = require("firebase-functions/v2/https"); // For callable functions

// Initialize the Firebase Admin SDK ONCE at the top
admin.initializeApp();
const db = admin.firestore();

/**
 * v1 HTTPS function that handles incoming WhatsApp messages.
 */
exports.whatsAppWebhook = functions.https.onRequest(async (request, response) => {
  // ... (This function's code remains unchanged)
});

/**
 * v2 Storage-triggered function that runs when a file is uploaded.
 */
exports.analyzeImage = onObjectFinalized({ bucket: "civic-connect-app.firebasestorage.app" }, async (event) => {
  // ... (This function's code remains unchanged)
});


// --- NEW CALLABLE FUNCTION FOR UPVOTING ---
/**
 * Securely upvotes an issue, preventing multiple votes from the same user.
 */
exports.upvoteIssue = functions.https.onCall(async (data, context) => {
  // 1. Check if the user is authenticated.
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'You must be logged in to upvote.');
  }

  const userId = context.auth.uid;
  const issueId = data.issueId;

  if (!issueId) {
    throw new HttpsError('invalid-argument', 'The function must be called with an "issueId".');
  }

  // 2. Run a transaction to safely update the document.
  const issueRef = db.collection('issues').doc(issueId);

  try {
    await db.runTransaction(async (transaction) => {
      const issueDoc = await transaction.get(issueRef);
      if (!issueDoc.exists) {
        throw new HttpsError('not-found', 'The issue does not exist.');
      }

      const issueData = issueDoc.data();
      const upvotedBy = issueData.upvotedBy || [];

      // 3. Check if the user has already upvoted.
      if (upvotedBy.includes(userId)) {
        throw new HttpsError('already-exists', 'You have already upvoted this issue.');
      }

      // 4. If not, add the user's ID and increment the count.
      transaction.update(issueRef, {
        upvotedBy: [...upvotedBy, userId],
        upvotes: admin.firestore.FieldValue.increment(1)
      });
    });
    
    return { success: true, message: 'Issue upvoted successfully!' };

  } catch (error) {
    console.error("Upvote failed:", error);
    // Re-throw the error so the client can catch it
    throw error;
  }
});