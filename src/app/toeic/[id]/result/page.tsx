import type { Metadata } from "next";
import { ToeicResultView } from "@/views/toeic/toeic-result-view";

export const metadata: Metadata = {
    title: "Kết quả thi TOEIC / IELTS",
    description: "Bảng điểm và phân tích kỹ năng Listening & Reading",
};

export default async function ToeicResultPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ToeicResultView examId={id} />;
}
