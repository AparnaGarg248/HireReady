// ==================================================
// BACKEND — APARNA
//
// File: backend/routes/resumeRoutes.js
//
// Purpose:
// Express router for Student Resume Uploads and File Management.
//
// Routes:
// POST   /api/resume/upload   -> resumeController.uploadResume (Multer)
// GET    /api/resume          -> resumeController.getResume
// GET    /api/resume/download -> resumeController.downloadResume
// DELETE /api/resume          -> resumeController.deleteResume
// ==================================================

const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const {
  uploadResume,
  getResume,
  downloadResume,
  deleteResume
} = require('../controllers/resumeController');

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/', protect, getResume);
router.get('/download', protect, downloadResume);
router.delete('/', protect, deleteResume);

module.exports = router;
