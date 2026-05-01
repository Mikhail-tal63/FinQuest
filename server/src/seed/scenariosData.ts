import { ScenarioType, ScenarioSource, Difficulty, Persona, QualityLevel } from '../types'

interface TimelineEventData {
  day: number
  event: string
  isPositive: boolean
}

interface ChoiceEffectsData {
  xp: number
  securityScore: number
  awarenessScore: number
  balance: number
}

interface ChoiceData {
  text: string
  qualityLevel: QualityLevel
  feedback: string
  effects: ChoiceEffectsData
  timeline: TimelineEventData[]
}

interface ScenarioData {
  title: string
  description: string
  type: ScenarioType
  source: ScenarioSource
  scheduledDay: number
  emailMeta: {
    sender: string
    subject: string
    preview: string
    riskBadge: string
  }
  realContext: string
  difficulty: Difficulty
  targetRoles: Persona[]
  choices: ChoiceData[]
}

const scenarios: ScenarioData[] = [
  // ─── PHISHING: BANK ──────────────────────────────────────────────────────────
  {
    title: 'Urgent: Your Account Has Been Suspended',
    description:
      'You receive an email that reads: "Dear Customer, We have detected suspicious activity on your BankSecure account. Your account access has been temporarily suspended. To restore access, click the link below and verify your identity within 24 hours or your account will be permanently closed. Click here: http://banksecure-support.ru/verify"',
    type: 'phishing_bank',
    source: 'inbox',
    scheduledDay: 3,
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
        text: "Forward the email to your bank's official phishing report address.",
        qualityLevel: 'average',
        feedback:
          'Good instinct to report, but you should have also verified your account status directly. Reporting alone is reactive — always confirm with your bank.',
        effects: { xp: 20, securityScore: 3, awarenessScore: 5, balance: 0 },
        timeline: [
          { day: 1, event: "Email forwarded to bank's fraud team.", isPositive: true },
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
    scheduledDay: 8,
    emailMeta: {
      sender: 'grants@ministry-edu-assistance.net',
      subject: "You've Been Selected: $3,500 Grant Waiting",
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
          {
            day: 7,
            event: 'Awareness score rises — you recognize advanced social engineering.',
            isPositive: true,
          },
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
    scheduledDay: 14,
    emailMeta: {
      sender: 'hr-payroll@company-hr-portal.co',
      subject: 'Action Required: Update Payroll Details by Friday',
      preview: 'Re-submit your bank info to avoid salary delays. Deadline: Friday.',
      riskBadge: 'Suspicious',
    },
    realContext:
      "Legitimate HR departments don't change payroll portals and request re-entry of banking details via email. The domain differs from your company's real domain.",
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
        text: "Update your bank details on the portal — you don't want to miss your salary.",
        qualityLevel: 'worst',
        feedback:
          'Your real banking details were captured. The attacker redirected your next salary payment to their account.',
        effects: { xp: 0, securityScore: -30, awarenessScore: -10, balance: -2400 },
        timeline: [
          { day: 1, event: 'Bank details submitted to fraudulent portal.', isPositive: false },
          { day: 5, event: "Salary deposited — but to the attacker's account.", isPositive: false },
          { day: 6, event: 'You notice missing salary. Report filed with HR and bank.', isPositive: false },
          {
            day: 30,
            event: 'Investigation ongoing; partial recovery possible after 90 days.',
            isPositive: false,
          },
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
          {
            day: 2,
            event: 'Attacker now knows your email is active and sends follow-up scam.',
            isPositive: false,
          },
        ],
      },
    ],
  },

  // ─── INVESTMENT SCAM ─────────────────────────────────────────────────────────
  {
    title: 'Exclusive: 40% Monthly Return Investment',
    description:
      "An acquaintance DMs you: \"I've been using this crypto trading bot for 3 months. Last month I made $6,000 on a $2,000 investment. The window to join this round closes Sunday. The platform is VaultProfitBot.com — I can send you a referral link. No risk, guaranteed returns.\"",
    type: 'investment_scam',
    source: 'inbox',
    scheduledDay: 17,
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
          "The platform showed fabricated \"profits\" to gain your trust, then asked you to invest more. By the time it collapsed, you'd deposited $1,800.",
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
          "Screenshots are trivially faked. This buys time but doesn't protect you. Always check independent reviews and regulatory filings, not peer screenshots.",
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
    scheduledDay: 23,
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
        text: "Call the tax authority's official phone number to ask about the refund.",
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
    scheduledDay: 27,
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
          { day: 2, event: "Email reported. Platform support confirms it's a scam.", isPositive: true },
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
          { day: 1, event: "No reply from scammer. Payment wasn't actually frozen.", isPositive: true },
          { day: 3, event: 'Scammer sends a follow-up email with more urgency.', isPositive: false },
          { day: 4, event: 'You check the real platform and find everything is fine.', isPositive: true },
        ],
      },
    ],
  },

  // ─── PRIZE NOTIFICATION ───────────────────────────────────────────────────────
  {
    title: "You've Won a $500 Gift Card!",
    description:
      'A pop-up notification reads: "Congratulations! You are our 1,000,000th visitor and have been selected to win a $500 Amazon Gift Card! Click below, complete a 30-second survey, and provide your shipping address and credit card details (for identity verification only — you will NOT be charged)."',
    type: 'prize_notification',
    source: 'inbox',
    scheduledDay: 11,
    emailMeta: {
      sender: 'winner@amazongifts-promo.net',
      subject: 'You Won! Claim Your $500 Amazon Gift Card Now',
      preview: "You're our 1,000,000th visitor! Claim your $500 gift card in 30 seconds.",
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
          {
            day: 7,
            event: "Awareness score rises — you're getting better at spotting scams.",
            isPositive: true,
          },
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
          {
            day: 25,
            event: '$280 recovered via chargeback. Inconvenience of a week without card.',
            isPositive: true,
          },
        ],
      },
      {
        text: "Search for the prize on Amazon's official website before providing any details.",
        qualityLevel: 'average',
        feedback:
          "Good instinct to verify — Amazon's site confirms no such promotion exists. You should also report the site to avoid others falling victim.",
        effects: { xp: 25, securityScore: 4, awarenessScore: 7, balance: 0 },
        timeline: [
          {
            day: 1,
            event: 'Amazon website shows no such promotion. Pop-up confirmed as scam.',
            isPositive: true,
          },
          { day: 1, event: 'No data entered. Account safe.', isPositive: true },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MONTH 2 SCENARIOS (Days 31–58)
  // ═══════════════════════════════════════════════════════════════════════════

  // ─── PHISHING: BANK (Month 2) ────────────────────────────────────────────
  {
    title: 'Fraud Alert: Unusual Login Detected on Your Account',
    description:
      'You receive an email: "We have detected an unusual login to your account from an unrecognized device in another country. For your security, your online banking has been temporarily locked. Please click the link below to confirm your identity and unlock your account within 12 hours to avoid permanent suspension. Click here: http://secure-bankverify.net/unlock"',
    type: 'phishing_bank',
    source: 'inbox',
    scheduledDay: 33,
    emailMeta: {
      sender: 'security@secure-bankverify.net',
      subject: 'Fraud Alert: Your account has been locked – Verify Now',
      preview: 'Unusual login detected. Unlock your account within 12 hours.',
      riskBadge: 'Phishing',
    },
    realContext:
      'Banks lock accounts through their own systems, not email links. The domain "secure-bankverify.net" has no connection to any real bank.',
    difficulty: 'easy',
    targetRoles: ['student', 'employee', 'freelancer'],
    choices: [
      {
        text: "Ignore the email and log in directly through your bank's official app.",
        qualityLevel: 'best',
        feedback:
          'Correct. Your app showed no lock or unusual activity. The email was a clone of a legitimate fraud alert, designed to create panic.',
        effects: { xp: 50, securityScore: 10, awarenessScore: 8, balance: 0 },
        timeline: [
          { day: 1, event: 'Bank app shows no fraud alert or account lock.', isPositive: true },
          { day: 1, event: 'Phishing email reported to bank fraud team.', isPositive: true },
          { day: 5, event: 'Bank confirms domain is a known fraud site.', isPositive: true },
        ],
      },
      {
        text: 'Click the link and verify your details to unlock the account quickly.',
        qualityLevel: 'worst',
        feedback:
          'The "unlock" page captured your full banking credentials. Funds were moved within the hour.',
        effects: { xp: 0, securityScore: -25, awarenessScore: -5, balance: -1500 },
        timeline: [
          { day: 1, event: 'Credentials entered on phishing page.', isPositive: false },
          {
            day: 1,
            event: '$1,500 transferred to foreign account within 60 minutes.',
            isPositive: false,
          },
          { day: 3, event: 'Bank investigation opened. Card cancelled.', isPositive: false },
          { day: 21, event: '$500 recovered. $1,000 permanently lost.', isPositive: false },
        ],
      },
      {
        text: 'Call the number printed on the back of your debit card to check.',
        qualityLevel: 'average',
        feedback:
          'Calling the number on your card is the right instinct. The bank confirmed there was no lock — email was fraudulent.',
        effects: { xp: 35, securityScore: 7, awarenessScore: 7, balance: 0 },
        timeline: [
          { day: 1, event: 'Bank confirms account is fully active. No lock detected.', isPositive: true },
          { day: 1, event: 'Fraud email reported by phone.', isPositive: true },
        ],
      },
    ],
  },

  // ─── INVESTMENT SCAM (Month 2) ────────────────────────────────────────────
  {
    title: 'Exclusive NFT Portfolio — Guaranteed 300% ROI',
    description:
      "A direct message arrives: \"Hey! I've been building my NFT portfolio with CryptoVaultX for the last two months. I turned $300 into $1,800 — all documented. They're opening a new round this week. Minimum entry is $200. The platform is licensed, your funds are insured, and returns are locked in by contract. I can get you whitelisted before Friday.\"",
    type: 'investment_scam',
    source: 'inbox',
    scheduledDay: 38,
    emailMeta: {
      sender: 'referral@cryptovaultx.io',
      subject: 'CryptoVaultX — Your whitelist spot is reserved',
      preview: 'Your friend reserved you a whitelist spot. 300% ROI guaranteed.',
      riskBadge: 'High Risk',
    },
    realContext:
      '"Licensed", "insured", and "guaranteed ROI" are meaningless claims on unregulated crypto platforms. No investment guarantees returns. NFT scams work by paying early investors with new deposits until the platform disappears.',
    difficulty: 'hard',
    targetRoles: ['student', 'employee', 'freelancer'],
    choices: [
      {
        text: "Decline and look up CryptoVaultX on a financial regulator's official website.",
        qualityLevel: 'best',
        feedback:
          "Smart. The regulator's site shows no record of CryptoVaultX. The platform was later exposed as a rug-pull that stole $2.3 million from users.",
        effects: { xp: 60, securityScore: 5, awarenessScore: 15, balance: 0 },
        timeline: [
          { day: 1, event: 'No registration found on financial regulator database.', isPositive: true },
          { day: 14, event: 'CryptoVaultX shuts down. Thousands of investors lose funds.', isPositive: true },
          { day: 30, event: 'News coverage confirms it was a coordinated rug-pull.', isPositive: true },
        ],
      },
      {
        text: 'Invest the $200 minimum — the risk seems manageable.',
        qualityLevel: 'worst',
        feedback:
          'The platform showed you fake gains, then asked you to deposit more. You ended up sending $900 before it vanished.',
        effects: { xp: 0, securityScore: -10, awarenessScore: -5, balance: -900 },
        timeline: [
          {
            day: 1,
            event: '$200 deposited. Dashboard shows fictitious +40% after one week.',
            isPositive: false,
          },
          { day: 10, event: 'Platform urges you to "lock in gains" with $700 more.', isPositive: false },
          { day: 21, event: 'Withdrawal requests fail. Site goes offline.', isPositive: false },
          { day: 60, event: 'No recovery. Offshore entity, untraceable.', isPositive: false },
        ],
      },
      {
        text: "Ask the friend for the company's registration number to verify independently.",
        qualityLevel: 'average',
        feedback:
          'Your friend provides a fake registration number. Looking it up correctly would have revealed no match — good that you asked, but you need to complete the check.',
        effects: { xp: 20, securityScore: 2, awarenessScore: 5, balance: 0 },
        timeline: [
          { day: 1, event: 'Fake registration number provided.', isPositive: false },
          { day: 2, event: 'You search the regulator database — no match found.', isPositive: true },
          { day: 2, event: 'You decline. Your money stays safe.', isPositive: true },
        ],
      },
    ],
  },

  // ─── PRIZE NOTIFICATION (Month 2) ────────────────────────────────────────
  {
    title: "You've Been Selected for a $1,000 Loyalty Reward",
    description:
      'An email arrives from "Customer Loyalty Program": "As a valued customer, you have been randomly selected to receive a $1,000 loyalty reward. To claim your reward, complete a short survey and provide your payment card details for identity verification. This offer expires in 24 hours and cannot be transferred."',
    type: 'prize_notification',
    source: 'inbox',
    scheduledDay: 42,
    emailMeta: {
      sender: 'rewards@loyalty-customer-program.com',
      subject: 'Congratulations — $1,000 Loyalty Reward Awaits You',
      preview: "You've been selected for a $1,000 reward. Claim in the next 24 hours.",
      riskBadge: 'Scam',
    },
    realContext:
      '"Identity verification" via credit card is a standard way scammers harvest card details. Legitimate loyalty programs never ask for payment info by email.',
    difficulty: 'easy',
    targetRoles: ['student', 'employee', 'freelancer'],
    choices: [
      {
        text: 'Delete the email — legitimate loyalty programs never ask for card details.',
        qualityLevel: 'best',
        feedback:
          'Correct. No real loyalty program asks for payment information to deliver a reward. The 24-hour urgency was designed to stop you from thinking clearly.',
        effects: { xp: 45, securityScore: 8, awarenessScore: 12, balance: 0 },
        timeline: [
          { day: 1, event: 'Email deleted. No data exposed.', isPositive: true },
          { day: 7, event: "Awareness score rises. You're building strong habits.", isPositive: true },
        ],
      },
      {
        text: 'Complete the survey and enter your card details to claim the $1,000.',
        qualityLevel: 'worst',
        feedback:
          'Your card was charged for multiple subscriptions immediately. The "reward" never arrived.',
        effects: { xp: 0, securityScore: -20, awarenessScore: -10, balance: -450 },
        timeline: [
          { day: 1, event: 'Card details captured on scam page.', isPositive: false },
          { day: 1, event: '$14.99 trial charge appears instantly.', isPositive: false },
          { day: 7, event: 'Three more unauthorized charges totalling $450.', isPositive: false },
          { day: 10, event: 'Card cancelled. Chargeback filed.', isPositive: false },
          {
            day: 25,
            event: '$380 recovered. Significant inconvenience and stress.',
            isPositive: true,
          },
        ],
      },
      {
        text: 'Call the company whose name is in the email to ask if the reward is real.',
        qualityLevel: 'average',
        feedback:
          "Good initiative, but the email doesn't actually name a real company. You should also forward it to your country's anti-fraud reporting service.",
        effects: { xp: 25, securityScore: 4, awarenessScore: 7, balance: 0 },
        timeline: [
          { day: 1, event: 'No real company matches the sender. Scam confirmed.', isPositive: true },
          { day: 1, event: 'No data entered. Account safe.', isPositive: true },
        ],
      },
    ],
  },

  // ─── TAX REFUND (Month 2) ─────────────────────────────────────────────────
  {
    title: 'Amended Return: Additional Refund of $1,200 Approved',
    description:
      'An email from "Revenue Processing Centre" states: "A review of your previous tax filing has identified an error in your favour. An additional refund of $1,200 has been approved. To receive your payment, you must verify your current bank account within 48 hours. Failure to verify will result in the refund being cancelled."',
    type: 'tax_refund',
    source: 'inbox',
    scheduledDay: 45,
    emailMeta: {
      sender: 'refunds@revenue-processing-centre.com',
      subject: 'Additional Tax Refund Approved – Verify Your Account',
      preview: 'An amended return found $1,200 in your favour. Verify your bank account.',
      riskBadge: 'Phishing',
    },
    realContext:
      'Tax authorities process amended-return refunds automatically — they never ask you to provide bank details via email to "unlock" a refund. The domain is not a government address.',
    difficulty: 'medium',
    targetRoles: ['student', 'employee', 'freelancer'],
    choices: [
      {
        text: 'Log in to the official government tax portal directly to check for any amended return.',
        qualityLevel: 'best',
        feedback:
          'Perfect. The portal showed no amended return and no pending refund. You reported the email and moved on without any loss.',
        effects: { xp: 50, securityScore: 10, awarenessScore: 8, balance: 0 },
        timeline: [
          { day: 1, event: 'Official tax portal: no amended return on file.', isPositive: true },
          { day: 1, event: 'Phishing email forwarded to government fraud hotline.', isPositive: true },
          { day: 7, event: 'Domain taken down following mass reporting.', isPositive: true },
        ],
      },
      {
        text: 'Click the link and provide your bank details to claim the $1,200 refund.',
        qualityLevel: 'worst',
        feedback:
          'Your bank details were harvested immediately. An unauthorized ACH transfer cleared your account the same night.',
        effects: { xp: 0, securityScore: -25, awarenessScore: -8, balance: -700 },
        timeline: [
          { day: 1, event: 'Bank account details entered on phishing form.', isPositive: false },
          { day: 1, event: '$700 transferred via unauthorized ACH.', isPositive: false },
          { day: 3, event: 'Bank freezes account pending investigation.', isPositive: false },
          { day: 20, event: '$250 recovered. Remaining $450 lost permanently.', isPositive: false },
        ],
      },
      {
        text: 'Call your accountant or tax adviser to ask if an amended return was filed.',
        qualityLevel: 'average',
        feedback:
          'A good step — your accountant confirmed no amendment was filed. However, you should also report the email to the authorities.',
        effects: { xp: 35, securityScore: 7, awarenessScore: 7, balance: 0 },
        timeline: [
          { day: 1, event: 'Accountant confirms no amended return. Email is fraudulent.', isPositive: true },
          { day: 1, event: 'Email deleted. No financial loss.', isPositive: true },
        ],
      },
    ],
  },

  // ─── SALARY UPDATE (Month 2) ─────────────────────────────────────────────
  {
    title: 'Urgent: Direct Deposit Details Must Be Updated Today',
    description:
      'You get a text message followed by an email: "URGENT: Your direct deposit account on file has been flagged as invalid by our payment processor. You must update your banking details before 5 PM today to receive your next salary payment. Use the link below to re-enter your information securely."',
    type: 'salary_update',
    source: 'inbox',
    scheduledDay: 48,
    emailMeta: {
      sender: 'payroll@direct-deposit-update.com',
      subject: 'Action Required: Direct Deposit Account Invalid – Update Now',
      preview: 'Your direct deposit is flagged invalid. Update details before 5 PM today.',
      riskBadge: 'Suspicious',
    },
    realContext:
      "Payroll systems don't invalidate bank accounts without notice from the bank itself. Combining a text + email creates false urgency — a known social engineering technique.",
    difficulty: 'hard',
    targetRoles: ['employee', 'freelancer'],
    choices: [
      {
        text: 'Call your payroll department directly using the number in the company directory.',
        qualityLevel: 'best',
        feedback:
          'Exactly right. Payroll confirmed your bank details on file are valid and no update was requested. IT was immediately notified of the attack.',
        effects: { xp: 55, securityScore: 12, awarenessScore: 10, balance: 0 },
        timeline: [
          {
            day: 1,
            event: 'Payroll confirms account details are correct and unchanged.',
            isPositive: true,
          },
          { day: 1, event: 'IT security team notified. Source of the attack investigated.', isPositive: true },
          {
            day: 2,
            event: 'Company-wide alert issued. Attack traced to external threat actor.',
            isPositive: true,
          },
        ],
      },
      {
        text: "Update your bank details through the link — you can't afford to miss your salary.",
        qualityLevel: 'worst',
        feedback:
          "Your salary for the month was redirected to the attacker's account. You had to file a formal fraud claim and go without pay during the investigation.",
        effects: { xp: 0, securityScore: -30, awarenessScore: -10, balance: -2800 },
        timeline: [
          { day: 1, event: 'Fraudulent bank details submitted through phishing portal.', isPositive: false },
          { day: 5, event: "Salary deposited — directly into attacker's account.", isPositive: false },
          { day: 6, event: 'You notice missing salary. HR and bank both contacted.', isPositive: false },
          {
            day: 45,
            event: 'Investigation ongoing. Full recovery unlikely within 90 days.',
            isPositive: false,
          },
        ],
      },
      {
        text: "Ignore the link but do nothing else — it's probably spam.",
        qualityLevel: 'average',
        feedback:
          'Ignoring it kept you safe, but doing nothing means the attack was never reported. Other colleagues may have fallen for it.',
        effects: { xp: 10, securityScore: 1, awarenessScore: 3, balance: 0 },
        timeline: [
          { day: 1, event: 'Link ignored. Your salary is safe.', isPositive: true },
          {
            day: 3,
            event: 'A colleague falls for the same attack. Loss reported to HR.',
            isPositive: false,
          },
          {
            day: 4,
            event: 'If you had reported it, the colleague would have been warned.',
            isPositive: false,
          },
        ],
      },
    ],
  },

  // ─── ACCOUNT VERIFICATION (Month 2) ─────────────────────────────────────
  {
    title: 'Streaming Account: Billing Error – Card Needs Re-verification',
    description:
      'An email lands in your inbox: "We were unable to process your recent payment. To avoid losing access to your account, please re-verify your credit card details within 24 hours. If you do not update your billing information, your account will be suspended and your viewing history deleted."',
    type: 'account_verification',
    source: 'inbox',
    scheduledDay: 52,
    emailMeta: {
      sender: 'billing@streamingservice-support.net',
      subject: 'Billing Error – Update Your Card to Keep Your Account',
      preview: 'Payment failed. Re-verify your card within 24 hours or lose your account.',
      riskBadge: 'Phishing',
    },
    realContext:
      'Streaming platforms always let you update payment details directly within the app or website. They never send you to a third-party domain for billing updates.',
    difficulty: 'medium',
    targetRoles: ['student', 'employee', 'freelancer'],
    choices: [
      {
        text: 'Open the streaming app directly and check the billing section — not via the email link.',
        qualityLevel: 'best',
        feedback:
          'Correct. The app showed no billing error and your subscription was active. The email was a phishing attempt targeting streaming subscribers.',
        effects: { xp: 55, securityScore: 12, awarenessScore: 10, balance: 0 },
        timeline: [
          {
            day: 1,
            event: "Streaming app: no billing issue found. Subscription active.",
            isPositive: true,
          },
          { day: 1, event: "Email reported through the app's phishing form.", isPositive: true },
          {
            day: 3,
            event: 'Streaming service warns all users of the phishing campaign.',
            isPositive: true,
          },
        ],
      },
      {
        text: 'Click the link and re-enter your card to avoid losing your subscription.',
        qualityLevel: 'worst',
        feedback:
          'Your card was cloned instantly. Fraudulent purchases appeared within hours on your statement.',
        effects: { xp: 0, securityScore: -22, awarenessScore: -8, balance: -580 },
        timeline: [
          { day: 1, event: 'Card details entered on fake billing page.', isPositive: false },
          {
            day: 1,
            event: 'Two fraudulent transactions totalling $580 appear immediately.',
            isPositive: false,
          },
          { day: 2, event: 'Card cancelled. Chargeback filed.', isPositive: false },
          { day: 18, event: '$480 recovered. $100 processing fee absorbed by you.', isPositive: true },
        ],
      },
      {
        text: 'Check your actual bank statement to see if a payment really failed.',
        qualityLevel: 'average',
        feedback:
          'Smart — your bank statement showed the subscription payment went through normally. The email was confirmed as fake. Report it to the streaming service as well.',
        effects: { xp: 30, securityScore: 5, awarenessScore: 7, balance: 0 },
        timeline: [
          { day: 1, event: 'Bank statement shows subscription paid successfully.', isPositive: true },
          { day: 1, event: 'Email confirmed as phishing. No data entered.', isPositive: true },
        ],
      },
    ],
  },

  // ─── PHISHING GRANT (Month 2) ─────────────────────────────────────────────
  {
    title: 'Housing Assistance Grant – $2,800 Available',
    description:
      'An email arrives: "You may qualify for a $2,800 housing assistance grant from the National Housing Relief Fund. This grant does not need to be repaid. To claim, submit your details — including your current bank account for deposit — using the link below. Applications close this Friday. This is a one-time, limited-availability offer."',
    type: 'phishing_grant',
    source: 'inbox',
    scheduledDay: 57,
    emailMeta: {
      sender: 'grants@national-housing-relief.org',
      subject: 'Housing Assistance Grant – $2,800 — Apply Before Friday',
      preview: 'Qualify for a $2,800 non-repayable housing grant. Limited availability.',
      riskBadge: 'Scam',
    },
    realContext:
      'Real housing assistance programs are administered by local governments and charities — they have public application processes and never solicit bank details by email.',
    difficulty: 'medium',
    targetRoles: ['student', 'employee', 'freelancer'],
    choices: [
      {
        text: "Ignore and report it — government grants don't arrive as unsolicited emails.",
        qualityLevel: 'best',
        feedback:
          'Correct. Legitimate housing grants have public application portals. Unsolicited emails asking for bank details to "receive" a grant are always fraudulent.',
        effects: { xp: 50, securityScore: 8, awarenessScore: 10, balance: 0 },
        timeline: [
          { day: 1, event: 'Email reported as phishing. No data exposed.', isPositive: true },
          { day: 3, event: 'Anti-fraud authority notified. Domain flagged.', isPositive: true },
          { day: 7, event: 'Awareness score rises. Two months of solid decisions.', isPositive: true },
        ],
      },
      {
        text: 'Submit your bank details — $2,800 would really help with rent.',
        qualityLevel: 'worst',
        feedback:
          'Your bank account number and routing details were stolen. An unauthorized debit wiped a significant portion of your balance.',
        effects: { xp: 0, securityScore: -28, awarenessScore: -10, balance: -1100 },
        timeline: [
          { day: 1, event: 'Bank account details submitted to scam site.', isPositive: false },
          { day: 2, event: 'Unauthorized ACH debit of $1,100 processed overnight.', isPositive: false },
          { day: 5, event: 'Bank account frozen pending investigation.', isPositive: false },
          { day: 30, event: '$600 recovered after fraud dispute. $500 permanently lost.', isPositive: false },
        ],
      },
      {
        text: 'Search online for "National Housing Relief Fund" to verify it\'s real.',
        qualityLevel: 'average',
        feedback:
          'Good first step. The search reveals no official government body by that name. You should also report the email to the consumer protection agency.',
        effects: { xp: 25, securityScore: 4, awarenessScore: 6, balance: 0 },
        timeline: [
          { day: 1, event: 'No government body matches the name. Scam confirmed.', isPositive: true },
          { day: 1, event: 'Email deleted. No financial loss.', isPositive: true },
        ],
      },
    ],
  },
]

export default scenarios
