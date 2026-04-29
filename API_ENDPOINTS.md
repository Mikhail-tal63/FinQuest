# FinQuest API Documentation

This document provides a comprehensive list of all available API endpoints for the FinQuest financial literacy platform.

**Base URL:** `http://localhost:5000` (Default)
**Content-Type:** `application/json`

---

## 📋 General

### Health Check
- **Endpoint:** `GET /health`
- **Description:** Checks if the server is running and returns the current timestamp.
- **Response:**
  ```json
  {
    "status": "ok",
    "timestamp": "2024-04-28T12:00:00.000Z"
  }
  ```

---

## 👤 User Endpoints

### Create User
- **Endpoint:** `POST /api/users`
- **Description:** Initializes a new player profile with default stats (Balance: 1000, Scores: 50).
- **Body:**
  ```json
  {
    "name": "string (required)",
    "role": "student | employee | freelancer (required)"
  }
  ```
- **Response:** Returns the created user object.

### Get User
- **Endpoint:** `GET /api/users/:id`
- **Description:** Retrieves a user's current profile, including scores and a list of completed scenarios.
- **Path Parameters:**
  - `id`: The MongoDB `_id` of the user.

---

## 🎮 Scenario Endpoints

### Get Scenarios (List)
- **Endpoint:** `GET /api/scenarios`
- **Description:** Retrieves a list of available scenarios.
- **Query Parameters:**
  - `role`: Filter by user role (`student`, `employee`, `freelancer`).
  - `source`: Filter by panel (`inbox`, `wallet`, `bills`, `tasks`, `phone`, `savings`).
- **Response:** Returns an array of scenario objects.

### Get Scenario by ID
- **Endpoint:** `GET /api/scenarios/:id`
- **Description:** Retrieves full details for a specific scenario, including choices, clues, and reason options.
- **Path Parameters:**
  - `id`: The scenario ID.

### Answer Scenario
- **Endpoint:** `POST /api/scenarios/answer`
- **Description:** Submits a choice for a scenario. This triggers the game engine to calculate effects (XP, Balance, Scores), records an attempt, and awards potential badges.
- **Body:**
  ```json
  {
    "userId": "string (required)",
    "scenarioId": "string (required)",
    "choiceIndex": "number (required)",
    "reasonIndex": "number (optional)"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "attempt": { ... },
      "updatedUser": { ... },
      "timeline": [ ... ],
      "newBadges": [ ... ]
    }
  }
  ```

---

## 💳 Bill Endpoints

### Get User Bills
- **Endpoint:** `GET /api/bills/:userId`
- **Description:** Returns all bills (paid, due, or overdue) associated with a user, sorted by due date.
- **Path Parameters:**
  - `userId`: The user's ID.

### Pay Bill
- **Endpoint:** `POST /api/bills/pay`
- **Description:** Deducts the bill amount from user balance, marks it as paid, reduces risk level, and logs a transaction.
- **Body:**
  ```json
  {
    "userId": "string (required)",
    "billId": "string (required)"
  }
  ```

---

## 💸 Transaction Endpoints

### Get User Transactions
- **Endpoint:** `GET /api/transactions/:userId`
- **Description:** Retrieves the history of income and expenses for a specific user, sorted from newest to oldest.
- **Path Parameters:**
  - `userId`: The user's ID.

---

## 📊 Report Endpoints

### Generate Report
- **Endpoint:** `GET /api/report/:userId`
- **Description:** The "End of Game" endpoint. Analyzes all user attempts and transactions to generate a deep-dive financial health report.
- **Path Parameters:**
  - `userId`: The user's ID.
- **Included Data:**
  - Final Scores (Awareness, Security, Decision Quality, etc.)
  - Mistake Memory (Analysis of recurring bad habits)
  - Strengths & Weaknesses (Based on category performance)
  - Personalized Tips (Based on role and mistakes)
  - Earned Badges
  - Recent Transactions

---

## 🗄️ Core Data Models (Summary)

| Model | Key Fields |
| :--- | :--- |
| **User** | balance, awarenessScore, securityScore, riskLevel, xp, mistakeTags |
| **Scenario** | title, role, source, clues, choices, reasonOptions |
| **Bill** | title, amount, dueDate, status, category |
| **Attempt** | selectedChoiceIndex, qualityLevel, xpGained, feedback |
| **Transaction** | title, amount, type (income/expense), category, date |
| **Badge** | name, icon, conditionType, requiredScore |
