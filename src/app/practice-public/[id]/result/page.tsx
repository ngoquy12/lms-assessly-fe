import type { Metadata } from "next";
import { PracticeResultPublicView } from "@/views/practice/practice-result-public-view";

export const metadata: Metadata = {
    title: "Kết quả bài thi thử & Lời giải",
    description: "Xem chi tiết đáp án và lời giải thích bài thi thử luyện tập",
};

export default async function PracticeResultPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <PracticeResultPublicView practiceId={id} />;
}
