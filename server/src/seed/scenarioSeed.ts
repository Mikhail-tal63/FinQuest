import Scenario from '../models/Scenario';

export const scenarioSeedData = [
  // ════════════════════════════════════════════════════════
  // 1. INBOX — Suspicious Bank Email (all roles)
  // ════════════════════════════════════════════════════════
  {
    title: 'Suspicious Bank Email',
    role: 'all',
    source: 'inbox',
    category: 'Phishing',
    description:
      'You received an email claiming to be from your bank, asking you to click a link immediately and update your card details or your account will be suspended.',
    difficulty: 'easy',
    riskPoints: 20,
    emailMeta: {
      sender: 'support-bank-secure@gmail.com',
      subject: 'URGENT: Your account will be blocked in 10 minutes',
      preview: 'Please click the link below to avoid account suspension...',
      riskBadge: 'suspicious',
    },
    clues: [
      { label: 'Sender address', description: 'The sender uses @gmail.com — your bank would use its own official domain.' },
      { label: 'Urgency language', description: '"10 minutes" creates panic to stop you from thinking clearly.' },
      { label: 'Sensitive data request', description: 'Real banks never ask for card details through email links.' },
      { label: 'Generic greeting', description: 'The email says "Dear Customer" instead of your actual name.' },
    ],
    preClickChecklist: [
      'Is the sender address an official bank domain?',
      'Does the message create unnecessary urgency?',
      'Is it asking for card or account details?',
      'Did you request any change to your account?',
    ],
    potentialLosses: ['Full card details', 'Wallet balance', 'Personal data', 'Account access'],
    reasonQuestion: 'Why is verifying through the official source the right move?',
    reasonOptions: [
      { text: 'Because the link may lead to a fake website', isCorrect: true },
      { text: 'Because banks do not ask for card details through email links', isCorrect: true },
      { text: 'Because the message uses unusual urgency to trick you', isCorrect: true },
      { text: 'Because ignoring emails is always the safest option', isCorrect: false },
    ],
    choices: [
      {
        text: 'Click the link and update my card details',
        qualityLevel: 'worst',
        mistakeTag: 'phishing',
        effects: { balance: -300, awareness: -15, security: -25, savings: 0 },
        feedback:
          'You fell for a phishing attack. The sender address (@gmail.com) and the urgency tone were clear red flags. Real banks use their own domain and never ask for card details via email.',
        timeline: [
          { day: 1, event: 'You clicked a suspicious link and entered your card details', isPositive: false },
          { day: 2, event: '300 was deducted from your balance by an unauthorized party', isPositive: false },
          { day: 3, event: 'Your security score dropped — your account is now at risk', isPositive: false },
          { day: 4, event: 'You had to contact your bank to block and reissue your card', isPositive: false },
        ],
      },
      {
        text: 'Ignore the email and delete it',
        qualityLevel: 'average',
        effects: { balance: 0, awareness: 5, security: 5, savings: 0 },
        feedback:
          'Better than clicking, but ignoring is not enough. You should report phishing emails to your bank and email provider so others are protected.',
        timeline: [
          { day: 1, event: 'You deleted the suspicious email without clicking', isPositive: true },
          { day: 2, event: 'Your balance stayed intact', isPositive: true },
          { day: 3, event: 'The phishing campaign continued targeting others', isPositive: false },
        ],
      },
      {
        text: 'Call the bank using the official number on their website to verify',
        qualityLevel: 'best',
        effects: { balance: 0, awareness: 20, security: 20, savings: 0 },
        feedback:
          'Excellent decision! Verifying through official channels is the gold standard. The bank confirmed it was a phishing attempt — you just protected your account and your money.',
        timeline: [
          { day: 1, event: 'You called your bank through the official number to verify', isPositive: true },
          { day: 2, event: 'Bank confirmed the email was a phishing scam', isPositive: true },
          { day: 3, event: 'Your security score increased — you stayed vigilant', isPositive: true },
          { day: 4, event: 'You reported the email — protecting other customers too', isPositive: true },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════
  // 2. WALLET — Monthly Budget Decision (all roles)
  // ════════════════════════════════════════════════════════
  {
    title: 'Monthly Budget Decision',
    role: 'all',
    source: 'wallet',
    category: 'Budgeting',
    description:
      'Your monthly income just arrived. You have bills due, groceries needed, entertainment planned, and a savings goal. What do you do first?',
    difficulty: 'medium',
    riskPoints: 5,
    clues: [],
    preClickChecklist: [],
    potentialLosses: [],
    reasonQuestion: 'Why should you pay bills and save before entertainment?',
    reasonOptions: [
      { text: 'Because unpaid bills lead to late fees and service cuts', isCorrect: true },
      { text: 'Because saving first ensures you always set money aside', isCorrect: true },
      { text: 'Because entertainment is not important', isCorrect: false },
      { text: 'Because you might not have money left for fun', isCorrect: false },
    ],
    choices: [
      {
        text: 'Spend on entertainment first, pay bills with whatever is left',
        qualityLevel: 'worst',
        mistakeTag: 'poor_budgeting',
        effects: { balance: -200, awareness: -10, security: -5, savings: -50 },
        feedback:
          'Paying wants before needs is a common budgeting mistake. It left you short for essentials and forced you to delay a bill — which added a late fee.',
        timeline: [
          { day: 1, event: 'You spent on entertainment immediately after receiving income', isPositive: false },
          { day: 3, event: 'Electricity bill due — not enough money left to pay it fully', isPositive: false },
          { day: 7, event: 'Late fee added to your bill — extra cost you could have avoided', isPositive: false },
          { day: 14, event: 'Nothing saved this month — savings goal falls further behind', isPositive: false },
        ],
      },
      {
        text: 'Pay all bills, set aside 20% for savings, then budget entertainment from the rest',
        qualityLevel: 'best',
        effects: { balance: 0, awareness: 20, security: 10, savings: 100 },
        feedback:
          'This is the 50/30/20 rule in action — needs first, then savings, then wants. A solid monthly habit that keeps you financially healthy.',
        timeline: [
          { day: 1, event: 'All bills paid on time — no late fees', isPositive: true },
          { day: 2, event: '20% set aside into savings automatically', isPositive: true },
          { day: 5, event: 'Remaining budget used freely for entertainment', isPositive: true },
          { day: 30, event: 'Month ends with savings goal on track and no debt', isPositive: true },
        ],
      },
      {
        text: 'Put everything directly into savings and skip bills this month',
        qualityLevel: 'worst',
        mistakeTag: 'bill_delay',
        effects: { balance: -150, awareness: -5, security: -15, savings: 50 },
        feedback:
          'Skipping bills to save sounds disciplined, but it backfires — late fees and service suspension cost more than the savings you gained.',
        timeline: [
          { day: 1, event: 'All income transferred to savings account', isPositive: false },
          { day: 3, event: 'Internet service cut off — bill was not paid', isPositive: false },
          { day: 7, event: 'Late fee added to rent — unexpected extra cost', isPositive: false },
          { day: 10, event: 'Had to withdraw from savings to cover penalties — net gain: zero', isPositive: false },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════
  // 3. BILLS — Overdue Internet Bill (all roles)
  // ════════════════════════════════════════════════════════
  {
    title: 'Overdue Internet Bill',
    role: 'all',
    source: 'bills',
    category: 'Bill Management',
    description:
      'Your internet bill is 2 weeks overdue. A small late fee has been added. If you delay further, your service will be suspended tomorrow.',
    difficulty: 'easy',
    riskPoints: 10,
    clues: [],
    preClickChecklist: [],
    potentialLosses: ['Internet service access', 'Additional late fees', 'Credit score impact'],
    reasonQuestion: 'Why is it better to pay the bill now with the late fee?',
    reasonOptions: [
      { text: 'Because delaying further adds more fees on top', isCorrect: true },
      { text: 'Because service suspension disrupts daily work or study', isCorrect: true },
      { text: 'Because the late fee will disappear if you wait', isCorrect: false },
      { text: 'Because paying late is technically fine as long as you pay eventually', isCorrect: false },
    ],
    choices: [
      {
        text: 'Pay now including the late fee',
        qualityLevel: 'best',
        effects: { balance: -55, awareness: 15, security: 5, savings: 0 },
        feedback:
          'Good call. By paying now you stop the damage — no service cut, no growing fees. The late fee was a lesson: set up payment reminders for next month.',
        timeline: [
          { day: 1, event: 'Bill paid including the small late fee', isPositive: true },
          { day: 2, event: 'Internet service continues without interruption', isPositive: true },
          { day: 3, event: 'You set a payment reminder to avoid this next month', isPositive: true },
        ],
      },
      {
        text: 'Wait another week — hopefully it will sort itself out',
        qualityLevel: 'worst',
        mistakeTag: 'bill_delay',
        effects: { balance: -110, awareness: -10, security: -10, savings: 0 },
        feedback:
          'Bills never sort themselves out. The fee doubled and your internet was suspended for 3 days — affecting work and study. Always act on overdue bills immediately.',
        timeline: [
          { day: 1, event: 'You decided to wait and ignored the overdue notice', isPositive: false },
          { day: 2, event: 'Internet service suspended — work and study disrupted', isPositive: false },
          { day: 4, event: 'Late fee doubled — now paying almost twice the original bill', isPositive: false },
          { day: 7, event: 'Finally paid — but wasted money and lost productivity', isPositive: false },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════
  // 4. PHONE — Urgent Money Transfer Request (all roles)
  // ════════════════════════════════════════════════════════
  {
    title: 'Urgent Transfer Request',
    role: 'all',
    source: 'phone',
    category: 'Fraud Prevention',
    description:
      'A text from an unknown number claims to be your cousin stranded abroad. They urgently need you to transfer money and promise to repay you tomorrow.',
    difficulty: 'medium',
    riskPoints: 25,
    clues: [
      { label: 'Unknown number', description: 'The message comes from a number not in your contacts.' },
      { label: 'Artificial urgency', description: '"I need it NOW" is a classic pressure tactic used by scammers.' },
      { label: 'Unverified identity', description: 'Anyone can claim to be your cousin over text.' },
      { label: 'Promise to repay', description: 'Scammers always promise to repay quickly — then disappear.' },
    ],
    preClickChecklist: [
      'Do you recognize this phone number?',
      'Have you spoken to this person through another channel recently?',
      'Is the urgency level suspicious?',
      'Can you verify their identity before sending anything?',
    ],
    potentialLosses: ['Full transfer amount', 'Future trust in contacts', 'Time spent recovering money'],
    reasonQuestion: 'Why should you always verify identity before transferring money?',
    reasonOptions: [
      { text: 'Because anyone can impersonate someone over text', isCorrect: true },
      { text: 'Because scammers rely on urgency to prevent you from thinking', isCorrect: true },
      { text: 'Because it is rude to question family members', isCorrect: false },
      { text: 'Because the promise to repay makes it safe', isCorrect: false },
    ],
    choices: [
      {
        text: 'Transfer the money immediately to help them',
        qualityLevel: 'worst',
        mistakeTag: 'fraud',
        effects: { balance: -500, awareness: -20, security: -30, savings: 0 },
        feedback:
          'This was a social engineering scam. The "cousin" did not exist — you transferred money to a stranger. Always verify identity through a known channel before any transfer.',
        timeline: [
          { day: 1, event: 'You transferred money to an unknown number claiming to be family', isPositive: false },
          { day: 2, event: 'The contact went silent and the number became unreachable', isPositive: false },
          { day: 3, event: 'You called your real cousin — they were safe at home, knew nothing', isPositive: false },
          { day: 5, event: 'Money lost — fraud report filed with bank, recovery unlikely', isPositive: false },
        ],
      },
      {
        text: 'Call your cousin on their known number to verify before sending anything',
        qualityLevel: 'best',
        effects: { balance: 0, awareness: 25, security: 25, savings: 0 },
        feedback:
          'Perfect. One call to a known number exposed the scam instantly. This is the correct response to any unexpected urgent money request — regardless of who they claim to be.',
        timeline: [
          { day: 1, event: 'You called your cousin on their real number — they were fine at home', isPositive: true },
          { day: 2, event: 'Scam confirmed — you reported the number to authorities', isPositive: true },
          { day: 3, event: 'Your security score increased — you stayed vigilant under pressure', isPositive: true },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════
  // 5. PHONE — Flash Sale Temptation (all roles)
  // ════════════════════════════════════════════════════════
  {
    title: 'Flash Sale Temptation',
    role: 'all',
    source: 'phone',
    category: 'Impulse Spending',
    description:
      'A notification announces a 24-hour flash sale — 40% off a gadget you have been eyeing. Buying it would require dipping into your emergency fund.',
    difficulty: 'medium',
    riskPoints: 10,
    clues: [],
    preClickChecklist: [
      'Is this a planned purchase in your budget?',
      'Do you actually need this right now?',
      'Would buying this leave your emergency fund depleted?',
      'Will this deal still matter in 24 hours?',
    ],
    potentialLosses: ['Emergency fund balance', 'Financial safety net', 'Savings momentum'],
    reasonQuestion: 'Why should emergency funds not be used for sales?',
    reasonOptions: [
      { text: 'Because emergency funds exist only for unexpected critical expenses', isCorrect: true },
      { text: 'Because a depleted emergency fund leaves you exposed to real emergencies', isCorrect: true },
      { text: 'Because discounts are never real savings', isCorrect: false },
      { text: 'Because you should never spend money on wants', isCorrect: false },
    ],
    choices: [
      {
        text: 'Buy it — the 40% discount makes it too good to pass',
        qualityLevel: 'worst',
        mistakeTag: 'impulse_spending',
        effects: { balance: -400, awareness: -10, security: -20, savings: -150 },
        feedback:
          'Emotional buying triggered by urgency is one of the biggest financial traps. You emptied part of your emergency fund for a purchase that was never planned — leaving you exposed to real emergencies.',
        timeline: [
          { day: 1, event: 'You bought the gadget using your emergency fund', isPositive: false },
          { day: 3, event: 'Unexpected medical expense — emergency fund is too low to cover it', isPositive: false },
          { day: 7, event: 'Had to borrow money at high interest to cover emergency costs', isPositive: false },
        ],
      },
      {
        text: 'Skip it — the emergency fund must stay intact',
        qualityLevel: 'best',
        effects: { balance: 0, awareness: 15, security: 15, savings: 10 },
        feedback:
          'Great self-control. Your emergency fund is there for real emergencies, not for sales. If you truly want this gadget, save for it separately as a planned purchase.',
        timeline: [
          { day: 1, event: 'You decided not to spend from the emergency fund', isPositive: true },
          { day: 7, event: 'An unexpected car repair came up — your emergency fund covered it', isPositive: true },
          { day: 14, event: 'You started a separate savings goal for the gadget instead', isPositive: true },
        ],
      },
      {
        text: 'Buy a cheaper alternative that fits within my regular monthly budget',
        qualityLevel: 'average',
        effects: { balance: -80, awareness: 10, security: 5, savings: 5 },
        feedback:
          'A reasonable compromise — you satisfied the want without touching your safety net. Next time, plan gadget purchases in advance so you never have to choose between fun and safety.',
        timeline: [
          { day: 1, event: 'Bought a budget-friendly alternative from your regular spending allocation', isPositive: true },
          { day: 3, event: 'Emergency fund stayed intact', isPositive: true },
          { day: 14, event: 'Monthly budget slightly tighter but manageable', isPositive: true },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════
  // 6. SAVINGS — Building Emergency Fund (all roles)
  // ════════════════════════════════════════════════════════
  {
    title: 'Building Your Emergency Fund',
    role: 'all',
    source: 'savings',
    category: 'Saving',
    description:
      'A financial advisor recommends 3–6 months of expenses as an emergency fund. Yours currently covers 1 month. How do you approach closing the gap?',
    difficulty: 'medium',
    riskPoints: 0,
    clues: [],
    preClickChecklist: [],
    potentialLosses: [],
    reasonQuestion: 'Why is automating savings more effective than saving what is left?',
    reasonOptions: [
      { text: 'Because automation removes the temptation to spend first', isCorrect: true },
      { text: 'Because leftover savings are unreliable and usually zero', isCorrect: true },
      { text: 'Because banks require automatic transfers', isCorrect: false },
      { text: 'Because manual saving always leads to overspending', isCorrect: false },
    ],
    choices: [
      {
        text: 'Automatically transfer 10% of income to savings at the start of each month',
        qualityLevel: 'best',
        effects: { balance: 0, awareness: 20, security: 10, savings: 150 },
        feedback:
          'Automating savings is the single most effective habit you can build. By paying yourself first, you guarantee progress every month without relying on willpower.',
        timeline: [
          { day: 1, event: '10% transferred to savings automatically on payday', isPositive: true },
          { day: 30, event: 'First month complete — savings progress on track', isPositive: true },
          { day: 90, event: '3 months in — emergency fund growing steadily without effort', isPositive: true },
        ],
      },
      {
        text: 'Save whatever is left at the end of the month',
        qualityLevel: 'average',
        effects: { balance: 0, awareness: 5, security: 0, savings: 20 },
        feedback:
          'Saving leftovers is better than nothing, but it is unpredictable. Most months there will be little or nothing left. Pay yourself first instead.',
        timeline: [
          { day: 30, event: 'End of month — almost nothing left to save', isPositive: false },
          { day: 60, event: 'Second month — managed to save a small amount', isPositive: true },
          { day: 90, event: 'Progress is slow and inconsistent', isPositive: false },
        ],
      },
      {
        text: 'Invest everything in stocks for faster growth',
        qualityLevel: 'worst',
        mistakeTag: 'poor_budgeting',
        effects: { balance: -100, awareness: 0, security: -10, savings: -30 },
        feedback:
          'Emergency funds must be liquid and stable — not in volatile markets. Stocks can drop 30% overnight. If an emergency hits while your fund is down, you are in serious trouble.',
        timeline: [
          { day: 1, event: 'All savings invested in stocks for quick returns', isPositive: false },
          { day: 14, event: 'Market drops 20% — portfolio value falls sharply', isPositive: false },
          { day: 21, event: 'Car breaks down — forced to sell stocks at a loss to cover repair', isPositive: false },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════
  // 7. INBOX — Fake Investment Offer (all roles)
  // ════════════════════════════════════════════════════════
  {
    title: 'Too-Good Investment Offer',
    role: 'all',
    source: 'inbox',
    category: 'Investment Scams',
    description:
      'An email promises 300% returns in 30 days through a "guaranteed" crypto fund. They ask for your wallet seed phrase to get started.',
    difficulty: 'easy',
    riskPoints: 30,
    emailMeta: {
      sender: 'invest@crypto-guaranteed-returns.net',
      subject: 'Exclusive: 300% Returns in 30 Days — Act Now!',
      preview: 'Share your seed phrase today to unlock guaranteed crypto profits...',
      riskBadge: 'suspicious',
    },
    clues: [
      { label: 'Unrealistic returns', description: '300% in 30 days is impossible in any legitimate investment.' },
      { label: 'Seed phrase request', description: 'Sharing your seed phrase gives the sender full control of your crypto wallet. NEVER share it.' },
      { label: 'Unofficial domain', description: 'The domain ".net" and generic name are not from any recognized financial institution.' },
      { label: '"Guaranteed" language', description: 'All real investments carry risk. "Guaranteed" returns are always a scam signal.' },
    ],
    preClickChecklist: [
      'Is a 300% return in 30 days financially realistic?',
      'Is anyone asking for your seed phrase?',
      'Is this from a regulated, verifiable financial institution?',
      'Does "guaranteed" appear anywhere in the offer?',
    ],
    potentialLosses: ['Entire crypto wallet balance', 'Personal financial data', 'Future savings'],
    reasonQuestion: 'Why are "guaranteed" high returns always a red flag?',
    reasonOptions: [
      { text: 'Because all real investments carry some level of risk', isCorrect: true },
      { text: 'Because seed phrases give full wallet access to whoever receives them', isCorrect: true },
      { text: 'Because crypto investments are illegal', isCorrect: false },
      { text: 'Because high returns only happen in traditional banking', isCorrect: false },
    ],
    choices: [
      {
        text: 'Share my seed phrase and invest — 300% sounds amazing',
        qualityLevel: 'worst',
        mistakeTag: 'fraud',
        effects: { balance: -800, awareness: -25, security: -40, savings: -200 },
        feedback:
          'Your entire wallet was drained the moment you shared your seed phrase. NEVER share it with anyone — not even someone who claims to be from your bank or a trusted company. Seed phrase = full wallet control.',
        timeline: [
          { day: 1, event: 'You shared your seed phrase with the "investment platform"', isPositive: false },
          { day: 1, event: 'Within hours, your entire wallet was emptied remotely', isPositive: false },
          { day: 2, event: 'The website disappeared — no trace of the company', isPositive: false },
          { day: 7, event: 'Filed police report — recovery of funds extremely unlikely', isPositive: false },
        ],
      },
      {
        text: 'Ignore and report the email as spam and phishing',
        qualityLevel: 'best',
        effects: { balance: 0, awareness: 20, security: 20, savings: 0 },
        feedback:
          'Correct. Guaranteed high returns are always a lie. By reporting it, you also helped protect others from the same scam. Never share your seed phrase with anyone, ever.',
        timeline: [
          { day: 1, event: 'You marked the email as phishing and reported it', isPositive: true },
          { day: 2, event: 'Your wallet and balance remain completely safe', isPositive: true },
          { day: 3, event: 'Security score increased — you recognized a major scam', isPositive: true },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════
  // 8. TASKS — Daily Budget Review (all roles)
  // ════════════════════════════════════════════════════════
  {
    title: 'Monthly Budget Review',
    role: 'all',
    source: 'tasks',
    category: 'Budgeting',
    description:
      'Your task reminder says: "Review your budget for this month." You have been spending more than planned on food and entertainment. What do you do?',
    difficulty: 'easy',
    riskPoints: 0,
    clues: [],
    preClickChecklist: [],
    potentialLosses: [],
    reasonQuestion: 'Why is reviewing your budget regularly important?',
    reasonOptions: [
      { text: 'Because small overspending compounds into large debt over time', isCorrect: true },
      { text: 'Because it helps you identify patterns and adjust before it is too late', isCorrect: true },
      { text: 'Because banks require monthly budget reviews', isCorrect: false },
      { text: 'Because budgets should change every single month', isCorrect: false },
    ],
    choices: [
      {
        text: 'Review spending, identify overspend categories, and adjust next month\'s limits',
        qualityLevel: 'best',
        effects: { balance: 0, awareness: 20, security: 5, savings: 30 },
        feedback:
          'Reviewing and adjusting is exactly what budgets are for. Identifying that food and entertainment exceeded the plan lets you course-correct before it becomes a debt problem.',
        timeline: [
          { day: 1, event: 'Reviewed budget — found food and entertainment over by 20%', isPositive: true },
          { day: 2, event: 'Set lower limits for both categories next month', isPositive: true },
          { day: 30, event: 'Next month\'s spending stayed within the adjusted limits', isPositive: true },
        ],
      },
      {
        text: 'Skip the review — it will be better next month automatically',
        qualityLevel: 'worst',
        mistakeTag: 'poor_budgeting',
        effects: { balance: -80, awareness: -10, security: 0, savings: -20 },
        feedback:
          'Budgets do not improve on their own. Without reviewing and adjusting, the same overspending pattern repeats until debt accumulates.',
        timeline: [
          { day: 1, event: 'Skipped the budget review and closed the reminder', isPositive: false },
          { day: 15, event: 'Overspend continued — same pattern, no adjustment made', isPositive: false },
          { day: 30, event: 'Month ended with a deficit — had to pull from savings', isPositive: false },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════
  // 9. INBOX — Fake Scholarship (Student only)
  // ════════════════════════════════════════════════════════
  {
    title: 'Fake Scholarship Email',
    role: 'student',
    source: 'inbox',
    category: 'Phishing',
    description:
      'You receive an exciting email: you have been selected for a $5,000 scholarship! There is just one condition — you need to pay a $50 "processing fee" to release the funds.',
    difficulty: 'easy',
    riskPoints: 20,
    emailMeta: {
      sender: 'scholarships-global-fund@outlook.com',
      subject: 'Congratulations! You have been selected for a $5,000 Scholarship',
      preview: 'Pay the $50 processing fee to release your scholarship funds within 48 hours...',
      riskBadge: 'suspicious',
    },
    clues: [
      { label: 'Upfront fee requirement', description: 'Real scholarships NEVER ask you to pay money to receive money.' },
      { label: 'Unofficial email domain', description: 'Legitimate scholarship bodies use official institutional domains, not @outlook.com.' },
      { label: 'No application memory', description: 'You never applied for this scholarship — so how were you selected?' },
      { label: 'Time pressure', description: '"Within 48 hours" is designed to rush you before you think clearly.' },
    ],
    preClickChecklist: [
      'Did you actually apply for this scholarship?',
      'Does the sender email match an official institution?',
      'Is there a fee required to receive money?',
      'Have you verified this with your school\'s financial aid office?',
    ],
    potentialLosses: ['$50 processing fee', 'Bank details used in the fee payment'],
    reasonQuestion: 'Why do real scholarships never require a processing fee?',
    reasonOptions: [
      { text: 'Because legitimate organizations already have funds ready to disburse', isCorrect: true },
      { text: 'Because requiring fees before payment is the definition of an advance-fee scam', isCorrect: true },
      { text: 'Because scholarships are always free to apply for', isCorrect: false },
      { text: 'Because international scholarships are always scams', isCorrect: false },
    ],
    choices: [
      {
        text: 'Pay the $50 fee to claim the $5,000 scholarship',
        qualityLevel: 'worst',
        mistakeTag: 'phishing',
        effects: { balance: -50, awareness: -20, security: -20, savings: 0 },
        feedback:
          'This is an advance-fee scam — one of the oldest tricks in the book. There is no $5,000. The $50 is gone, and your payment details may now be compromised.',
        timeline: [
          { day: 1, event: 'You paid the $50 "processing fee"', isPositive: false },
          { day: 2, event: 'No scholarship funds arrived — messages went unanswered', isPositive: false },
          { day: 3, event: 'Email address bounced — the sender had disappeared', isPositive: false },
          { day: 5, event: 'Reported to university — they confirmed it was a known scam', isPositive: false },
        ],
      },
      {
        text: 'Verify the scholarship directly with your university\'s financial aid office',
        qualityLevel: 'best',
        effects: { balance: 0, awareness: 20, security: 20, savings: 0 },
        feedback:
          'Exactly right. Your financial aid office confirmed this email is a known scam circulating among students. Always verify unexpected awards through official institutional channels.',
        timeline: [
          { day: 1, event: 'You forwarded the email to the financial aid office for verification', isPositive: true },
          { day: 2, event: 'Office confirmed it is a known advance-fee scholarship scam', isPositive: true },
          { day: 3, event: 'University sent a warning to all students — you helped protect peers', isPositive: true },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════
  // 10. INBOX — Suspicious Client (Freelancer only)
  // ════════════════════════════════════════════════════════
  {
    title: 'Overpayment Scam from New Client',
    role: 'freelancer',
    source: 'inbox',
    category: 'Fraud Prevention',
    description:
      'A new client says they will pay you $3,000 upfront via cheque — but they immediately ask you to refund $1,500 because they "accidentally overpaid." They need the refund before the cheque clears.',
    difficulty: 'hard',
    riskPoints: 25,
    emailMeta: {
      sender: 'john.client2024@protonmail.com',
      subject: 'Project Payment — Please Refund Overpayment ASAP',
      preview: 'I have sent $3,000 by mistake. Please refund the extra $1,500 to my PayPal immediately...',
      riskBadge: 'suspicious',
    },
    clues: [
      { label: 'Overpayment before work', description: 'No legitimate client pays before the project is scoped or started.' },
      { label: 'Urgent refund request', description: 'The urgency to refund before the cheque clears is the core of the scam.' },
      { label: 'Cheque vs PayPal mismatch', description: 'Paid by cheque but wants refund to PayPal — different channels hide the fraud.' },
      { label: 'Proton mail domain', description: 'Anonymous email services are commonly used by scammers to avoid tracing.' },
    ],
    preClickChecklist: [
      'Has the cheque fully cleared in your bank account yet?',
      'Why would a client overpay before work even starts?',
      'Why are they asking for a refund to a different payment method?',
      'Have you verified this client through any other channel?',
    ],
    potentialLosses: ['$1,500 refund amount', 'Bank fees from bounced cheque', 'Personal banking details'],
    reasonQuestion: 'Why must you wait for a cheque to fully clear before any refund?',
    reasonOptions: [
      { text: 'Because cheques can bounce days after they appear to clear', isCorrect: true },
      { text: 'Because a refund before clearing means you pay from your own funds', isCorrect: true },
      { text: 'Because PayPal refunds are always irreversible', isCorrect: false },
      { text: 'Because banks hold all cheques for 30 days by law', isCorrect: false },
    ],
    choices: [
      {
        text: 'Refund the $1,500 immediately by PayPal as the client asked',
        qualityLevel: 'worst',
        mistakeTag: 'fraud',
        effects: { balance: -1500, awareness: -20, security: -30, savings: 0 },
        feedback:
          'The cheque bounced 5 days later — it was fake. The $1,500 you refunded came from your own balance. This is the overpayment scam — a common attack against freelancers.',
        timeline: [
          { day: 1, event: 'You transferred $1,500 to the "client\'s" PayPal', isPositive: false },
          { day: 5, event: 'Cheque bounced — the bank reversed the $3,000 deposit', isPositive: false },
          { day: 6, event: 'Net loss: $1,500 from your own balance, plus bank fees', isPositive: false },
          { day: 10, event: 'Client and their email vanished — no recovery possible', isPositive: false },
        ],
      },
      {
        text: 'Wait for the cheque to fully clear (5+ business days) before any refund',
        qualityLevel: 'best',
        effects: { balance: 0, awareness: 25, security: 25, savings: 0 },
        feedback:
          'Correct. A cheque showing in your account does NOT mean it has cleared. Legitimate clients always understand bank processing times. Waiting saved you $1,500.',
        timeline: [
          { day: 1, event: 'You told the client you will process any refund after the cheque clears', isPositive: true },
          { day: 2, event: 'Client became aggressive and insisted on immediate refund — red flag confirmed', isPositive: true },
          { day: 5, event: 'Cheque bounced — you owed nothing and lost nothing', isPositive: true },
          { day: 6, event: 'You reported the scam to protect other freelancers', isPositive: true },
        ],
      },
      {
        text: 'Decline the project entirely and block the contact',
        qualityLevel: 'best',
        effects: { balance: 0, awareness: 20, security: 20, savings: 0 },
        feedback:
          'When something feels off, trust your instincts. Declining before any money changed hands is a completely valid and safe response. Better to lose a fake client than real money.',
        timeline: [
          { day: 1, event: 'You declined the project and blocked the contact', isPositive: true },
          { day: 2, event: 'Balance and savings completely protected', isPositive: true },
          { day: 3, event: 'You warned other freelancers in your community about this scam', isPositive: true },
        ],
      },
    ],
  },
];

export const seedScenarios = async (): Promise<void> => {
  await Scenario.deleteMany({});
  await Scenario.insertMany(scenarioSeedData);
  console.log(`✅  Seeded ${scenarioSeedData.length} scenarios`);
};
