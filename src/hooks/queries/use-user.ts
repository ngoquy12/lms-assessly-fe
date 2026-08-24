import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import { getLeaderboard, getUserProfile } from "@/services/user.service";

export function useUserProfile() {
    return useQuery({ queryKey: queryKeys.user.profile, queryFn: getUserProfile });
}

export function useLeaderboard() {
    return useQuery({ queryKey: queryKeys.user.leaderboard, queryFn: getLeaderboard });
}
