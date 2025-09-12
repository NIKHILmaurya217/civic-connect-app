# 🇮🇳 Civic Connect: A Crowdsourced Civic Issue Reporting System

This is a full-stack web application built for the SIH 2025 problem statement from the Government of Jharkhand. It provides a platform for citizens to report local civic issues and for administrators to manage and resolve them.

## ✨ Key Features

- **User Authentication:** Secure sign-up, login, and logout functionality using Firebase Authentication.
- **Full-Stack Reporting:** Users can submit detailed issue reports with a title, description, category, and image.
- **Cloud Image Uploads:** Images are uploaded to Firebase Storage, and the AI-powered `analyzeImage` function is automatically triggered.
- **Real-time Updates:** The issue feed updates in real-time for all users thanks to Firestore's `onSnapshot` listener.
- **Admin Dashboard:** A protected route for designated admins to view all issues and update their status (Pending, In Progress, Resolved).
- **Admin Analytics:** A bar chart visualizing the number of issues per category.
- **"My Reports" Page:** A dedicated page for logged-in users to view the issues they have personally submitted.
- **Community Upvoting:** Logged-in users can upvote an issue once to help prioritize it.
- **WhatsApp Chatbot Foundation:** A serverless webhook using Firebase Cloud Functions and Twilio to handle the first steps of a conversational report.

## 🛠️ Tech Stack

- **Frontend:** Vite + React.js
- **Backend:** Serverless with Firebase (Cloud Functions)
- **Database:** Cloud Firestore
- **Authentication:** Firebase Authentication
- **File Storage:** Firebase Storage
- **AI:** Google Cloud Vision API
- **WhatsApp Integration:** Twilio API
- **Styling:** Custom CSS (resembling Tailwind CSS)

## 🚀 Getting Started

### Prerequisites
- Node.js and npm
- Firebase CLI (`npm install -g firebase-tools`)

### Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/NIKHILmaurya217/civic-connect-app.git
    cd civic-connect-app
    ```

2.  **Set up the Frontend:**
    ```bash
    cd client
    npm install
    # Create a .env file and add VITE_ADMIN_EMAIL
    ```

3.  **Set up the Backend:**
    ```bash
    cd ../functions
    npm install
    ```

### Running the Project

You need two terminals to run the project.

**Terminal 1 (Frontend):**
```bash
cd client
npm run dev
# App will be running on http://localhost:5173
