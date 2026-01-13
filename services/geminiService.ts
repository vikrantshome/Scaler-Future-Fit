import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, UserResponses } from "../types";

// Using the provided prompt guidance, we ensure the key is from env
const getAIClient = () => {
    // In a real production app, ensure this is handled securely or via proxy.
    // For this demo, we assume the environment variable is available.
    if (!process.env.API_KEY) {
        console.warn("API_KEY is missing. AI features will be disabled.");
        return null;
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateAIInsights = async (
    responses: UserResponses,
    results: AnalysisResult
): Promise<string> => {
    const ai = getAIClient();
    if (!ai) return "AI insights unavailable (Missing API Key).";

    const topBranchNames = results.topBranches.map(b => b.branch.name).join(", ");
    const dominantTrait = results.dominantType;
    
    // Construct a prompt that asks for a counselor-style summary
    const prompt = `
      You are an expert career counselor for Indian engineering students (Class 8-12).
      
      Student Profile:
      - Dominant Personality Trait: ${dominantTrait} (RAISEC model)
      - Favorite Subject: ${responses.academic.favoriteSubject}
      - Exam Prep: ${responses.academic.examPrep}
      - Career Goal: ${responses.academic.engineeringGoal}
      
      Calculated Top 3 Branches: ${topBranchNames}
      
      Task:
      Write a short, encouraging paragraph (max 150 words) explaining WHY these branches are a great fit for this specific student.
      Mention "Scaler School of Technology" as a great place to nurture these skills if they are inclined towards CS/AI.
      Tone: Motivating, insightful, professional yet friendly.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text || "Your profile shows great potential for these fields!";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Based on your logical and analytical strengths, these branches offer the best career trajectory for you.";
    }
};