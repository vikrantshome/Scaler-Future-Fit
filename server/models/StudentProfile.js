const mongoose = require('mongoose');

const StudentProfileSchema = new mongoose.Schema({
  personalInfo: {
    fullName: { type: String, required: false },
    email: { type: String, required: false },
    phone: { type: String, required: false },
    grade: { type: String, required: false },
    schoolName: { type: String }, // Added per recent updates
    city: { type: String, required: false }
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
        description: String,
        subCareers: [{
            name: String,
            recruiters: [String]
        }],
        exams: [{
            name: String,
            type: { type: String },
            description: String
        }],
        salary: {
            entry: String,
            midLevel: String
        },
        topColleges: [String],
        focusAreas: {
            subjects: [String],
            topics: [String]
        },
        typicalRoles: {
            roles: [String],
            companies: [String]
        },
        futureTrends: [String],
        workEnvironment: String,
        weights: { type: Map, of: Number }
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
