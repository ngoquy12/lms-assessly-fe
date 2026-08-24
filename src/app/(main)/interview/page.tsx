import type { Metadata } from "next";
import { InterviewListView } from "@/views/interview/interview-list-view";

export const metadata: Metadata = {
    title: "Phỏng vấn AI trực tiếp bằng giọng nói",
    description: "Luyện phỏng vấn kỹ thuật và nhận xét chấm điểm phản xạ với AI",
};

export default function InterviewPage() {
    return <InterviewListView />;
}
