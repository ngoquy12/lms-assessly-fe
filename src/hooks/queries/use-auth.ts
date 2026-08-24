import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import { getCurrentUser, login, logout } from "@/services/auth.service";

export function useCurrentUser() {
    return useQuery({ queryKey: queryKeys.auth.currentUser, queryFn: getCurrentUser });
}

export function useLogin() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: login,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser });
        },
    });
}

export function useLogout() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser });
        },
    });
}
