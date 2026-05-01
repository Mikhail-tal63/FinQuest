# FinQuest — Product Requirements Document

**Version:** 1.0  
**Date:** May 2026  
**Status:** In Development

---

## 1. Overview

FinQuest is a browser-based financial literacy simulation game. Players live through a virtual month managing real financial decisions: handling scam emails, paying bills, managing subscriptions, and dealing with unexpected financial threats. The goal is to end the month without falling into debt.

The product is designed to build practical financial awareness through consequence-driven gameplay rather than passive instruction. Every decision has a visible, immediate effect on the player's balance and scores.

---

## 2. Problem Statement

Most people lack exposure to real financial threat scenarios until they encounter them in real life — often at great cost. Phishing emails, investment scams, impersonation fraud, and poor expense management are the leading causes of avoidable financial loss, yet they are rarely taught in schools or traditional financial literacy programs.

FinQuest solves this by putting users inside a simulated financial environment where mistakes are safe to make and learn from.

---

## 3. Target Users

| Persona | Description |
|---|---|
| Students | Early in their financial lives, learning basic budgeting and scam awareness |
| Employees | Managing a regular salary, bills, and workplace financial decisions |
| Freelancers | Handling variable income, software tool expenses, and irregular cash flow |

---

## 4. Core Concept

The player selects a persona at the start of each session. Each persona has a different monthly salary and expense profile. A simulated month (30 game days) then runs in real time — 1 real minute equals 1 game day.

Throughout the month, financial scenarios arrive in the player's inbox on scheduled days. The player must identify and respond to each scenario correctly. At the end of Day 30, a month-end report is generated showing whether the player survived financially.

**Win condition:** End-of-month balance (salary minus expenses minus scenario losses) is greater than or equal to zero.

---

## 5. Personas & Salary

| Persona | Monthly Salary | Typical Mandatory Expenses |
|---|---|---|
| Student | $1,200 | Rent $600, Electricity $40, Internet $65, Phone $30, Groceries $200 |
| Employee | $3,500 | Rent $1,200, Electricity $80, Internet $65, Phone $50, Groceries $400, Transport $120 |
| Freelancer | $2,800 | Rent $1,000, Electricity $70, Internet $65, Phone $45, Groceries $350, Tools $50 |

Each persona also has a set of optional subscriptions (Netflix, Spotify, Gym, Amazon Prime, etc.) that the player can toggle on or off in the Bills screen. Active optional expenses are deducted at month-end.

---

## 6. Game Screens

The interface is modelled after a desktop operating system. A dock on the left provides navigation between screens. A persistent menubar at the top shows the current game day, month, time, and a month-progress bar.

### 6.1 Persona Screen
The entry point. Player selects one of three personas (Student, Employee, Freelancer). Selecting a persona creates a session, loads all scenarios, credits the monthly salary, and opens the Inbox.

### 6.2 Inbox Screen
The main gameplay surface. Displays all email-type scenarios that have arrived so far (based on `scheduledDay <= gameDay`). Future emails are shown as locked placeholders with their arrival day.

Each email can be:
- **A phishing/scam email** — contains a suspicious link. Clicking the link opens a realistic form modal (PhishingFormModal) where the player can enter fake credentials. Submitting the form = falling for the scam (worst outcome). The toolbar also offers "Report as Phishing" and "Ignore Email" (both trigger the best outcome).
- **A financial decision email** — presents multiple-choice options directly in the email body. The player picks a response.

Scenarios already answered are shown as read (greyed) and marked "Handled."

**Dock badge:** Shows the count of unanswered inbox/wallet scenarios that have arrived.

### 6.3 Bills Screen
Shows the player's full monthly expense profile, split into two sections:

- **Mandatory bills** — always deducted at month-end, cannot be toggled. Displayed with a lock icon.
- **Optional subscriptions** — each item has a toggle. Turning one off removes it from the month-end calculation. Active optional items are labelled "Active · will be deducted"; cancelled items are crossed out.

A summary bar at the top shows: Total Going Out · Monthly Salary · Left After Bills.
A progress bar visualises the split between mandatory (blue) and active optional (violet) spending.

No scenario interaction happens here — Bills is a planning and management screen only.

### 6.4 Wallet Screen
Shows the player's bank card and transaction history. Contains:

- **Bank card** — displays current balance, monthly salary, masked card number, cardholder name, and expiry. Animates to a frozen/greyed state if the account is frozen.
- **Monthly Income tile** — salary credited on Day 1.
- **Net This Month tile** — sum of all scenario-driven balance changes (positive or negative).
- **Virtual Card** — a secondary card with a Freeze button. Freezing blocks all transactions and adds a freeze entry to the transaction log.
- **Transaction feed** — a chronological list of all balance changes from answered scenarios, colour-coded (red for losses, green for gains).
- **Fraud alert banner** — appears when a debit transaction is recorded, with a shortcut to freeze the account.

### 6.5 Profile Screen
Displays the player's current persona, XP total, level, XP progress bar toward the next level, and Awareness Score.

### 6.6 Final Report (Month-End)
Triggered automatically when `gameDay > 30`. Shows:

- **Verdict banner** — green "You survived the month!" or red "You ended the month in debt", with the net balance.
- **Monthly Breakdown** — line-by-line: Salary In → Mandatory Expenses → Optional Expenses → Scenario Effects → End-of-Month Balance.
- **XP Earned** — total XP accumulated across all scenario answers.
- **Security & Awareness Scores** — pulled from the backend session result.
- **Scenario Outcomes** — a list of every scenario answered with its result (correct / incorrect / partial).
- **Play Again** — restart with the same persona or choose a new one.

