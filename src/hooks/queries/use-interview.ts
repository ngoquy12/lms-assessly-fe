import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import { MOCK_INTERVIEW_RESULT } from "@/mocks/interview.mock";
import { getInterviewList, getInterviewPositions, getInterviewResult } from "@/services/interview.service";

export function useInterviewPositions() {
    return useQuery({ queryKey: queryKeys.interview.positions, queryFn: getInterviewPositions });
}

export function useInterviewList() {
    return useQuery({ queryKey: queryKeys.interview.list, queryFn: getInterviewList });
}

export function useInterviewResult() {
    return useQuery({
        queryKey: queryKeys.interview.result,
        queryFn: getInterviewResult,
        initialData: MOCK_INTERVIEW_RESULT,
    });
}
