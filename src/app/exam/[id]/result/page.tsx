import type { Metadata } from "next";
import { ExamResultDetailView } from "@/views/exam/exam-result-detail-view";

export const metadata: Metadata = {
    title: "Kết quả bài thi",
    description: "Báo cáo chi tiết điểm số và đánh giá bài thi khảo thí",
};

export default async function ExamResultPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ExamResultDetailView examId={id} />;
}
