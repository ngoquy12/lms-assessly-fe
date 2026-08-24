import { MOCK_INTERVIEW_POSITIONS, MOCK_INTERVIEW_RESULT } from "@/mocks/interview.mock";
import { simulateLatency } from "@/services/mock-delay";
import type { InterviewEvaluationResult, InterviewPosition } from "@/types/interview.types";

export function getInterviewPositions(): Promise<InterviewPosition[]> {
    return simulateLatency(MOCK_INTERVIEW_POSITIONS);
}

export function getInterviewResult(): Promise<InterviewEvaluationResult> {
    return simulateLatency(MOCK_INTERVIEW_RESULT);
}
