export const queryKeys = {
    practice: {
        list: ["practice", "list"] as const,
        detail: (id: string) => ["practice", "detail", id] as const,
    },
    topic: {
        list: ["topic", "list"] as const,
        detail: (id: string) => ["topic", "detail", id] as const,
    },
    exam: {
        session: ["exam", "session"] as const,
        questions: ["exam", "questions"] as const,
        result: ["exam", "result"] as const,
    },
    interview: {
        positions: ["interview", "positions"] as const,
        result: ["interview", "result"] as const,
    },
    user: {
        profile: ["user", "profile"] as const,
        leaderboard: ["user", "leaderboard"] as const,
    },
    auth: {
        currentUser: ["auth", "current-user"] as const,
    },
} as const;
