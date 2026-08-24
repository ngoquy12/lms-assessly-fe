import type { PracticeItem, TopicItem } from "@/types/practice.types";

export const MOCK_PRACTICE_LIST: PracticeItem[] = [
    {
        id: "practice-01",
        title: "Luyện thi Đánh giá Năng lực Thuật toán & Cấu trúc Dữ liệu",
        category: "Khoa học Máy tính",
        description: "Bộ câu hỏi rèn luyện tư duy thuật toán, độ phức tạp thời gian/không gian, sắp xếp và tìm kiếm.",
        totalQuestions: 20,
        durationMinutes: 30,
        participantsCount: 320,
        difficulty: "MEDIUM",
        tag: "Algorithm",
    },
    {
        id: "practice-02",
        title: "Bộ đề Luyện tập Ngữ pháp & Từ vựng TOEIC 650+",
        category: "Tiếng Anh Chuyên ngành",
        description: "Tổng hợp các dạng câu hỏi Part 5 & Part 6 xuất hiện nhiều nhất trong đề thi TOEIC chuẩn quốc tế.",
        totalQuestions: 30,
        durationMinutes: 25,
        participantsCount: 512,
        difficulty: "EASY",
        tag: "TOEIC",
    },
    {
        id: "practice-03",
        title: "Thực hành Lập trình Bất đồng bộ trong JavaScript (Async/Await & Promises)",
        category: "Lập trình Web",
        description: "Kiểm tra kiến thức Event Loop, Microtasks/Macrotasks, xử lý Promise.all và Error Handling.",
        totalQuestions: 15,
        durationMinutes: 20,
        participantsCount: 210,
        difficulty: "HARD",
        tag: "JavaScript",
    },
];

export const MOCK_TOPICS_LIST: TopicItem[] = [
    {
        id: "topic-01",
        name: "Lập trình Web Frontend",
        description: "Kiến thức về HTML5, CSS3, JavaScript ES6+, TypeScript, React và Next.js",
        questionsCount: 150,
        subTopics: [
            { id: "sub-1", name: "React Hooks & State Management", questionsCount: 45 },
            { id: "sub-2", name: "Next.js App Router & SSR/SSG", questionsCount: 55 },
            { id: "sub-3", name: "Tailwind CSS & Responsive Design", questionsCount: 50 },
        ],
    },
    {
        id: "topic-02",
        name: "Lập trình Backend & Cơ sở Dữ liệu",
        description: "Node.js, Express, NestJS, RESTful API, PostgreSQL, MongoDB",
        questionsCount: 120,
        subTopics: [
            { id: "sub-4", name: "RESTful API & Middleware", questionsCount: 40 },
            { id: "sub-5", name: "Thiết kế & Tối ưu hóa Database", questionsCount: 50 },
            { id: "sub-6", name: "Xác thực & Bảo mật (JWT, OAuth2)", questionsCount: 30 },
        ],
    },
    {
        id: "topic-03",
        name: "Tư duy Logic & Đánh giá Năng lực",
        description: "Kiểm tra chỉ số IQ, EQ, giải quyết vấn đề và phản xạ tình huống",
        questionsCount: 80,
        subTopics: [
            { id: "sub-7", name: "Suy luận Logic & Chuỗi số", questionsCount: 40 },
            { id: "sub-8", name: "Xử lý Tình huống Công việc", questionsCount: 40 },
        ],
    },
];
