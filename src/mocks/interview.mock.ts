import seed from "@/mocks/shared/assessment-seed.json";
import type { InterviewEvaluationResult, InterviewPosition, InterviewSessionItem } from "@/types/interview.types";

export const MOCK_INTERVIEW_SESSIONS: InterviewSessionItem[] = seed.candidate.candidateInterviewPractice.interviewSessions as unknown as InterviewSessionItem[];

export const MOCK_INTERVIEW_POSITIONS: InterviewPosition[] = seed.interview.positions.map((position) => ({
    id: position.id,
    title: position.title,
    description: position.description,
    level: position.level,
    category: position.category,
    questionsCount: position.questionsCount,
    durationMinutes: position.durationMinutes,
    difficulty: position.difficulty as InterviewPosition["difficulty"],
}));

export const MOCK_INTERVIEW_RESULT: InterviewEvaluationResult = seed.candidate.interviewResult as unknown as InterviewEvaluationResult;
