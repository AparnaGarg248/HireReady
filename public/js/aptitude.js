// ==================================================
// FRONTEND — AASTHA
//
// File: public/js/aptitude.js
//
// Purpose:
// Handles Aptitude Assessment test flow, question navigation,
// answer capture, timer, submit warning modal, score calculation
// display, and historical attempts table.
//
// Technologies:
// HTML5, CSS3, JavaScript, Fetch API
// ==================================================

// State Variables for Active Test
let activeCategory = 'Comprehensive Assessment';
let testQuestions = [];
let currentIndex = 0;
let userAnswers = {}; // { [questionId]: optionIndex }
let timerInterval = null;
let secondsRemaining = 1200; // 20 minutes default
let timeSpent = 0;

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;

  const currentPath = window.location.pathname.split('/').pop();

  if (currentPath === 'aptitude.html') {
    initAptitudePage();
  } else if (currentPath === 'results.html') {
    renderResultsPage();
  }
});

// Initialize Aptitude Selection & History Page
async function initAptitudePage() {
  loadAssessmentHistory();

  // Category Selection Handlers
  const categoryCards = document.querySelectorAll('.category-card');
  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      categoryCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      activeCategory = card.getAttribute('data-category');
    });
  });

  const startTestBtn = document.getElementById('start-test-btn');
  if (startTestBtn) {
    startTestBtn.addEventListener('click', () => {
      startAssessment(activeCategory);
    });
  }
}

// Fetch and Start Test
async function startAssessment(category) {
  const selectionView = document.getElementById('test-selection-view');
  const activeTestView = document.getElementById('active-test-view');

  try {
    const response = await authFetch(`/api/aptitude/questions?category=${encodeURIComponent(category)}`);
    const data = await response.json();

    if (!data.success || !data.questions || data.questions.length === 0) {
      showToast('Could not load test questions. Please try again.', 'error');
      return;
    }

    testQuestions = data.questions;
    currentIndex = 0;
    userAnswers = {};
    activeCategory = category;

    // Switch Views
    if (selectionView) selectionView.style.display = 'none';
    if (activeTestView) activeTestView.style.display = 'block';

    // Start Timer (20 mins for Comprehensive, 10 mins for single category)
    secondsRemaining = testQuestions.length * 60; // 1 min per question
    timeSpent = 0;
    startTimer();

    // Render Question & Palette
    renderQuestion(currentIndex);
    renderQuestionPalette();

  } catch (error) {
    console.error('Error starting test:', error);
    showToast('Failed to start assessment.', 'error');
  }
}

// Timer Loop
function startTimer() {
  if (timerInterval) clearInterval(timerInterval);

  const timerEl = document.getElementById('timer-display');

  timerInterval = setInterval(() => {
    secondsRemaining--;
    timeSpent++;

    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;
    const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    if (timerEl) {
      timerEl.innerText = formatted;
      if (secondsRemaining <= 120) {
        timerEl.parentElement.classList.add('timer-warning');
      }
    }

    if (secondsRemaining <= 0) {
      clearInterval(timerInterval);
      showToast('Time is up! Submitting test automatically...', 'info');
      submitTest(true);
    }
  }, 1000);
}

// Render Current Question
function renderQuestion(index) {
  if (index < 0 || index >= testQuestions.length) return;
  currentIndex = index;

  const q = testQuestions[index];
  const qNumberEl = document.getElementById('q-number');
  const qTotalEl = document.getElementById('q-total');
  const qCategoryEl = document.getElementById('q-category');
  const qTopicEl = document.getElementById('q-topic');
  const qTextEl = document.getElementById('q-text');
  const optionsListEl = document.getElementById('options-list');

  if (qNumberEl) qNumberEl.innerText = `Question ${index + 1}`;
  if (qTotalEl) qTotalEl.innerText = `of ${testQuestions.length}`;
  if (qCategoryEl) qCategoryEl.innerText = q.category;
  if (qTopicEl) qTopicEl.innerText = q.topic;
  if (qTextEl) qTextEl.innerText = q.question;

  const letters = ['A', 'B', 'C', 'D'];
  const selected = userAnswers[q.id];

  if (optionsListEl) {
    optionsListEl.innerHTML = q.options.map((opt, optIdx) => {
      const isSelected = selected === optIdx;
      return `
        <div class="option-item ${isSelected ? 'selected' : ''}" onclick="selectOption(${q.id}, ${optIdx})">
          <div class="option-badge">${letters[optIdx]}</div>
          <div class="option-label">${opt}</div>
        </div>
      `;
    }).join('');
  }

  // Update Nav Buttons
  const prevBtn = document.getElementById('btn-prev-q');
  const nextBtn = document.getElementById('btn-next-q');
  if (prevBtn) prevBtn.disabled = currentIndex === 0;
  if (nextBtn) {
    nextBtn.innerText = currentIndex === testQuestions.length - 1 ? 'Review & Submit' : 'Next Question';
  }

  // Highlight Current in Palette
  updatePaletteStates();
}

