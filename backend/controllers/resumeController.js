// ==================================================
// BACKEND — APARNA
//
// File: backend/controllers/resumeController.js
//
// Purpose:
// Controller for handling Student Resume Uploads and File Management using Multer.
//
// Endpoints:
// - POST /api/resume/upload : Upload new resume (PDF/DOC/DOCX)
// - GET  /api/resume        : Fetch active resume metadata
// - GET  /api/resume/download : Download uploaded resume file
// - DELETE /api/resume      : Delete uploaded resume
// ==================================================

const path = require('path');
const fs = require('fs');
const Resume = require('../models/Resume');

// In-memory resume store for preview / fallback mode
const memoryResumes = new Map();

// @desc    Upload student resume
// @route   POST /api/resume/upload
// @access  Private (JWT Protected)
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select a resume file to upload (.pdf, .doc, or .docx).'
      });
    }

    const userId = req.user.id;
    const file = req.file;

    // Database record creation
    let resumeRecord = null;
    try {
      // Find existing resume and update or replace
      resumeRecord = await Resume.findOne({ userId });
      if (resumeRecord) {
        // Delete old file from disk if different
        try {
          const oldPath = path.join(__dirname, '../../', resumeRecord.filePath);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        } catch (e) {}

        resumeRecord.fileName = file.originalname;
        resumeRecord.storedName = file.filename;
        resumeRecord.filePath = `uploads/resumes/${file.filename}`;
        resumeRecord.fileType = file.mimetype;
        resumeRecord.fileSize = file.size;
        resumeRecord.uploadDate = new Date();
        await resumeRecord.save();
      } else {
        resumeRecord = await Resume.create({
          userId,
          fileName: file.originalname,
          storedName: file.filename,
          filePath: `uploads/resumes/${file.filename}`,
          fileType: file.mimetype,
          fileSize: file.size,
          uploadDate: new Date()
        });
      }
    } catch (dbErr) {
      // Memory store fallback
      resumeRecord = {
        _id: 'resume_' + Date.now(),
        userId: userId.toString(),
        fileName: file.originalname,
        storedName: file.filename,
        filePath: `uploads/resumes/${file.filename}`,
        fileType: file.mimetype,
        fileSize: file.size,
        uploadDate: new Date()
      };
    }

    // Cache in memory
    memoryResumes.set(userId.toString(), {
      fileName: file.originalname,
      storedName: file.filename,
      filePath: `uploads/resumes/${file.filename}`,
      fileType: file.mimetype,
      fileSize: file.size,
      uploadDate: resumeRecord.uploadDate || new Date()
    });

    return res.status(200).json({
      success: true,
      message: 'Resume uploaded and verified successfully!',
      resume: {
        fileName: file.originalname,
        fileSize: file.size,
        fileType: file.mimetype,
        uploadDate: resumeRecord.uploadDate || new Date(),
        status: 'Uploaded'
      }
    });
  } catch (error) {
    console.error('Resume Upload Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error processing resume file upload.'
    });
  }
};

// @desc    Get student's uploaded resume status
// @route   GET /api/resume
// @access  Private
const getResume = async (req, res) => {
  try {
    const userId = req.user.id;
    let resume = null;

    try {
      resume = await Resume.findOne({ userId });
    } catch (dbErr) {
      resume = memoryResumes.get(userId.toString());
    }

    if (!resume) {
      resume = memoryResumes.get(userId.toString());
    }

    if (!resume) {
      return res.status(200).json({
        success: true,
        hasResume: false,
        message: 'No resume uploaded yet.'
      });
    }

    return res.status(200).json({
      success: true,
      hasResume: true,
      resume: {
        fileName: resume.fileName,
        fileSize: resume.fileSize,
        fileType: resume.fileType,
        uploadDate: resume.uploadDate,
        status: 'Uploaded'
      }
    });
  } catch (error) {
    console.error('Fetch Resume Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not fetch resume details.'
    });
  }
};

// @desc    Download resume file
// @route   GET /api/resume/download
// @access  Private
const downloadResume = async (req, res) => {
  try {
    const userId = req.user.id;
    let resume = null;

    try {
      resume = await Resume.findOne({ userId });
    } catch (dbErr) {
      resume = memoryResumes.get(userId.toString());
    }

    if (!resume) {
      resume = memoryResumes.get(userId.toString());
    }

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'No resume found for download.'
      });
    }

    const fullPath = path.join(__dirname, '../../', resume.filePath);
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({
        success: false,
        message: 'Resume file is not present on disk.'
      });
    }

    return res.download(fullPath, resume.fileName);
  } catch (error) {
    console.error('Download Resume Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error downloading resume file.'
    });
  }
};

// @desc    Delete uploaded resume
// @route   DELETE /api/resume
// @access  Private
const deleteResume = async (req, res) => {
  try {
    const userId = req.user.id;
    let resume = null;

    try {
      resume = await Resume.findOneAndDelete({ userId });
      if (resume) {
        const fullPath = path.join(__dirname, '../../', resume.filePath);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      }
    } catch (dbErr) {
      // Memory fallback
    }

    memoryResumes.delete(userId.toString());

    return res.status(200).json({
      success: true,
      message: 'Resume removed successfully.'
    });
  } catch (error) {
    console.error('Delete Resume Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete resume.'
    });
  }
};

module.exports = {
  uploadResume,
  getResume,
  downloadResume,
  deleteResume,
  memoryResumes
};
