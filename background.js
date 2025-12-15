/**
 * PhishGuard - Background Service Worker
 *
 * Checks URLs against threat database and warns users
 * Uses live threat intelligence from OpenPhish, URLhaus, etc.
 */

// Threat database (will be updated from online sources)
let threatDatabase = {
  phishingDomains: new Set(),
  legitimateDomains: new Set([
    'google.com', 'youtube.com', 'facebook.com', 'amazon.com',
    'wikipedia.org', 'twitter.com', 'instagram.com', 'linkedin.com',
    'microsoft.com', 'apple.com', 'netflix.com', 'reddit.com',
    'paypal.com', 'ebay.com', 'craigslist.org', 'github.com'
  ]),
  lastUpdate: null
};

// Suspicious TLDs
const SUSPICIOUS_TLDS = ['.tk', '.ml', '.ga', '.cf', '.gq', '.pw', '.cc', '.top'];

// URL shorteners (can hide phishing)
const URL_SHORTENERS = ['bit.ly', 'tinyurl.com', 'ow.ly', 'goo.gl', 't.co', 'is.gd'];

/**
 * Initialize extension
 */
chrome.runtime.onInstalled.addListener(async () => {
  console.log('PhishGuard installed - loading threat database...');

  // Load cached threat database
  await loadThreatDatabase();

  // Update from online sources
  updateThreatDatabase();

  // Set up periodic updates (every 24 hours)
  chrome.alarms.create('updateThreats', { periodInMinutes: 1440 });
});

/**
 * Listen for alarm to update threats
 */
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'updateThreats') {
    updateThreatDatabase();
  }
});

/**
 * Load threat database from storage
 */
async function loadThreatDatabase() {
  const stored = await chrome.storage.local.get(['threatDatabase']);
  if (stored.threatDatabase) {
    threatDatabase.phishingDomains = new Set(stored.threatDatabase.phishingDomains);
    threatDatabase.lastUpdate = stored.threatDatabase.lastUpdate;
    console.log(`Loaded ${threatDatabase.phishingDomains.size} known threats`);
  }
}

/**
 * Update threat database from online sources
 */
async function updateThreatDatabase() {
  console.log('Updating threat database...');

  try {
    // Fetch from OpenPhish (free, no API key needed)
    // Note: OpenPhish now redirects to GitHub
    const openphishResponse = await fetch('https://raw.githubusercontent.com/openphish/public_feed/refs/heads/main/feed.txt');
    const openphishText = await openphishResponse.text();

    // Parse URLs and extract domains
    const urls = openphishText.trim().split('\n');
    let newThreats = 0;

    for (const url of urls) {
      if (url) {
        try {
          const domain = new URL(url).hostname.toLowerCase();
          if (!threatDatabase.phishingDomains.has(domain)) {
            threatDatabase.phishingDomains.add(domain);
            newThreats++;
          }
        } catch (e) {
          // Invalid URL, skip
        }
      }
    }

    // Save to storage
    threatDatabase.lastUpdate = Date.now();
    await chrome.storage.local.set({
      threatDatabase: {
        phishingDomains: Array.from(threatDatabase.phishingDomains),
        lastUpdate: threatDatabase.lastUpdate
      }
    });

    console.log(`Threat database updated: +${newThreats} new threats (total: ${threatDatabase.phishingDomains.size})`);

    // Update badge
    chrome.action.setBadgeText({ text: 'OK' });
    chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' });

  } catch (error) {
    console.error('Failed to update threat database:', error);
    chrome.action.setBadgeText({ text: '!' });
    chrome.action.setBadgeBackgroundColor({ color: '#FF9800' });
  }
}

/**
 * Check if domain is typosquatting a legitimate one
 */
