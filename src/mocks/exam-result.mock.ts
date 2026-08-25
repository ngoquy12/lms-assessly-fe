import { DayActivityData } from "@/components/charts/activity-heatmap-calendar";
import seed from "@/mocks/shared/assessment-seed.json";
import type { RecentAttemptRecord, TopicGroup } from "@/types/exam-result.types";

export const MOCK_HEATMAP_2026: Record<string, DayActivityData> = seed.candidate.analytics.heatmap as unknown as Record<string, DayActivityData>;

export const MOCK_RECENT_ATTEMPTS: RecentAttemptRecord[] = seed.candidate.analytics.recentAttempts as unknown as RecentAttemptRecord[];

export const MOCK_TOPIC_GROUPS: TopicGroup[] = seed.candidate.analytics.topicGroups as unknown as TopicGroup[];
