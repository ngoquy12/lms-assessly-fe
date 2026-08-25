import seed from "@/mocks/shared/assessment-seed.json";
import type { AssignedExamSession, ExamResultSummary, ExamSessionInfo, ExamSessionItem, QuestionItem, QuestionOption, QuestionType } from "@/types/exam.types";

// Local loose shapes for the shared seed JSON. The seed is the single source of
// truth shared with LMS-AI-QLDT; these interfaces only describe the fields this
// candidate-facing app derives its mocks from. DO NOT edit the JSON.
interface SeedOption {
    id: string;
    label: string;
    text: string;
    scoreWeight?: number;
    isCorrect?: boolean;
}

interface SeedQuestion {
    id: string;
    orderNumber: number;
    type: string;
    points: number;
    criteriaId?: string;
    tag?: string;
    title: string;
    description?: string;
    explanation?: string;
    content?: string;
    answerText?: string;
    options?: SeedOption[];
    matchingPairs?: { id: string; left: string; right: string }[];
    orderingItems?: string[];
    language?: string;
    codeTemplate?: string;
}

const demoCandidateId = seed.meta.demoCandidateId;
const demoCandidate = seed.candidates.find((candidate) => candidate.id === demoCandidateId)!;
const demoResult = seed.results.find((result) => result.candidateId === demoCandidateId)!;

export const MOCK_EXAM_SESSION: ExamSessionInfo = {
    id: seed.session.id,
    code: seed.exam.code,
    title: seed.exam.title,
    subjectName: seed.exam.subject,
    durationMinutes: seed.exam.durationMinutes,
    totalQuestions: seed.exam.questionIds.length,
    maxScore: seed.exam.maxScore,
    candidateName: demoCandidate.fullName,
    candidateCode: demoCandidate.code,
    roomName: seed.session.roomName,
    startTime: seed.session.openTime,
    endTime: seed.session.closeTime,
    isProctored: true,
};

export const MOCK_EXAM_QUESTIONS: QuestionItem[] = (seed.questions as SeedQuestion[]).map((question) => ({
    id: question.id,
    orderNumber: question.orderNumber,
    type: question.type as QuestionType,
    points: question.points,
    title: question.title,
    description: question.description,
    explanation: question.explanation,
    content: question.content,
    options: question.options?.map((option): QuestionOption => ({
        id: option.id,
        label: option.label,
        text: option.text,
        scoreWeight: option.scoreWeight,
        isCorrect: option.isCorrect,
    })),
    matchingPairs: question.matchingPairs?.map((pair) => ({
        id: pair.id,
        left: pair.left,
        right: pair.right,
    })),
    orderingItems: question.orderingItems,
    codeTemplate: question.codeTemplate,
    language: question.language,
}));

export const MOCK_EXAM_LIST: ExamSessionItem[] = seed.candidate.examList as unknown as ExamSessionItem[];

export const MOCK_ASSIGNED_EXAM: AssignedExamSession = seed.candidate.assignedExam as unknown as AssignedExamSession;

export const MOCK_EXAM_RESULT: ExamResultSummary = {
    examId: demoResult.examId,
    examCode: seed.exam.code,
    examTitle: seed.exam.title,
    subject: seed.exam.subject,
    candidateName: demoCandidate.fullName,
    candidateCode: demoCandidate.code,
    candidateClass: demoCandidate.className,
    identificationNumber: demoResult.identificationNumber,
    roomName: seed.session.roomName,
    proctors: seed.session.proctors,
    institution: seed.meta.institution,
    score: demoResult.score,
    maxScore: demoResult.maxScore,
    percentage: demoResult.percentage,
    status: demoResult.status as ExamResultSummary["status"],
    totalCorrect: demoResult.totalCorrect,
    totalWrong: demoResult.totalWrong,
    totalSkipped: demoResult.totalSkipped,
    durationSpentSeconds: demoResult.durationSpentSeconds,
    submittedAt: demoResult.submittedAt,
    criteriaBreakdown: demoResult.criteriaBreakdown.map((criteria) => ({
        criteriaName: criteria.criteriaName,
        correct: criteria.correct,
        total: criteria.total,
        percentage: criteria.percentage,
    })),
    feedback: demoResult.feedback,
};
