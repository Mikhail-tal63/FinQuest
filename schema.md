erDiagram

    USER ||--o{ ATTEMPT : makes
    USER ||--o{ TRANSACTION : owns
    USER ||--o{ BILL : has

    SCENARIO ||--o{ ATTEMPT : answered_in

    USER {
        ObjectId _id
        String name
        String role
        Number balance
        Number awarenessScore
        Number securityScore
        Number savingsProgress
        Number xp
        Number level
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
        Number xpEarned
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