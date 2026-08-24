import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import { getInterviewPositions, getInterviewResult } from "@/services/interview.service";

export function useInterviewPositions() {
    return useQuery({ queryKey: queryKeys.interview.positions, queryFn: getInterviewPositions });
}

export function useInterviewResult() {
    return useQuery({ queryKey: queryKeys.interview.result, queryFn: getInterviewResult });
}
