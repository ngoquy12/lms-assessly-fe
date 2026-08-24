import type { Metadata } from "next";
import { TopicDetailView } from "@/views/topics/topic-detail-view";

export const metadata: Metadata = {
    title: "Chi tiết chuyên đề ôn luyện",
    description: "Bộ câu hỏi và tài liệu ôn tập theo chuyên đề kiến thức",
};

export default async function TopicDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <TopicDetailView topicId={id} />;
}
