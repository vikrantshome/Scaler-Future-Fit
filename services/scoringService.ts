import { UserResponses, AnalysisResult, ScoredBranch, RaisecType } from '../types';
import { ENGINEERING_BRANCHES, RAISEC_QUESTIONS } from '../constants';

export const calculateResults = (responses: UserResponses): AnalysisResult => {
  // 1. Calculate RAISEC Profile
  const raisecScores: Record<RaisecType, number> = { R: 0, A: 0, I: 0, S: 0, E: 0, C: 0 };
  const raisecCounts: Record<RaisecType, number> = { R: 0, A: 0, I: 0, S: 0, E: 0, C: 0 };

  Object.entries(responses.raisec).forEach(([qId, value]) => {
    const question = RAISEC_QUESTIONS.find(q => q.id === qId);
    if (question && question.raisecType) {
      raisecScores[question.raisecType] += value;
      raisecCounts[question.raisecType] += 1;
    }
  });

  // Normalize RAISEC to 0-10 scale
  const normalizedRaisec: Record<string, number> = {};
  Object.keys(raisecScores).forEach((key) => {
    const k = key as RaisecType;
    normalizedRaisec[k] = raisecCounts[k] > 0 ? (raisecScores[k] / raisecCounts[k]) * 2 : 0;
  });

  // 2. Determine Academic Strengths (Simple mapping)
  const academicScores = {
    math: 5, // base
    physics: 5,
    chemistry: 5,
    cs: 5,
    logic: 5
  };

  // Boost based on Favorite/Strong Subject
  const boostSubject = (subj: string, amount: number) => {
    if (subj === 'Math') { academicScores.math += amount; academicScores.logic += amount; }
    if (subj === 'Physics') { academicScores.physics += amount; academicScores.math += amount * 0.5; }
    if (subj === 'CS') { academicScores.cs += amount; academicScores.logic += amount; }
    if (subj === 'Chemistry') { academicScores.chemistry += amount; }
    // Biology isn't a primary weight for these engineering branches except maybe partial bio-med, keeping simple.
  };

  boostSubject(responses.academic.favoriteSubject, 3);
  boostSubject(responses.academic.strongestSubject, 3);

  // Boost based on Exams
  if (responses.academic.examPrep === 'JEE' || responses.academic.examPrep === 'Olympiad') {
    academicScores.math += 2;
    academicScores.physics += 2;
    academicScores.logic += 2;
  }
  
  if (responses.academic.learningStyle === 'Practical') {
      academicScores.cs += 1;
  }

  // 3. Calculate Branch Fit Scores
  const branchScores: ScoredBranch[] = ENGINEERING_BRANCHES.map(branch => {
    let score = 0;
    let maxPossible = 0;

    // A. Personality Fit (40% weight approx)
    Object.entries(branch.weights).forEach(([key, weight]) => {
      if (['R', 'A', 'I', 'S', 'E', 'C'].includes(key)) {
        const raisecVal = normalizedRaisec[key] || 0; 
        score += raisecVal * (weight as number) * 1.5; // Multiplier for weight
        maxPossible += 10 * (weight as number) * 1.5;
      }
    });

    // B. Academic Fit (40% weight approx)
    if (branch.weights.math) score += academicScores.math * branch.weights.math;
    if (branch.weights.physics) score += academicScores.physics * branch.weights.physics;
    if (branch.weights.chemistry) score += academicScores.chemistry * branch.weights.chemistry;
    if (branch.weights.cs) score += academicScores.cs * branch.weights.cs;
    
    // C. Goal Alignment (20% weight approx)
    if (responses.academic.engineeringGoal === 'Software' && (branch.id === 'cse' || branch.id === 'ai_ds')) {
      score += 15;
    }
    if (responses.academic.engineeringGoal === 'Core' && ['mech', 'civil', 'electrical', 'chem'].includes(branch.id)) {
      score += 15;
    }
    if (responses.academic.engineeringGoal === 'Startup' && branch.id === 'cse') {
        score += 10; // Scaler specific bias: CS is great for founders
    }
    if (responses.academic.engineeringGoal === 'Research' && ['ai_ds', 'robotics', 'ece', 'eng_phy'].includes(branch.id)) {
        score += 10;
    }

    return {
      branch,
      score,
      matchReason: "Based on your strong alignment with " + (branch.weights.math ? "Math " : "") + (branch.weights.cs ? "and Logic" : "") 
    };
  });

  // Sort by score descending
  branchScores.sort((a, b) => b.score - a.score);

  // Prepare Chart Data
  const chartData = [
    { type: 'Realistic', score: normalizedRaisec.R },
    { type: 'Investigative', score: normalizedRaisec.I },
    { type: 'Artistic', score: normalizedRaisec.A },
    { type: 'Social', score: normalizedRaisec.S },
    { type: 'Enterprising', score: normalizedRaisec.E },
    { type: 'Conventional', score: normalizedRaisec.C },
  ];

  // Determine dominant type
  const dominant = chartData.reduce((prev, current) => (prev.score > current.score) ? prev : current);

  return {
    topBranches: branchScores.slice(0, 3),
    raisecProfile: chartData as { type: RaisecType; score: number }[],
    dominantType: dominant.type,
  };
};