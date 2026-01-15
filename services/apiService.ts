import { UserInfo, UserResponses, AnalysisResult } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || '';

export const saveStudentData = async (
  userInfo: UserInfo, 
  responses: UserResponses, 
  results: AnalysisResult,
  id?: string
): Promise<string | null> => {
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
        results,
        id
      }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Data saved successfully:", data);
    return data.id || null;

  } catch (error) {
    console.error("❌ Failed to save student data:", error);
    // In a real app, you might want to show a toast notification here
    // For now, we return false but allowing the UI to proceed or retry could be better
    return null;
  }
};

export const generateReport = async (studentId: string): Promise<string | null> => {
  try {
    const endpoint = `${BASE_URL}/api/generate-report`;
    console.log(`🔌 Requesting report for: ${studentId}`);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentID: studentId }),
    });

    if (!response.ok) throw new Error('Failed to generate report');

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return data.reportLink || null;
    } else {
      // Handle Blob (direct download)
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `FutureFit_Report_${studentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return 'downloaded';
    }
  } catch (error) {
    console.error("❌ Report generation failed:", error);
    return null;
  }
};
