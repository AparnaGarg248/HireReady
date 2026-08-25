// ==================================================
// FRONTEND — AASTHA
//
// File: public/js/resume.js
//
// Purpose:
// Client-side Resume Management module: handles file selection,
// drag-and-drop, Multer upload via Fetch API, viewing metadata,
// and resume downloading.
//
// Technologies:
// HTML5, JavaScript, Multer endpoint communication
// ==================================================

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;

  loadResumeStatus();
  initUploadHandlers();
});

async function loadResumeStatus() {
  try {
    const response = await authFetch('/api/resume');
    const data = await response.json();

    const noResumeBox = document.getElementById('no-resume-box');
    const uploadedResumeCard = document.getElementById('uploaded-resume-card');
    const resumeFileNameEl = document.getElementById('resume-file-name');
    const resumeFileSizeEl = document.getElementById('resume-file-size');
    const resumeUploadDateEl = document.getElementById('resume-upload-date');

    if (data.hasResume && data.resume) {
      if (noResumeBox) noResumeBox.style.display = 'none';
      if (uploadedResumeCard) uploadedResumeCard.style.display = 'block';

      if (resumeFileNameEl) resumeFileNameEl.innerText = data.resume.fileName;
      if (resumeFileSizeEl) {
        const sizeKb = (data.resume.fileSize / 1024).toFixed(1);
        resumeFileSizeEl.innerText = `${sizeKb} KB`;
      }
      if (resumeUploadDateEl) {
        const formattedDate = new Date(data.resume.uploadDate).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        resumeUploadDateEl.innerText = formattedDate;
      }
    } else {
      if (noResumeBox) noResumeBox.style.display = 'block';
      if (uploadedResumeCard) uploadedResumeCard.style.display = 'none';
    }
  } catch (error) {
    console.error('Error fetching resume details:', error);
  }
}

function initUploadHandlers() {
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('resume-file-input');
  const uploadForm = document.getElementById('resume-upload-form');
  const selectedFileInfo = document.getElementById('selected-file-info');
  const selectedFileName = document.getElementById('selected-file-name');
  const uploadBtn = document.getElementById('resume-submit-btn');

  if (!dropZone || !fileInput) return;

  // Click on dropzone triggers file input
  dropZone.addEventListener('click', () => fileInput.click());

  // Drag & drop events
  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.style.borderColor = 'var(--primary-blue)';
      dropZone.style.backgroundColor = 'var(--primary-light)';
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.style.borderColor = 'var(--border-light)';
      dropZone.style.backgroundColor = 'var(--bg-surface)';
    }, false);
  });

  dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      fileInput.files = files;
      handleFileSelected(files[0]);
    }
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      handleFileSelected(fileInput.files[0]);
    }
  });

  function handleFileSelected(file) {
    const validExtensions = ['.pdf', '.doc', '.docx'];
    const fileExt = '.' + file.name.split('.').pop().toLowerCase();

    if (!validExtensions.includes(fileExt)) {
      showToast('Invalid format. Only PDF, DOC, and DOCX files are permitted.', 'error');
      fileInput.value = '';
      if (selectedFileInfo) selectedFileInfo.style.display = 'none';
      if (uploadBtn) uploadBtn.disabled = true;
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('File is too large. Maximum allowed size is 5MB.', 'error');
      fileInput.value = '';
      if (selectedFileInfo) selectedFileInfo.style.display = 'none';
      if (uploadBtn) uploadBtn.disabled = true;
      return;
    }

    if (selectedFileName) {
      selectedFileName.innerText = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
    }
    if (selectedFileInfo) selectedFileInfo.style.display = 'flex';
    if (uploadBtn) uploadBtn.disabled = false;
  }

  if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!fileInput.files || fileInput.files.length === 0) {
        showToast('Please choose a file to upload.', 'error');
        return;
      }

      const file = fileInput.files[0];
      const formData = new FormData();
      formData.append('resume', file);

      uploadBtn.disabled = true;
      const originalText = uploadBtn.innerText;
      uploadBtn.innerText = 'Uploading to Server...';

      try {
        const response = await authFetch('/api/resume/upload', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          showToast(data.message || 'Resume uploaded successfully!', 'success');
          fileInput.value = '';
          if (selectedFileInfo) selectedFileInfo.style.display = 'none';
          loadResumeStatus();
        } else {
          showToast(data.message || 'Upload failed.', 'error');
        }
      } catch (error) {
        console.error('Upload Error:', error);
        showToast('Error uploading resume.', 'error');
      } finally {
        uploadBtn.disabled = false;
        uploadBtn.innerText = originalText;
      }
    });
  }
}

// Download Resume Handler
async function handleDownloadResume() {
  const token = getToken();
  if (!token) return;

  window.location.href = `/api/resume/download?token=${token}`;
}

// Delete Resume Handler
async function handleDeleteResume() {
  if (!confirm('Are you sure you want to remove your uploaded resume?')) return;

  try {
    const response = await authFetch('/api/resume', {
      method: 'DELETE'
    });

    const data = await response.json();
    if (data.success) {
      showToast('Resume removed successfully.', 'info');
      loadResumeStatus();
    } else {
      showToast(data.message || 'Failed to remove resume.', 'error');
    }
  } catch (error) {
    console.error('Delete Resume Error:', error);
    showToast('Failed to remove resume.', 'error');
  }
}
