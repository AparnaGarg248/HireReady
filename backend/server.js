// ==================================================
// BACKEND — APARNA
//
// File: backend/server.js
//
// Purpose:
// Main entry point of the Node.js + Express backend for HireReady AI.
//
// Responsibilities:
// 1. Load environment variables via dotenv.
// 2. Initialize Express application.
// 3. Connect to MongoDB Atlas database.
// 4. Configure security and parsing middleware (CORS, Express JSON).
// 5. Mount API routes (/api/auth, /api/resume, /api/aptitude, /api/dashboard).
// 6. Serve frontend static assets from public/ directory.
// 7. Bind server to host 0.0.0.0 and port 3000.
// ==================================================

require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { connectDB, getDBStatus } = require('./config/db');

// Import Route Handlers
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const aptitudeRoutes = require('./routes/aptitudeRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Database Connection
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from 'public' directory
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// API Health Check & System Status
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'HireReady AI Backend',
    timestamp: new Date().toISOString(),
    database: getDBStatus()
  });
});

// Mount API Routers
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/aptitude', aptitudeRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Fallback Route for Single Page / Navigation Support
app.get('*', (req, res) => {
  // If the path does not match an API, serve index.html or requested static file
  const requestedFile = path.join(publicPath, req.path);
  if (req.path.endsWith('.html')) {
    res.sendFile(requestedFile, (err) => {
      if (err) res.sendFile(path.join(publicPath, 'index.html'));
    });
  } else {
    res.sendFile(path.join(publicPath, 'index.html'));
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An internal server error occurred.'
  });
});

// Start Server on 0.0.0.0 and PORT
app.listen(PORT, '0.0.0.0', () => {
  console.log('==================================================');
  console.log(` HireReady AI Server is running on port ${PORT}`);
  console.log(` Live URL: http://localhost:${PORT}`);
  console.log(' Frontend: Serving from public/ directory');
  console.log(' Backend: Express + Mongoose + JWT + Multer');
  console.log('==================================================');
});
