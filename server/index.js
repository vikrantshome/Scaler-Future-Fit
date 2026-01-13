require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const StudentProfile = require('./models/StudentProfile');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected to Scaler-future-fit'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('Scaler Future Fit API is running');
});

app.post('/api/save-student', async (req, res) => {
  try {
    const { userInfo, responses, results } = req.body;

    // Create new profile record
    const newProfile = new StudentProfile({
      personalInfo: userInfo,
      assessment: {
        raisec: responses.raisec,
        academic: responses.academic
      },
      results: {
        topBranches: results.topBranches,
        raisecProfile: results.raisecProfile,
        dominantType: results.dominantType,
        aiInsight: results.aiInsight || ''
      },
      submittedAt: new Date()
    });

    const savedProfile = await newProfile.save();
    console.log(`📝 Saved profile for: ${userInfo.fullName}`);
    
    res.status(201).json({ success: true, id: savedProfile._id });
  } catch (error) {
    console.error('Save Error:', error);
    res.status(500).json({ success: false, message: 'Server error saving data' });
  }
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;
