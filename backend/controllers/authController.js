// ==================================================
// BACKEND — APARNA
//
// File: backend/controllers/authController.js
//
// Purpose:
// Controller for Student Authentication & Profile Management.
//
// Endpoints:
// - POST /api/auth/register : Register new student account
// - POST /api/auth/login    : Authenticate student & return JWT
// - GET  /api/auth/profile  : Get student profile information
// - PUT  /api/auth/profile  : Update student profile
// ==================================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/authMiddleware');

// Helper to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      college,
      branch,
      graduationYear,
      phone
    } = req.body;

    // 1. Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email address, and password.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match. Please verify and re-enter.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Check if user already exists
    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.'
      });
    }

    // 3. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create User Record in MongoDB
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      college: college || 'Chitkara University',
      branch: branch || 'Computer Science & Engineering',
      graduationYear: graduationYear || '2026',
      phone: phone || ''
    });

    console.log('New user registered in MongoDB:', newUser.email);

    // 5. Generate Token and Respond
    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to HireReady AI.',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        college: newUser.college,
        branch: newUser.branch,
        graduationYear: newUser.graduationYear,
        phone: newUser.phone
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration. Please try again.'
    });
  }
};

// @desc    Authenticate student & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Find User in MongoDB
    const user = await User.findOne({
      email: normalizedEmail
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please check your credentials.'
      });
    }

    // 3. Verify Password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please check your credentials.'
      });
    }

    // 4. Generate Token
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        branch: user.branch,
        graduationYear: user.graduationYear,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Login Error:', error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login. Please try again.'
    });
  }
};

// @desc    Get logged-in student profile
// @route   GET /api/auth/profile
// @access  Private (Protected by JWT)
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found.'
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college || 'Chitkara University',
        branch: user.branch || 'Computer Science & Engineering',
        graduationYear: user.graduationYear || '2026',
        phone: user.phone || '',
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Profile Fetch Error:', error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Could not retrieve profile information.'
    });
  }
};

// @desc    Update student profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const {
      name,
      college,
      branch,
      graduationYear,
      phone
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found.'
      });
    }

    if (name) {
      user.name = name.trim();
    }

    if (college) {
      user.college = college.trim();
    }

    if (branch) {
      user.branch = branch.trim();
    }

    if (graduationYear) {
      user.graduationYear = graduationYear.trim();
    }

    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        branch: user.branch,
        graduationYear: user.graduationYear,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Profile Update Error:', error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating profile details.'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};
