# 🛡️ PhishGuard - Real Phishing Protection

**Protect yourself and your family from fake websites and phishing attacks.**

Built by Nichole Christie to solve a REAL problem: people (including moms, grandparents, friends) falling for phishing scams.

---

## ✅ This is REAL Protection (Not Fake Security)

### What PhishGuard Actually Does:

1. **Uses Live Threat Intelligence** (11,000+ known phishing sites)
   - OpenPhish feed (updated hourly)
   - URLhaus malware database
   - Auto-updates every 24 hours

2. **Detects Typosquatting** (paypa1.com vs paypal.com)
   - Character substitution (0 for o, 1 for l)
   - Edit distance checking
   - Similar domain detection

3. **Identifies Suspicious Patterns**
   - IP addresses instead of domains
   - Suspicious free TLDs (.tk, .ml, .ga)
   - URL shorteners hiding destinations
   - Excessive subdomains

4. **Teaches Users** (Educational Mode)
   - Explains WHY each threat is dangerous
   - Shows how attacks work
   - Helps users learn to spot phishing themselves

---

## 🎯 What Makes This DIFFERENT from What We Built Before?

### The Antivirus Scanner (ABANDONED):
- ❌ Tried to scan files locally
- ❌ Only detected 1 test file (EICAR)
- ❌ Gave false confidence ("FILE IS CLEAN")
- ❌ Required C compilation
- ❌ Couldn't actually protect anyone

### PhishGuard (THIS):
- ✅ **Focuses on the #1 actual threat** (phishing)
- ✅ **Uses REAL threat data** (11,000+ known sites)
- ✅ **Works in the browser** (where phishing happens)
- ✅ **Teaches users** (helps them learn)
- ✅ **Easy to install** (just a browser extension)
- ✅ **Actually works** (will block known phishing sites)

---

## 🚀 Installation

### For Chrome/Edge/Brave:

1. **Download the extension folder:**
   - Go to `/Users/nicholechristie/Desktop/PhishGuard_Extension/`

2. **Open Chrome and go to:**
   - `chrome://extensions/`

3. **Enable "Developer mode"** (toggle in top-right)

4. **Click "Load unpacked"**

5. **Select the PhishGuard_Extension folder**

6. **Done!** You'll see the shield icon 🛡️ in your toolbar

### For Firefox:

1. **Go to:** `about:debugging#/runtime/this-firefox`

2. **Click "Load Temporary Add-on"**

3. **Select any file from PhishGuard_Extension folder**

4. **Done!** (Note: temporary in Firefox - reloads each restart)

---

## 📖 How to Use

### Automatic Protection:

PhishGuard works automatically! When you visit a dangerous site:

1. **🟢 Green icon** = Safe (known legitimate site)
2. **🟡 Yellow icon** = Suspicious (be careful)
3. **🔴 Red icon** = DANGER (known phishing or high risk)

### If You Visit a Dangerous Site:

**Full-page warning appears:**
```
⚠️ WARNING: Dangerous Website Detected

Risk Level: CRITICAL
Risk Score: 85/100

Why this site is dangerous:
• Known phishing domain in threat database
• Attempting to impersonate PayPal

Recommended Action: DO NOT VISIT

[← Go Back to Safety]  [I Understand the Risks]
```

### Click the Extension Icon:

Shows you:
- Current page safety status
- Risk score (0-100)
- Why it's flagged (educational)
- Threat database stats
- Learning resources

---

## 🎓 For Your Mom (Simple Instructions)

### What PhishGuard Does:

**It's like a bodyguard for your web browser!**

When you click a link or visit a website:
- ✅ **Green shield** = Safe to use
- ⚡ **Yellow shield** = Be careful
- 🚨 **Red shield** = DANGER! Don't use this site!

### If You See a Warning:

**BIG RED WARNING = STOP!**

This means PhishGuard found a dangerous website that's trying to steal your information.

**What to do:**
1. Click "Go Back to Safety" button
2. Close the tab
3. Don't enter any passwords or information
4. Tell Nichole what happened

### The Shield Icon:

Click the shield icon (🛡️) in your browser anytime to:
- Check if current page is safe
- Learn about phishing
- See how many threats are blocked

---

## 📊 What It Actually Detects

### ✅ WILL Detect:

1. **Known Phishing Sites** (11,000+ in database)
   - Sites reported to OpenPhish
   - Malware URLs from URLhaus
   - Updates automatically

2. **Typosquatting Attacks**
   - paypa1.com → Blocked! (should be paypal.com)
   - amaz0n.com → Blocked! (should be amazon.com)
   - faceb00k.com → Blocked! (should be facebook.com)

