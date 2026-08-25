import { MOCK_INTERVIEW_POSITIONS, MOCK_INTERVIEW_RESULT, MOCK_INTERVIEW_SESSIONS } from "@/mocks/interview.mock";
import { simulateLatency } from "@/services/mock-delay";
import type { InterviewEvaluationResult, InterviewPosition, InterviewSessionItem } from "@/types/interview.types";

export function getInterviewPositions(): Promise<InterviewPosition[]> {
    return simulateLatency(MOCK_INTERVIEW_POSITIONS);
}

export function getInterviewList(): Promise<InterviewSessionItem[]> {
    return simulateLatency(MOCK_INTERVIEW_SESSIONS);
}

export function getInterviewResult(): Promise<InterviewEvaluationResult> {
    return simulateLatency(MOCK_INTERVIEW_RESULT);
}
