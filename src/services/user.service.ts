import { MOCK_LEADERBOARD, MOCK_USER_PROFILE } from "@/mocks/user.mock";
import { simulateLatency } from "@/services/mock-delay";
import type { LeaderboardRankItem, UserProfile } from "@/types/user.types";

export function getUserProfile(): Promise<UserProfile> {
    return simulateLatency(MOCK_USER_PROFILE);
}

export function getLeaderboard(): Promise<LeaderboardRankItem[]> {
    return simulateLatency(MOCK_LEADERBOARD);
}
