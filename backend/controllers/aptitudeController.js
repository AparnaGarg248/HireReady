// ==================================================
// BACKEND — APARNA
//
// File: backend/controllers/aptitudeController.js
//
// Purpose:
// Controller for Aptitude Assessments, Score Calculation,
// and Historical Analytics.
//
// Endpoints:
// - GET  /api/aptitude/questions : Retrieve assessment questions
// - POST /api/aptitude/submit    : Submit test, calculate score & save result
// - GET  /api/aptitude/history   : Fetch assessment attempts history
// - GET  /api/aptitude/results/:id: Fetch specific result details
// - GET  /api/aptitude/analytics : Fetch analytics data for Chart.js
// ==================================================

const questionBank = require('../data/questions');
const AptitudeResult = require('../models/AptitudeResult');

// In-Memory Test Results Store (fallback / temporary mode)
const memoryResults = [
  {
    id: 'res_sample_1',
    _id: 'res_sample_1',
    userId: 'temp_student_1',
    category: 'Quantitative Aptitude',
    totalQuestions: 5,
    attemptedQuestions: 5,
    correctAnswers: 4,
    incorrectAnswers: 1,
    unattemptedQuestions: 0,
    score: 4,
    percentage: 80.0,
    timeTakenSeconds: 140,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'res_sample_2',
    _id: 'res_sample_2',
    userId: 'temp_student_1',
    category: 'Logical Reasoning',
    totalQuestions: 5,
    attemptedQuestions: 5,
    correctAnswers: 5,
    incorrectAnswers: 0,
    unattemptedQuestions: 0,
    score: 5,
    percentage: 100.0,
    timeTakenSeconds: 120,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'res_sample_3',
    _id: 'res_sample_3',
    userId: 'temp_student_2',
    category: 'Quantitative Aptitude',
    totalQuestions: 5,
    attemptedQuestions: 5,
    correctAnswers: 4,
    incorrectAnswers: 1,
    unattemptedQuestions: 0,
    score: 4,
    percentage: 80.0,
    timeTakenSeconds: 150,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  }
];

// @desc    Get aptitude questions by category or all
// @route   GET /api/aptitude/questions
// @access  Private
const getQuestions = (req, res) => {
  try {
    const { category, count } = req.query;

    let questions = [...questionBank];

    if (category && category !== 'Comprehensive Assessment') {
      questions = questions.filter(q => q.category.toLowerCase() === category.toLowerCase());
    }

    // Limit if requested
    const limit = parseInt(count) || questions.length;
    const selectedQuestions = questions.slice(0, limit);

    // Omit correctAnswer and explanation to prevent client inspection
    const sanitizedQuestions = selectedQuestions.map((q, idx) => ({
      id: q.id,
      index: idx + 1,
      category: q.category,
      topic: q.topic,
      question: q.question,
      options: q.options
    }));

    return res.status(200).json({
      success: true,
      category: category || 'Comprehensive Assessment',
      totalQuestions: sanitizedQuestions.length,
      questions: sanitizedQuestions
    });
  } catch (error) {
    console.error('Fetch Questions Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not load aptitude questions.'
    });
  }
};

