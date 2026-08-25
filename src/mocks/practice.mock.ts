import seed from "@/mocks/shared/assessment-seed.json";
import type { QuestionItem } from "@/types/exam.types";
import type { PracticeCriteriaRow, PracticeItem, QuestionReviewItem, TopicItem } from "@/types/practice.types";

export const MOCK_PRACTICE_08_QUESTIONS: QuestionItem[] = seed.candidate.practiceQuestions as unknown as QuestionItem[];

export function getPracticeQuestionsByPracticeId(practiceId: string): QuestionItem[] {
    if (practiceId === "practice-08") {
        return MOCK_PRACTICE_08_QUESTIONS;
    }
    // Return standard enriched mock questions for other practice IDs
    return MOCK_PRACTICE_08_QUESTIONS;
}

export const MOCK_PRACTICE_LIST: PracticeItem[] = seed.candidate.practiceList as unknown as PracticeItem[];

export const MOCK_PRACTICE_CRITERIA: PracticeCriteriaRow[] = seed.candidate.candidateInterviewPractice.practiceCriteria as unknown as PracticeCriteriaRow[];

export const MOCK_PRACTICE_QUESTION_REVIEWS: QuestionReviewItem[] = seed.candidate.candidateInterviewPractice
    .practiceQuestionReviews as unknown as QuestionReviewItem[];

export const MOCK_TOPICS_LIST: TopicItem[] = seed.topics.map((topic) => ({
    id: topic.id,
    name: topic.name,
    description: topic.description,
    questionsCount: topic.questionsCount,
}));
