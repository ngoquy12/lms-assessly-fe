import type { Metadata } from "next";
import { PracticeDetailView } from "@/views/practice/practice-detail-view";

export const metadata: Metadata = {
    title: "Chi tiết đề thi luyện tập",
    description: "Xem thông tin cấu trúc đề thi thử và bắt đầu làm bài",
};

export default async function PracticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <PracticeDetailView practiceId={id} />;
}
