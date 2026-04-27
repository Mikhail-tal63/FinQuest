import Scenario from '../models/Scenario';

export const scenarioSeedData = [
  // ── Scenario 1: Suspicious email ────────────────────────────────────────
  {
    title: 'Suspicious Bank Email',
    role: 'all',
    source: 'inbox',
    category: 'Phishing',
    description:
      'You received an email claiming to be from your bank, asking you to click a link and update your card details immediately or your account will be suspended.',
    difficulty: 'easy',
    choices: [
      {
        text: 'Click the link and enter your details',
        isCorrect: false,
        effects: { balance: -200, awareness: -15, security: -25, savings: 0 },
        feedback:
          'You fell for a phishing attack. Real banks never ask for card details via email links.',
      },
      {
        text: 'Ignore the email and delete it',
        isCorrect: false,
        effects: { balance: 0, awareness: 5, security: 5, savings: 0 },
        feedback:
          'Better than clicking, but you should report phishing emails to protect others.',
      },
      {
        text: 'Call the bank directly using the official number on their website',
        isCorrect: true,
        effects: { balance: 0, awareness: 20, security: 20, savings: 0 },
        feedback:
          'Excellent! Always verify suspicious messages through official channels.',
      },
    ],
  },
  // ── Scenario 2: Budget allocation ────────────────────────────────────────
  {
    title: 'Monthly Budget Decision',
    role: 'all',
    source: 'wallet',
    category: 'Budgeting',
    description:
      'You just received your monthly income. You have bills, groceries, entertainment, and savings goals. What do you do first?',
    difficulty: 'medium',
    choices: [
      {
        text: 'Spend on entertainment first, then pay bills with what is left',
        isCorrect: false,
        effects: { balance: -150, awareness: -10, security: -5, savings: -50 },
        feedback: 'Paying yourself in fun first often leaves you short for essentials.',
      },
      {
        text: 'Pay all bills, set aside savings, then budget entertainment from the rest',
        isCorrect: true,
        effects: { balance: 0, awareness: 20, security: 10, savings: 50 },
        feedback: 'This is the 50/30/20 rule in action – needs, savings, wants.',
      },
      {
        text: 'Put everything in savings and skip bills for this month',
        isCorrect: false,
        effects: { balance: -100, awareness: -5, security: -15, savings: 100 },
        feedback: 'Skipping bills causes late fees and damages your credit history.',
      },
    ],
  },
  // ── Scenario 3: Overdue bill ────────────────────────────────────────────
  {
    title: 'Overdue Internet Bill',
    role: 'all',
    source: 'bills',
    category: 'Bill Management',
    description:
      'Your internet bill is 2 weeks overdue. If you pay now there is a small late fee. If you delay further, your service will be cut off.',
    difficulty: 'easy',
    choices: [
      {
        text: 'Pay now including the late fee',
        isCorrect: true,
        effects: { balance: -30, awareness: 15, security: 5, savings: 0 },
        feedback: 'Good. Paying now avoids service interruption and a bigger penalty later.',
      },
      {
        text: "Wait another week – maybe the fee will go away",
        isCorrect: false,
        effects: { balance: -70, awareness: -10, security: -10, savings: 0 },
        feedback: 'The fee doubled and your internet was suspended. Always pay bills on time.',
      },
    ],
  },
  // ── Scenario 4: Tempting offer ───────────────────────────────────────────
  {
    title: 'Flash Sale Temptation',
    role: 'all',
    source: 'phone',
    category: 'Impulse Spending',
    description:
      'A notification announces a 24-hour flash sale on a gadget you have been eyeing. It is 40% off but you would need to dip into your emergency fund to buy it.',
    difficulty: 'medium',
    choices: [
      {
        text: 'Buy it immediately – deals like this are rare!',
        isCorrect: false,
        effects: { balance: -300, awareness: -10, security: -20, savings: -100 },
        feedback:
          'Impulse buying from your emergency fund leaves you vulnerable to real emergencies.',
      },
      {
        text: 'Skip it – you need the emergency fund intact',
        isCorrect: true,
        effects: { balance: 0, awareness: 15, security: 15, savings: 10 },
        feedback:
          'Great self-control. An emergency fund is for emergencies, not sales.',
      },
      {
        text: 'Buy a cheaper alternative within your regular budget',
        isCorrect: true,
        effects: { balance: -80, awareness: 10, security: 5, savings: 5 },
        feedback:
          'Reasonable compromise – you satisfied the want without touching your safety net.',
      },
    ],
  },
  // ── Scenario 5: Wire transfer request ────────────────────────────────────
  {
    title: 'Urgent Transfer Request',
    role: 'all',
    source: 'phone',
    category: 'Fraud Prevention',
    description:
      'A text from an unknown number claims to be your cousin who is stranded abroad. They ask you to transfer money urgently and promise to repay you tomorrow.',
    difficulty: 'medium',
    choices: [
      {
        text: 'Transfer the money immediately',
        isCorrect: false,
        effects: { balance: -500, awareness: -20, security: -30, savings: 0 },
        feedback: 'This is a classic social engineering scam. Always verify identity through another channel.',
      },
      {
        text: 'Call your cousin on their known number to verify',
        isCorrect: true,
        effects: { balance: 0, awareness: 25, security: 25, savings: 0 },
        feedback: 'Perfect. Verifying through a known contact protects you from impersonation scams.',
      },
      {
        text: 'Ask them for a video call before sending',
        isCorrect: true,
        effects: { balance: 0, awareness: 20, security: 20, savings: 0 },
        feedback: 'Smart move – scammers usually cannot produce video proof.',
      },
    ],
  },
  // ── Scenario 6: Saving goal ───────────────────────────────────────────────
  {
    title: 'Building Your Emergency Fund',
    role: 'all',
    source: 'savings',
    category: 'Saving',
    description:
      'A financial advisor recommends having 3–6 months of expenses saved. Your fund currently covers 1 month. How do you approach closing the gap?',
    difficulty: 'medium',
    choices: [
      {
        text: 'Transfer a fixed 10% of income to savings each month automatically',
        isCorrect: true,
        effects: { balance: 0, awareness: 20, security: 10, savings: 100 },
        feedback: 'Automating savings is one of the most effective habits you can build.',
      },
      {
        text: 'Save whatever is left at the end of the month',
        isCorrect: false,
        effects: { balance: 0, awareness: 5, security: 0, savings: 10 },
        feedback: 'Left-over savings are unreliable. Pay yourself first.',
      },
      {
        text: 'Invest everything in stocks for faster growth',
        isCorrect: false,
        effects: { balance: -100, awareness: 0, security: -10, savings: -20 },
        feedback:
          'Stocks can lose value. An emergency fund should be liquid and stable, not in the market.',
      },
    ],
  },
  // ── Scenario 7: Unexpected expense ──────────────────────────────────────
  {
    title: 'Car Repair Emergency',
    role: 'employee',
    source: 'phone',
    category: 'Emergency Fund',
    description:
      'Your car breaks down and the repair costs more than expected. You have an emergency fund covering exactly this amount.',
    difficulty: 'easy',
    choices: [
      {
        text: 'Use the emergency fund for the repair',
        isCorrect: true,
        effects: { balance: -200, awareness: 15, security: 10, savings: -50 },
        feedback: 'This is exactly what an emergency fund is for. Rebuild it gradually next month.',
      },
      {
        text: 'Put it on a high-interest credit card',
        isCorrect: false,
        effects: { balance: -250, awareness: -10, security: -10, savings: 0 },
        feedback: 'Credit card interest makes this much more expensive in the long run.',
      },
    ],
  },
  // ── Scenario 8: Fake investment ──────────────────────────────────────────
  {
    title: 'Too-Good Investment Offer',
    role: 'all',
    source: 'inbox',
    category: 'Investment Scams',
    description:
      'An email promises 300% returns in 30 days by investing in a "guaranteed" crypto fund. They ask for your seed phrase to get started.',
    difficulty: 'easy',
    choices: [
      {
        text: 'Share your seed phrase and invest',
        isCorrect: false,
        effects: { balance: -1000, awareness: -25, security: -40, savings: -100 },
        feedback:
          'NEVER share your seed phrase with anyone. Your entire wallet is now compromised.',
      },
      {
        text: 'Ignore and report the email as spam',
        isCorrect: true,
        effects: { balance: 0, awareness: 20, security: 20, savings: 0 },
        feedback:
          'Correct. Guaranteed high returns are always a red flag. Real investments carry risk.',
      },
    ],
  },
  // ── Scenario 9: Fake scholarship (student only) ──────────────────────────
  {
    title: 'Fake Scholarship Email',
    role: 'student',
    source: 'inbox',
    category: 'Phishing',
    description:
      'You get an email saying you won a $5,000 scholarship. They ask you to pay a $50 "processing fee" to release the funds.',
    difficulty: 'easy',
    choices: [
      {
        text: 'Pay the $50 fee to get the scholarship',
        isCorrect: false,
        effects: { balance: -50, awareness: -20, security: -20, savings: 0 },
        feedback:
          'Legitimate scholarships never charge fees. This is called an advance-fee scam.',
      },
      {
        text: 'Verify with your school\'s financial aid office',
        isCorrect: true,
        effects: { balance: 0, awareness: 20, security: 20, savings: 0 },
        feedback: 'Always verify awards through official institutional channels.',
      },
    ],
  },
  // ── Scenario 10: Fake client (freelancer only) ───────────────────────────
  {
    title: 'Suspicious New Client',
    role: 'freelancer',
    source: 'inbox',
    category: 'Fraud Prevention',
    description:
      'A "client" wants to pay you $3,000 upfront via cheque, but then asks you to refund $1,500 because they "overpaid." They rush you to act before the cheque clears.',
    difficulty: 'hard',
    choices: [
      {
        text: 'Refund the $1,500 immediately as requested',
        isCorrect: false,
        effects: { balance: -1500, awareness: -20, security: -30, savings: 0 },
        feedback: 'The cheque will bounce and the $1,500 you refunded is gone. Classic overpayment scam.',
      },
      {
        text: 'Wait for the cheque to fully clear before any refund',
        isCorrect: true,
        effects: { balance: 0, awareness: 25, security: 25, savings: 0 },
        feedback: 'Always wait for funds to fully clear. Legitimate clients understand bank processing times.',
      },
      {
        text: 'Decline the project and block the contact',
        isCorrect: true,
        effects: { balance: 0, awareness: 20, security: 20, savings: 0 },
        feedback: 'When something feels off, trust your instincts. Declining protects you from risk.',
      },
    ],
  },
];

export const seedScenarios = async (): Promise<void> => {
  await Scenario.deleteMany({});
  await Scenario.insertMany(scenarioSeedData);
  console.log(`✅  Seeded ${scenarioSeedData.length} scenarios`);
};