// Option Click Handler
function selectOption(questionId, optionIndex) {
  userAnswers[questionId] = optionIndex;
  renderQuestion(currentIndex);
  updatePaletteStates();
}

// Clear Chosen Option
function clearSelectedOption() {
  const q = testQuestions[currentIndex];
  if (q && userAnswers[q.id] !== undefined) {
    delete userAnswers[q.id];
    renderQuestion(currentIndex);
    updatePaletteStates();
  }
}

// Next / Previous Handlers
function nextQuestion() {
  if (currentIndex < testQuestions.length - 1) {
    renderQuestion(currentIndex + 1);
  } else {
    promptSubmitTest();
  }
}

function prevQuestion() {
  if (currentIndex > 0) {
    renderQuestion(currentIndex - 1);
  }
}

// Question Navigation Palette
function renderQuestionPalette() {
  const paletteGrid = document.getElementById('palette-grid');
  if (!paletteGrid) return;

  paletteGrid.innerHTML = testQuestions.map((q, idx) => {
    return `
      <button class="palette-btn" id="pal-btn-${idx}" onclick="renderQuestion(${idx})">
        ${idx + 1}
      </button>
    `;
  }).join('');

  updatePaletteStates();
}

function updatePaletteStates() {
  testQuestions.forEach((q, idx) => {
    const btn = document.getElementById(`pal-btn-${idx}`);
    if (!btn) return;

    btn.className = 'palette-btn';
    if (idx === currentIndex) btn.classList.add('current');
    if (userAnswers[q.id] !== undefined) btn.classList.add('answered');
  });
}

// Submit Test Prompt with Unanswered Warnings
function promptSubmitTest() {
  const answeredCount = Object.keys(userAnswers).length;
  const totalCount = testQuestions.length;
  const unansweredCount = totalCount - answeredCount;

  let msg = `You have answered ${answeredCount} of ${totalCount} questions.`;
  if (unansweredCount > 0) {
    msg += `\nWarning: You have ${unansweredCount} unanswered questions!`;
  }
  msg += '\n\nAre you sure you want to submit your assessment?';

  if (confirm(msg)) {
    submitTest(false);
  }
}

// Submit Assessment to Backend
async function submitTest(isAutoSubmit = false) {
  if (timerInterval) clearInterval(timerInterval);

  try {
    const response = await authFetch('/api/aptitude/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: activeCategory,
        answers: userAnswers,
        timeTakenSeconds: timeSpent
      })
    });

    const data = await response.json();

    if (data.success && data.result) {
      // Store in session for results view
      sessionStorage.setItem('lastAptitudeResult', JSON.stringify(data.result));
      window.location.href = 'results.html';
    } else {
      showToast(data.message || 'Error submitting assessment.', 'error');
    }
  } catch (error) {
    console.error('Submission Error:', error);
    showToast('Failed to submit test. Please check network.', 'error');
  }
}

