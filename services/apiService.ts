import { UserInfo, UserResponses, AnalysisResult } from '../types';

// NOTE: In a production environment, this connection string should reside on a secure backend server.
// Browsers cannot directly connect to MongoDB via standard drivers for security reasons.
// This service simulates the API call that would send data to your backend.
const DB_CONNECTION_STRING = "mongodb+srv://ainaviksha_db_user:gHV1FANEjzVAsMBP@naviksha.kwnahck.mongodb.net/Scaler-future-fit?retryWrites=true&w=majority";

export const saveStudentData = async (
  userInfo: UserInfo, 
  responses: UserResponses, 
  results: AnalysisResult
): Promise<boolean> => {
  console.log("------------------------------------------------");
  console.log(`🔌 Connecting to MongoDB: ${DB_CONNECTION_STRING}`);
  console.log("📝 Saving Student Record:", {
    profile: userInfo,
    test_data: responses,
    analysis_results: results,
    timestamp: new Date().toISOString()
  });
  console.log("------------------------------------------------");

  // Simulate network latency for a realistic effect
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1500);
  });
};