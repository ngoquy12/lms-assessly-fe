import { MOCK_COMPETENCY_QUESTIONS, MOCK_COMPETENCY_RESULT, MOCK_COMPETENCY_SESSIONS } from "@/mocks/competency.mock";
import { simulateLatency } from "@/services/mock-delay";
import type { CompetencyQuestion, CompetencyResult, CompetencySessionItem } from "@/types/competency.types";

export function getCompetencyList(): Promise<CompetencySessionItem[]> {
    return simulateLatency(MOCK_COMPETENCY_SESSIONS);
}

export function getCompetencyQuestions(): Promise<CompetencyQuestion[]> {
    return simulateLatency(MOCK_COMPETENCY_QUESTIONS);
}

export function getCompetencyResult(): Promise<CompetencyResult> {
    return simulateLatency(MOCK_COMPETENCY_RESULT);
}
