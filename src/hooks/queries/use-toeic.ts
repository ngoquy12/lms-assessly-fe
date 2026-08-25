import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import { getToeicList, getToeicQuestions, getToeicResult } from "@/services/toeic.service";

export function useToeicList() {
    return useQuery({ queryKey: queryKeys.toeic.list, queryFn: getToeicList });
}

export function useToeicQuestions() {
    return useQuery({ queryKey: queryKeys.toeic.questions, queryFn: getToeicQuestions });
}

export function useToeicResult() {
    return useQuery({ queryKey: queryKeys.toeic.result, queryFn: getToeicResult });
}
