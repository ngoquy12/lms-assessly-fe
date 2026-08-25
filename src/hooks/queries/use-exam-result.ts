import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import { getRecentAttempts, getResultHeatmap, getResultTopicGroups } from "@/services/exam-result.service";

export function useResultHeatmap() {
    return useQuery({ queryKey: queryKeys.examResult.heatmap, queryFn: getResultHeatmap });
}

export function useRecentAttempts() {
    return useQuery({ queryKey: queryKeys.examResult.recentAttempts, queryFn: getRecentAttempts });
}

export function useResultTopicGroups() {
    return useQuery({ queryKey: queryKeys.examResult.topicGroups, queryFn: getResultTopicGroups });
}
