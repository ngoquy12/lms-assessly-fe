import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import { getPracticeById, getPracticeCriteria, getPracticeList, getPracticeQuestionReviews, getTopicById, getTopicsList } from "@/services/practice.service";

export function usePracticeList() {
    return useQuery({ queryKey: queryKeys.practice.list, queryFn: getPracticeList });
}

export function usePracticeDetail(id: string) {
    return useQuery({ queryKey: queryKeys.practice.detail(id), queryFn: () => getPracticeById(id) });
}

export function usePracticeCriteria() {
    return useQuery({ queryKey: queryKeys.practice.criteria, queryFn: getPracticeCriteria });
}

export function usePracticeQuestionReviews() {
    return useQuery({ queryKey: queryKeys.practice.reviews, queryFn: getPracticeQuestionReviews });
}

export function useTopicsList() {
    return useQuery({ queryKey: queryKeys.topic.list, queryFn: getTopicsList });
}

export function useTopicDetail(id: string) {
    return useQuery({ queryKey: queryKeys.topic.detail(id), queryFn: () => getTopicById(id) });
}
