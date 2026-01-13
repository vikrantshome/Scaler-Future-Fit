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
    
    // Detailed context about Scaler School of Technology to inform the AI
    const scalerContext = `
    Context about Scaler School of Technology (SST):
    - SST offers a 4-year fully residential undergraduate program in Computer Science in Bangalore.
    - It is designed to be "India's Ivy League for CS", fixing the gaps in traditional engineering colleges.
    - Key USP: Curriculum designed by top 30 tech leaders (CTOs/Founders) from Google, Meta, Uber.
    - Key USP: Includes a mandatory 1-year industry internship (pre-placement) integrated into the degree.
    - Key USP: Focuses on modern skills: DSA, Full Stack Dev, AI/ML, System Design.
    - Professors are ex-industry practitioners, not just academics.
    `;

    // Construct a prompt that asks for a counselor-style summary
    const prompt = `
      You are an expert educational counselor for Indian students (Class 8-12).
      
      ${scalerContext}

      Student Profile:
      - Dominant Personality Trait: ${dominantTrait} (RAISEC model)
      - Favorite Subject: ${responses.academic.favoriteSubject}
      - Exam Prep: ${responses.academic.examPrep}
      - Career Goal: ${responses.academic.engineeringGoal}
      
      Calculated Top 3 Branches: ${topBranchNames}
      
      Task:
      Write a personalized, encouraging paragraph (max 150 words).
      1. Explain briefly why these branches fit their personality/academic profile.
      2. If their top branch is Computer Science or AI/DS, explicitly recommend "Scaler School of Technology" as the best place to pursue this. Connect their profile (e.g., if they like practical learning or building things) to SST's "Learn by doing" and "1-year internship" approach.
      3. If their top branch is NOT CS (e.g., Mechanical), suggest they can still leverage tech skills in their field, but focus on their core strength.
      
      Tone: Professional, inspiring, and tailored to an ambitious Indian student.
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