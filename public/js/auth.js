// ==================================================
// FRONTEND — AASTHA
//
// File: public/js/auth.js
//
// Purpose:
// Client-side authentication logic for Student Registration and Login.
//
// Responsibilities:
// 1. Client-side form validation (email format, matching passwords).
// 2. Sending registration & login POST requests via fetch().
// 3. Storing JWT token and user details in localStorage.
// 4. Handling errors and loading states gracefully.
// ==================================================

document.addEventListener('DOMContentLoaded', () => {
  // If already logged in, redirect to dashboard
  if (isAuthenticated() && (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html'))) {
    window.location.href = 'dashboard.html';
    return;
  }

  // 1. Handle Registration Form
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const college = document.getElementById('college') ? document.getElementById('college').value.trim() : '';
      const branch = document.getElementById('branch') ? document.getElementById('branch').value.trim() : '';
      const submitBtn = document.getElementById('register-submit-btn');

      // Client-side validation
      if (!name || !email || !password || !confirmPassword) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }

      if (password.length < 6) {
        showToast('Password must be at least 6 characters long.', 'error');
        return;
      }

      if (password !== confirmPassword) {
        showToast('Passwords do not match. Please verify.', 'error');
        return;
      }

      // UI Loading state
      submitBtn.disabled = true;
      const originalText = submitBtn.innerText;
      submitBtn.innerText = 'Creating Account...';

      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, confirmPassword, college, branch })
        });

        const data = await response.json();

        if (data.success) {
          showToast(data.message || 'Registration successful!', 'success');
          setAuthSession(data.token, data.user);
          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 600);
        } else {
          showToast(data.message || 'Registration failed. Please check your details.', 'error');
          submitBtn.disabled = false;
          submitBtn.innerText = originalText;
        }
      } catch (error) {
        console.error('Registration Fetch Error:', error);
        showToast('Network error. Please try again.', 'error');
        submitBtn.disabled = false;
        submitBtn.innerText = originalText;
      }
    });
  }

  // 2. Handle Login Form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const submitBtn = document.getElementById('login-submit-btn');

      if (!email || !password) {
        showToast('Please enter both email and password.', 'error');
        return;
      }

      submitBtn.disabled = true;
      const originalText = submitBtn.innerText;
      submitBtn.innerText = 'Signing In...';

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
          showToast('Welcome back, ' + (data.user.name || 'Student') + '!', 'success');
          setAuthSession(data.token, data.user);
          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 500);
        } else {
          showToast(data.message || 'Invalid credentials.', 'error');
          submitBtn.disabled = false;
          submitBtn.innerText = originalText;
        }
      } catch (error) {
        console.error('Login Fetch Error:', error);
        showToast('Network error. Please try again.', 'error');
        submitBtn.disabled = false;
        submitBtn.innerText = originalText;
      }
    });
  }
});