// @desc    Submit aptitude test, calculate actual score, and store result
// @route   POST /api/aptitude/submit
// @access  Private
const submitAssessment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, answers, timeTakenSeconds } = req.body;

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid submission format. Answers object is required.'
      });
    }

    // Determine questions in scope
    let testQuestions = [...questionBank];
    if (category && category !== 'Comprehensive Assessment') {
      testQuestions = testQuestions.filter(q => q.category.toLowerCase() === category.toLowerCase());
    }

    const totalQuestions = testQuestions.length;
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let attemptedQuestions = 0;
    const reviewDetails = [];

    testQuestions.forEach((q) => {
      const selectedOption = answers[q.id] !== undefined ? parseInt(answers[q.id]) : null;
      const isAttempted = selectedOption !== null && !isNaN(selectedOption) && selectedOption >= 0;

      if (isAttempted) {
        attemptedQuestions++;
        const isCorrect = selectedOption === q.correctAnswer;
        if (isCorrect) {
          correctAnswers++;
        } else {
          incorrectAnswers++;
        }

        reviewDetails.push({
          id: q.id,
          category: q.category,
          topic: q.topic,
          question: q.question,
          options: q.options,
          selectedOption: selectedOption,
          correctOption: q.correctAnswer,
          isCorrect: isCorrect,
          explanation: q.explanation
        });
      } else {
        reviewDetails.push({
          id: q.id,
          category: q.category,
          topic: q.topic,
          question: q.question,
          options: q.options,
          selectedOption: null,
          correctOption: q.correctAnswer,
          isCorrect: false,
          explanation: q.explanation
        });
      }
    });

    const unattemptedQuestions = totalQuestions - attemptedQuestions;
    const rawScore = correctAnswers;
    const percentage = totalQuestions > 0 ? parseFloat(((correctAnswers / totalQuestions) * 100).toFixed(1)) : 0;

    // Database record creation
    let savedResult = null;
    const targetCategory = category || 'Comprehensive Assessment';

    try {
      savedResult = await AptitudeResult.create({
        userId,
        category: targetCategory,
        totalQuestions,
        attemptedQuestions,
        correctAnswers,
        incorrectAnswers,
        unattemptedQuestions,
        score: rawScore,
        percentage,
        timeTakenSeconds: timeTakenSeconds || 0,
        createdAt: new Date()
      });
    } catch (dbErr) {
      const memId = 'result_' + Date.now();
      savedResult = {
        _id: memId,
        id: memId,
        userId: userId.toString(),
        category: targetCategory,
        totalQuestions,
        attemptedQuestions,
        correctAnswers,
        incorrectAnswers,
        unattemptedQuestions,
        score: rawScore,
        percentage,
        timeTakenSeconds: timeTakenSeconds || 0,
        createdAt: new Date()
      };
    }

    // Cache in memory array
    const memoryRecord = {
      id: savedResult._id ? savedResult._id.toString() : savedResult.id,
      _id: savedResult._id ? savedResult._id.toString() : savedResult.id,
      userId: userId.toString(),
      category: targetCategory,
      totalQuestions,
      attemptedQuestions,
      correctAnswers,
      incorrectAnswers,
      unattemptedQuestions,
      score: rawScore,
      percentage,
      timeTakenSeconds: timeTakenSeconds || 0,
      createdAt: savedResult.createdAt || new Date(),
      review: reviewDetails
    };
    memoryResults.unshift(memoryRecord);

    return res.status(201).json({
      success: true,
      message: 'Assessment completed and score calculated successfully!',
      result: {
        id: memoryRecord.id,
        category: targetCategory,
        totalQuestions,
        attemptedQuestions,
        correctAnswers,
        incorrectAnswers,
        unattemptedQuestions,
        score: rawScore,
        percentage,
        timeTakenSeconds: timeTakenSeconds || 0,
        createdAt: memoryRecord.createdAt,
        review: reviewDetails
      }
    });
  } catch (error) {
    console.error('Submit Assessment Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process assessment submission.'
    });
  }
};

// @desc    Get assessment history for student
// @route   GET /api/aptitude/history
// @access  Private
const getResultsHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    let history = [];

    try {
      history = await AptitudeResult.find({ userId }).sort({ createdAt: -1 });
    } catch (dbErr) {
      history = memoryResults.filter(r => r.userId === userId.toString());
    }

    if (!history || history.length === 0) {
      history = memoryResults.filter(r => r.userId === userId.toString());
    }

    return res.status(200).json({
      success: true,
      count: history.length,
      history: history.map(item => ({
        id: item._id ? item._id.toString() : item.id,
        category: item.category,
        totalQuestions: item.totalQuestions,
        attemptedQuestions: item.attemptedQuestions,
        correctAnswers: item.correctAnswers,
        incorrectAnswers: item.incorrectAnswers,
        score: item.score,
        percentage: item.percentage,
        createdAt: item.createdAt
      }))
    });
  } catch (error) {
    console.error('History Fetch Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not load assessment history.'
    });
  }
};

// @desc    Get assessment analytics for Chart.js and student statistics
// @route   GET /api/aptitude/analytics
// @access  Private
const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    let userResults = [];

    try {
      userResults = await AptitudeResult.find({ userId }).sort({ createdAt: 1 });
    } catch (dbErr) {
      userResults = memoryResults
        .filter(r => r.userId === userId.toString())
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    if (!userResults || userResults.length === 0) {
      userResults = memoryResults
        .filter(r => r.userId === userId.toString())
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    const totalAttempts = userResults.length;

    if (totalAttempts === 0) {
      return res.status(200).json({
        success: true,
        hasAttempts: false,
        totalAttempts: 0,
        latestScore: 0,
        latestPercentage: 0,
        highestPercentage: 0,
        averagePercentage: 0,
        chartData: {
          labels: [],
          scores: [],
          percentages: []
        }
      });
    }

    const latest = userResults[userResults.length - 1];
    const percentages = userResults.map(r => r.percentage);
    const highestPercentage = Math.max(...percentages);
    const sumPercentage = percentages.reduce((acc, curr) => acc + curr, 0);
    const averagePercentage = parseFloat((sumPercentage / totalAttempts).toFixed(1));

    // Prepare Chart.js datasets
    const labels = userResults.map((r, i) => `Attempt ${i + 1}`);
    const chartPercentages = userResults.map(r => r.percentage);
    const chartScores = userResults.map(r => r.score);

    return res.status(200).json({
      success: true,
      hasAttempts: true,
      totalAttempts,
      latestScore: `${latest.score} / ${latest.totalQuestions}`,
      latestPercentage: latest.percentage,
      latestCategory: latest.category,
      latestDate: latest.createdAt,
      highestPercentage,
      averagePercentage,
      chartData: {
        labels,
        percentages: chartPercentages,
        scores: chartScores
      }
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve assessment analytics.'
    });
  }
};

module.exports = {
  getQuestions,
  submitAssessment,
  getResultsHistory,
  getAnalytics,
  memoryResults
};
