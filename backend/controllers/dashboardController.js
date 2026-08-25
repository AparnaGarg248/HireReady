// ==================================================
// BACKEND — APARNA
//
// File: backend/controllers/dashboardController.js
//
// Purpose:
// Controller for the Student Dashboard overview.
// Aggregates user profile info, resume status, aptitude test statistics,
// and chart data into a single efficient endpoint.
//
// Endpoint:
// - GET /api/dashboard
// ==================================================

const User = require('../models/User');
const Resume = require('../models/Resume');
const AptitudeResult = require('../models/AptitudeResult');
const { memoryUsers } = require('./authController');
const { memoryResumes } = require('./resumeController');
const { memoryResults } = require('./aptitudeController');

// @desc    Get complete student dashboard summary
// @route   GET /api/dashboard
// @access  Private (JWT Protected)
const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Fetch User Info
    let user = null;
    try {
      user = await User.findById(userId).select('-password');
    } catch (e) {
      user = memoryUsers.get(userId.toString());
    }
    if (!user) user = memoryUsers.get(userId.toString()) || { name: req.user.name, email: req.user.email };

    // 2. Fetch Resume Info
    let resume = null;
    try {
      resume = await Resume.findOne({ userId });
    } catch (e) {
      resume = memoryResumes.get(userId.toString());
    }
    if (!resume) resume = memoryResumes.get(userId.toString());

    // 3. Fetch Aptitude Test History
    let results = [];
    try {
      results = await AptitudeResult.find({ userId }).sort({ createdAt: 1 });
    } catch (e) {
      results = memoryResults
        .filter(r => r.userId === userId.toString())
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    if (!results || results.length === 0) {
      results = memoryResults
        .filter(r => r.userId === userId.toString())
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    // 4. Calculate Aptitude Statistics
    const totalAttempts = results.length;
    let latestScore = 'Not Attempted';
    let latestPercentage = 0;
    let highestPercentage = 0;
    let averagePercentage = 0;
    let latestDate = null;
    let latestCategory = null;

    if (totalAttempts > 0) {
      const latest = results[results.length - 1];
      latestScore = `${latest.score} / ${latest.totalQuestions}`;
      latestPercentage = latest.percentage;
      latestDate = latest.createdAt;
      latestCategory = latest.category;

      const pList = results.map(r => r.percentage);
      highestPercentage = Math.max(...pList);
      const totalP = pList.reduce((a, b) => a + b, 0);
      averagePercentage = parseFloat((totalP / totalAttempts).toFixed(1));
    }

    // Chart.js data
    const chartLabels = results.map((r, i) => `Attempt ${i + 1}`);
    const chartPercentages = results.map(r => r.percentage);
    const chartScores = results.map(r => r.score);

    return res.status(200).json({
      success: true,
      data: {
        student: {
          id: userId,
          name: user.name || req.user.name,
          email: user.email || req.user.email,
          college: user.college || 'Chitkara University',
          branch: user.branch || 'Computer Science & Engineering',
          graduationYear: user.graduationYear || '2026'
        },
        resumeStatus: {
          isUploaded: !!resume,
          fileName: resume ? resume.fileName : null,
          fileSize: resume ? resume.fileSize : null,
          uploadDate: resume ? resume.uploadDate : null
        },
        aptitudeOverview: {
          totalAttempts,
          latestScore,
          latestPercentage,
          latestCategory,
          latestDate,
          highestPercentage,
          averagePercentage,
          attemptedStatus: totalAttempts > 0 ? 'Attempted' : 'Not Attempted'
        },
        chartData: {
          labels: chartLabels,
          percentages: chartPercentages,
          scores: chartScores
        },
        recentAttempts: results.slice(-5).reverse().map(r => ({
          id: r._id || r.id,
          category: r.category,
          score: r.score,
          totalQuestions: r.totalQuestions,
          percentage: r.percentage,
          createdAt: r.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Dashboard Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to assemble student dashboard data.'
    });
  }
};

module.exports = { getDashboardSummary };
