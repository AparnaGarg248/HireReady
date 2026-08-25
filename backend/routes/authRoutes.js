// ==================================================
// BACKEND — APARNA
//
// File: backend/routes/authRoutes.js
//
// Purpose:
// Express router for Student Authentication & Profile APIs.
//
// Routes:
// POST /api/auth/register -> authController.register
// POST /api/auth/login    -> authController.login
// GET  /api/auth/profile  -> authController.getProfile (Protected)
// PUT  /api/auth/profile  -> authController.updateProfile (Protected)
// ==================================================

const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
