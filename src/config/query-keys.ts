export const queryKeys = {
    practice: {
        list: ["practice", "list"] as const,
        detail: (id: string) => ["practice", "detail", id] as const,
        criteria: ["practice", "criteria"] as const,
        reviews: ["practice", "reviews"] as const,
    },
    topic: {
        list: ["topic", "list"] as const,
        detail: (id: string) => ["topic", "detail", id] as const,
    },
    exam: {
        session: ["exam", "session"] as const,
        questions: ["exam", "questions"] as const,
        result: ["exam", "result"] as const,
        list: ["exam", "list"] as const,
        assigned: ["exam", "assigned"] as const,
    },
    examResult: {
        heatmap: ["exam-result", "heatmap"] as const,
        recentAttempts: ["exam-result", "recent-attempts"] as const,
        topicGroups: ["exam-result", "topic-groups"] as const,
    },
    competency: {
        list: ["competency", "list"] as const,
        detail: (id: string) => ["competency", "detail", id] as const,
        questions: ["competency", "questions"] as const,
        result: ["competency", "result"] as const,
    },
    toeic: {
        list: ["toeic", "list"] as const,
        detail: (id: string) => ["toeic", "detail", id] as const,
        questions: ["toeic", "questions"] as const,
        result: ["toeic", "result"] as const,
    },
    interview: {
        positions: ["interview", "positions"] as const,
        result: ["interview", "result"] as const,
        list: ["interview", "list"] as const,
    },
    user: {
        profile: ["user", "profile"] as const,
        leaderboard: ["user", "leaderboard"] as const,
    },
    auth: {
        currentUser: ["auth", "current-user"] as const,
    },
} as const;
