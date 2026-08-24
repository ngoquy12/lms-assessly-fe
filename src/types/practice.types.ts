export interface PracticeItem {
    id: string;
    title: string;
    category: string;
    description: string;
    totalQuestions: number;
    durationMinutes: number;
    participantsCount: number;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    tag: string;
}

export interface TopicItem {
    id: string;
    name: string;
    description: string;
    questionsCount: number;
    subTopics?: {
        id: string;
        name: string;
        questionsCount: number;
    }[];
}
