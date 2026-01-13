import { UserInfo, UserResponses, AnalysisResult } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || '';

export const saveStudentData = async (
  userInfo: UserInfo, 
  responses: UserResponses, 
  results: AnalysisResult
): Promise<boolean> => {
  try {
    const endpoint = `${BASE_URL}/api/save-student`;
    console.log("------------------------------------------------");
    console.log(`🔌 Sending data to backend: ${endpoint}`);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userInfo,
        responses,
        results
      }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Data saved successfully:", data);
    return true;

  } catch (error) {
    console.error("❌ Failed to save student data:", error);
    // In a real app, you might want to show a toast notification here
    // For now, we return false but allowing the UI to proceed or retry could be better
    return false;
  }
};