// ==================================================
// FRONTEND — AASTHA
//
// File: public/js/profile.js
//
// Purpose:
// Client-side Profile management: fetches student profile details,
// allows updating academic information, and displays assessment
// summary metrics.
//
// Technologies:
// HTML5, JavaScript, Fetch API
// ==================================================

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;

  loadProfileDetails();
  initProfileForm();
});

async function loadProfileDetails() {
  try {
    // 1. Fetch Profile Data
    const profRes = await authFetch('/api/auth/profile');
    const profData = await profRes.json();

    if (profData.success && profData.user) {
      const user = profData.user;
      
      const nameInput = document.getElementById('profile-name');
      const emailInput = document.getElementById('profile-email');
      const collegeInput = document.getElementById('profile-college');
      const branchInput = document.getElementById('profile-branch');
      const gradYearInput = document.getElementById('profile-grad-year');
      const phoneInput = document.getElementById('profile-phone');

      if (nameInput) nameInput.value = user.name || '';
      if (emailInput) emailInput.value = user.email || '';
      if (collegeInput) collegeInput.value = user.college || '';
      if (branchInput) branchInput.value = user.branch || '';
      if (gradYearInput) gradYearInput.value = user.graduationYear || '';
      if (phoneInput) phoneInput.value = user.phone || '';

      const heroName = document.getElementById('profile-hero-name');
      const heroEmail = document.getElementById('profile-hero-email');
      if (heroName) heroName.innerText = user.name || 'Student';
      if (heroEmail) heroEmail.innerText = user.email || '';
    }

    // 2. Fetch Resume Info for Profile
    const resumeRes = await authFetch('/api/resume');
    const resumeData = await resumeRes.json();
    const resumeStatusEl = document.getElementById('profile-resume-status');
    if (resumeStatusEl) {
      resumeStatusEl.innerText = resumeData.hasResume ? 'Uploaded (Active)' : 'Not Uploaded';
      resumeStatusEl.className = resumeData.hasResume ? 'badge badge-success' : 'badge badge-warning';
    }

    // 3. Fetch Aptitude Analytics for Profile Summary
    const analyticsRes = await authFetch('/api/aptitude/analytics');
    const analyticsData = await analyticsRes.json();

    const attemptsCountEl = document.getElementById('profile-total-attempts');
    const highestScoreEl = document.getElementById('profile-highest-score');
    const avgScoreEl = document.getElementById('profile-avg-score');

    if (attemptsCountEl) attemptsCountEl.innerText = analyticsData.totalAttempts || 0;
    if (highestScoreEl) highestScoreEl.innerText = analyticsData.hasAttempts ? `${analyticsData.highestPercentage}%` : 'N/A';
    if (avgScoreEl) avgScoreEl.innerText = analyticsData.hasAttempts ? `${analyticsData.averagePercentage}%` : 'N/A';

  } catch (error) {
    console.error('Error loading profile:', error);
  }
}

function initProfileForm() {
  const profileForm = document.getElementById('profile-edit-form');
  if (!profileForm) return;

  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('profile-name').value.trim();
    const college = document.getElementById('profile-college').value.trim();
    const branch = document.getElementById('profile-branch').value.trim();
    const graduationYear = document.getElementById('profile-grad-year').value.trim();
    const phone = document.getElementById('profile-phone').value.trim();
    const submitBtn = document.getElementById('profile-save-btn');

    if (!name) {
      showToast('Name cannot be empty.', 'error');
      return;
    }

    submitBtn.disabled = true;
    const originalText = submitBtn.innerText;
    submitBtn.innerText = 'Saving Changes...';

    try {
      const response = await authFetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, college, branch, graduationYear, phone })
      });

      const data = await response.json();

      if (data.success) {
        showToast(data.message || 'Profile updated successfully!', 'success');
        // Update stored user
        const existing = getUser() || {};
        setAuthSession(getToken(), { ...existing, name, college, branch });
        loadProfileDetails();
      } else {
        showToast(data.message || 'Failed to update profile.', 'error');
      }
    } catch (error) {
      console.error('Update Profile Error:', error);
      showToast('Network error while updating profile.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerText = originalText;
    }
  });
}
