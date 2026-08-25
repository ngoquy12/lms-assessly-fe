export type QuestionType =
    "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "FILL_IN_BLANKS" | "MATCHING" | "ESSAY" | "CODING" | "ORDERING" | "EQ" | "IQ" | "AUDIO_SPEAKING";

export type QuestionStatus = "CURRENT" | "ANSWERED" | "UNANSWERED" | "FLAGGED";

export interface QuestionOption {
    id: string;
    label: string;
    text: string;
    scoreWeight?: number;
    isCorrect?: boolean;
}

export interface QuestionItem {
    id: string;
    orderNumber: number;
    type: QuestionType;
    points: number;
    title: string;
    description?: string;
    explanation?: string;
    content?: string;
    options?: QuestionOption[];
    matchingPairs?: { left: string; right: string; id: string }[];
    orderingItems?: string[];
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
    orderedItems?: string[];
    isFlagged?: boolean;
    updatedAt?: string;
}

export type ExamStatus = keyof {
    ACTIVE: unknown;
    UPCOMING: unknown;
    COMPLETED: unknown;
};

export interface ExamSessionItem {
    id: string;
    code: string;
    title: string;
    subject: string;
    room: string;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    totalQuestions: number;
    status: ExamStatus;
    score?: number;
    maxScore?: number;
    isProctored: boolean;
    hasInterview?: boolean;
    examId: string;
    resultId?: string;
    interviewId?: string;
}

export interface AssignedExamSession {
    id: string;
    code: string;
    title: string;
    category: string;
    duration: string;
    questionCount: number;
    supervisor: string;
    startTime: string;
    passcode: string;
}

export interface ExamResultSummary {
    examId: string;
    examCode?: string;
    examTitle: string;
    subject?: string;
    candidateName: string;
    candidateCode: string;
    candidateClass?: string;
    identificationNumber?: string;
    roomName?: string;
    proctors?: string[];
    examTimeRange?: string;
    institution?: string;
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
