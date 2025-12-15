# PhishGuard Testing Guide

## Installation Steps

### Chrome/Edge/Brave:

1. **Open Extensions Page:**
   - Chrome: Go to `chrome://extensions/`
   - Edge: Go to `edge://extensions/`
   - Brave: Go to `brave://extensions/`

2. **Enable Developer Mode:**
   - Look for "Developer mode" toggle in the top-right corner
   - Turn it ON

3. **Load the Extension:**
   - Click "Load unpacked" button
   - Navigate to: `/Users/nicholechristie/Desktop/PhishGuard_Extension/`
   - Select the folder
   - Click "Select" or "Open"

4. **Verify Installation:**
   - You should see "PhishGuard - Real Phishing Protection" in your extensions list
   - A shield icon 🛡️ should appear in your toolbar

---

## Testing Checklist

### ✅ Test 1: Extension Loads
- [ ] Shield icon visible in toolbar
- [ ] Extension shows "OK" badge or no errors
- [ ] Click shield icon - popup opens

### ✅ Test 2: Safe Site Detection
**Visit:** https://google.com

**Expected Results:**
- Green shield icon OR no warning
- Popup shows: "Risk Level: SAFE"
- Indicators say: "✅ Known legitimate website"

### ✅ Test 3: Threat Database Update
**In the popup:**
- [ ] Click "🔄 Update Threat Database"
- [ ] Wait 3-5 seconds
- [ ] Should see success message
- [ ] "Known Threats" number should be 11,000+

### ✅ Test 4: Manual URL Check
**In the popup:**
- [ ] Click "🔍 Check Another URL"
- [ ] Enter: `paypal.com`
- [ ] Should show: ✅ SAFE

**Then test dangerous:**
- [ ] Click "🔍 Check Another URL"
- [ ] Enter: `paypa1.com` (note the "1" instead of "l")
- [ ] Should show: ⚠️ DANGEROUS
- [ ] Should mention typosquatting

### ✅ Test 5: Learning Mode
**In the popup:**
- [ ] Click "🎓 Learn About Phishing"
- [ ] Should show educational content
- [ ] Explains typosquatting, urgent language, suspicious requests

### ✅ Test 6: Suspicious Pattern Detection
**In the popup, check these URLs:**

**Test URL Shortener:**
- Enter: `bit.ly/test123`
- Should warn: "URL shortener - destination is hidden"

**Test IP Address:**
- Enter: `http://192.168.1.1/login`
- Should warn: "Uses IP address instead of domain name"

**Test Suspicious TLD:**
- Enter: `freesite.tk`
- Should warn: "Suspicious free TLD"

---

## Expected Behavior Summary

### When Extension is Working:

**On Safe Sites:**
- No warnings
- Green shield icon
- Popup shows risk level: SAFE

**On Suspicious Sites:**
- Yellow or orange shield icon
- Popup shows medium risk
- Lists suspicious indicators
- NO full-page block (just caution)

**On Dangerous Sites (Critical/High Risk):**
- Red shield icon
- Full-page warning overlay appears
- Explains WHY it's dangerous
- Two buttons: "Go Back to Safety" or "Continue Anyway"

### What the Database Contains:

After first update, PhishGuard knows about:
- 11,000+ verified phishing domains (from OpenPhish)
- 16+ popular legitimate domains
- Character substitution patterns (0→o, 1→l, 3→e, 5→s, 8→b)
- Suspicious TLDs (.tk, .ml, .ga, .cf, .gq)
- Common URL shorteners

---

## Troubleshooting

### "Extension won't load"
- Make sure Developer Mode is enabled
- Check that you selected the PhishGuard_Extension folder (not a file inside it)
- Try restarting browser

### "No threats loading" or shows "0 threats"
- Click "Update Database" in popup
- Check internet connection
- Wait 30 seconds for first update
- Check browser console for errors: `chrome://extensions/` → PhishGuard → "Inspect views: service worker"

### "Not blocking known phishing"
- Make sure extension is enabled
- Check that database has updated (should show 11,000+)
- Verify you're testing with actual phishing domains (be careful!)

### "Blocks safe sites" (False positive)
- This shouldn't happen with major sites
- If it does, click "Continue Anyway"
- Report it so we can fix detection rules

---

## Real-World Testing (BE CAREFUL!)

### Testing with ACTUAL Phishing Sites:

**⚠️ EXTREME CAUTION:**
- DO NOT enter any personal information
- DO NOT download anything
- DO NOT click links on these pages
- Close the tab immediately after testing

**Why test with real sites?**
- Only way to verify it actually works
- Confirms threat database is functioning
- Validates warning system appears correctly

**How to test safely:**
1. Update threat database first
2. Open a new tab
3. Type (don't click) a known phishing URL from the database
4. PhishGuard should block it BEFORE page loads
5. If warning appears → SUCCESS!
6. Click "Go Back to Safety"
7. Close tab

---

## Success Criteria

PhishGuard is working correctly if:

✅ Loads without errors
✅ Updates threat database (11,000+ threats)
✅ Shows safe sites as safe (google.com, paypal.com)
✅ Detects typosquatting (paypa1.com)
✅ Warns about suspicious patterns (IP addresses, weird TLDs)
✅ Provides educational content explaining threats
✅ Full-page warning blocks critical threats

---

## Next Step: Testing with Mom

Once YOU verify it works:

1. Install it on mom's computer (same steps)
2. Show her the shield icon
3. Explain: Green = safe, Red = danger
4. Walk through the "Learn About Phishing" mode together
5. Test with one safe site (google.com) and show green shield
6. Explain: "If you see a big red warning, click 'Go Back' and call me"

**Keep it simple for mom:**
- "This protects you from fake websites"
- "If you see RED, click 'Go Back' button"
- "Green shield = safe, Red shield = danger"

---

**Ready to test? Let's start with Installation Steps above!**
