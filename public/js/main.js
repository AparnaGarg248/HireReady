// ==================================================
// FRONTEND — AASTHA
//
// File: public/js/main.js
//
// Purpose:
// Global utilities, authentication state management,
// toast notifications, and dynamic navigation bar updates.
//
// Technologies:
// HTML5, CSS3, JavaScript, Fetch API
// ==================================================

// Auth State Helpers
const AUTH_TOKEN_KEY = 'hireReadyToken';
const AUTH_USER_KEY = 'hireReadyUser';

function getToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

function getUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function setAuthSession(token, user) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

function clearAuthSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

function isAuthenticated() {
  return !!getToken();
}

function requireAuth() {
  if (!isAuthenticated()) {
    showToast('Please log in to access this page.', 'error');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 400);
    return false;
  }
  return true;
}

// Global Toast Notification System
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerText = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Authenticated Fetch Wrapper
async function authFetch(url, options = {}) {
  const token = getToken();
  const headers = options.headers || {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (response.status === 401) {
    clearAuthSession();
    showToast('Session expired. Please log in again.', 'error');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 600);
    throw new Error('Unauthorized');
  }

  return response;
}

// Logout Handler
function handleLogout() {
  clearAuthSession();
  showToast('Logged out successfully.', 'info');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 400);
}

// Initialize Navigation Bar Based on Auth State
document.addEventListener('DOMContentLoaded', () => {
  const user = getUser();
  const navAuthContainer = document.getElementById('nav-auth-container');
  const navLinksContainer = document.getElementById('nav-links-container');

  if (navAuthContainer) {
    if (isAuthenticated() && user) {
      navAuthContainer.innerHTML = `
        <span class="badge badge-blue" style="font-size: 0.85rem;">
          <i class="fas fa-user-circle"></i> ${user.name ? user.name.split(' ')[0] : 'Student'}
        </span>
        <button onclick="handleLogout()" class="btn btn-outline btn-sm">
          Logout
        </button>
      `;
    } else {
      navAuthContainer.innerHTML = `
        <a href="login.html" class="btn btn-outline btn-sm">Login</a>
        <a href="register.html" class="btn btn-primary btn-sm">Register</a>
      `;
    }
  }

  // Update nav links if logged in
  if (navLinksContainer && isAuthenticated()) {
    navLinksContainer.innerHTML = `
      <li><a href="dashboard.html" class="nav-link" id="nav-dashboard">Dashboard</a></li>
      <li><a href="aptitude.html" class="nav-link" id="nav-aptitude">Aptitude Test</a></li>
      <li><a href="resume.html" class="nav-link" id="nav-resume">Resume</a></li>
      <li><a href="profile.html" class="nav-link" id="nav-profile">Profile</a></li>
    `;
  }

  // Set active link based on current path
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navMap = {
    'index.html': 'nav-home',
    'dashboard.html': 'nav-dashboard',
    'aptitude.html': 'nav-aptitude',
    'results.html': 'nav-aptitude',
    'resume.html': 'nav-resume',
    'profile.html': 'nav-profile',
    'login.html': 'nav-login',
    'register.html': 'nav-register'
  };

  const activeId = navMap[currentPath];
  if (activeId) {
    const activeEl = document.getElementById(activeId);
    if (activeEl) activeEl.classList.add('active');
  }
});
