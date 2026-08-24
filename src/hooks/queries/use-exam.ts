import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import { getExamQuestions, getExamResult, getExamSession } from "@/services/exam.service";

export function useExamSession() {
    return useQuery({ queryKey: queryKeys.exam.session, queryFn: getExamSession });
}

export function useExamQuestions() {
    return useQuery({ queryKey: queryKeys.exam.questions, queryFn: getExamQuestions });
}

export function useExamResult() {
    return useQuery({ queryKey: queryKeys.exam.result, queryFn: getExamResult });
}
