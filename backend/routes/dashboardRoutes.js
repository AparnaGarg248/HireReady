// ==================================================
// BACKEND — APARNA
//
// File: backend/routes/dashboardRoutes.js
//
// Purpose:
// Express router for Student Dashboard summary metrics.
//
// Route:
// GET /api/dashboard -> dashboardController.getDashboardSummary (Protected)
// ==================================================

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getDashboardSummary } = require('../controllers/dashboardController');

router.get('/', protect, getDashboardSummary);

module.exports = router;
