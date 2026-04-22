# Scaler Future Fit: Engineering Branch Selector

A comprehensive, AI-powered assessment tool designed to help students discover their ideal engineering branches based on personality, academic interests, and career goals.

## 🚀 Project Overview

The project consists of three main components:
1.  **Main Web Application (Root):** A React-based assessment portal where students take a RAISEC personality test and receive AI-generated career counseling.
2.  **Backend Server (`server/`):** An Express server that manages data persistence (MongoDB), AI integration (Gemini), and generates high-quality PDF reports using Puppeteer.
3.  **AI OMR Scanner (`omr-scanner/`):** A specialized frontend-only tool for digitizing physical "Branch Fitment Test" OMR sheets using Gemini Vision.

## 🛠️ Tech Stack

### Core Technologies
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Recharts.
- **Backend:** Node.js, Express, Mongoose, Puppeteer (PDF generation).
- **AI:** Google Gemini 2.0 Flash (for counseling insights and OMR extraction).
- **Database:** MongoDB.

### Key Libraries
- `@google/genai`: Google's Generative AI SDK.
- `recharts`: For visualizing personality profiles.
- `pdf-lib` & `puppeteer`: For generating and stitching multi-page PDF reports.
- `pdfjs-dist`: Used in the OMR scanner for client-side PDF processing.

## 📂 Directory Structure

- `components/`: Main UI components (LandingPage, TestInterface, AdminPortal, etc.).
- `server/`: Express backend, HTML templates for PDF reports, and Mongoose models.
- `services/`: Core logic including `scoringService.ts` (RAISEC calculation) and `geminiService.ts`.
- `omr-scanner/`: Sub-project for AI-powered OMR sheet data extraction.
- `data/` & `documents/`: Project documentation, domain knowledge, and static data.

## 🏁 Building and Running

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or a URI)
- Google Gemini API Key

### Setup
1.  **Install All Dependencies:**
    ```bash
    npm install && cd server && npm install
    ```
2.  **Environment Variables:**
    - Root `.env.local`: `VITE_GEMINI_API_KEY=your_key`
    - `server/.env`: `MONGODB_URI=your_uri`, `PORT=5001`

### Running the App
- **Start All (Recommended):** `npm start` (Runs both client and server concurrently).
- **Client Only:** `npm run client` (Vite dev server).
- **Server Only:** `npm run server` (Node backend).

## 🧠 Core Logic & Conventions

- **RAISEC Assessment:** Normalizes scores to a 0-10 scale across Realistic, Investigative, Artistic, Social, Enterprising, and Conventional traits.
- **Branch Matching:** Weighted algorithm in `scoringService.ts` that combines RAISEC profile, academic strengths (Math/Physics/CS), and career goals.
- **PDF Generation:** The server preloads HTML templates and assets, injecting student data and base64 images into Puppeteer to generate pixel-perfect reports.
- **Development Style:** Modern TypeScript, functional components, and Tailwind for styling.
