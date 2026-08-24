import { MOCK_PRACTICE_LIST, MOCK_TOPICS_LIST } from "@/mocks/practice.mock";
import { simulateLatency } from "@/services/mock-delay";
import type { PracticeItem, TopicItem } from "@/types/practice.types";

export function getPracticeList(): Promise<PracticeItem[]> {
    return simulateLatency(MOCK_PRACTICE_LIST);
}

export function getPracticeById(id: string): Promise<PracticeItem | null> {
    return simulateLatency(MOCK_PRACTICE_LIST.find((item) => item.id === id) ?? null);
}

export function getTopicsList(): Promise<TopicItem[]> {
    return simulateLatency(MOCK_TOPICS_LIST);
}

export function getTopicById(id: string): Promise<TopicItem | null> {
    return simulateLatency(MOCK_TOPICS_LIST.find((item) => item.id === id) ?? null);
}
