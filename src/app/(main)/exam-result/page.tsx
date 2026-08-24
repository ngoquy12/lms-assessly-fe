import type { Metadata } from "next";
import { ExamResultHistoryView } from "@/views/exam-result/exam-result-history-view";

export const metadata: Metadata = {
    title: "Lịch sử & Báo cáo thi cử",
    description: "Tổng hợp kết quả toàn bộ các ca thi và bài khảo sát năng lực",
};

export default function ExamResultHistoryPage() {
    return <ExamResultHistoryView />;
}
