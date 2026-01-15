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
    
    // Sort and format full profile
    const sortedProfile = [...results.raisecProfile].sort((a, b) => b.score - a.score);
    const fullRaisecProfile = sortedProfile.map(p => `${p.type}: ${p.score}`).join(", ");

    // Extract top traits (Top 2 or all ties)
    const topScore = sortedProfile[0]?.score || 0;
    // Get all traits that are either the top score or the second highest score (including ties)
    const topTraits = sortedProfile.filter((p, i) => 
        p.score === topScore || (i === 1) || (i > 1 && p.score === sortedProfile[1]?.score)
    );
    const topTraitsString = topTraits.map(p => `${p.type} (${p.score})`).join(", ");
    
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
      - Top Personality Traits: ${topTraitsString} (Primary focus: Consider all these traits equally if scores are tied or very close)
      - Full RAISEC Profile: ${fullRaisecProfile}
      - Favorite Subject: ${responses.academic.favoriteSubject}
      - Exam Prep: ${responses.academic.examPrep}
      - Career Goal: ${responses.academic.engineeringGoal}
      
      Calculated Top 3 Branches: ${topBranchNames}
      
      Task:
      Write a personalized, encouraging paragraph (max 170 words).
      1. Explain briefly why these branches fit their personality (especially their top traits) and academic profile.
      2. If their top branch is Computer Science or AI/DS AND they prefer practical learning/building things: Highlight "New-Age Tech Schools (like Scaler School of Technology)" as a high-potential alternative to traditional IITs, specifically for their industry-aligned curriculum and internships.
      3. Provide a balanced perspective: Briefly contrast the value of Government colleges (Legacy, Research) vs. New-Age schools (Modern Skills, Hands-on) to help them make an informed choice based on their learning style.
      
      Tone: Professional, unbiased, empowering, and tailored to an ambitious Indian student. Avoid sounding like a direct advertisement; sound like a trusted mentor.
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