# 📦 DEPLOYMENT & SETUP GUIDE

**Target Audience:** Threat Intel Analysts & IT Operations
**System Requirements:** Windows / macOS / Linux

This guide details how to set up the **THREAT SCOPE** platform on your local workstation and how to deploy it to the web for free.

---

## 📋 Prerequisites

Before starting, ensure you have the following installed:

1.  **Node.js (LTS Version)**
    *   Download: [nodejs.org](https://nodejs.org/)
    *   Verify by running `node -v` in your terminal (Should be v18 or higher).
2.  **Git** (Optional, for cloning)

---

## 🚀 Installation Steps

### 1. Get the Application
Copy the project folder to your local machine or clone the repository.
```bash
git clone <repository-url>
cd threat-intel-platform
```

### 2. Install Dependencies
Open your terminal (Command Prompt or PowerShell) inside the folder and run:
```bash
npm install
```
*This downloads the necessary libraries (React, Tailwind, AI tools).*

### 3. Configure Security Keys
1.  Look for a file named `.env.example` in the main folder.
2.  Copy it and rename the copy to `.env` (or just create a new file named `.env`).
3.  Open `.env` and add your Google Gemini API Key:
    ```env
    VITE_GEMINI_API_KEY=your_actual_api_key_here
    ```
    *(Ask your Team Lead for the production API Key)*

---

## ▶️ Running the Platform Locally

### Option A: Development Mode (Best for Testing)
Run this command to start the app instantly:
```bash
npm run dev
```
*   You will see a link like `http://localhost:5173`.
*   Ctrl+Click the link to open the dashboard.

### Option B: Production Build (Stable)
To simulate a real deployment or run a high-performance version:
```bash
npm run build
npm run preview
```

---

## ☁️ Deploying to the Web (Free)

You can deploy this project for free on **Vercel** or **Netlify**. Both are excellent for React applications.

### Option 1: Vercel (Recommended)

1.  **Push to GitHub:** Ensure your project is pushed to a GitHub repository.
2.  **Sign Up/Login:** Go to [vercel.com](https://vercel.com/) and sign in with GitHub.
3.  **Add New Project:** Click "Add New..." -> "Project".
4.  **Import Repository:** Select your `threat-intel-platform` repository.
5.  **Configure Environment Variables:**
    *   Expand the **"Environment Variables"** section.
    *   **Key:** `VITE_GEMINI_API_KEY`
    *   **Value:** Paste your actual Gemini API key.
    *   Click **Add**.
6.  **Deploy:** Click **Deploy**. Vercel will build your site and give you a live URL (e.g., `https://your-project.vercel.app`).

### Option 2: Netlify

1.  **Push to GitHub:** Ensure your project is pushed to a GitHub repository.
2.  **Sign Up/Login:** Go to [netlify.com](https://netlify.com/) and sign in with GitHub.
3.  **Add New Site:** Click "Add new site" -> "Import from existing project".
4.  **Connect to Git:** Choose GitHub and select your repository.
5.  **Configure Build Settings:**
    *   **Build command:** `npm run build` (should be auto-detected)
    *   **Publish directory:** `dist` (should be auto-detected)
6.  **Environment Variables:**
    *   Click "Show advanced" -> "New Variable".
    *   **Key:** `VITE_GEMINI_API_KEY`
    *   **Value:** Paste your actual Gemini API key.
7.  **Deploy:** Click **Deploy Site**. Netlify will give you a live URL (e.g., `https://your-project.netlify.app`).

---

## 🛠️ Troubleshooting

**Q: "Command not found" error?**
*   Ensure Node.js is installed. Restart your terminal after installing.

**Q: The AI isn't replying (Grind/Loading forever)?**
*   Check your `.env` file (locally) or Environment Variables (on Vercel/Netlify). Ensure the API Key is correct and has no extra spaces.
*   Check your internet connection (Google AI requires access).

**Q: Export button doesn't download file?**
*   The system uses a pop-up "Save As" window. Ensure your browser isn't blocking pop-ups.

---

## 📞 Support
For technical issues, contact the **SOC Engineering Team**.
