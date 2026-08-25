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

export interface PracticeCriteriaRow {
    name: string;
    score: string;
    percentage: number;
}

export interface QuestionReviewItem {
    id: string;
    orderNumber: number;
    category: string;
    title: string;
    options: {
        id: string;
        label: string;
        text: string;
    }[];
    userSelectedId: string;
    correctOptionId: string;
    isCorrect: boolean;
    explanation: string;
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
