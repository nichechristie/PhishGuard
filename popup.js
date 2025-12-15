/**
 * PhishGuard - Popup Script
 * Powers the extension popup interface
 */

// Load current page analysis
document.addEventListener('DOMContentLoaded', async () => {
  await loadCurrentPageStatus();
  await loadStats();

  // Set up button handlers
  document.getElementById('btn-check').addEventListener('click', checkCustomURL);
  document.getElementById('btn-update').addEventListener('click', updateDatabase);
  document.getElementById('btn-learn').addEventListener('click', showLearningMode);
});

/**
 * Load status of current page
 */
async function loadCurrentPageStatus() {
  try {
    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.url) {
      showError('Cannot analyze this page');
      return;
    }

    // Analyze URL
    chrome.runtime.sendMessage(
      { action: 'analyzeURL', url: tab.url },
      (analysis) => {
        if (analysis) {
          displayAnalysis(analysis);
        } else {
          showError('Analysis failed');
        }
      }
    );
  } catch (error) {
    console.error('Error loading page status:', error);
    showError('Error analyzing page');
  }
}

/**
 * Display analysis results
 */
function displayAnalysis(analysis) {
  // Hide loading, show content
  document.getElementById('loading').classList.add('hidden');
  document.getElementById('content').classList.remove('hidden');

  // Update risk level
  const riskLevelEl = document.getElementById('risk-level');
  const riskIconEl = document.getElementById('risk-icon');
  const riskScoreEl = document.getElementById('risk-score');

  riskLevelEl.textContent = analysis.riskLevel.toUpperCase();

  // Set icon based on risk level
  const icons = {
    'safe': '✅',
    'low': '👀',
    'medium': '⚡',
    'high': '⚠️',
    'critical': '🚨'
  };
  riskIconEl.textContent = icons[analysis.riskLevel] || '❓';
  riskIconEl.className = `risk-icon risk-${analysis.riskLevel}`;

  // Update risk score
  riskScoreEl.textContent = `${analysis.riskScore}/100`;

  // Update current URL
  document.getElementById('current-url').textContent = analysis.domain || 'Unknown';

  // Update indicators
  const indicatorsList = document.getElementById('indicators-list');
  indicatorsList.innerHTML = '';

  analysis.indicators.forEach(indicator => {
    const li = document.createElement('li');
    li.textContent = indicator;
    indicatorsList.appendChild(li);
  });
}

/**
 * Load statistics
 */
async function loadStats() {
  chrome.runtime.sendMessage({ action: 'getStats' }, (stats) => {
    if (stats) {
      // Total threats
      document.getElementById('total-threats').textContent =
        stats.totalThreats.toLocaleString();

      // Last update
      if (stats.lastUpdate) {
        const hoursAgo = Math.floor((Date.now() - stats.lastUpdate) / (1000 * 60 * 60));
        document.getElementById('last-update').textContent = hoursAgo;
      } else {
        document.getElementById('last-update').textContent = 'Never';
      }
    }
  });
}

/**
 * Check custom URL
 */
function checkCustomURL() {
  let url = prompt('Enter URL to check:');

  if (!url) return;

  // Add https:// if no protocol specified
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  chrome.runtime.sendMessage(
    { action: 'analyzeURL', url: url },
    (analysis) => {
      if (analysis) {
        const safetyText = analysis.isSafe ? 'SAFE' : 'DANGEROUS';
        const emoji = analysis.isSafe ? '✅' : '⚠️';

        let message = `${emoji} ${safetyText}\n\n`;
        message += `Domain: ${analysis.domain}\n`;
        message += `Risk Level: ${analysis.riskLevel.toUpperCase()}\n`;
        message += `Risk Score: ${analysis.riskScore}/100\n\n`;
        message += `Indicators:\n${analysis.indicators.join('\n')}\n\n`;
        message += `Action: ${analysis.action}`;

        alert(message);
      }
    }
  );
}

/**
 * Update threat database
 */
function updateDatabase() {
  // Show updating message
  const btn = document.getElementById('btn-update');
  const originalText = btn.textContent;
  btn.textContent = '⏳ Updating...';
  btn.disabled = true;

  chrome.runtime.sendMessage({ action: 'forceUpdate' }, (response) => {
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;

      if (response && response.success) {
        alert('✅ Threat database updated!\n\nPhishGuard now has the latest threat intelligence.');
        loadStats(); // Refresh stats
      } else {
        alert('❌ Update failed. Please try again later.');
      }
    }, 2000);
  });
}

/**
 * Show learning mode
 */
function showLearningMode() {
  const learnMessage = `🎓 HOW TO SPOT PHISHING

Common Warning Signs:

1. TYPOSQUATTING
   • paypa1.com (1 instead of l)
   • amaz0n.com (0 instead of o)
   • Always check the URL carefully!

2. URGENT LANGUAGE
   • "Account will be closed!"
   • "Act now or lose access!"
   • Legitimate companies don't threaten

3. SUSPICIOUS REQUESTS
   • Asking for password via email
   • Requesting personal information
   • Banks NEVER do this

4. URL RED FLAGS
   • No HTTPS (no lock icon)
   • IP address instead of domain
   • Free domains (.tk, .ml)
   • Too many subdomains

5. POOR QUALITY
   • Spelling errors
   • Bad grammar
   • Low-quality images

REMEMBER:
✅ Hover over links before clicking
✅ Type URLs directly when possible
✅ Check for HTTPS and lock icon
✅ When in doubt, go back!

PhishGuard helps protect you by checking against ${document.getElementById('total-threats').textContent} known phishing sites and analyzing URLs for suspicious patterns.`;

  alert(learnMessage);
}

/**
 * Show error message
 */
function showError(message) {
  document.getElementById('loading').textContent = `Error: ${message}`;
}
