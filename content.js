/**
 * PhishGuard - Content Script
 *
 * Injects warnings into dangerous pages
 * Shows educational information about threats
 */

// Check if warning is already showing
let warningShown = false;

/**
 * Show full-page warning for dangerous sites
 */
function showWarning(analysis) {
  if (warningShown) return;
  warningShown = true;

  // Create warning overlay
  const overlay = document.createElement('div');
  overlay.id = 'phishguard-warning';
  overlay.innerHTML = `
    <div class="phishguard-warning-container">
      <div class="phishguard-warning-header">
        <div class="phishguard-warning-icon">⚠️</div>
        <h1>WARNING: Dangerous Website Detected</h1>
      </div>

      <div class="phishguard-warning-content">
        <div class="phishguard-risk-badge phishguard-risk-${analysis.riskLevel}">
          Risk Level: ${analysis.riskLevel.toUpperCase()}
        </div>

        <div class="phishguard-domain">
          <strong>Domain:</strong> ${analysis.domain}
        </div>

        <div class="phishguard-risk-score">
          <strong>Risk Score:</strong> ${analysis.riskScore}/100
        </div>

        <div class="phishguard-indicators">
          <strong>Why this site is dangerous:</strong>
          <ul>
            ${analysis.indicators.map(ind => `<li>${ind}</li>`).join('')}
          </ul>
        </div>

        <div class="phishguard-action">
          <strong>Recommended Action:</strong> ${analysis.action}
        </div>

        <div class="phishguard-education">
          <h3>🎓 What You Should Know:</h3>
          ${getEducationalContent(analysis)}
        </div>
      </div>

      <div class="phishguard-warning-buttons">
        <button id="phishguard-go-back" class="phishguard-btn phishguard-btn-primary">
          ← Go Back to Safety
        </button>
        <button id="phishguard-ignore" class="phishguard-btn phishguard-btn-secondary">
          I Understand the Risks - Continue Anyway
        </button>
      </div>

      <div class="phishguard-footer">
        Protected by PhishGuard |
        <a href="#" id="phishguard-learn-more">Learn more about this threat</a>
      </div>
    </div>
  `;

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    #phishguard-warning {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      color: #fff;
    }

    .phishguard-warning-container {
      max-width: 700px;
      background: #1a1a1a;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 10px 50px rgba(255, 0, 0, 0.3);
      border: 2px solid #ff4444;
    }

    .phishguard-warning-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .phishguard-warning-icon {
      font-size: 72px;
      margin-bottom: 20px;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .phishguard-warning-header h1 {
      color: #ff4444;
      font-size: 28px;
      margin: 0;
      font-weight: 700;
    }

    .phishguard-warning-content {
      margin-bottom: 30px;
    }

    .phishguard-risk-badge {
      display: inline-block;
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: 700;
      font-size: 14px;
      margin-bottom: 20px;
      text-transform: uppercase;
    }

    .phishguard-risk-critical {
      background: #d32f2f;
      color: #fff;
    }

    .phishguard-risk-high {
      background: #f57c00;
      color: #fff;
    }

    .phishguard-risk-medium {
      background: #fbc02d;
      color: #000;
    }

    .phishguard-domain {
      background: #2a2a2a;
      padding: 15px;
      border-radius: 6px;
      margin-bottom: 15px;
      font-family: 'Courier New', monospace;
      word-break: break-all;
    }

    .phishguard-risk-score {
      margin-bottom: 20px;
      font-size: 18px;
    }

    .phishguard-indicators {
      background: #2a2a2a;
      padding: 20px;
      border-radius: 6px;
      margin-bottom: 20px;
    }

    .phishguard-indicators ul {
      margin: 10px 0 0 0;
      padding-left: 20px;
    }

    .phishguard-indicators li {
      margin: 8px 0;
      line-height: 1.6;
    }

    .phishguard-action {
      background: #1e1e1e;
      border-left: 4px solid #ff4444;
      padding: 15px;
      margin-bottom: 20px;
    }

    .phishguard-education {
      background: #1a3a4a;
      border-left: 4px solid #4CAF50;
      padding: 20px;
      border-radius: 6px;
    }

    .phishguard-education h3 {
      margin-top: 0;
      color: #4CAF50;
    }

    .phishguard-education p {
      line-height: 1.6;
      margin: 10px 0;
    }

    .phishguard-warning-buttons {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
    }

    .phishguard-btn {
      flex: 1;
      padding: 15px 30px;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .phishguard-btn-primary {
      background: #4CAF50;
      color: #fff;
    }

    .phishguard-btn-primary:hover {
      background: #45a049;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
    }

    .phishguard-btn-secondary {
      background: #444;
      color: #fff;
    }

    .phishguard-btn-secondary:hover {
      background: #555;
    }

    .phishguard-footer {
      text-align: center;
      font-size: 12px;
      color: #888;
    }

    .phishguard-footer a {
      color: #4CAF50;
      text-decoration: none;
    }

    .phishguard-footer a:hover {
      text-decoration: underline;
    }
  `;

  // Insert into page
  document.documentElement.appendChild(style);
  document.documentElement.appendChild(overlay);

  // Add event listeners
  document.getElementById('phishguard-go-back').addEventListener('click', () => {
    window.history.back();
  });

  document.getElementById('phishguard-ignore').addEventListener('click', () => {
    overlay.remove();
    style.remove();
    warningShown = false;
  });

  document.getElementById('phishguard-learn-more').addEventListener('click', (e) => {
    e.preventDefault();
    showDetailedInfo(analysis);
  });
}

/**
 * Get educational content based on threat type
 */
function getEducationalContent(analysis) {
  const indicators = analysis.indicators.join(' ').toLowerCase();

  if (indicators.includes('known phishing')) {
    return `
      <p><strong>This is a KNOWN phishing site</strong> in our threat database of over 11,000 confirmed scams.</p>
      <p>Phishing sites are designed to steal your passwords, credit card numbers, and personal information.</p>
      <p><strong>What to do:</strong></p>
      <ul>
        <li>DO NOT enter any personal information</li>
        <li>DO NOT download anything from this site</li>
        <li>Go back and visit the legitimate website directly</li>
        <li>Report this to the company being impersonated</li>
      </ul>
    `;
  }

  if (indicators.includes('typosquatting')) {
    return `
      <p><strong>Typosquatting Attack Detected!</strong></p>
      <p>This site uses a domain name that's very similar to a legitimate website, hoping you won't notice the difference.</p>
      <p>For example: "paypa1.com" (with number 1) instead of "paypal.com" (with letter l)</p>
      <p><strong>How to protect yourself:</strong></p>
      <ul>
        <li>Always check the URL carefully before logging in</li>
        <li>Bookmark legitimate sites and use the bookmarks</li>
        <li>Type URLs directly instead of clicking links</li>
        <li>Look for HTTPS and the lock icon</li>
      </ul>
    `;
  }

  if (indicators.includes('url shortener')) {
    return `
      <p><strong>URL Shortener Detected</strong></p>
      <p>This link uses a URL shortener (bit.ly, tinyurl, etc.) which hides the real destination.</p>
      <p>Scammers often use URL shorteners to hide phishing sites.</p>
      <p><strong>Best practices:</strong></p>
      <ul>
        <li>Avoid clicking shortened URLs from unknown sources</li>
        <li>Use a URL expander to see the real destination first</li>
        <li>Only trust shortened links from people you know</li>
      </ul>
    `;
  }

  // Generic advice
  return `
    <p><strong>This website shows multiple suspicious indicators.</strong></p>
    <p>While it may not be confirmed as malicious, several red flags suggest caution.</p>
    <p><strong>Stay safe online:</strong></p>
    <ul>
      <li>Only enter sensitive information on sites you trust</li>
      <li>Verify URLs before logging in</li>
      <li>Look for HTTPS and security certificates</li>
      <li>When in doubt, navigate to the site directly (don't click links)</li>
    </ul>
  `;
}

/**
 * Show detailed information modal
 */
function showDetailedInfo(analysis) {
  alert(`Detailed Threat Analysis:

Domain: ${analysis.domain}
Risk Level: ${analysis.riskLevel}
Risk Score: ${analysis.riskScore}/100

Threat Indicators:
${analysis.indicators.join('\n')}

Recommended Action:
${analysis.action}

PhishGuard is protecting you using live threat intelligence from multiple sources including OpenPhish and URLhaus.

Our database currently tracks ${analysis.totalThreats || '11,000+'} known phishing and malware sites.`);
}

/**
 * Listen for messages from background script
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'showWarning') {
    showWarning(request.analysis);
  }
  sendResponse({ success: true });
});

// Analyze current page on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkCurrentPage);
} else {
  checkCurrentPage();
}

function checkCurrentPage() {
  chrome.runtime.sendMessage(
    { action: 'analyzeURL', url: window.location.href },
    (analysis) => {
      if (analysis && (analysis.riskLevel === 'critical' || analysis.riskLevel === 'high')) {
        showWarning(analysis);
      }
    }
  );
}