---

## 7. Scenario System

### 7.1 Scenario Sources
| Source | Where it appears |
|---|---|
| `inbox` | Inbox screen as an email |
| `wallet` | Inbox screen (wallet-type financial decisions shown in the email flow) |

### 7.2 Scenario Types

| Type | Description | Day |
|---|---|---|
| `phishing_bank` | Fake bank suspension email with credential-harvesting link | 3 |
| `phishing_grant` | Fake government grant claim form | 8 |
| `salary_update` | Payroll phishing — fake HR update requesting bank details | 14 |
| `investment_scam` | Guaranteed-return investment pitch | 17 |
| `tax_refund` | Fake tax refund claim portal | 23 |
| `account_verification` | Fake freelance platform re-verification | 27 |
| `prize_notification` | "You're our millionth visitor" credit card scam | 11 |
| `income_budgeting` | Salary allocation decision (wallet source) | 2 |

### 7.3 Choice Quality Levels
Every scenario has exactly three choices, each tagged with a quality level:

| Level | Meaning |
|---|---|
| `best` | Correct, cautious response — maximum XP and score gains |
| `average` | Partially correct — partial XP, no negative effects |
| `worst` | Falls for the scam or makes the worst financial decision — balance loss, score penalties |

### 7.4 Phishing Form Modal
Inbox scenarios of phishing type (bank, grant, salary, investment, tax, account verification, prize) render a realistic-looking form inside a modal when the player clicks the email's call-to-action link. The form fields vary per scenario type (e.g. bank credentials, grant personal info, payroll bank details). Submitting the form triggers the `worst` choice. Closing the modal without submitting does nothing — the player can still choose Report or Ignore from the toolbar.

---

## 8. Scoring System

Each scenario answer applies effects to the player's session:

| Effect | What it tracks |
|---|---|
| `xp` | Experience points — used for level progression in Profile |
| `securityScore` | How well the player protects their accounts (0–100) |
| `awarenessScore` | How well the player identifies financial threats (0–100) |
| `balance` | Direct monetary impact — credited or debited from the account |

Balance effects are the primary win/lose mechanic. XP and scores are secondary tracking for educational feedback.

---

## 9. Time System

The game clock runs as long as a session is active:

- **1 real minute = 1 game day**
- The clock ticks every ~2.5 real seconds (1 game hour), incrementing the in-game hour
- When the hour reaches 23, the day increments and the hour resets to 0
- Scenarios with `scheduledDay <= gameDay` become visible and interactive
- When `gameDay > 30`, the session ends and the Final Report is shown automatically

The GameClock component in the menubar always shows: `Day X · Month Year · HH:00` with a month progress bar and a "Month ending soon" warning from Day 26 onward.

---

## 10. Technical Architecture

### 10.1 Frontend
- **Framework:** React + TypeScript (Vite)
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** Single React context (`FinQuestContext`) — manages user, session, all scenarios, answered IDs, game clock, transactions, account freeze state, and optional expense toggles
- **Key components:** `DesktopLayout`, `Dock`, `GameClock`, `InboxScreen`, `BillsScreen`, `WalletScreen`, `ProfileScreen`, `FinalReport`, `PhishingFormModal`, `ResultModal`

### 10.2 Backend
- **Runtime:** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **Models:** `User`, `Session`, `Scenario`, `Attempt`
- **Key services:** `sessionService` (start session, submit answer, get scenarios, get result)

### 10.3 API Endpoints
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/users` | List seeded users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/session/start` | Start a new session, reset balance to salary |
| POST | `/api/session/:id/answer` | Submit answer for a scenario |
| GET | `/api/session/:id/scenarios` | Get all scenarios for a session |
| GET | `/api/session/:id/result` | Get month-end report |

### 10.4 Data Seeding
Running `npm run seed` from `/server` drops and repopulates:
- 3 users (one per persona)
- 8 scenarios with scheduled days, choice data, and effects

---

## 11. Month-End Balance Calculation

The final balance is calculated client-side at the end of the month:

```
finalBalance = salary
             - mandatoryExpenses
             - activeOptionalExpenses
             + sum(scenario balance effects)
```

- `salary` — set per persona at session start
- `mandatoryExpenses` — always applied (player cannot disable them)
- `activeOptionalExpenses` — only those not in `optionalOff` set
- `scenario balance effects` — accumulated from `transactions` in context (each scenario answer with a non-zero balance effect adds a transaction)

If `finalBalance >= 0`, the player survived. If `< 0`, they ended the month in debt.

---

## 12. Out of Scope (Current Version)

- User authentication / accounts (sessions are anonymous and ephemeral)
- Multiplayer or leaderboards
- Mobile layout (desktop-first only)
- More than one month of gameplay per session
- Dynamic or AI-generated scenarios
- Real financial data integrations

---

## 13. Potential Future Features

- **More scenario types:** rent negotiation, job offer evaluation, peer lending, insurance decisions
- **Difficulty modes:** Easy (more time per day), Hard (more scenarios, tighter margins)
- **Streak & achievement system:** rewards for completing months without falling for any scam
- **Scenario editor:** admin UI for adding new scenarios without code changes
- **Analytics dashboard:** track which scenarios players get wrong most often
- **Multiplayer mode:** compete with a friend to see who ends the month with a higher balance
