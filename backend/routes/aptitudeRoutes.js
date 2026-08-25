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
