// ==================================================
// BACKEND — APARNA
//
// File: backend/models/AptitudeResult.js
//
// Purpose:
// Mongoose schema and model for storing student aptitude test results.
//
// Fields:
// - userId: Reference to User model
// - category: Quantitative / Logical / Verbal / All-in-One
// - totalQuestions: Total number of questions in test
// - attemptedQuestions: Number of answered questions
// - correctAnswers: Count of correctly answered questions
// - incorrectAnswers: Count of wrong answers
// - unattemptedQuestions: Count of skipped questions
// - score: Calculated raw score (e.g. 15)
// - percentage: Score percentage (e.g. 75.0%)
// - timeTakenSeconds: Time spent completing test
// - createdAt: Timestamp of test submission
// ==================================================

const mongoose = require('mongoose');

const aptitudeResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability', 'Comprehensive Assessment']
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  attemptedQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  incorrectAnswers: {
    type: Number,
    required: true
  },
  unattemptedQuestions: {
    type: Number,
    default: 0
  },
  score: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  timeTakenSeconds: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.AptitudeResult || mongoose.model('AptitudeResult', aptitudeResultSchema);
