import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import { getAssignedExam, getExamList, getExamQuestions, getExamResult, getExamSession } from "@/services/exam.service";

export function useExamSession() {
    return useQuery({ queryKey: queryKeys.exam.session, queryFn: getExamSession });
}

export function useExamQuestions() {
    return useQuery({ queryKey: queryKeys.exam.questions, queryFn: getExamQuestions });
}

export function useExamResult() {
    return useQuery({ queryKey: queryKeys.exam.result, queryFn: getExamResult });
}

export function useExamList() {
    return useQuery({ queryKey: queryKeys.exam.list, queryFn: getExamList });
}

export function useAssignedExam() {
    return useQuery({ queryKey: queryKeys.exam.assigned, queryFn: getAssignedExam });
}
