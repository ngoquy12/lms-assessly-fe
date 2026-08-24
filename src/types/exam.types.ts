export type QuestionType = "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "FILL_IN_BLANKS" | "MATCHING" | "ESSAY" | "CODING" | "AUDIO_SPEAKING";

export type QuestionStatus = "CURRENT" | "ANSWERED" | "UNANSWERED" | "FLAGGED";

export interface QuestionOption {
    id: string;
    label: string;
    text: string;
}

export interface QuestionItem {
    id: string;
    orderNumber: number;
    type: QuestionType;
    points: number;
    title: string;
    description?: string;
    content?: string;
    options?: QuestionOption[];
    matchingPairs?: { left: string; right: string; id: string }[];
    codeTemplate?: string;
    language?: string;
    audioUrl?: string;
    readingPassage?: string;
    partName?: string;
}

export interface ExamSessionInfo {
    id: string;
    code: string;
    title: string;
    subjectName: string;
    durationMinutes: number;
    totalQuestions: number;
    maxScore: number;
    candidateName: string;
    candidateCode: string;
    roomName: string;
    startTime: string;
    endTime: string;
    isProctored: boolean;
}

export interface UserExamAnswer {
    questionId: string;
    selectedOptionIds?: string[];
    textAnswer?: string;
    codeAnswer?: string;
    matchingAnswers?: Record<string, string>;
    isFlagged?: boolean;
    updatedAt?: string;
}

export interface ExamResultSummary {
    examId: string;
    examTitle: string;
    candidateName: string;
    candidateCode: string;
    score: number;
    maxScore: number;
    percentage: number;
    status: "PASSED" | "FAILED" | "PENDING_GRADING";
    totalCorrect: number;
    totalWrong: number;
    totalSkipped: number;
    durationSpentSeconds: number;
    submittedAt: string;
    criteriaBreakdown: {
        criteriaName: string;
        correct: number;
        total: number;
        percentage: number;
    }[];
    feedback?: string;
}
