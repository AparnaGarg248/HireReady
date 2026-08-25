// ==================================================
// BACKEND — APARNA
//
// File: backend/routes/aptitudeRoutes.js
//
// Purpose:
// Express router for Aptitude Assessments, Results, History & Analytics.
//
// Routes:
// GET  /api/aptitude/questions -> aptitudeController.getQuestions
// POST /api/aptitude/submit    -> aptitudeController.submitAssessment
// GET  /api/aptitude/history   -> aptitudeController.getResultsHistory
// GET  /api/aptitude/analytics -> aptitudeController.getAnalytics
// ==================================================

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getQuestions,
  submitAssessment,
  getResultsHistory,
  getAnalytics
} = require('../controllers/aptitudeController');

router.get('/questions', protect, getQuestions);
router.post('/submit', protect, submitAssessment);
router.get('/history', protect, getResultsHistory);
router.get('/analytics', protect, getAnalytics);

module.exports = router;
