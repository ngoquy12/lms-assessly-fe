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
