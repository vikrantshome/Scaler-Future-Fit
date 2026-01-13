import { UserInfo, UserResponses, AnalysisResult } from '../types';

const API_URL = '/api';

export const saveStudentData = async (
  userInfo: UserInfo, 
  responses: UserResponses, 
  results: AnalysisResult
): Promise<boolean> => {
  try {
    console.log("------------------------------------------------");
    console.log(`🔌 Sending data to backend: ${API_URL}/save-student`);
    
    const response = await fetch(`${API_URL}/save-student`, {
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