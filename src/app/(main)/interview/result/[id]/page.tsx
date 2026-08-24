import type { Metadata } from "next";
import { InterviewResultView } from "@/views/interview/interview-result-view";

export const metadata: Metadata = {
    title: "Kết quả phỏng vấn AI",
    description: "Báo cáo phân tích độ trôi chảy, ngữ pháp và phản xạ phỏng vấn AI",
};

export default async function InterviewResultPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <InterviewResultView sessionId={id} />;
}
