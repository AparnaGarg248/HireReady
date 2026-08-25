// ==================================================
// BACKEND — APARNA
//
// File: backend/middleware/authMiddleware.js
//
// Purpose:
// Express middleware to verify JSON Web Tokens (JWT)
// on protected API routes.
//
// Responsibilities:
// 1. Extract Bearer token from Authorization header.
// 2. Verify token signature using JWT_SECRET.
// 3. Attach decoded user data (userId, email) to req.user.
// 4. Reject unauthenticated requests with 401 status.
// ==================================================

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'hireready_secure_jwt_secret_key_2026';

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Authentication token missing. Please log in.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name
    };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Session expired or invalid token. Please log in again.'
    });
  }
};

module.exports = { protect, JWT_SECRET };
