import type { Metadata } from "next";
import { TopicsView } from "@/views/topics/topics-view";

export const metadata: Metadata = {
    title: "Chủ đề kiến thức ôn luyện",
    description: "Cây kiến thức phân cấp và ngân hàng câu hỏi ôn tập theo chuyên đề",
};

export default function TopicsPage() {
    return <TopicsView />;
}
