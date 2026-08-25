export type CompetencyStatus = keyof {
    ACTIVE: unknown;
    UPCOMING: unknown;
    COMPLETED: unknown;
};

export interface CompetencySessionItem {
    id: string;
    code: string;
    title: string;
    category: string;
    level: string;
    room: string;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    totalQuestions: number;
    status: CompetencyStatus;
    score?: number;
    maxScore?: number;
    resultId?: string;
}

export interface CompetencyQuestionOption {
    id: string;
    label: string;
    text: string;
}

export interface CompetencyQuestion {
    id: string;
    num: number;
    category: string;
    title: string;
    options: CompetencyQuestionOption[];
}

export interface CompetencyRadar {
    labels: string[];
    scores: number[];
}

export interface CompetencyResult {
    radar: CompetencyRadar;
    overallScore: number;
}
