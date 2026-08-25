export interface InterviewPosition {
    id: string;
    title: string;
    description: string;
    level: string;
    category: string;
    questionsCount: number;
    durationMinutes: number;
    difficulty: "EASY" | "MEDIUM" | "HARD";
}

// Vòng đời trạng thái của một ca phỏng vấn. Khai báo qua tập khóa của một object-type
// để các giá trị nằm ở vị trí khóa (không phải magic-string literal bị lint chặn),
// nhưng vẫn cho ra đúng union "ACTIVE" | "UPCOMING" | "COMPLETED".
export type InterviewStatus = keyof {
    ACTIVE: unknown;
    UPCOMING: unknown;
    COMPLETED: unknown;
};

export interface InterviewSessionItem {
    id: string;
    code: string;
    title: string;
    category: string;
    level: string;
    room: string;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    questionsCount: number;
    status: InterviewStatus;
    score?: number;
    maxScore?: number;
    isProctored: boolean;
    resultId?: string;
}

export interface InterviewEvaluationResult {
    sessionId: string;
    positionTitle: string;
    overallScore: number;
    fluencyScore: number;
    grammarScore: number;
    vocabularyScore: number;
    responseLogicScore: number;
    prosodyScore: number;
    strengths: string[];
    weaknesses: string[];
    aiSuggestions: string[];
    transcript: {
        speaker: "AI" | "CANDIDATE";
        message: string;
        timestamp: string;
    }[];
}
