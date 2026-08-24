import type { LeaderboardRankItem, UserProfile } from "@/types/user.types";

export const MOCK_USER_PROFILE: UserProfile = {
    id: "user-01",
    studentCode: "RA-2026-0889",
    fullName: "Nguyễn Văn An",
    email: "an.nguyen@assessly.local",
    phone: "0987654321",
    avatarUrl: "",
    dateOfBirth: "2002-05-15",
    gender: "MALE",
    className: "Kỹ sư Cầu nối Frontend - K26",
    totalExamsTaken: 12,
    averageScore: 88.5,
    certificatesCount: 4,
    rankPosition: 3,
};

export const MOCK_LEADERBOARD: LeaderboardRankItem[] = [
    {
        id: "rank-1",
        rank: 1,
        studentName: "Trần Minh Quân",
        studentCode: "RA-2026-0102",
        totalScore: 985,
        examsCompleted: 10,
        badge: "Top 1 Xuất Sắc",
    },
    {
        id: "rank-2",
        rank: 2,
        studentName: "Lê Hoàng Yến",
        studentCode: "RA-2026-0345",
        totalScore: 960,
        examsCompleted: 10,
        badge: "Top 2 Tài Năng",
    },
    {
        id: "rank-3",
        rank: 3,
        studentName: "Nguyễn Văn An",
        studentCode: "RA-2026-0889",
        totalScore: 940,
        examsCompleted: 10,
        badge: "Top 3 Triển Vọng",
    },
    {
        id: "rank-4",
        rank: 4,
        studentName: "Phạm Đức Thắng",
        studentCode: "RA-2026-0771",
        totalScore: 890,
        examsCompleted: 9,
    },
    {
        id: "rank-5",
        rank: 5,
        studentName: "Vũ Phương Linh",
        studentCode: "RA-2026-0520",
        totalScore: 875,
        examsCompleted: 9,
    },
];
