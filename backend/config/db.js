const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

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
