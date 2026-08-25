import seed from "@/mocks/shared/assessment-seed.json";
import type { LeaderboardRankItem, UserProfile } from "@/types/user.types";

const demoCandidateId = seed.meta.demoCandidateId;
const demoCandidate = seed.candidates.find((candidate) => candidate.id === demoCandidateId)!;
const demoLeaderboardEntry = seed.leaderboard.find((entry) => entry.candidateId === demoCandidateId)!;

// certificatesCount has no source field in the shared seed — use a sensible
// static demo value.
const DEMO_CERTIFICATES_COUNT = 3;

export const MOCK_USER_PROFILE: UserProfile = {
    id: demoCandidate.id,
    studentCode: demoCandidate.code,
    fullName: demoCandidate.fullName,
    email: demoCandidate.email,
    phone: demoCandidate.phone,
    avatarUrl: demoCandidate.avatarUrl,
    dateOfBirth: demoCandidate.dateOfBirth,
    gender: demoCandidate.gender as UserProfile["gender"],
    className: demoCandidate.className,
    totalExamsTaken: demoLeaderboardEntry.examsCompleted,
    averageScore: Math.round(demoLeaderboardEntry.totalScore / demoLeaderboardEntry.examsCompleted),
    certificatesCount: DEMO_CERTIFICATES_COUNT,
    rankPosition: demoLeaderboardEntry.rank,
};

export const MOCK_LEADERBOARD: LeaderboardRankItem[] = seed.leaderboard.map((entry) => {
    const candidate = seed.candidates.find((item) => item.id === entry.candidateId)!;

    return {
        id: `rank-${entry.rank}`,
        rank: entry.rank,
        studentName: candidate.fullName,
        studentCode: candidate.code,
        totalScore: entry.totalScore,
        examsCompleted: entry.examsCompleted,
        badge: entry.badge || undefined,
    };
});
