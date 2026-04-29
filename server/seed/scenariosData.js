const scenarios = [
  // ─── PHISHING: BANK ──────────────────────────────────────────────────────────
  {
    title: 'Urgent: Your Account Has Been Suspended',
    description:
      'You receive an email that reads: "Dear Customer, We have detected suspicious activity on your BankSecure account. Your account access has been temporarily suspended. To restore access, click the link below and verify your identity within 24 hours or your account will be permanently closed. Click here: http://banksecure-support.ru/verify"',
    type: 'phishing_bank',
    source: 'inbox',
    emailMeta: {
      sender: 'noreply@banksecure-support.ru',
      subject: 'URGENT: Account Suspended – Action Required',
      preview: 'We detected suspicious activity on your account. Verify now or lose access.',
      riskBadge: 'Phishing',
    },
    realContext:
      'Legitimate banks never send verification links via email. The domain "banksecure-support.ru" is not your bank\'s real domain.',
    difficulty: 'easy',
    targetRoles: ['student', 'employee', 'freelancer'],
    choices: [
      {
        text: 'Delete the email and call your bank directly using the number on your card.',
        qualityLevel: 'best',
        feedback:
          'Perfect. Calling your bank directly is the gold standard. You avoided a credential-harvesting page and alerted your bank to the scam.',
        effects: { xp: 50, securityScore: 10, awarenessScore: 8, balance: 0 },
        timeline: [
          { day: 1, event: 'You call your bank. They confirm your account is fine.', isPositive: true },
          { day: 2, event: 'Bank flags the scam domain and warns other customers.', isPositive: true },
          { day: 7, event: 'Your security score climbs — no breach detected.', isPositive: true },
        ],
      },
      {
        text: 'Click the link to check if the account suspension is real.',
        qualityLevel: 'worst',
        feedback:
          'Disaster. The fake site harvested your credentials. Attackers drained your account within hours.',
        effects: { xp: 0, securityScore: -25, awarenessScore: -5, balance: -1200 },
        timeline: [
          { day: 1, event: 'You enter your credentials on the phishing page.', isPositive: false },
          { day: 1, event: 'Attackers log in instantly using your credentials.', isPositive: false },
          { day: 2, event: '$1,200 transferred to an overseas account.', isPositive: false },
          { day: 14, event: 'Bank partially reimburses $400 after investigation.', isPositive: true },
        ],
      },
      {
        text: 'Forward the email to your bank\'s official phishing report address.',
        qualityLevel: 'average',
        feedback:
          'Good instinct to report, but you should have also verified your account status directly. Reporting alone is reactive — always confirm with your bank.',
        effects: { xp: 20, securityScore: 3, awarenessScore: 5, balance: 0 },
        timeline: [
          { day: 1, event: 'Email forwarded to bank\'s fraud team.', isPositive: true },
          { day: 3, event: 'Bank confirms phishing attempt and takes action.', isPositive: true },
        ],
      },
    ],
  },

  // ─── PHISHING: GRANT ─────────────────────────────────────────────────────────
  {
    title: 'Government Educational Grant – Claim $3,500',
    description:
      'You receive an email: "Congratulations! You have been selected to receive a $3,500 educational assistance grant from the Ministry of Education. To claim your funds, complete the form at the link below and provide your bank account details for direct deposit. Offer expires in 48 hours."',
    type: 'phishing_grant',
    source: 'inbox',
    emailMeta: {
      sender: 'grants@ministry-edu-assistance.net',
      subject: 'You\'ve Been Selected: $3,500 Grant Waiting',
      preview: 'Claim your $3,500 educational grant before the 48-hour window closes.',
      riskBadge: 'Scam',
    },
    realContext:
      'Real government grants never ask for bank account details via email. The domain "ministry-edu-assistance.net" is not a government domain.',
    difficulty: 'medium',
    targetRoles: ['student', 'freelancer'],
    choices: [
      {
        text: 'Ignore the email and report it as phishing.',
        qualityLevel: 'best',
        feedback:
          'Exactly right. There is no such grant. Providing your bank details would have led to direct theft from your account.',
        effects: { xp: 50, securityScore: 8, awarenessScore: 10, balance: 0 },
        timeline: [
          { day: 1, event: 'Email marked as phishing. Inbox protected.', isPositive: true },
          { day: 7, event: 'Awareness score rises — you recognize advanced social engineering.', isPositive: true },
        ],
      },
      {
        text: 'Fill in the form with your bank details to claim the grant.',
        qualityLevel: 'worst',
        feedback:
          'Your bank details were stolen instantly. Scammers made unauthorized withdrawals that same day.',
        effects: { xp: 0, securityScore: -30, awarenessScore: -10, balance: -850 },
        timeline: [
          { day: 1, event: 'Bank details submitted to scam site.', isPositive: false },
          { day: 1, event: '$850 withdrawn via fraudulent ACH transfer.', isPositive: false },
          { day: 5, event: 'Bank freezes account while investigating.', isPositive: false },
          { day: 20, event: 'Partial recovery of $300 after fraud claim.', isPositive: true },
        ],
      },
      {
        text: 'Search online for the grant program before responding.',
        qualityLevel: 'average',
        feedback:
          'Good — you slowed down. But even after finding no results, you should have reported the email rather than just ignoring it.',
        effects: { xp: 25, securityScore: 4, awarenessScore: 6, balance: 0 },
        timeline: [
          { day: 1, event: 'Search reveals no such government grant exists.', isPositive: true },
          { day: 1, event: 'Email deleted. No data compromised.', isPositive: true },
        ],
      },
    ],
  },

  // ─── SALARY UPDATE ────────────────────────────────────────────────────────────
  {
    title: 'Payroll Update: New Salary Effective Immediately',
    description:
      'HR sends a company-wide email: "We are updating our payroll system. All employees must re-submit their bank account information via the secure portal linked below before Friday or your salary payment may be delayed. Please use your employee ID and personal email to log in."',
    type: 'salary_update',
    source: 'inbox',
    emailMeta: {
      sender: 'hr-payroll@company-hr-portal.co',
      subject: 'Action Required: Update Payroll Details by Friday',
      preview: 'Re-submit your bank info to avoid salary delays. Deadline: Friday.',
      riskBadge: 'Suspicious',
    },
    realContext:
      'Legitimate HR departments don\'t change payroll portals and request re-entry of banking details via email. The domain differs from your company\'s real domain.',
    difficulty: 'medium',
    targetRoles: ['employee'],
    choices: [
      {
        text: 'Contact HR directly by phone to verify before doing anything.',
        qualityLevel: 'best',
        feedback:
          'Exactly right. Calling HR through a known company number immediately exposed this as a spear-phishing attack targeting employees.',
        effects: { xp: 50, securityScore: 12, awarenessScore: 10, balance: 0 },
        timeline: [
          { day: 1, event: 'HR confirms no payroll update was sent. IT alerted.', isPositive: true },
          { day: 2, event: 'Company-wide security alert sent to all staff.', isPositive: true },
          { day: 3, event: 'Phishing campaign traced and domain taken down.', isPositive: true },
        ],
      },
      {
        text: 'Update your bank details on the portal — you don\'t want to miss your salary.',
        qualityLevel: 'worst',
        feedback:
          'Your real banking details were captured. The attacker redirected your next salary payment to their account.',
        effects: { xp: 0, securityScore: -30, awarenessScore: -10, balance: -2400 },
        timeline: [
          { day: 1, event: 'Bank details submitted to fraudulent portal.', isPositive: false },
          { day: 5, event: 'Salary deposited — but to the attacker\'s account.', isPositive: false },
          { day: 6, event: 'You notice missing salary. Report filed with HR and bank.', isPositive: false },
          { day: 30, event: 'Investigation ongoing; partial recovery possible after 90 days.', isPositive: false },
        ],
      },
      {
        text: 'Reply to the email asking for more details before submitting anything.',
        qualityLevel: 'average',
        feedback:
          'Better than clicking the link, but replying to a phishing email confirms your address is active and may invite further attacks.',
        effects: { xp: 15, securityScore: -3, awarenessScore: 4, balance: 0 },
        timeline: [
          { day: 1, event: 'Reply sent. No bank details leaked.', isPositive: true },
          { day: 2, event: 'Attacker now knows your email is active and sends follow-up scam.', isPositive: false },
        ],
      },
    ],
  },

  // ─── INVESTMENT SCAM ─────────────────────────────────────────────────────────
  {
    title: 'Exclusive: 40% Monthly Return Investment',
    description:
      'An acquaintance DMs you: "I\'ve been using this crypto trading bot for 3 months. Last month I made $6,000 on a $2,000 investment. The window to join this round closes Sunday. The platform is VaultProfitBot.com — I can send you a referral link. No risk, guaranteed returns."',
    type: 'investment_scam',
    source: 'inbox',
    emailMeta: {
      sender: 'referral@vaultprofitbot.com',
      subject: 'Your friend invited you: Earn 40% monthly — Limited spots',
      preview: 'Guaranteed 40% monthly return. Your friend is already profiting.',
      riskBadge: 'High Risk',
    },
    realContext:
      '"Guaranteed returns" and "no risk" are hallmarks of Ponzi schemes. No legitimate investment offers guaranteed fixed returns. These schemes pay early investors with new investor money.',
    difficulty: 'hard',
    targetRoles: ['student', 'employee', 'freelancer'],
    choices: [
      {
        text: 'Decline and research the platform — it sounds like a Ponzi scheme.',
        qualityLevel: 'best',
        feedback:
          'Correct instinct. A quick search would have revealed dozens of fraud reports. "Guaranteed returns" violates every principle of legitimate finance.',
        effects: { xp: 60, securityScore: 5, awarenessScore: 15, balance: 0 },
        timeline: [
          { day: 1, event: 'Research confirms VaultProfitBot is a known scam.', isPositive: true },
          { day: 3, event: 'You warn your acquaintance — they pull out before collapse.', isPositive: true },
          { day: 30, event: 'Platform collapses. Thousands of investors lose money.', isPositive: true },
        ],
      },
      {
        text: 'Invest $500 to test it — a small amount feels safe.',
        qualityLevel: 'worst',
        feedback:
          'The platform showed fabricated "profits" to gain your trust, then asked you to invest more. By the time it collapsed, you\'d deposited $1,800.',
        effects: { xp: 0, securityScore: -10, awarenessScore: -5, balance: -1800 },
        timeline: [
          { day: 1, event: '$500 deposited. Dashboard shows fake +12% after week one.', isPositive: false },
          { day: 14, event: 'Tempted by returns, you add $1,300 more.', isPositive: false },
          { day: 45, event: 'Platform goes offline. $1,800 total lost.', isPositive: false },
          { day: 90, event: 'No recovery possible — offshore entity, no recourse.', isPositive: false },
        ],
      },
      {
        text: 'Ask your acquaintance to prove their earnings with screenshots before deciding.',
        qualityLevel: 'average',
        feedback:
          'Screenshots are trivially faked. This buys time but doesn\'t protect you. Always check independent reviews and regulatory filings, not peer screenshots.',
        effects: { xp: 20, securityScore: 2, awarenessScore: 5, balance: 0 },
        timeline: [
          { day: 1, event: 'You receive convincing (but fake) earnings screenshots.', isPositive: false },
          { day: 2, event: 'You hesitate and do a deeper search instead — good recovery.', isPositive: true },
          { day: 3, event: 'Regulatory blacklist confirms the platform is fraudulent.', isPositive: true },
        ],
      },
    ],
  },

  // ─── TAX REFUND PHISHING ─────────────────────────────────────────────────────
  {
    title: 'Tax Refund of $780 Is Waiting for You',
    description:
      'An official-looking email from "National Revenue Service" says: "After reviewing your recent tax return, we have determined that you are owed a refund of $780.00. To process your refund, please verify your identity and provide your bank account information using the secure form below. Refunds not claimed within 5 days will be forfeited."',
    type: 'tax_refund',
    source: 'inbox',
    emailMeta: {
      sender: 'refunds@national-revenue-service.org',
      subject: 'Tax Refund Notification – $780.00 Available',
      preview: 'Your $780 tax refund is ready. Claim it within 5 days.',
      riskBadge: 'Phishing',
    },
    realContext:
      'Tax authorities never initiate refunds via email and never ask for bank info through a link. Real refunds are processed automatically or through the official government portal.',
    difficulty: 'easy',
    targetRoles: ['student', 'employee', 'freelancer'],
    choices: [
      {
        text: 'Go to the official government tax website directly (not through the email link) to check your refund status.',
        qualityLevel: 'best',
        feedback:
          'Perfect approach. You navigated directly to the official site, found no pending refund, and confirmed the email was fraudulent.',
        effects: { xp: 50, securityScore: 10, awarenessScore: 8, balance: 0 },
        timeline: [
          { day: 1, event: 'Official tax portal shows no pending refund.', isPositive: true },
          { day: 1, event: 'Email reported to government anti-phishing team.', isPositive: true },
          { day: 7, event: 'Phishing site taken down following your report.', isPositive: true },
        ],
      },
      {
        text: 'Click the link and enter your bank details to receive the refund.',
        qualityLevel: 'worst',
        feedback:
          'Your bank details were captured immediately. Within 24 hours, your account was compromised.',
        effects: { xp: 0, securityScore: -25, awarenessScore: -8, balance: -620 },
        timeline: [
          { day: 1, event: 'Bank details entered on phishing form.', isPositive: false },
          { day: 1, event: '$620 withdrawn via unauthorized transfer.', isPositive: false },
          { day: 3, event: 'Bank freezes account after fraud detection.', isPositive: false },
          { day: 21, event: '$200 recovered via chargeback. $420 permanently lost.', isPositive: false },
        ],
      },
      {
        text: 'Call the tax authority\'s official phone number to ask about the refund.',
        qualityLevel: 'average',
        feedback:
          'Calling the official number is very good — almost as good as checking the portal directly. The agent confirmed no refund was pending.',
        effects: { xp: 35, securityScore: 7, awarenessScore: 7, balance: 0 },
        timeline: [
          { day: 1, event: 'Call to tax authority confirms no refund is pending.', isPositive: true },
          { day: 1, event: 'Fraud reported over the phone for tracking.', isPositive: true },
        ],
      },
    ],
  },

  // ─── ACCOUNT VERIFICATION ─────────────────────────────────────────────────────
  {
    title: 'Verify Your Freelance Platform Account',
    description:
      'You get an email from what looks like your freelance platform: "To maintain your account in good standing, we need to re-verify your identity. Please re-enter your PayPal or bank account information linked to your profile. Failure to verify within 72 hours will result in a hold on your pending payments of $1,450."',
    type: 'account_verification',
    source: 'inbox',
    emailMeta: {
      sender: 'verify@freelancepay-security.com',
      subject: 'Account Verification Required – $1,450 Payment on Hold',
      preview: 'Re-verify your payment details or your $1,450 payout will be frozen.',
      riskBadge: 'Suspicious',
    },
    realContext:
      'Legitimate freelance platforms like Upwork, Fiverr, or Toptal never ask you to re-enter payment info via email. Always log in directly through the platform.',
    difficulty: 'medium',
    targetRoles: ['freelancer', 'student'],
    choices: [
      {
        text: 'Log into the freelance platform directly from your browser and check your account there.',
        qualityLevel: 'best',
        feedback:
          'Correct. Your account showed no verification request and all payments were on schedule. The email was a targeted spear-phishing attempt.',
        effects: { xp: 55, securityScore: 12, awarenessScore: 10, balance: 0 },
        timeline: [
          { day: 1, event: 'Platform login shows no verification request.', isPositive: true },
          { day: 1, event: '$1,450 payment processes normally on schedule.', isPositive: true },
          { day: 2, event: 'Email reported. Platform support confirms it\'s a scam.', isPositive: true },
        ],
      },
      {
        text: 'Click the link and re-enter your PayPal credentials to unfreeze the payment.',
        qualityLevel: 'worst',
        feedback:
          'Your PayPal credentials were stolen. The attacker accessed your PayPal and withdrew your balance.',
        effects: { xp: 0, securityScore: -28, awarenessScore: -8, balance: -950 },
        timeline: [
          { day: 1, event: 'PayPal credentials captured by phishing page.', isPositive: false },
          { day: 1, event: 'Attacker logs into PayPal and sends $950 to themselves.', isPositive: false },
          { day: 2, event: 'PayPal account locked after fraud detection.', isPositive: false },
          { day: 14, event: 'PayPal dispute filed. Recovery uncertain.', isPositive: false },
        ],
      },
      {
        text: 'Reply asking the platform to call you to confirm before you take any action.',
        qualityLevel: 'average',
        feedback:
          'Smart to demand a phone call, but replying to the phishing email confirmed your email is active. The better move is to contact support through the real platform.',
        effects: { xp: 18, securityScore: 1, awarenessScore: 5, balance: 0 },
        timeline: [
          { day: 1, event: 'No reply from scammer. Payment wasn\'t actually frozen.', isPositive: true },
          { day: 3, event: 'Scammer sends a follow-up email with more urgency.', isPositive: false },
          { day: 4, event: 'You check the real platform and find everything is fine.', isPositive: true },
        ],
      },
    ],
  },

  // ─── PRIZE NOTIFICATION ───────────────────────────────────────────────────────
  {
    title: 'You\'ve Won a $500 Gift Card!',
    description:
      'A pop-up notification reads: "Congratulations! You are our 1,000,000th visitor and have been selected to win a $500 Amazon Gift Card! Click below, complete a 30-second survey, and provide your shipping address and credit card details (for identity verification only — you will NOT be charged)."',
    type: 'prize_notification',
    source: 'inbox',
    emailMeta: {
      sender: 'winner@amazongifts-promo.net',
      subject: 'You Won! Claim Your $500 Amazon Gift Card Now',
      preview: 'You\'re our 1,000,000th visitor! Claim your $500 gift card in 30 seconds.',
      riskBadge: 'Scam',
    },
    realContext:
      '"You are our millionth visitor" is one of the oldest internet scams. Providing credit card info "for verification" is a direct route to unauthorized charges.',
    difficulty: 'easy',
    targetRoles: ['student', 'employee', 'freelancer'],
    choices: [
      {
        text: 'Close the notification immediately — this is a classic scam.',
        qualityLevel: 'best',
        feedback:
          'Exactly right. "1,000,000th visitor" prizes are always fraudulent. No credit card is ever needed for identity verification of a prize.',
        effects: { xp: 45, securityScore: 8, awarenessScore: 12, balance: 0 },
        timeline: [
          { day: 1, event: 'Pop-up closed. No data entered. No exposure.', isPositive: true },
          { day: 7, event: 'Awareness score rises — you\'re getting better at spotting scams.', isPositive: true },
        ],
      },
      {
        text: 'Complete the survey and enter your credit card details for "verification."',
        qualityLevel: 'worst',
        feedback:
          'Your card details were used for subscription charges you never agreed to. You also received a flood of spam calls.',
        effects: { xp: 0, securityScore: -20, awarenessScore: -10, balance: -320 },
        timeline: [
          { day: 1, event: 'Credit card details captured on scam site.', isPositive: false },
          { day: 2, event: '$9.99 trial subscription charge appears.', isPositive: false },
          { day: 7, event: 'Three unauthorized charges totaling $320.', isPositive: false },
          { day: 10, event: 'Card cancelled. Dispute filed with bank.', isPositive: false },
          { day: 25, event: '$280 recovered via chargeback. Inconvenience of a week without card.', isPositive: true },
        ],
      },
      {
        text: 'Search for the prize on Amazon\'s official website before providing any details.',
        qualityLevel: 'average',
        feedback:
          'Good instinct to verify — Amazon\'s site confirms no such promotion exists. You should also report the site to avoid others falling victim.',
        effects: { xp: 25, securityScore: 4, awarenessScore: 7, balance: 0 },
        timeline: [
          { day: 1, event: 'Amazon website shows no such promotion. Pop-up confirmed as scam.', isPositive: true },
          { day: 1, event: 'No data entered. Account safe.', isPositive: true },
        ],
      },
    ],
  },
]

module.exports = scenarios
