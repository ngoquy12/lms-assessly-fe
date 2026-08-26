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

export const FOOTER_OFFICES = [
    {
        id: "hanoi",
        label: "Cơ sở Hà Nội:",
        address: "Toà nhà HPC Landmark 105, 105 Tố Hữu, La Khê, Hà Đông, Hà Nội",
    },
    {
        id: "hcm",
        label: "Cơ sở Hồ Chí Minh:",
        address: "Tầng 2, Tòa nhà Dali Tower, số 24C đường Phan Đăng Lưu, Phường 6, Quận Bình Thạnh, TP. Hồ Chí Minh",
    },
    {
        id: "fukuoka",
        label: "Cơ sở Fukuoka:",
        address: "Fukuoka-ken, Fukuoka-shi, Hakata-ku, Hakataekihigashi 1-17-1, Fukuoka Daiichi Building 6F",
    },
    {
        id: "tokyo",
        label: "Cơ sở Tokyo:",
        address: "Tokyo-to, Minato-ku, Shiba 4-13-4, KN Shiba Building 5F",
    },
];

export const FOOTER_PRODUCT_GROUPS = [
    {
        title: "Hợp tác đào tạo Đại học",
        items: [
            "Kỹ Sư Công nghệ thông tin (PTIT x Rikkeisoft)",
            "Cử nhân Quản trị Kinh doanh - Định hướng Kinh doanh số (PTIT x Rikkeisoft)",
            "Chương trình đào tạo Data Analysis (HUST x Rikkeisoft)",
            "Chương trình đào tạo Lập trình Nhúng giảng dạy bởi Trường Điện – Điện Tử (ĐHBKHN) x Rikkeisoft",
        ],
    },
    {
        title: "Chương trình Đào tạo CNTT",
        items: ["Chương trình Đào tạo IT TSUBASA", "Chương trình Đào tạo Java Backend Full-Skill"],
    },
    {
        title: "Du học & Việc làm Nhật Bản",
        items: ["Du học Rikkei Academy", "Cung ứng nhân lực Nhật Bản"],
    },
];

export const FOOTER_EXTRA_GROUPS = [
    {
        title: "Tiếng Nhật",
        items: ["JLPT", "IT TALK", "Đào tạo Doanh nghiệp"],
    },
    {
        title: "Hệ sinh thái EdTech",
        items: ["Internship One Connect", "Khảo thí chất lượng đào tạo", "Rikkei Edu LMS"],
    },
];
