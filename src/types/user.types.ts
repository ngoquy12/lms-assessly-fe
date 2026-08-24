export interface UserProfile {
    id: string;
    studentCode: string;
    fullName: string;
    email: string;
    phone: string;
    avatarUrl?: string;
    dateOfBirth?: string;
    gender?: "MALE" | "FEMALE" | "OTHER";
    className?: string;
    totalExamsTaken: number;
    averageScore: number;
    certificatesCount: number;
    rankPosition: number;
}

export interface LeaderboardRankItem {
    id: string;
    rank: number;
    studentName: string;
    studentCode: string;
    avatarUrl?: string;
    totalScore: number;
    examsCompleted: number;
    badge?: string;
}
