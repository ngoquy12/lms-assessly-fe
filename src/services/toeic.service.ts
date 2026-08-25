import { MOCK_TOEIC_QUESTIONS, MOCK_TOEIC_RESULT, MOCK_TOEIC_SESSIONS } from "@/mocks/toeic.mock";
import { simulateLatency } from "@/services/mock-delay";
import type { ToeicQuestion, ToeicResult, ToeicSessionItem } from "@/types/toeic.types";

export function getToeicList(): Promise<ToeicSessionItem[]> {
    return simulateLatency(MOCK_TOEIC_SESSIONS);
}

export function getToeicQuestions(): Promise<ToeicQuestion[]> {
    return simulateLatency(MOCK_TOEIC_QUESTIONS);
}

export function getToeicResult(): Promise<ToeicResult> {
    return simulateLatency(MOCK_TOEIC_RESULT);
}
