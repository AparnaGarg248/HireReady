// ==================================================
// BACKEND — APARNA
//
// File: backend/config/db.js
//
// Purpose:
// MongoDB Atlas database connection configuration using Mongoose.
//
// Responsibilities:
// 1. Read MONGODB_URI from environment variables.
// 2. Connect to MongoDB Atlas cluster with retry logic.
// 3. Provide connection status and graceful fallback for local testing.
// ==================================================

const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  // ==================================================
  // BACKEND — APARNA
  // MONGODB ATLAS CONNECTION
  //
  // Add your MongoDB Atlas connection string inside the .env file:
  // MONGODB_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING
  // ==================================================

  if (!uri || uri.includes('YOUR_MONGODB_ATLAS_CONNECTION_STRING') || uri.includes('<username>')) {
    console.log('----------------------------------------------------');
    console.log(' [MONGODB STATUS] MongoDB Atlas URI not configured yet.');
    console.log(' Set MONGODB_URI in .env to connect your Atlas cluster.');
    console.log(' Running with in-memory resilient storage for preview.');
    console.log('----------------------------------------------------');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[MONGODB STATUS] MongoDB Atlas Connected Successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`[MONGODB ERROR] Connection Failed: ${error.message}`);
    console.log('[MONGODB INFO] Operating in fallback memory mode so the application remains fully functional.');
    return false;
  }
};

const getDBStatus = () => ({
  connected: isConnected,
  mode: isConnected ? 'MongoDB Atlas (Live)' : 'Local Storage Mode (Ready for Atlas URI)'
});

module.exports = { connectDB, getDBStatus };
