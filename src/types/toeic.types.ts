export type ToeicStatus = keyof {
    ACTIVE: unknown;
    UPCOMING: unknown;
    COMPLETED: unknown;
};

export interface ToeicSessionItem {
    id: string;
    code: string;
    title: string;
    subject: string;
    room: string;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    totalQuestions: number;
    status: ToeicStatus;
    score?: number;
    maxScore?: number;
    isProctored: boolean;
    resultId?: string;
}

export interface ToeicQuestionOption {
    id: string;
    label: string;
    text: string;
}

export interface ToeicQuestion {
    id: string;
    orderNumber: number;
    part: number;
    partTitle: string;
    title: string;
    points: number;
    options: ToeicQuestionOption[];
}

export interface ToeicResult {
    totalScore: number;
    maxScore: number;
    listeningScore: number;
    readingScore: number;
    totalQuestions: number;
    totalCorrect: number;
    totalWrong: number;
    percentage: number;
    durationSpentSeconds: number;
    avgSecondsPerQuestion: string;
}
