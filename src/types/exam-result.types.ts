export interface RecentAttemptRecord {
    id: string;
    title: string;
    category: string;
    submittedAt: string;
    score: number;
    maxScore: number;
    passed: boolean;
    duration: string;
    resultUrl: string;
}

export interface TopicSubItem {
    id: string;
    name: string;
    attemptsCount: number;
    avgScore: number;
    maxScore: number;
    trend: "GIAM" | "TANG" | "ON_DINH";
    attempts: {
        attemptNum: number;
        score: number;
        totalScore: number;
    }[];
}

export interface TopicGroup {
    id: string;
    name: string;
    children: TopicSubItem[];
}
