# Scaler Future Fit: Engineering Branch Selector

An AI-powered web application designed to help students discover their ideal engineering branch. By analyzing personality traits (using the RAISEC model), academic preferences, and career aspirations, this tool provides personalized recommendations and insights powered by Google's Gemini AI.

## 🚀 Features

*   **RAISEC Personality Assessment:** Evaluates users based on Realistic, Artistic, Investigative, Social, Enterprising, and Conventional traits to understand their work personality.
*   **Academic & Career Profiling:** Considers favorite subjects, exam preparation (JEE/Olympiad), and long-term career goals (Software, Core Engineering, Research, Startup, etc.).
*   **AI-Powered Insights:** Utilizes Google's **Gemini 2.0 Flash** model to generate personalized career counseling summaries.
*   **Branch Recommendations:** detailed scoring algorithm matches users to top engineering branches like Computer Science, AI & DS, Robotics, Mechanical, etc.
*   **Scaler School of Technology Integration:** Context-aware recommendations that highlight SST for relevant profiles (CS/AI interests).
*   **Interactive UI:** Built with React and Tailwind CSS for a smooth, responsive user experience.
*   **Data Visualization:** Visual representation of personality profiles (using Recharts).
*   **Backend Integration:** Saves student profiles and results to a MongoDB database.

## 🛠️ Tech Stack

*   **Frontend:** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/)
*   **Backend:** [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [Mongoose](https://mongoosejs.com/)
*   **Database:** [MongoDB](https://www.mongodb.com/)
*   **AI Integration:** [Google Gen AI SDK](https://www.npmjs.com/package/@google/genai)
*   **Charts:** [Recharts](https://recharts.org/)

## 🏁 Getting Started

Follow these steps to run the application locally.

### Prerequisites

*   **Node.js** (v18 or higher recommended)
*   **npm** or **yarn**
*   A **Google Gemini API Key** (Get one at [Google AI Studio](https://aistudio.google.com/))
*   A **MongoDB Connection String**

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd Scaler-Future-Fit
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    cd server && npm install
    cd ..
    ```

3.  **Environment Setup:**
    
    *   **Frontend:** Create a `.env.local` file in the root directory:
        ```env
        GEMINI_API_KEY=your_actual_api_key_here
        ```
    
    *   **Backend:** Create a `.env` file in the `server/` directory:
        ```env
        MONGODB_URI=your_mongodb_connection_string
        PORT=5000
        ```

4.  **Run the Application:**
    Start both the frontend and backend servers with a single command:
    ```bash
    npm start
    ```

5.  **Open the App:**
    Visit `http://localhost:5173` to view the app. The backend API will be running at `http://localhost:5000`.

## 📂 Project Structure

```
Scaler-Future-Fit/
├── src/
│   ├── components/       # UI Components (Header, LandingPage, TestInterface, etc.)
│   ├── data/            # Local databases or static data
│   ├── services/        # Logic & API integrations
│   │   ├── apiService.ts       # Backend API calls
│   │   ├── geminiService.ts    # Google Gemini AI integration
│   │   └── scoringService.ts   # Core algorithm for branch matching
│   ├── App.tsx          # Main application component & state management
│   ├── constants.ts     # Config constants (Questions, Branch Data)
│   ├── types.ts         # TypeScript definitions
│   └── index.tsx        # Entry point
├── server/              # Backend Code
│   ├── models/          # Mongoose Schemas (StudentProfile.js)
│   ├── server.js        # Express Server Entry Point
│   └── .env             # Backend Environment Variables
├── public/              # Static assets
└── package.json         # Project dependencies and scripts
```

## 🧠 How It Works

1.  **Assessment:** The user completes a quiz covering personality traits and academic interests.
2.  **Scoring:** `scoringService.ts` normalizes RAISEC scores and calculates weighted matches for various engineering branches.
3.  **Prediction:** The app identifies the top 3 matches (e.g., Computer Science, Mechanical, Electronics).
4.  **AI Insight:** `geminiService.ts` sends the profile data to Gemini, which generates a personalized counseling paragraph.
5.  **Data Persistence:** The complete student profile, including responses and results, is sent to the Express backend and stored in MongoDB.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is for educational and assessment purposes.