import seed from "@/mocks/shared/assessment-seed.json";
import type { ToeicQuestion, ToeicResult, ToeicSessionItem } from "@/types/toeic.types";

export const MOCK_TOEIC_SESSIONS: ToeicSessionItem[] = seed.candidate.candidateToeic.sessionList as unknown as ToeicSessionItem[];

export const MOCK_TOEIC_QUESTIONS: ToeicQuestion[] = seed.candidate.candidateToeic.questions as unknown as ToeicQuestion[];

export const MOCK_TOEIC_RESULT: ToeicResult = seed.candidate.candidateToeic.result as unknown as ToeicResult;
