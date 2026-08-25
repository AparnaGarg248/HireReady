const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: [true, 'File name is required'],
    trim: true
  },
  storedName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: [true, 'File path is required']
  },
  fileType: {
    type: String,
    default: 'application/pdf'
  },
  fileSize: {
    type: Number,
    default: 0
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);
