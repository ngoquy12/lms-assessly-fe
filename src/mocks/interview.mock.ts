import type { InterviewEvaluationResult, InterviewPosition } from "@/types/interview.types";

export const MOCK_INTERVIEW_POSITIONS: InterviewPosition[] = [
    {
        id: "interview-pos-01",
        title: "Frontend Developer (React / Next.js)",
        description: "Mô phỏng phỏng vấn kỹ thuật vị trí Lập trình viên Frontend với AI: Đánh giá tư duy component, tối ưu render và xử lý API.",
        level: "Fresher / Junior",
        category: "Kỹ thuật",
        questionsCount: 5,
        durationMinutes: 15,
        difficulty: "MEDIUM",
    },
    {
        id: "interview-pos-02",
        title: "Tiếng Anh Giao tiếp Chuyên ngành Công nghệ (IT English)",
        description: "Phỏng vấn phản xạ tiếng Anh chuyên ngành IT: Trình bày dự án, giải thích bug và giao tiếp trong Daily Standup.",
        level: "Mọi cấp độ",
        category: "Ngoại ngữ",
        questionsCount: 4,
        durationMinutes: 12,
        difficulty: "EASY",
    },
    {
        id: "interview-pos-03",
        title: "Kỹ năng Mềm & Phỏng vấn Tình huống (HR & Behavioral)",
        description: "Đánh giá khả năng làm việc nhóm, giải quyết xung đột, quản lý thời gian và định hướng nghề nghiệp.",
        level: "Toàn bộ",
        category: "Kỹ năng mềm",
        questionsCount: 4,
        durationMinutes: 10,
        difficulty: "MEDIUM",
    },
];

export const MOCK_INTERVIEW_RESULT: InterviewEvaluationResult = {
    sessionId: "interview-pos-01",
    positionTitle: "Frontend Developer (React / Next.js)",
    overallScore: 88,
    fluencyScore: 85,
    grammarScore: 90,
    vocabularyScore: 86,
    responseLogicScore: 92,
    prosodyScore: 87,
    strengths: [
        "Trả lời gãy gọn, đúng trọng tâm câu hỏi về React Server Components",
        "Sử dụng thuật ngữ chuyên môn chính xác (Hydration, Re-rendering, State Colocation)",
        "Giọng nói rõ ràng, tự tin, độ trễ phản xạ dưới 1.5 giây",
    ],
    weaknesses: ["Có thể bổ sung ví dụ thực tế về việc tối ưu LCP hoặc CLS trong bài nói", "Một vài câu còn ngập ngừng nhẹ khi chuyển ý"],
    aiSuggestions: [
        "Luyện tập thêm phần chia sẻ dự án cá nhân theo mô hình STAR (Situation - Task - Action - Result)",
        "Thực hành thêm các câu hỏi về xử lý bất đồng bộ trong Server Actions",
    ],
    transcript: [
        {
            speaker: "AI",
            message: "Chào bạn, hãy giới thiệu ngắn gọn về kinh nghiệm làm việc với React và Next.js của bạn?",
            timestamp: "00:05",
        },
        {
            speaker: "CANDIDATE",
            message: "Em đã có hơn 1 năm kinh nghiệm phát triển các ứng dụng web với React và Next.js App Router, làm việc với Tailwind CSS và Zustand.",
            timestamp: "00:15",
        },
        {
            speaker: "AI",
            message: "Bạn có thể giải thích sự khác biệt cốt lõi giữa Server Components và Client Components trong Next.js 16 không?",
            timestamp: "00:35",
        },
        {
            speaker: "CANDIDATE",
            message:
                "Server Components được thực thi và render sẵn trên máy chủ nên không gửi mã JavaScript về phía trình duyệt, giúp giảm dung lượng tải trang và tối ưu SEO.",
            timestamp: "00:48",
        },
    ],
};
