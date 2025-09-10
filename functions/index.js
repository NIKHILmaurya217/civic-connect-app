const functions = require("firebase-functions");
const twilio = require("twilio");
const admin = require("firebase-admin");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const vision = require('@google-cloud/vision');
const { onObjectFinalized } = require("firebase-functions/v2/storage");
const { HttpsError } = require("firebase-functions/v2/https");

// Initialize the Firebase Admin SDK ONCE at the top
admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage().bucket();

// --- 1. v1 HTTPS Function for Twilio Webhook (WhatsApp Chatbot) ---
exports.whatsAppWebhook = functions.https.onRequest(async (request, response) => {
  const twiml = new twilio.twiml.MessagingResponse();
  const incomingMsg = request.body.Body.toLowerCase().trim();
  const fromNumber = request.body.From;

  const sessionRef = db.collection("whatsapp_sessions").doc(fromNumber);
  const sessionDoc = await sessionRef.get();

  let message = "";
  let sessionData = sessionDoc.exists ? sessionDoc.data() : {};

  if (!sessionDoc.exists || ["hi", "hello", "report", "start"].includes(incomingMsg)) {
    sessionData = { state: "awaiting_description", report: {} };
    message = "Welcome to Civic Connect! Please describe the issue you want to report.";
    await sessionRef.set(sessionData);
  } 
  else if (sessionData.state === "awaiting_description") {
    sessionData.report.description = request.body.Body;
    sessionData.state = "awaiting_photo";
    message = "Thank you. Now, please send a photo of the issue.";
    await sessionRef.set(sessionData);
  } 
  else if (sessionData.state === "awaiting_photo") {
    const mediaUrl = request.body.MediaUrl0;
    if (mediaUrl) {
      try {
        const imageResponse = await axios({ method: 'get', url: mediaUrl, responseType: 'arraybuffer' });
        const fileExtension = request.body.MediaContentType0.split('/')[1];
        const fileName = `issue-images/whatsapp_${uuidv4()}.${fileExtension}`;
        const file = storage.file(fileName);
        await file.save(imageResponse.data);
        
        sessionData.report.imageUrl = file.publicUrl();
        sessionData.state = "awaiting_location";
        message = "Photo received. Finally, please share your location using the WhatsApp location feature.";
        await sessionRef.set(sessionData);
      } catch (error) {
        console.error("Error handling image:", error);
        message = "Sorry, there was an error processing your image. Please try sending it again.";
      }
    } else {
      message = "Please send a photo to continue.";
    }
  }
  else if (sessionData.state === "awaiting_location") {
    const lat = request.body.Latitude;
    const lon = request.body.Longitude;

    if (lat && lon) {
      try {
        const finalReport = {
          title: `WhatsApp Report: ${sessionData.report.description.substring(0, 20)}...`,
          description: sessionData.report.description,
          category: 'whatsapp-report',
          status: 'pending',
          imageUrl: sessionData.report.imageUrl,
          upvotes: 0,
          reportedBy: fromNumber,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          location: {
            address: `WhatsApp Location (${lat}, ${lon})`,
            geo: {
              type: 'Point',
              coordinates: [parseFloat(lon), parseFloat(lat)]
            }
          }
        };

        await db.collection('issues').add(finalReport);
        message = "Thank you! Your report has been submitted successfully. You can view its status in the Civic Connect app.";
        await sessionRef.delete();
      } catch (error) {
        console.error("Error saving report:", error);
        message = "Sorry, there was an error saving your report. Please try again.";
        await sessionRef.delete();
      }
    } else {
      message = "Please share your location using the attachment pin and selecting 'Location'.";
    }
  }
  else {
    message = "Sorry, I didn't understand that. Please type 'report' to start a new issue.";
  }

  twiml.message(message);
  response.writeHead(200, { "Content-Type": "text/xml" });
  response.end(twiml.toString());
});


// --- 2. v2 Storage-Triggered Function for AI Image Analysis ---
exports.analyzeImage = onObjectFinalized({ bucket: "civic-connect-app.firebasestorage.app" }, async (event) => {
  const filePath = event.data.name;
  const bucketName = event.data.bucket;
  
  if (!filePath.startsWith('issue-images/')) {
    return console.log('This is not an issue image.');
  }

  const fileName = filePath.split('/').pop();
  const documentId = fileName.split('.')[0];

  console.log(`Analyzing image for issue document: ${documentId}`);

  const client = new vision.ImageAnnotatorClient();
  const [result] = await client.labelDetection(`gs://${bucketName}/${filePath}`);
  const labels = result.labelAnnotations.map(label => label.description);

  console.log('Labels found:', labels.join(', '));
  
  const issueRef = db.collection('issues').doc(documentId);
  try {
    await issueRef.update({
      aiLabels: labels,
      aiAnalysisComplete: true,
    });
    console.log(`Successfully saved labels to Firestore document ${documentId}`);
  } catch (error) {
    console.error(`Error saving labels to Firestore for document ${documentId}:`, error);
  }
  
  return null;
});


// --- 3. v2 Callable Function for Secure Upvoting ---
exports.upvoteIssue = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'You must be logged in to upvote.');
  }
  const userId = context.auth.uid;
  const issueId = data.issueId;

  if (!issueId) {
    throw new HttpsError('invalid-argument', 'The function must be called with an "issueId".');
  }

  const issueRef = db.collection('issues').doc(issueId);

  try {
    await db.runTransaction(async (transaction) => {
      const issueDoc = await transaction.get(issueRef);
      if (!issueDoc.exists) {
        throw new HttpsError('not-found', 'The issue does not exist.');
      }
      const issueData = issueDoc.data();
      const upvotedBy = issueData.upvotedBy || [];
      if (upvotedBy.includes(userId)) {
        throw new HttpsError('already-exists', 'You have already upvoted this issue.');
      }
      transaction.update(issueRef, {
        upvotedBy: [...upvotedBy, userId],
        upvotes: admin.firestore.FieldValue.increment(1)
      });
    });
    
    return { success: true, message: 'Issue upvoted successfully!' };
  } catch (error) {
    console.error("Upvote failed:", error);
    throw error;
  }
});