import { MOCK_EXAM_QUESTIONS, MOCK_EXAM_RESULT, MOCK_EXAM_SESSION } from "@/mocks/exam.mock";
import { simulateLatency } from "@/services/mock-delay";
import type { ExamResultSummary, ExamSessionInfo, QuestionItem } from "@/types/exam.types";

export function getExamSession(): Promise<ExamSessionInfo> {
    return simulateLatency(MOCK_EXAM_SESSION);
}

export function getExamQuestions(): Promise<QuestionItem[]> {
    return simulateLatency(MOCK_EXAM_QUESTIONS);
}

export function getExamResult(): Promise<ExamResultSummary> {
    return simulateLatency(MOCK_EXAM_RESULT);
}
