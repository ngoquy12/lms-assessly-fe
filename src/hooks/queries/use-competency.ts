import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import { getCompetencyList, getCompetencyQuestions, getCompetencyResult } from "@/services/competency.service";

export function useCompetencyList() {
    return useQuery({ queryKey: queryKeys.competency.list, queryFn: getCompetencyList });
}

export function useCompetencyQuestions() {
    return useQuery({ queryKey: queryKeys.competency.questions, queryFn: getCompetencyQuestions });
}

export function useCompetencyResult() {
    return useQuery({ queryKey: queryKeys.competency.result, queryFn: getCompetencyResult });
}
