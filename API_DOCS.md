# FinQuest API Documentation

Base URL: `http://localhost:5020/api`

All responses follow the envelope:
```json
{ "success": true,  "data": { ... } }
{ "success": false, "message": "Error description" }
```

---

## Table of Contents

1. [Health](#health)
2. [Users](#users)
3. [Scenarios](#scenarios)
4. [Session](#session)
5. [Data Models](#data-models)
6. [Error Codes](#error-codes)

---

## Health

### GET `/health`

Confirms the server is running.

**Response**
```json
{
  "status": "ok",
  "timestamp": "2026-04-29T10:00:00.000Z"
}
```

---

## Users

### GET `/users`

Returns all users in the database.

**Response**
```json
{
  "success": true,
  "data": [
    {
      "_id": "664a1b2c3d4e5f6a7b8c9d0e",
      "name": "Alex Johnson",
      "email": "alex.johnson@demo.com",
      "role": "employee",
      "balance": 5000,
      "xp": 0,
      "securityScore": 50,
      "awarenessScore": 50,
      "createdAt": "2026-04-29T10:00:00.000Z",
      "updatedAt": "2026-04-29T10:00:00.000Z"
    }
  ]
}
```

---

### GET `/users/:id`

Returns a single user by ID.

**Path Params**

| Param | Type   | Description |
|-------|--------|-------------|
| `id`  | string | MongoDB ObjectId |

**Response `200`**
```json
{
  "success": true,
  "data": {
    "_id": "664a1b2c3d4e5f6a7b8c9d0e",
    "name": "Alex Johnson",
    "email": "alex.johnson@demo.com",
    "role": "employee",
    "balance": 4800,
    "xp": 100,
    "securityScore": 62,
    "awarenessScore": 58
  }
}
```

**Response `404`**
```json
{ "success": false, "message": "User not found" }
```

---

### POST `/users`

Creates a new user.

**Request Body**

| Field     | Type   | Required | Notes |
|-----------|--------|----------|-------|
| `name`    | string | yes      | |
| `email`   | string | yes      | Must be unique |
| `role`    | string | yes      | `student` \| `employee` \| `freelancer` |
| `balance` | number | no       | Defaults to `5000` |

**Example Request**
```json
{
  "name": "Rania Ahmed",
  "email": "rania.ahmed@demo.com",
  "role": "student"
}
```

**Response `201`**
```json
{
  "success": true,
  "data": {
    "_id": "664a1b2c3d4e5f6a7b8c9d1f",
    "name": "Rania Ahmed",
    "email": "rania.ahmed@demo.com",
    "role": "student",
    "balance": 5000,
    "xp": 0,
    "securityScore": 50,
    "awarenessScore": 50
  }
}
```

**Response `400`**
```json
{ "success": false, "message": "Missing required fields: email" }
```

---

## Scenarios

### GET `/scenarios?source=inbox`

Returns all scenarios filtered by source. Used by the frontend inbox view.

**Query Params**

| Param    | Type   | Required | Notes |
|----------|--------|----------|-------|
| `source` | string | no       | `inbox` (default) \| `sms` \| `notification` |

**Response `200`**
```json
{
  "success": true,
  "data": [
    {
      "_id": "664b1c2d3e4f5a6b7c8d9e0f",
      "title": "Urgent: Your Account Has Been Suspended",
      "description": "You receive an email that reads...",
      "type": "phishing_bank",
      "source": "inbox",
      "emailMeta": {
        "sender": "noreply@banksecure-support.ru",
        "subject": "URGENT: Account Suspended – Action Required",
        "preview": "We detected suspicious activity on your account.",
        "riskBadge": "Phishing"
      },
      "realContext": "Legitimate banks never send verification links via email.",
      "difficulty": "easy",
      "targetRoles": ["student", "employee", "freelancer"],
      "choices": [
        {
          "text": "Delete the email and call your bank directly.",
          "qualityLevel": "best",
          "feedback": "Perfect. Calling your bank directly is the gold standard.",
          "timeline": [
            { "day": 1, "event": "You call your bank. They confirm your account is fine.", "isPositive": true }
          ],
          "effects": { "xp": 50, "securityScore": 10, "awarenessScore": 8, "balance": 0 }
        }
      ]
    }
  ]
}
```

---

### GET `/scenarios/:id`

Returns a single scenario by ID.

**Path Params**

| Param | Type   | Description |
|-------|--------|-------------|
| `id`  | string | MongoDB ObjectId |

**Response `200`** — same shape as a single item from the list above.

**Response `404`**
```json
{ "success": false, "message": "Scenario not found" }
```

---

### POST `/scenarios/answer`

> **Legacy stateless endpoint** — used by the frontend without a session. Applies effects directly to the user.

**Request Body**

| Field         | Type   | Required | Notes |
|---------------|--------|----------|-------|
| `userId`      | string | yes      | MongoDB ObjectId |
| `scenarioId`  | string | yes      | MongoDB ObjectId |
| `choiceIndex` | number | yes      | Zero-based index into `choices[]` |

**Example Request**
```json
{
  "userId": "664a1b2c3d4e5f6a7b8c9d0e",
  "scenarioId": "664b1c2d3e4f5a6b7c8d9e0f",
  "choiceIndex": 0
}
```

**Response `200`**
```json
{
  "success": true,
  "data": {
    "result": "correct",
    "qualityLevel": "best",
    "feedback": "Perfect. Calling your bank directly is the gold standard.",
    "timeline": [
      { "day": 1, "event": "You call your bank. They confirm your account is fine.", "isPositive": true },
      { "day": 2, "event": "Bank flags the scam domain and warns other customers.", "isPositive": true }
    ],
    "effectsApplied": {
      "xp": 50,
      "securityScore": 10,
      "awarenessScore": 8,
      "balance": 0
    },
    "updatedUser": {
      "_id": "664a1b2c3d4e5f6a7b8c9d0e",
      "balance": 5000,
      "xp": 50,
      "securityScore": 60,
      "awarenessScore": 58
    }
  }
}
```

---

## Session

The session API drives the sequential scenario flow. One session = one ordered run through role-matched scenarios.

```
POST /session/start
        ↓
GET  /session/:id/current   ←──────────┐
        ↓                              │
POST /session/:id/answer               │
        ↓                              │
  remainingScenarios > 0 ─────────────┘
        ↓
  remainingScenarios === 0
        ↓
GET  /session/:id/result
```

---

### POST `/session/start`

Creates a new session for a user. Scenarios are selected based on the user's role and shuffled for variety.

**Request Body**

| Field    | Type   | Required |
|----------|--------|----------|
| `userId` | string | yes      |

**Example Request**
```json
{ "userId": "664a1b2c3d4e5f6a7b8c9d0e" }
```

**Response `201`**
```json
{
  "success": true,
  "data": {
    "_id": "664c1d2e3f4a5b6c7d8e9f0a",
    "userId": "664a1b2c3d4e5f6a7b8c9d0e",
    "scenarioIds": [
      "664b1c2d3e4f5a6b7c8d9e0f",
      "664b1c2d3e4f5a6b7c8d9e1a",
      "664b1c2d3e4f5a6b7c8d9e2b"
    ],
    "currentIndex": 0,
    "status": "in_progress",
    "totalXP": 0,
    "startedAt": "2026-04-29T10:00:00.000Z"
  }
}
```

**Response `400`**
```json
{ "success": false, "message": "No scenarios available for this role" }
```

---

### GET `/session/:sessionId/current`

Returns the current scenario the user must respond to. Returns `null` when the session is complete.

**Path Params**

| Param       | Type   | Description |
|-------------|--------|-------------|
| `sessionId` | string | MongoDB ObjectId |

**Response `200` — scenario pending**
```json
{
  "success": true,
  "data": {
    "_id": "664b1c2d3e4f5a6b7c8d9e0f",
    "title": "Urgent: Your Account Has Been Suspended",
    "description": "You receive an email that reads...",
    "type": "phishing_bank",
    "source": "inbox",
    "emailMeta": {
      "sender": "noreply@banksecure-support.ru",
      "subject": "URGENT: Account Suspended – Action Required",
      "preview": "We detected suspicious activity on your account.",
      "riskBadge": "Phishing"
    },
    "choices": [
      {
        "text": "Delete the email and call your bank directly.",
        "qualityLevel": "best",
        "feedback": "Perfect. Calling your bank directly is the gold standard.",
        "timeline": [...],
        "effects": { "xp": 50, "securityScore": 10, "awarenessScore": 8, "balance": 0 }
      },
      {
        "text": "Click the link to check if the suspension is real.",
        "qualityLevel": "worst",
        "feedback": "Disaster. The fake site harvested your credentials.",
        "timeline": [...],
        "effects": { "xp": 0, "securityScore": -25, "awarenessScore": -5, "balance": -1200 }
      }
    ],
    "difficulty": "easy",
    "targetRoles": ["student", "employee", "freelancer"]
  }
}
```

**Response `200` — session complete**
```json
{ "success": true, "data": null }
```

---

### POST `/session/:sessionId/answer`

Submits the user's choice for the current scenario. Applies stat effects to the user, saves an attempt record, and advances the session to the next scenario.

**Path Params**

| Param       | Type   | Description |
|-------------|--------|-------------|
| `sessionId` | string | MongoDB ObjectId |

**Request Body**

| Field         | Type   | Required | Notes |
|---------------|--------|----------|-------|
| `choiceIndex` | number | yes      | Zero-based index into the current scenario's `choices[]` |

**Example Request**
```json
{ "choiceIndex": 0 }
```

**Response `200`**
```json
{
  "success": true,
  "data": {
    "result": "correct",
    "qualityLevel": "best",
    "feedback": "Perfect. Calling your bank directly is the gold standard.",
    "timeline": [
      { "day": 1, "event": "You call your bank. They confirm your account is fine.", "isPositive": true },
      { "day": 2, "event": "Bank flags the scam domain and warns other customers.", "isPositive": true },
      { "day": 7, "event": "Your security score climbs — no breach detected.", "isPositive": true }
    ],
    "effectsApplied": {
      "xp": 50,
      "securityScore": 10,
      "awarenessScore": 8,
      "balance": 0
    },
    "updatedUser": {
      "_id": "664a1b2c3d4e5f6a7b8c9d0e",
      "balance": 5000,
      "xp": 50,
      "securityScore": 60,
      "awarenessScore": 58
    },
    "sessionStatus": "in_progress",
    "remainingScenarios": 2
  }
}
```

**`result` values**

| Value       | Meaning |
|-------------|---------|
| `correct`   | User chose the `best` option |
| `partial`   | User chose the `average` option |
| `incorrect` | User chose the `worst` option |

**`sessionStatus` values**

| Value         | Meaning |
|---------------|---------|
| `in_progress` | More scenarios remain |
| `completed`   | All scenarios answered — fetch `/result` next |

**Response `400` — already completed**
```json
{ "success": false, "message": "Session already completed" }
```

---

### GET `/session/:sessionId/result`

Returns the full session report. Can be called at any point but is most useful after `sessionStatus === "completed"`.

**Path Params**

| Param       | Type   | Description |
|-------------|--------|-------------|
| `sessionId` | string | MongoDB ObjectId |

**Response `200`**
```json
{
  "success": true,
  "data": {
    "session": {
      "_id": "664c1d2e3f4a5b6c7d8e9f0a",
      "status": "completed",
      "totalXP": 175,
      "scenariosTotal": 3,
      "scenariosCompleted": 3,
      "startedAt": "2026-04-29T10:00:00.000Z",
      "completedAt": "2026-04-29T10:12:00.000Z"
    },
    "finalStats": {
      "balance": 5000,
      "xp": 175,
      "securityScore": 73,
      "awarenessScore": 66
    },
    "attempts": [
      {
        "scenario": {
          "title": "Urgent: Your Account Has Been Suspended",
          "type": "phishing_bank",
          "difficulty": "easy"
        },
        "selectedChoice": 0,
        "qualityLevel": "best",
        "result": "correct",
        "effectsApplied": {
          "xp": 50,
          "securityScore": 10,
          "awarenessScore": 8,
          "balance": 0
        }
      },
      {
        "scenario": {
          "title": "Government Educational Grant – Claim $3,500",
          "type": "phishing_grant",
          "difficulty": "medium"
        },
        "selectedChoice": 1,
        "qualityLevel": "worst",
        "result": "incorrect",
        "effectsApplied": {
          "xp": 0,
          "securityScore": -30,
          "awarenessScore": -10,
          "balance": -850
        }
      }
    ]
  }
}
```

---

## Data Models

### User

| Field            | Type   | Default | Notes |
|------------------|--------|---------|-------|
| `name`           | string | —       | Required |
| `email`          | string | —       | Required, unique |
| `role`           | string | `employee` | `student` \| `employee` \| `freelancer` |
| `balance`        | number | `5000`  | |
| `xp`             | number | `0`     | Accumulates across all sessions |
| `securityScore`  | number | `50`    | Clamped `0–100` |
| `awarenessScore` | number | `50`    | Clamped `0–100` |

---

### Scenario

| Field         | Type     | Notes |
|---------------|----------|-------|
| `title`       | string   | Required |
| `description` | string   | Email body text shown to user |
| `type`        | string   | `phishing_bank` \| `phishing_grant` \| `salary_update` \| `investment_scam` \| `tax_refund` \| `account_verification` \| `prize_notification` |
| `source`      | string   | `inbox` \| `sms` \| `notification` |
| `emailMeta`   | object   | `{ sender, subject, preview, riskBadge }` |
| `realContext` | string   | Educational note shown after decision |
| `choices`     | array    | Min 2. Each has `text`, `qualityLevel`, `feedback`, `timeline`, `effects` |
| `difficulty`  | string   | `easy` \| `medium` \| `hard` |
| `targetRoles` | string[] | Roles this scenario is delivered to |

**Choice object**

| Field          | Type   | Notes |
|----------------|--------|-------|
| `text`         | string | Button label shown to user |
| `qualityLevel` | string | `best` \| `average` \| `worst` |
| `feedback`     | string | Explanation shown after decision |
| `timeline`     | array  | `[{ day, event, isPositive }]` — consequences over time |
| `effects`      | object | `{ xp, securityScore, awarenessScore, balance }` — all integers, can be negative |

---

### Session

| Field          | Type     | Notes |
|----------------|----------|-------|
| `userId`       | ObjectId | Ref → User |
| `scenarioIds`  | ObjectId[] | Ordered list for this session |
| `currentIndex` | number   | Pointer into `scenarioIds` |
| `status`       | string   | `in_progress` \| `completed` |
| `totalXP`      | number   | XP accumulated in this session |
| `startedAt`    | Date     | |
| `completedAt`  | Date     | Set when status → completed |

---

### Attempt

| Field           | Type     | Notes |
|-----------------|----------|-------|
| `sessionId`     | ObjectId | Ref → Session (nullable for legacy endpoint) |
| `scenarioId`    | ObjectId | Ref → Scenario |
| `userId`        | ObjectId | Ref → User |
| `selectedChoice`| number   | Zero-based index |
| `qualityLevel`  | string   | `best` \| `average` \| `worst` |
| `result`        | string   | `correct` \| `partial` \| `incorrect` |
| `effectsApplied`| object   | `{ xp, securityScore, awarenessScore, balance }` |

---

## Error Codes

| HTTP Status | Meaning |
|-------------|---------|
| `200` | Success |
| `201` | Resource created |
| `400` | Bad request — missing or invalid fields |
| `404` | Resource not found |
| `500` | Internal server error |

All error responses:
```json
{ "success": false, "message": "Human-readable description" }
```

---

## Quick Start

```bash
# 1. Install dependencies
cd server && npm install

# 2. Copy environment file
cp .env.example .env

# 3. Seed the database (creates 3 demo users + 7 scenarios)
npm run seed

# 4. Start the server
npm run dev
# → API running on http://localhost:5020
```

**Demo users created by seed**

| Name          | Role       | Email |
|---------------|------------|-------|
| Alex Johnson  | employee   | alex.johnson@demo.com |
| Sam Rivera    | student    | sam.rivera@demo.com |
| Jordan Lee    | freelancer | jordan.lee@demo.com |
