erDiagram

    USER ||--o{ ATTEMPT : makes
    USER ||--o{ TRANSACTION : owns
    USER ||--o{ BILL : has
    USER ||--o{ USER_BADGE : earns

    SCENARIO ||--o{ ATTEMPT : answered_in
    BADGE ||--o{ USER_BADGE : assigned_to

    USER {
        ObjectId _id
        String name
        String role
        Number balance
        Number awarenessScore
        Number securityScore
        Number savingsProgress
        Array completedScenarios
        Date createdAt
        Date updatedAt
    }

    SCENARIO {
        ObjectId _id
        String title
        String role
        String source
        String category
        String description
        String difficulty
        Array choices
        Date createdAt
        Date updatedAt
    }

    ATTEMPT {
        ObjectId _id
        ObjectId userId
        ObjectId scenarioId
        Number selectedChoiceIndex
        Boolean isCorrect
        Number balanceEffect
        Number awarenessEffect
        Number securityEffect
        Number savingsEffect
        String feedback
        Date createdAt
        Date updatedAt
    }

    TRANSACTION {
        ObjectId _id
        ObjectId userId
        String title
        Number amount
        String type
        String category
        Date date
        Date createdAt
        Date updatedAt
    }

    BILL {
        ObjectId _id
        ObjectId userId
        String title
        Number amount
        Date dueDate
        String status
        String category
        ObjectId linkedScenarioId
        Date createdAt
        Date updatedAt
    }

    BADGE {
        ObjectId _id
        String name
        String description
        String icon
        String conditionType
        Number requiredScore
        Date createdAt
        Date updatedAt
    }

    USER_BADGE {
        ObjectId _id
        ObjectId userId
        ObjectId badgeId
        Date earnedAt
    }