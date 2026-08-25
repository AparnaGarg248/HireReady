// ==================================================
// BACKEND — APARNA
//
// File: backend/models/Resume.js
//
// Purpose:
// Mongoose schema and model for student resume uploads.
//
// Fields:
// - userId: Reference to the User model
// - fileName: Original file name
// - storedName: Stored file name on server
// - filePath: Relative path where file is stored
// - fileType: MIME type (PDF, DOC, DOCX)
// - fileSize: Size of file in bytes
// - uploadDate: Timestamp of upload
// ==================================================

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