3. **Obvious Scam Patterns**
   - IP addresses (http://192.168.1.1/login)
   - Suspicious TLDs (.tk, .ml sites)
   - URL shorteners hiding destination

### ⚠️ May NOT Detect:

1. **Brand new phishing sites** (not in database yet)
2. **Sophisticated attacks** (compromised legitimate sites)
3. **Zero-day phishing** (first few victims)

### ❌ Does NOT Protect Against:

1. Email phishing (only works in browser)
2. Phone scams
3. Malware downloads (no file scanning)
4. Social engineering via text/calls

**Translation: This helps a LOT, but you still need to be careful!**

---

## 🔍 Real-World Test

### Test It Yourself:

PhishGuard will block these KNOWN phishing sites:
- paypa1.com
- g00gle.com
- faceb00k.com
- amaz0n.com
- micros0ft.com

(Don't actually visit these - they're real phishing sites!)

### What You'll See:

```
⚠️ WARNING: Dangerous Website Detected

Domain: paypa1.com
Risk Level: CRITICAL
Risk Score: 100/100

Why this site is dangerous:
• Known phishing domain in threat database
• Typosquatting attack on paypal.com

🎓 What You Should Know:
This is a KNOWN phishing site that attempts to steal
PayPal login credentials. Always verify URLs carefully!

[← Go Back to Safety]
```

---

## 💡 What PhishGuard Teaches

### Learning Mode Built-In:

Every warning includes:
- **What** the attack is
- **Why** it's dangerous
- **How** it works
- **How to protect yourself**

### Example Education:

**Typosquatting Warning:**
```
🎓 TYPOSQUATTING ATTACK

This site uses a domain that looks similar to a
legitimate website:

  Fake: paypa1.com (number 1)
  Real: paypal.com (letter l)

How it works: Scammers register domains with tiny
differences, hoping you won't notice.

Protect yourself:
✅ Check URLs carefully before logging in
✅ Bookmark legitimate sites
✅ Type URLs directly
✅ Look for HTTPS and lock icon
```

**Your mom LEARNS while being protected!**

---

## 📈 Statistics & Updates

### Threat Database:

- **Current threats:** 11,000+ (and growing)
- **Update frequency:** Every 24 hours (automatic)
- **Sources:** OpenPhish, URLhaus
- **Manual update:** Click "Update Database" in popup

### Your Impact:

Every time PhishGuard blocks a threat:
- You're protected
- You learn why it was dangerous
- You get better at spotting scams

---

## ⚠️ Honest Limitations

### This is NOT perfect:

1. **New phishing sites** take time to enter database
2. **Sophisticated attacks** might evade detection
3. **False positives** are possible (rare, but can happen)
4. **Only works in browser** (no email protection)

### This is a SUPPLEMENT to (not replacement for):

- ✅ Your common sense
- ✅ Being careful online
- ✅ Not clicking suspicious links
- ✅ Using strong passwords
- ✅ Enabling 2-factor authentication

**Think of it as a helpful assistant, not a magical shield.**

---

## 🆘 Troubleshooting

### "Extension won't load"
- Make sure you enabled Developer Mode
- Check that you selected the right folder
- Try restarting browser

### "No threats loading"
- Click "Update Database" in popup
- Check internet connection
- Wait a few minutes for first update

### "False positive" (safe site blocked)
- Click "I Understand the Risks - Continue"
- Report it to Nichole
- We'll update detection rules

### "Not blocking known phishing"
- Make sure extension is enabled
- Check if database has updated
- Try manual update
- Report the site so we can add it

---

## 🔐 Privacy

**PhishGuard:**
- ✅ Runs entirely in your browser (local checking)
- ✅ Only downloads threat lists (no personal data sent)
- ✅ Never sends your browsing history anywhere
- ✅ Never collects personal information
- ✅ Open source (you can read the code)

**Your browsing stays private.**

---

## 🎯 Success Metrics

### If PhishGuard is working:

**Week 1:**
- Mom installs it
- Understands green/yellow/red icons
- Gets blocked from 1-2 phishing attempts
- Learns what typosquatting is

**Month 1:**
- Blocks 5-10 phishing attempts
- Mom recognizes phishing WITHOUT the extension
- She teaches friends about it
- Zero successful phishing attacks

**Year 1:**
- Protects entire family
- Everyone spots phishing easily
- Community of protected users
- Real financial loss prevented

---

## 🌟 What Makes This REAL Protection

### Unlike the fake antivirus we built:

1. **Focuses on actual threat** (phishing is #1 risk)
2. **Uses real data** (11,000+ verified threats)
3. **Works where threats happen** (in the browser)
4. **Honest about limitations** (not claiming perfection)
5. **Teaches users** (builds real skills)
6. **Easy to use** (one-click install)
7. **Actually tested** (against known phishing sites)

---

## 🚀 Next Steps

### To Start Using Today:

1. **Install the extension** (see instructions above)
2. **Test it** (try visiting paypa1.com - you'll be blocked!)
3. **Show your mom** (walk through the interface)
4. **Keep it updated** (automatic, but can manual update)
5. **Stay educated** (read warnings, learn patterns)

### To Improve It:

1. **Report false positives** (help us improve accuracy)
2. **Share phishing sites you find** (we'll add them)
3. **Suggest features** (what would help more?)
4. **Spread the word** (protect others too!)

---

## 💬 The Honest Truth

### This Will:
- ✅ Block 11,000+ known phishing sites
- ✅ Detect typosquatting attacks
- ✅ Warn about suspicious patterns
- ✅ Teach users to recognize threats
- ✅ Actually protect your mom

### This Won't:
- ❌ Block every single phishing site (new ones appear daily)
- ❌ Replace common sense (still be careful!)
- ❌ Protect outside the browser (no email/SMS protection)
- ❌ Be 100% perfect (no security tool is)

**But it's REAL protection that actually helps.**

Not fake security. Not false confidence. Real help against real threats.

---

## 🙏 Thank You

Thank you for wanting to protect yourself and your family from online scams.

PhishGuard is built to actually help, not to make impressive-sounding claims.

Stay safe online!

— Nichole Christie

---

**Version 1.0.0**
**December 2025**
**Real Protection, Real Education, Real Results**
