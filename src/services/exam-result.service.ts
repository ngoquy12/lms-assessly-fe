import { DayActivityData } from "@/components/charts/activity-heatmap-calendar";
import { MOCK_HEATMAP_2026, MOCK_RECENT_ATTEMPTS, MOCK_TOPIC_GROUPS } from "@/mocks/exam-result.mock";
import { simulateLatency } from "@/services/mock-delay";
import type { RecentAttemptRecord, TopicGroup } from "@/types/exam-result.types";

export function getResultHeatmap(): Promise<Record<string, DayActivityData>> {
    return simulateLatency(MOCK_HEATMAP_2026);
}

export function getRecentAttempts(): Promise<RecentAttemptRecord[]> {
    return simulateLatency(MOCK_RECENT_ATTEMPTS);
}

export function getResultTopicGroups(): Promise<TopicGroup[]> {
    return simulateLatency(MOCK_TOPIC_GROUPS);
}
