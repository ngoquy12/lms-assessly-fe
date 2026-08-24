import type { ExamResultSummary, ExamSessionInfo, QuestionItem } from "@/types/exam.types";

export const MOCK_EXAM_SESSION: ExamSessionInfo = {
    id: "exam-session-01",
    code: "FE-REACT-2026",
    title: "Khảo sát Năng lực Lập trình & Kỹ thuật Phần mềm",
    subjectName: "Kỹ thuật Phát triển Ứng dụng Web & Backend",
    durationMinutes: 50,
    totalQuestions: 8,
    maxScore: 100,
    candidateName: "Bảo Hoàng 01",
    candidateCode: "BH-2026-0889",
    roomName: "Phòng thi Trực tuyến 01",
    startTime: "2026-08-24T08:00:00Z",
    endTime: "2026-08-24T08:50:00Z",
    isProctored: true,
};

export const MOCK_EXAM_QUESTIONS: QuestionItem[] = [
    {
        id: "q-1",
        orderNumber: 1,
        type: "SINGLE_CHOICE",
        points: 10,
        title: "Hàm nào trong Python được dùng để kiểm tra độ dài của một chuỗi hoặc danh sách?",
        description: "Chọn 1 đáp án chính xác nhất.",
        options: [
            { id: "opt-1a", label: "A", text: "`count()`" },
            { id: "opt-1b", label: "B", text: "`size()`" },
            { id: "opt-1c", label: "C", text: "`len()`" },
            { id: "opt-1d", label: "D", text: "`length()`" },
        ],
    },
    {
        id: "q-2",
        orderNumber: 2,
        type: "SINGLE_CHOICE",
        points: 10,
        title: "Trong mô hình tổ chức dự án FastAPI 4 lớp chuẩn, thư mục `routers/` đảm nhận nhiệm vụ gì?",
        description: "Chọn 1 đáp án chính xác nhất.",
        options: [
            { id: "opt-2a", label: "A", text: "Chứa các script chạy kiểm thử tự động (Unit Test)" },
            { id: "opt-2b", label: "B", text: "Chứa các APIRouter định nghĩa các URL Endpoints và nhận Request" },
            { id: "opt-2c", label: "C", text: "Chứa cấu hình kết nối trực tiếp cơ sở dữ liệu SQLAlchemy/PostgreSQL" },
            { id: "opt-2d", label: "D", text: "Chứa các Pydantic Schemas validate dữ liệu" },
        ],
    },
    {
        id: "q-3",
        orderNumber: 3,
        type: "MULTIPLE_CHOICE",
        points: 15,
        title: "Những đặc tính và cải tiến nào sau đây thuộc về Tailwind CSS phiên bản 4?",
        description: "Chọn tất cả các đáp án đúng.",
        options: [
            { id: "opt-3a", label: "A", text: "Biên dịch bằng Rust engine (Oxide) tốc độ cao gấp 10 lần" },
            { id: "opt-3b", label: "B", text: "Cú pháp important modifier đặt ở cuối class như `mb-3!`, `hidden!`" },
            { id: "opt-3c", label: "C", text: "Hỗ trợ cấu hình native CSS variables với `@theme` trong CSS" },
            { id: "opt-3d", label: "D", text: "Bắt buộc phải tạo file `tailwind.config.js` để ứng dụng hoạt động" },
        ],
    },
    {
        id: "q-4",
        orderNumber: 4,
        type: "FILL_IN_BLANKS",
        points: 15,
        title: "Điền tên hàm/hook thích hợp vào ô trống:",
        description: "Hãy điền tên phương thức chính xác vào ô nhập liệu.",
        content: "Để khởi tạo một store quản lý state toàn cục với Zustand trong React, ta sử dụng hàm tạo store là _____ từ package 'zustand'.",
    },
    {
        id: "q-5",
        orderNumber: 5,
        type: "MATCHING",
        points: 15,
        title: "Ghép nối các khái niệm trong kiến trúc React & Next.js với định nghĩa phù hợp:",
        description: "Chọn định nghĩa tương ứng cho mỗi thuật ngữ ở cột bên trái.",
        matchingPairs: [
            { id: "m-1", left: "React Server Components (RSC)", right: "Render hoàn toàn trên server, không tải JS bundle về client" },
            { id: "m-2", left: "Server Actions", right: "Hàm async chạy trên server có thể trigger trực tiếp từ form hoặc button" },
            { id: "m-3", left: "Hydration", right: "Quá trình gắn kết các event listeners vào HTML tĩnh sau khi tải về trình duyệt" },
        ],
    },
    {
        id: "q-6",
        orderNumber: 6,
        type: "SINGLE_CHOICE",
        points: 10,
        title: "Trong Next.js 16 App Router, directive nào bắt buộc phải khai báo ở đầu file khi component cần sử dụng React Hook như useState hay useEffect?",
        description: "Chọn 1 đáp án chính xác nhất.",
        options: [
            { id: "opt-6a", label: "A", text: '"use client";' },
            { id: "opt-6b", label: "B", text: '"use server";' },
            { id: "opt-6c", label: "C", text: '"use static";' },
            { id: "opt-6d", label: "D", text: '"use dynamic";' },
        ],
    },
    {
        id: "q-7",
        orderNumber: 7,
        type: "ESSAY",
        points: 10,
        title: "Câu hỏi Tự luận: Phân tích sự khác biệt cốt lõi giữa Server-Side Rendering (SSR) và Client-Side Rendering (CSR).",
        description: "Trình bày ngắn gọn ưu nhược điểm và tình huống sử dụng thực tế.",
    },
    {
        id: "q-8",
        orderNumber: 8,
        type: "CODING",
        points: 15,
        title: "Câu hỏi Lập trình: Viết hàm đếm số lần xuất hiện của các từ trong đoạn văn bản chuỗi.",
        description: "Hoàn thiện hàm `countWordFrequency(text)` trả về object chứa tần suất của từng từ.",
        language: "javascript",
        codeTemplate: `function countWordFrequency(text) {
    // Viết mã nguồn của bạn tại đây
    const words = text.toLowerCase().match(/\\b\\w+\\b/g) || [];
    const frequency = {};
    for (const word of words) {
        frequency[word] = (frequency[word] || 0) + 1;
    }
    return frequency;
}`,
    },
];

export const MOCK_EXAM_RESULT: ExamResultSummary = {
    examId: "exam-session-01",
    examTitle: "Khảo sát Năng lực Lập trình & Kỹ thuật Phần mềm",
    candidateName: "Bảo Hoàng 01",
    candidateCode: "BH-2026-0889",
    score: 85,
    maxScore: 100,
    percentage: 85,
    status: "PASSED",
    totalCorrect: 7,
    totalWrong: 1,
    totalSkipped: 0,
    durationSpentSeconds: 1845,
    submittedAt: "2026-08-24T08:35:45Z",
    criteriaBreakdown: [
        { criteriaName: "Kiến thức Cốt lõi Python & JavaScript", correct: 2, total: 2, percentage: 100 },
        { criteriaName: "Kiến trúc Next.js 16 & React 19", correct: 2, total: 2, percentage: 100 },
        { criteriaName: "CSS & Styling Tailwind V4", correct: 1, total: 1, percentage: 100 },
        { criteriaName: "Kỹ năng Lập trình & Tự luận", correct: 2, total: 3, percentage: 67 },
    ],
    feedback: "Thí sinh nắm rất chắc kiến thức nền tảng và framework hiện đại, hoàn thành tốt bài thi.",
};
