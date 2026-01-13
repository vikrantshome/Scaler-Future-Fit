const mongoose = require('mongoose');

const StudentProfileSchema = new mongoose.Schema({
  personalInfo: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    grade: { type: String, required: true },
    schoolName: { type: String }, // Added per recent updates
    city: { type: String, required: true }
  },
  assessment: {
    raisec: { type: Map, of: Number }, // Stores questionId -> score
    academic: {
      favoriteSubject: String,
      strongestSubject: String,
      examPrep: String,
      learningStyle: String,
      engineeringGoal: String
    }
  },
  results: {
    topBranches: [{
      branch: {
        id: String,
        name: String,
        description: String
        // We actully only need identifiers usually, but storing full snapshot is safer for prototypes
      },
      score: Number,
      matchReason: String
    }],
    raisecProfile: [{
      type: { type: String }, // R, A, I, S, E, C
      score: Number
    }],
    dominantType: String,
    aiInsight: String
  },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StudentProfile', StudentProfileSchema);
