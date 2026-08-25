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