function checkTyposquatting(domain) {
  const suspiciousDomain = domain.toLowerCase();

  // Check against each legitimate domain
  for (const legitDomain of threatDatabase.legitimateDomains) {
    // Check for character substitution (0 for o, 1 for l, etc.)
    const normalized = suspiciousDomain
      .replace(/0/g, 'o')
      .replace(/1/g, 'l')
      .replace(/3/g, 'e')
      .replace(/5/g, 's')
      .replace(/8/g, 'b');

    if (normalized === legitDomain) {
      return {
        isTyposquatting: true,
        targetDomain: legitDomain,
        reason: 'Character substitution detected'
      };
    }

    // Check for similar domains (edit distance)
    const distance = levenshteinDistance(
      suspiciousDomain.replace(/\..+$/, ''),
      legitDomain.replace(/\..+$/, '')
    );

    if (distance === 1 || distance === 2) {
      return {
        isTyposquatting: true,
        targetDomain: legitDomain,
        reason: 'Very similar to legitimate domain'
      };
    }
  }

  return { isTyposquatting: false };
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Analyze URL for threats
 */
function analyzeURL(url) {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.toLowerCase();
    const indicators = [];
    let riskScore = 0;
    let riskLevel = 'safe';

    // Check if known phishing domain
    if (threatDatabase.phishingDomains.has(domain)) {
      indicators.push('⚠️ Known phishing domain in threat database');
      riskScore += 100;
      riskLevel = 'critical';

      return {
        isSafe: false,
        riskLevel,
        riskScore: Math.min(riskScore, 100),
        domain,
        indicators,
        action: 'BLOCK - This is a known phishing site!'
      };
    }

    // Check if legitimate domain
    const baseDomain = domain.split('.').slice(-2).join('.');
    if (threatDatabase.legitimateDomains.has(baseDomain)) {
      return {
        isSafe: true,
        riskLevel: 'safe',
        riskScore: 0,
        domain,
        indicators: ['✅ Known legitimate website'],
        action: 'Safe to proceed'
      };
    }

    // Check for typosquatting
    const typosquatCheck = checkTyposquatting(domain);
    if (typosquatCheck.isTyposquatting) {
      indicators.push(`⚠️ Possible typosquatting of ${typosquatCheck.targetDomain}`);
      indicators.push(`Reason: ${typosquatCheck.reason}`);
      riskScore += 70;
      riskLevel = 'high';
    }

    // Check for IP address instead of domain
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(domain)) {
      indicators.push('⚠️ Uses IP address instead of domain name');
      riskScore += 35;
      if (riskLevel === 'safe') riskLevel = 'medium';
    }

    // Check for suspicious TLD
    if (SUSPICIOUS_TLDS.some(tld => domain.endsWith(tld))) {
      indicators.push('⚠️ Suspicious free TLD (.tk, .ml, etc.)');
      riskScore += 30;
      if (riskLevel === 'safe') riskLevel = 'medium';
    }

    // Check for URL shortener
    if (URL_SHORTENERS.some(shortener => domain.includes(shortener))) {
      indicators.push('⚠️ URL shortener - destination is hidden');
      riskScore += 25;
      if (riskLevel === 'safe') riskLevel = 'low';
    }

    // Check for excessive subdomains
    const subdomainCount = domain.split('.').length;
    if (subdomainCount > 4) {
      indicators.push(`⚠️ Excessive subdomains (${subdomainCount} levels)`);
      riskScore += 20;
      if (riskLevel === 'safe') riskLevel = 'low';
    }

    // Check for @ symbol in URL (domain hiding)
    if (url.includes('@')) {
      indicators.push('⚠️ URL contains @ symbol - possible domain hiding');
      riskScore += 50;
      riskLevel = 'high';
    }

    // No HTTPS
    if (urlObj.protocol === 'http:') {
      indicators.push('⚠️ Not using HTTPS - connection is not secure');
      riskScore += 15;
      if (riskLevel === 'safe') riskLevel = 'low';
    }

    const isSafe = riskLevel === 'safe' || riskLevel === 'low';

    return {
      isSafe,
      riskLevel,
      riskScore: Math.min(riskScore, 100),
      domain,
      indicators: indicators.length > 0 ? indicators : ['No threats detected'],
      action: riskLevel === 'critical' ? 'DO NOT VISIT' :
              riskLevel === 'high' ? 'Avoid - likely phishing' :
              riskLevel === 'medium' ? 'Be cautious' :
              riskLevel === 'low' ? 'Minor concerns' :
              'Safe to proceed'
    };

  } catch (error) {
    return {
      isSafe: false,
      riskLevel: 'medium',
      riskScore: 30,
      domain: 'unknown',
      indicators: ['⚠️ Invalid URL format'],
      action: 'Cannot analyze - be careful'
    };
  }
}

/**
 * Listen for tab updates to check URLs
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const analysis = analyzeURL(changeInfo.url);

    // Store analysis for this tab
    chrome.storage.local.set({ [`tab_${tabId}`]: analysis });

    // Update icon based on risk level
    const iconColor = {
      'safe': 'green',
      'low': 'blue',
      'medium': 'yellow',
      'high': 'orange',
      'critical': 'red'
    }[analysis.riskLevel] || 'gray';

    // If dangerous, inject warning
    if (analysis.riskLevel === 'critical' || analysis.riskLevel === 'high') {
      chrome.tabs.sendMessage(tabId, {
        action: 'showWarning',
        analysis: analysis
      });
    }
  }
});

/**
 * Listen for messages from content script or popup
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeURL') {
    const analysis = analyzeURL(request.url);
    sendResponse(analysis);
  } else if (request.action === 'getStats') {
    sendResponse({
      totalThreats: threatDatabase.phishingDomains.size,
      lastUpdate: threatDatabase.lastUpdate,
      legitimateSites: threatDatabase.legitimateDomains.size
    });
  } else if (request.action === 'forceUpdate') {
    updateThreatDatabase();
    sendResponse({ success: true });
  }

  return true; // Keep message channel open for async response
});

console.log('PhishGuard background service worker ready!');
