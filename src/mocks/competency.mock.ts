import seed from "@/mocks/shared/assessment-seed.json";
import type { CompetencyQuestion, CompetencyResult, CompetencySessionItem } from "@/types/competency.types";

export const MOCK_COMPETENCY_SESSIONS: CompetencySessionItem[] = seed.candidate.competency.sessions as unknown as CompetencySessionItem[];

export const MOCK_COMPETENCY_QUESTIONS: CompetencyQuestion[] = seed.candidate.competency.questions as unknown as CompetencyQuestion[];

export const MOCK_COMPETENCY_RESULT: CompetencyResult = {
    radar: seed.candidate.competency.radar,
    overallScore: seed.candidate.competency.overallScore,
} as unknown as CompetencyResult;