// Load Assessment History Table
async function loadAssessmentHistory() {
  const historyTableBody = document.getElementById('history-table-body');
  const emptyHistoryMsg = document.getElementById('empty-history-msg');

  if (!historyTableBody) return;

  try {
    const response = await authFetch('/api/aptitude/history');
    const data = await response.json();

    if (data.success && data.history && data.history.length > 0) {
      if (emptyHistoryMsg) emptyHistoryMsg.style.display = 'none';

      historyTableBody.innerHTML = data.history.map(item => {
        const date = new Date(item.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });

        let badgeClass = 'badge-blue';
        if (item.percentage >= 70) badgeClass = 'badge-success';
        else if (item.percentage < 50) badgeClass = 'badge-warning';

        return `
          <tr>
            <td><strong>${date}</strong></td>
            <td>${item.category}</td>
            <td>${item.score} / ${item.totalQuestions}</td>
            <td>${item.attemptedQuestions} / ${item.totalQuestions}</td>
            <td><span class="badge ${badgeClass}">${item.percentage}%</span></td>
          </tr>
        `;
      }).join('');
    } else {
      if (emptyHistoryMsg) emptyHistoryMsg.style.display = 'block';
      historyTableBody.innerHTML = '';
    }
  } catch (error) {
    console.error('Error loading history:', error);
  }
}

// Render Results Page (results.html)
function renderResultsPage() {
  const raw = sessionStorage.getItem('lastAptitudeResult');
  if (!raw) {
    window.location.href = 'aptitude.html';
    return;
  }

  const result = JSON.parse(raw);

  const resCategoryEl = document.getElementById('res-category');
  const resPercentageEl = document.getElementById('res-percentage');
  const resScoreEl = document.getElementById('res-score');
  const resTotalEl = document.getElementById('res-total');
  const resAttemptedEl = document.getElementById('res-attempted');
  const resCorrectEl = document.getElementById('res-correct');
  const resIncorrectEl = document.getElementById('res-incorrect');
  const resReviewContainer = document.getElementById('review-container');

  if (resCategoryEl) resCategoryEl.innerText = result.category;
  if (resPercentageEl) resPercentageEl.innerText = `${result.percentage}%`;
  if (resScoreEl) resScoreEl.innerText = `${result.score} / ${result.totalQuestions}`;
  if (resTotalEl) resTotalEl.innerText = result.totalQuestions;
  if (resAttemptedEl) resAttemptedEl.innerText = result.attemptedQuestions;
  if (resCorrectEl) resCorrectEl.innerText = result.correctAnswers;
  if (resIncorrectEl) resIncorrectEl.innerText = result.incorrectAnswers;

  // Render Detailed Question-by-Question Review
  if (resReviewContainer && result.review) {
    const letters = ['A', 'B', 'C', 'D'];

    resReviewContainer.innerHTML = result.review.map((item, idx) => {
      const isCorrect = item.isCorrect;
      const statusBadge = isCorrect
        ? '<span class="badge badge-success">Correct (+1)</span>'
        : item.selectedOption === null
          ? '<span class="badge badge-warning">Unattempted</span>'
          : '<span class="badge badge-danger">Incorrect</span>';

      return `
        <div class="review-item ${isCorrect ? 'correct' : 'incorrect'}">
          <div class="question-meta">
            <span class="badge badge-blue">Question ${idx + 1} • ${item.topic || item.category}</span>
            ${statusBadge}
          </div>
          <div class="question-text" style="margin-bottom: 14px;">${item.question}</div>
          
          <div class="options-list" style="margin-bottom: 12px;">
            ${item.options.map((opt, optIdx) => {
              let optStyle = 'border: 1px solid var(--border-light);';
              let optBadgeClass = '';
              let markText = '';

              if (optIdx === item.correctOption) {
                optStyle = 'border: 2px solid var(--status-success); background-color: var(--status-success-bg); font-weight: 600;';
                markText = ' <strong style="color: var(--status-success); margin-left: 8px;">(Correct Answer)</strong>';
              } else if (optIdx === item.selectedOption && !isCorrect) {
                optStyle = 'border: 2px solid var(--status-danger); background-color: var(--status-danger-bg);';
                markText = ' <strong style="color: var(--status-danger); margin-left: 8px;">(Your Answer)</strong>';
              }

              return `
                <div class="option-item" style="${optStyle}">
                  <div class="option-badge ${optBadgeClass}">${letters[optIdx]}</div>
                  <div class="option-label">${opt} ${markText}</div>
                </div>
              `;
            }).join('')}
          </div>

          <div class="explanation-box">
            <strong>Explanation:</strong> ${item.explanation || 'No detailed explanation provided.'}
          </div>
        </div>
      `;
    }).join('');
  }
}
