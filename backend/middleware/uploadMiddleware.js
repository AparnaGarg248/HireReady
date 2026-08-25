// ==================================================
// BACKEND — APARNA
//
// File: backend/middleware/uploadMiddleware.js
//
// Purpose:
// Multer middleware configuration for handling student resume uploads.
//
// Responsibilities:
// 1. Configure local disk storage destination and safe filename generator.
// 2. Validate allowed file extensions (PDF, DOC, DOCX).
// 3. Enforce maximum file size limit (5MB).
// ==================================================

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads/resumes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique timestamp filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBaseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `resume-${cleanBaseName}-${uniqueSuffix}${ext}`);
  }
});

// File Filter for PDF, DOC, DOCX
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();

  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedExtensions.includes(ext) || allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format! Only PDF, DOC, and DOCX files are permitted.'), false);
  }
};

// Multer Upload Instance with 5MB limit
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: fileFilter
});

module.exports = upload;
