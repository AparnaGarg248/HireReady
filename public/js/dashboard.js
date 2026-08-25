// ==================================================
// FRONTEND — AASTHA
//
// File: public/js/dashboard.js
//
// Purpose:
// Handles Student Dashboard data fetching, metric cards population,
// recent attempts rendering, and Chart.js performance visualization.
//
// Technologies:
// JavaScript, Fetch API, Chart.js
// ==================================================

let aptitudeChartInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;

  loadDashboardData();
});

async function loadDashboardData() {
  try {
    const response = await authFetch('/api/dashboard');
    const result = await response.json();

    if (!result.success) {
      showToast('Could not load dashboard information.', 'error');
      return;
    }

    const { student, resumeStatus, aptitudeOverview, chartData, recentAttempts } = result.data;

    // 1. Populate Student Welcome Banner
    const studentNameEl = document.getElementById('student-name');
    const studentEmailEl = document.getElementById('student-email');
    const studentCollegeEl = document.getElementById('student-college');

    if (studentNameEl) studentNameEl.innerText = student.name || 'Student';
    if (studentEmailEl) studentEmailEl.innerText = student.email || '';
    if (studentCollegeEl) studentCollegeEl.innerText = `${student.branch} • ${student.college}`;

    // 2. Populate Resume Status Card
    const resumeStatusBadge = document.getElementById('resume-status-badge');
    const resumeInfoText = document.getElementById('resume-info-text');

    if (resumeStatusBadge && resumeInfoText) {
      if (resumeStatus.isUploaded) {
        resumeStatusBadge.className = 'badge badge-success';
        resumeStatusBadge.innerText = 'Resume Uploaded';
        const formattedDate = new Date(resumeStatus.uploadDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        resumeInfoText.innerText = `${resumeStatus.fileName} (Updated: ${formattedDate})`;
      } else {
        resumeStatusBadge.className = 'badge badge-warning';
        resumeStatusBadge.innerText = 'Resume Not Uploaded';
        resumeInfoText.innerText = 'Upload your latest CV in PDF or DOC format';
      }
    }

    // 3. Populate Aptitude Overview Metrics
    const attemptsCountEl = document.getElementById('metric-attempts');
    const latestScoreEl = document.getElementById('metric-latest-score');
    const latestPercentEl = document.getElementById('metric-latest-percentage');
    const avgScoreEl = document.getElementById('metric-avg-score');
    const highestScoreEl = document.getElementById('metric-highest-score');

    if (attemptsCountEl) attemptsCountEl.innerText = aptitudeOverview.totalAttempts;
    
    if (latestScoreEl) {
      latestScoreEl.innerText = aptitudeOverview.totalAttempts > 0 
        ? `${aptitudeOverview.latestPercentage}%` 
        : 'N/A';
    }

    if (latestPercentEl) {
      latestPercentEl.innerText = aptitudeOverview.totalAttempts > 0 
        ? `Score: ${aptitudeOverview.latestScore} (${aptitudeOverview.latestCategory || 'Test'})` 
        : 'No tests attempted yet';
    }

    if (avgScoreEl) {
      avgScoreEl.innerText = aptitudeOverview.totalAttempts > 0 
        ? `${aptitudeOverview.averagePercentage}%` 
        : 'N/A';
    }

    if (highestScoreEl) {
      highestScoreEl.innerText = aptitudeOverview.totalAttempts > 0 
        ? `${aptitudeOverview.highestPercentage}%` 
        : 'N/A';
    }

    // 4. Render Chart.js Performance Chart
    renderPerformanceChart(chartData);

    // 5. Populate Recent Attempts Table
    renderRecentAttempts(recentAttempts);

  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
  }
}

function renderPerformanceChart(chartData) {
  const chartCanvas = document.getElementById('performanceChart');
  if (!chartCanvas) return;

  const emptyChartMessage = document.getElementById('chart-empty-message');

  if (!chartData || !chartData.labels || chartData.labels.length === 0) {
    if (emptyChartMessage) emptyChartMessage.style.display = 'block';
    chartCanvas.style.display = 'none';
    return;
  }

  if (emptyChartMessage) emptyChartMessage.style.display = 'none';
  chartCanvas.style.display = 'block';

  // Destroy previous chart instance if exists
  if (aptitudeChartInstance) {
    aptitudeChartInstance.destroy();
  }

  const ctx = chartCanvas.getContext('2d');
  aptitudeChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.labels,
      datasets: [
        {
          label: 'Aptitude Score Percentage (%)',
          data: chartData.percentages,
          borderColor: '#1d4ed8',
          backgroundColor: 'rgba(29, 78, 216, 0.08)',
          fill: true,
          tension: 0.35,
          borderWidth: 3,
          pointBackgroundColor: '#1d4ed8',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 20,
            callback: (val) => `${val}%`
          },
          grid: {
            color: '#e2e8f0'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#1e3a8a',
            font: {
              weight: '600',
              family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }
          }
        },
        tooltip: {
          backgroundColor: '#0f172a',
          padding: 12,
          titleFont: { size: 13, weight: '700' },
          bodyFont: { size: 12 },
          callbacks: {
            label: (ctx) => `Score: ${ctx.parsed.y}%`
          }
        }
      }
    }
  });
}

function renderRecentAttempts(attempts) {
  const tableBody = document.getElementById('recent-attempts-body');
  const emptyAttemptsMsg = document.getElementById('empty-attempts-msg');

  if (!tableBody) return;

  if (!attempts || attempts.length === 0) {
    if (emptyAttemptsMsg) emptyAttemptsMsg.style.display = 'block';
    tableBody.innerHTML = '';
    return;
  }

  if (emptyAttemptsMsg) emptyAttemptsMsg.style.display = 'none';

  tableBody.innerHTML = attempts.map(attempt => {
    const formattedDate = new Date(attempt.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    let badgeClass = 'badge-blue';
    if (attempt.percentage >= 70) badgeClass = 'badge-success';
    else if (attempt.percentage < 50) badgeClass = 'badge-warning';

    return `
      <tr>
        <td><strong>${formattedDate}</strong></td>
        <td>${attempt.category}</td>
        <td>${attempt.score} / ${attempt.totalQuestions}</td>
        <td><span class="badge ${badgeClass}">${attempt.percentage}%</span></td>
      </tr>
    `;
  }).join('');
}
