// ==================================================
// BACKEND — APARNA
//
// File: backend/models/User.js
//
// Purpose:
// Mongoose schema and model for User accounts (Student registration & authentication).
//
// Fields:
// - name: Full name of the student
// - email: Unique registered email address
// - password: Encrypted password using bcrypt
// - college: Optional college/institution name
// - branch: Engineering/academic department
// - graduationYear: Year of passing out
// - phone: Contact number
// - createdAt: Account creation timestamp
// ==================================================

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide student full name'],
    trim: true,
    maxlength: [60, 'Name cannot exceed 60 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide student email address'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  college: {
    type: String,
    trim: true,
    default: 'Chitkara University'
  },
  branch: {
    type: String,
    trim: true,
    default: 'Computer Science & Engineering'
  },
  graduationYear: {
    type: String,
    trim: true,
    default: '2026'
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
